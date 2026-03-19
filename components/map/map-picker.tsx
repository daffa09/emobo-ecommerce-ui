"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, MapPin, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Leaflet CSS is imported dynamically to avoid SSR issues
export interface PickedLocation {
  lat: number;
  lng: number;
  address: string;
  displayName: string;
}

interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationPick: (location: PickedLocation) => void;
}

interface NominatimResult {
  display_name: string;
  address: {
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    village?: string;
    town?: string;
    city?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

async function reverseGeocode(lat: number, lng: number): Promise<PickedLocation> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=id`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "EmoboEcommerce/1.0",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch address");
  const data: NominatimResult = await response.json();

  const addr = data.address;
  // Build a concise, courier-friendly address
  const parts = [
    addr.road,
    addr.neighbourhood || addr.suburb || addr.village,
    addr.town || addr.city || addr.county,
    addr.state,
    addr.postcode,
  ].filter(Boolean);

  return {
    lat,
    lng,
    address: parts.join(", "),
    displayName: data.display_name,
  };
}

export function MapPicker({ initialLat, initialLng, onLocationPick }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<string>("");
  const [pickedLat, setPickedLat] = useState<number | null>(initialLat || null);
  const [pickedLng, setPickedLng] = useState<number | null>(initialLng || null);

  const defaultLat = initialLat || -6.2088;
  const defaultLng = initialLng || 106.8456;

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    setIsGeocoding(true);
    setPickedLat(lat);
    setPickedLng(lng);
    try {
      const result = await reverseGeocode(lat, lng);
      setCurrentAddress(result.address);
      onLocationPick(result);
    } catch (error) {
      toast.error("Failed to get address. Please try again.");
    } finally {
      setIsGeocoding(false);
    }
  }, [onLocationPick]);

  useEffect(() => {
    let isMounted = true;
    if (typeof window === "undefined" || !mapRef.current || leafletMapRef.current) return;

    // Dynamically import leaflet to avoid SSR
    import("leaflet").then((leafletModule) => {
      if (!isMounted || !mapRef.current) return;
      const L = leafletModule.default;

      // Fix leaflet default icon issue with webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      // Check if the map is already initialized on this specific element
      // Leaflet marks initialized containers with a special property
      if ((mapRef.current as any)._leaflet_id) {
        return;
      }

      if (leafletMapRef.current) return;

      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([defaultLat, defaultLng], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add initial marker if coordinates are available
      if (initialLat && initialLng) {
        const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);
        markerRef.current = marker;

        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          handleMapClick(pos.lat, pos.lng);
        });
      }

      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
          markerRef.current = marker;

          marker.on("dragend", () => {
            const pos = marker.getLatLng();
            handleMapClick(pos.lat, pos.lng);
          });
        }

        handleMapClick(lat, lng);
      });

      leafletMapRef.current = map;
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [defaultLat, defaultLng, handleMapClick, initialLat, initialLng]); // Added dependencies for correctness

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error("Browser does not support geolocation");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (leafletMapRef.current && markerRef.current) {
          leafletMapRef.current.setView([latitude, longitude], 17);
          markerRef.current.setLatLng([latitude, longitude]);
        } else if (leafletMapRef.current) {
          import("leaflet").then((leafletModule) => {
            const L = leafletModule.default;
            leafletMapRef.current.setView([latitude, longitude], 17);
            const marker = L.marker([latitude, longitude], { draggable: true }).addTo(leafletMapRef.current);
            markerRef.current = marker;
            marker.on("dragend", () => {
              const pos = marker.getLatLng();
              handleMapClick(pos.lat, pos.lng);
            });
          });
        }
        handleMapClick(latitude, longitude);
      },
      (error) => {
        toast.error("Unable to get location. Please pick a point manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Instructions */}
      <div className="text-sm text-muted-foreground flex items-start gap-2 bg-muted/40 rounded-lg px-3 py-2 border border-border">
        <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
        <span>Click on the map or drag the marker to set your location. The address will be auto-filled.</span>
      </div>

      {/* Map Container */}
      <div className="relative rounded-xl overflow-hidden border border-border" style={{ height: "350px" }}>
        {/* Leaflet CSS */}
        <style>{`
          .leaflet-container { height: 100%; width: 100%; background: #1a1a2e; }
          .leaflet-tile { filter: brightness(0.9) saturate(0.8); }
        `}</style>

        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Loading map...</span>
            </div>
          </div>
        )}

        <div ref={mapRef} className="h-full w-full" />

        {/* Locate Me Button */}
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="absolute bottom-3 right-3 z-1000 shadow-lg gap-1.5 text-xs"
          onClick={handleLocateMe}
        >
          <LocateFixed className="h-3.5 w-3.5" />
          Locate Me
        </Button>
      </div>

      {/* Address Preview */}
      {(currentAddress || isGeocoding) && (
        <div className="flex items-start gap-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2.5">
          {isGeocoding ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0 mt-0.5" />
          ) : (
            <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-0.5">Detected Address:</p>
            <p className="text-sm font-medium wrap-break-word">
              {isGeocoding ? "Fetching address..." : currentAddress}
            </p>
            {pickedLat && pickedLng && !isGeocoding && (
              <p className="text-xs text-muted-foreground mt-1">
                {pickedLat.toFixed(6)}, {pickedLng.toFixed(6)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
