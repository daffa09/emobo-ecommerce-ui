"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Lock, LogOut, MapPin, Pencil } from "lucide-react";
import { fetchUserProfile, updateUserProfile, type Customer } from "@/lib/api-service";
import { logoutUser } from "@/lib/auth-service";
import { toast } from "sonner";
import { getCookie, setCookie } from "@/lib/cookie-utils";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import type { PickedLocation } from "@/components/map/map-picker";

// Dynamically import MapPicker to avoid SSR error with Leaflet
const MapPicker = dynamic(
  () => import("@/components/map/map-picker").then((m) => m.MapPicker),
  {
    ssr: false,
    loading: () => (
      <div className="h-[350px] flex items-center justify-center rounded-xl border border-border bg-muted/20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    ),
  }
);

export default function CustomerProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [pendingLocation, setPendingLocation] = useState<PickedLocation | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    addressNotes: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchUserProfile();
        setUser(data);
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
          addressNotes: data.addressNotes || "",
          latitude: data.latitude ?? null,
          longitude: data.longitude ?? null,
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleLocationPick = useCallback((location: PickedLocation) => {
    setPendingLocation(location);
  }, []);

  const handleConfirmLocation = () => {
    if (!pendingLocation) return;
    setFormData((prev) => ({
      ...prev,
      address: pendingLocation.address,
      latitude: pendingLocation.lat,
      longitude: pendingLocation.lng,
    }));
    setShowMapDialog(false);
    setPendingLocation(null);
    toast.success("Location selected! You can now refine the address details.");
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateUserProfile(formData);
      toast.success("Profile updated successfully");

      // Reload profile
      const data = await fetchUserProfile();
      setUser(data);
      setIsEditing(false);

      // Update cookies to keep user info in sync
      const storedUser = getCookie("emobo-user");
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        setCookie("emobo-user", JSON.stringify({
          ...userObj,
          name: data.name,
          image: data.image
        }));
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setChangingPassword(true);
      const token = getCookie("emobo-token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to change password");
      }

      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Failed to change password:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutUser();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error: any) {
      toast.error("Failed to logout");
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  required
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label>Joined Date</Label>
                <div className="h-10 px-3 py-2 rounded-md bg-muted text-sm text-muted-foreground flex items-center">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "-"}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                disabled={!isEditing}
                placeholder="e.g. 08123456789"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">
                  Street Address
                  {formData.latitude && formData.longitude && (
                    <span className="ml-2 text-xs text-emerald-500 font-normal">
                      ✓ Coordinates saved
                    </span>
                  )}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="address"
                    required
                    disabled={!isEditing}
                    placeholder="Click 'Set on Map' to auto-fill"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="flex-1"
                  />
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-none gap-1.5 whitespace-nowrap border-primary/40 text-primary hover:bg-primary/10 hover:text-primary"
                      onClick={() => {
                        setPendingLocation(null);
                        setShowMapDialog(true);
                      }}
                    >
                      <MapPin className="h-4 w-4" />
                      Set on Map
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressNotes">Additional Details</Label>
                <Input
                  id="addressNotes"
                  disabled={!isEditing}
                  placeholder="House number, Floor, Apartment name, or Landmarks"
                  value={formData.addressNotes}
                  onChange={(e) => setFormData({ ...formData, addressNotes: e.target.value })}
                />
                <p className="text-xs text-muted-foreground italic">
                  Provide specific details to help the courier find your location faster.
                </p>
              </div>

              {formData.latitude && formData.longitude && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  GPS: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                </p>
              )}
            </div>

            {!isEditing ? (
              <Button type="button" onClick={() => setIsEditing(true)} className="gap-2">
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button type="submit" disabled={saving} className="gap-2">
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Update Changes"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={() => {
                    setIsEditing(false);
                    if (user) {
                      setFormData({
                        name: user.name || "",
                        phone: user.phone || "",
                        address: user.address || "",
                        addressNotes: user.addressNotes || "",
                        latitude: user.latitude ?? null,
                        longitude: user.longitude ?? null,
                      });
                    }
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Map Location Dialog */}
      <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Set Delivery Location
            </DialogTitle>
            <DialogDescription>
              Click on the map or drag the marker to set your exact location.
              The address will be automatically detected and can be refined afterwards.
            </DialogDescription>
          </DialogHeader>

          <MapPicker
            initialLat={formData.latitude ?? undefined}
            initialLng={formData.longitude ?? undefined}
            onLocationPick={handleLocationPick}
          />

          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowMapDialog(false);
                setPendingLocation(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!pendingLocation}
              onClick={handleConfirmLocation}
              className="gap-2"
            >
              <MapPin className="h-4 w-4" />
              Confirm Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password *</Label>
              <PasswordInput
                id="currentPassword"
                required
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password * (min. 6 characters)</Label>
              <PasswordInput
                id="newPassword"
                required
                minLength={6}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password *</Label>
              <PasswordInput
                id="confirmPassword"
                required
                minLength={6}
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
              />
            </div>

            <Button type="submit" disabled={changingPassword} className="gap-2">
              {changingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
