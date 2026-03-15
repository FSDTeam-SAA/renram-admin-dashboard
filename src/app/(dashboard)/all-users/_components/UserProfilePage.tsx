"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, UserX } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id;

  const queryClient = useQueryClient();

  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken || "";

  // ─── Fetch Single User ─────────────────────────────
  const {
    data: singleUserData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/${userId}`,
        {
          headers: {
            // Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch user");
      const result = await res.json();
      return result.data;
    },
  });

  // ─── Status state ─────────────────────────────
  const [status, setStatus] = useState<string>("");

  // Set status from API response once loaded
  useEffect(() => {
    if (singleUserData) {
      setStatus(singleUserData.status || "active"); // fallback to active
    }
  }, [singleUserData]);

  // ─── Update User Status Mutation ─────────────────────────────
  const updateUserMutation = useMutation({
    mutationFn: async (updatedStatus: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({ status: updatedStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });

  if (isLoading) return <p>Loading user data...</p>;
  if (error) return <p>Error loading user data</p>;

  const user = singleUserData;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  };

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/all-users">
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
            onClick={() => updateUserMutation.mutate(status)}
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
                {user?.profileImage ? (
                  <AvatarImage src={user.profileImage} alt={user.firstName} />
                ) : (
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                )}
              </Avatar>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600 mt-1">
                  @{user.firstName.toLowerCase()}
                  {user.lastName.toLowerCase()}
                </p>
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
                <Input
                  id="fullName"
                  value={`${user.firstName} ${user.lastName}`}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  User name
                </Label>
                <Input
                  id="username"
                  value={`@${user.firstName.toLowerCase()}${user.lastName.toLowerCase()}`}
                  readOnly
                />
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
                <Input id="phone" value={user.phoneNumber} readOnly />
              </div>
            </div>

            {/* Status Select */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select value={status} onValueChange={(val) => setStatus(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue>{status}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="block">Blocked</SelectItem>
                </SelectContent>
              </Select>
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
                  Location
                </Label>
                <Input id="city" value={user.location} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium">
                  Role
                </Label>
                <Input id="state" value={user.role} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip" className="text-sm font-medium">
                  Post Code
                </Label>
                <Input id="zip" value={user.postCode} readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}