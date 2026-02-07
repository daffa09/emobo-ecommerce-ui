"use client"

import { useState } from "react"
import { User, Mail, Phone, MapPin, Camera, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  })

  return (
    <div className="container-emobo py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6">
              {/* Profile Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center text-white text-2xl font-bold uppercase">
                    {(profile.fullName || "U").charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                    <p className="text-muted">{profile.email}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-surface rounded-lg transition-smooth">
                  <Camera className="w-5 h-5 text-primary" />
                </button>
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Full Name</label>
                      <Input
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Email</label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Phone</label>
                      <Input
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Address</label>
                      <Input
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted" />
                      <div>
                        <p className="text-sm text-muted">Full Name</p>
                        <p className="font-medium">{profile.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted" />
                      <div>
                        <p className="text-sm text-muted">Email Address</p>
                        <p className="font-medium">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted" />
                      <div>
                        <p className="text-sm text-muted">Phone Number</p>
                        <p className="font-medium">{profile.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-muted" />
                      <div>
                        <p className="text-sm text-muted">Address</p>
                        <p className="font-medium">{profile.address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-8 pt-8 border-t border-border">
                {isEditing ? (
                  <>
                    <Button className="bg-primary hover:bg-primary-dark" onClick={() => setIsEditing(false)}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <Card className="p-6">
              <p className="text-muted">Manage your delivery addresses here.</p>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted">Receive order updates via email</p>
                </div>
                <input type="checkbox" className="w-5 h-5 rounded border-border" defaultChecked />
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-muted">Receive promotions and special offers</p>
                </div>
                <input type="checkbox" className="w-5 h-5 rounded border-border" />
              </div>

              <div className="pt-4">
                <Button variant="outline" className="text-error hover:text-error bg-transparent">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
