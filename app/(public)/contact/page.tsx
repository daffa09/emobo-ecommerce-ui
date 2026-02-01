import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";
import { SendMessageForm } from "./_components/send-message-form";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container-emobo py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>

        {/* Send Message Form - Full Width */}
        <div className="max-w-4xl mx-auto mb-8">
          <SendMessageForm />
        </div>

        {/* Get in Touch & Map - Side by Side */}
        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <p>123 Gadget Street, Tech City, 12345</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <p>+62 851-5744-1749</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <p>admin@daffathan-labs.my.id</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Store Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                Map Placeholder
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
