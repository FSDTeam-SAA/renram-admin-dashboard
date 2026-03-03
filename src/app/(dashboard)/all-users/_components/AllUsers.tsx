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
import { Eye } from "lucide-react";
import Link from "next/link";

// Dummy data (you can replace with real API data later)
const dummyUsers = [
  {
    id: 1,
    name: "Cameron Williamson",
    mobile: "+447009960054",
    email: "debra.holt@example.com",
    avatarColor: "bg-pink-500",
  },
  {
    id: 2,
    name: "Jacob Jones",
    mobile: "+447009960748",
    email: "jacob.graham@example.com",
    avatarColor: "bg-purple-500",
  },
  {
    id: 3,
    name: "Arlene McCoy",
    mobile: "+447009960054",
    email: "deanna.curtis@example.com",
    avatarColor: "bg-cyan-500",
  },
  {
    id: 4,
    name: "Devon Lane",
    mobile: "+447009960180",
    email: "alma.lawson@example.com",
    avatarColor: "bg-emerald-500",
  },
  {
    id: 5,
    name: "Cody Fisher",
    mobile: "+447009960426",
    email: "sara.cruz@example.com",
    avatarColor: "bg-amber-500",
  },
  {
    id: 6,
    name: "Darrell Steward",
    mobile: "+447009960183",
    email: "nathan.roberts@example.com",
    avatarColor: "bg-rose-500",
  },
  {
    id: 7,
    name: "Leslie Alexander",
    mobile: "+447009960160",
    email: "michelle.rivera@example.com",
    avatarColor: "bg-indigo-500",
  },
  {
    id: 8,
    name: "Robert Fox",
    mobile: "+447009960137",
    email: "tanya.hills@example.com",
    avatarColor: "bg-teal-500",
  },
  {
    id: 9,
    name: "Marvin McKinney",
    mobile: "+447009960617",
    email: "tim.jennings@example.com",
    avatarColor: "bg-orange-500",
  },
  {
    id: 10,
    name: "Marvin McKinney",
    mobile: "+447009960974",
    email: "curtis.weaver@example.com",
    avatarColor: "bg-lime-500",
  },
  {
    id: 11,
    name: "Marvin McKinney",
    mobile: "+447009960063",
    email: "michael.mitc@example.com",
    avatarColor: "bg-fuchsia-500",
  },
  {
    id: 12,
    name: "Marvin McKinney",
    mobile: "+447009960378",
    email: "willie.jennings@example.com",
    avatarColor: "bg-sky-500",
  },
];

const ITEMS_PER_PAGE = 10;

export default function AllUsers() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = dummyUsers.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = dummyUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

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
            {paginatedUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50/70">
                <TableCell className="pl-6 font-medium py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback
                        className={`${user.avatarColor} text-white font-medium`}
                      >
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{user.mobile}</TableCell>
                <TableCell className="text-gray-600">{user.email}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-3">
                    <Link href={`/all-users/view-userinfo/${user?.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 border border-[#0024DA]"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </Button>
                    </Link>
                    <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-4 py-1.5 rounded-full transition-all duration-200 shadow-sm active:scale-95">
                      Suspend
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer - Showing info + Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of {totalItems}{" "}
          results
        </p>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="h-9 px-3"
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              className={`h-9 w-9 p-0 ${page === currentPage ? "bg-blue-600 hover:bg-blue-700" : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="h-9 px-3"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
