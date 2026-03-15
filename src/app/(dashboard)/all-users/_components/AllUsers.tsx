// components/AllUsers.tsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const ITEMS_PER_PAGE = 10;

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
};

export default function AllUsers() {
  const [currentPage, setCurrentPage] = useState(1);
  const session = useSession();
  const TOKEn = session?.data?.user?.accessToken || "";

  // ─── Fetch API Users ─────────────────────────────
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/all-users`,
        {
          headers: {
            Authorization: `Bearer ${TOKEn}`,
          },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch users");
      const result = await res.json();
      return result.data || [];
    },
  });

  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  };

  if (error) return <p>Error loading users</p>;

  return (
    <div className="">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center">
          User List
        </h1>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[220px] pl-6">Student Name</TableHead>
              <TableHead className="w-[160px]">Mobile</TableHead>
              <TableHead className="w-[280px]">Email</TableHead>
              <TableHead className="w-[120px] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? // ─── Skeleton Rows ─────────────────────────────────
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6 py-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-44" />
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center justify-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-7 w-16 rounded-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : // ─── Real Rows ──────────────────────────────────────
                paginatedUsers.map((user) => (
                  <TableRow key={user._id} className="hover:bg-gray-50/70">
                    <TableCell className="pl-6 font-medium py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-gray-500 text-white font-medium">
                            {getInitials(user.firstName, user.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {user.phoneNumber}
                    </TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-3">
                        <Link href={`/all-users/view-userinfo/${user._id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 border border-[#0024DA]"
                          >
                            <Eye className="h-4 w-4 text-gray-600" />
                          </Button>
                        </Link>
                        <Link href={`/all-users/view-userinfo/${user._id}`}>
                          <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-4 py-1.5 rounded-full transition-all duration-200 shadow-sm active:scale-95">
                            Suspend
                          </button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer - Showing info + Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          {totalItems > 0 && (
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1}–
              {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of{" "}
              {totalItems}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center justify-center h-10 w-10 rounded-md border transition-colors duration-200 ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex items-center justify-center h-10 w-10 rounded-md border text-sm font-medium transition-all duration-200 ${
                  page === currentPage
                    ? "bg-blue-600 text-white border-blue-600 font-semibold shadow-sm"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 active:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center h-10 w-10 rounded-md border transition-colors duration-200 ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}