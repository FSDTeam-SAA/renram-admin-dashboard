// app/users/[id]/page.tsx   (or components/UserProfile.tsx)
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, UserX } from "lucide-react";
import Link from "next/link";

export default function UserProfilePage() {
  // Dummy data (in real app → fetch from API using params.id)
  const user = {
    fullName: "Bessie Edwards",
    username: "@bessiedwards",
    email: "abcgdh@gmail.com",
    phone: "+1 (888) 000-0000",
    address: "123 Organic Way Farmville, CA 90210",
    city: "Farmville",
    state: "CA",
    zipCode: "90210",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60",
    avatarFallback: "BE",
  };

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/users">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              User Profile
            </h1>
          </div>

          <Button
            variant="destructive"
            className="gap-2 bg-red-600 hover:bg-red-700"
          >
            <UserX className="h-4 w-4" />
            Suspend
          </Button>
        </div>

        {/* Main Profile Card */}
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          {/* Top Profile Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-8 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  {user.avatarFallback}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.fullName}
                </h2>
                <p className="text-gray-600 mt-1">{user.username}</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input id="fullName" value={user.fullName} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  User name
                </Label>
                <Input id="username" value={user.username} readOnly />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input id="email" value={user.email} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone number
                </Label>
                <Input id="phone" value={user.phone} readOnly />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Address
              </Label>
              <Input id="address" value={user.address} readOnly />
            </div>

            {/* Row 3 - City, State, Zip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  City
                </Label>
                <Input id="city" value={user.city} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium">
                  State
                </Label>
                <Input id="state" value={user.state} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip" className="text-sm font-medium">
                  Zip Code
                </Label>
                <Input id="zip" value={user.zipCode} readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}