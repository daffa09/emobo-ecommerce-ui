"use client";

import { useState } from "react";
import { User, Mail, Shield, Camera, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Administrator",
    email: "management@emobo.com",
    role: "System Administrator",
    phone: "+62 812-3456-7890",
  });

  const handleSave = () => {
    setIsEditing(false);
    // Logic to save would go here
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">My Profile</h1>
          <p className="text-slate-400 font-medium">Manage your personal information and security settings.</p>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="rounded-xl font-black bg-primary hover:bg-primary-light transition-smooth px-6"
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-800 flex flex-col items-center text-center relative group">
            <div className="relative w-32 h-32 mb-6 group cursor-pointer">
              <div className="w-full h-full rounded-2xl bg-slate-700 border-2 border-slate-600 overflow-hidden shadow-2xl transition-smooth group-hover:border-primary/50">
                <img src="https://i.pravatar.cc/200?img=12" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-smooth">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-black text-white">{profile.name}</h2>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">{profile.role}</p>

            <div className="mt-8 pt-8 border-t border-slate-800/50 w-full text-left space-y-4">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter leading-none mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-bold text-white">Active Account</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter leading-none mb-1">Joined Date</p>
                <p className="text-sm font-bold text-white">Oct 24, 2025</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-800 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              <h3 className="text-xl font-black text-white">General Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    disabled={!isEditing}
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="bg-slate-900 border-slate-800 rounded-xl pl-12 h-12 text-white font-medium focus:border-primary/50 transition-smooth"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    disabled={!isEditing}
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="bg-slate-900 border-slate-800 rounded-xl pl-12 h-12 text-white font-medium focus:border-primary/50 transition-smooth"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Role</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    disabled
                    value={profile.role}
                    className="bg-slate-900 border-slate-800 rounded-xl pl-12 h-12 text-slate-400 font-medium cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Edit2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    disabled={!isEditing}
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="bg-slate-900 border-slate-800 rounded-xl pl-12 h-12 text-white font-medium focus:border-primary/50 transition-smooth"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="flex-1 rounded-xl h-12 font-black border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-smooth"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 rounded-xl h-12 font-black bg-primary hover:bg-primary-light transition-smooth"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <div className="bg-slate-800/10 p-6 rounded-2xl border border-dashed border-slate-800 flex items-center justify-between group cursor-pointer hover:bg-slate-800/20 transition-smooth">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-primary transition-smooth">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white">Security Settings</h4>
                <p className="text-xs text-slate-500">Update your password and 2FA settings.</p>
              </div>
            </div>
            <Edit2 className="w-4 h-4 text-slate-700 group-hover:text-white transition-smooth" />
          </div>
        </div>
      </div>
    </div>
  );
}
