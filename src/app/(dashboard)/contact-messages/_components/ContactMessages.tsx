// components/ContactMessages.tsx
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
import { Eye, Trash2, Mail } from "lucide-react";

// Dummy data
const dummyMessages = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1234567890",
    subject: "Question about Research Grant",
    received: "Today, 10:23 AM",
    status: "unread",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    subject: "Technical Support Request",
    received: "Yesterday, 4:12 PM",
    status: "read",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "+1234567890",
    subject: "Question about Community Development Grant",
    received: "Yesterday, 1:20 PM",
    status: "unread",
  },
  {
    id: 4,
    name: "Robert Williams",
    email: "robert.williams@example.com",
    phone: "+1234567890",
    subject: "Technical issue with application form",
    received: "Oct 06, 2025",
    status: "read",
  },
  {
    id: 5,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1234567890",
    subject: "Feedback on grant process",
    received: "Sep 01, 2025",
    status: "read",
  },
  {
    id: 6,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+1234567890",
    subject: "Partnership opportunity",
    received: "Aug 16, 2025",
    status: "read",
  },
  {
    id: 7,
    name: "David Jual",
    email: "david.jual@example.com",
    phone: "+1234567890",
    subject: "Technical Support Request",
    received: "Jul 06, 2025",
    status: "read",
  },
  {
    id: 8,
    name: "Olivia Rhye",
    email: "olivia.rhye@example.com",
    phone: "+1234567890",
    subject: "Technical Support Request",
    received: "June 10, 2025",
    status: "read",
  },
  // ... add more if you want to test pagination
];

const ITEMS_PER_PAGE = 5;

export default function ContactMessages() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = dummyMessages.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMessages = dummyMessages.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Contact Messages
        </h1>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader className="bg-blue-50/70">
            <TableRow>
              <TableHead className="w-[180px] pl-6">Name</TableHead>
              <TableHead className="w-[160px]">Phone Number</TableHead>
              <TableHead className="w-[260px]">Subject</TableHead>
              <TableHead className="w-[160px]">Received</TableHead>
              <TableHead className="w-[100px] text-center">Status</TableHead>
              <TableHead className="w-[120px] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedMessages.map((msg) => (
              <TableRow
                key={msg.id}
                className="hover:bg-gray-50/70 transition-colors"
              >
                <TableCell className="pl-6 font-medium py-3">
                  <div className="flex flex-col">
                    <span>{msg.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {msg.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{msg.phone}</TableCell>
                <TableCell className="text-gray-700">{msg.subject}</TableCell>
                <TableCell className="text-gray-600">{msg.received}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Mail
                      className={`h-5 w-5 ${
                        msg.status === "unread" ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-600 hover:text-gray-900"
                      title="View message"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete message"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-muted-foreground">
        <p>
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of {totalItems}{" "}
          results
        </p>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="h-9 px-3"
          >
            ←
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              className={`h-9 w-9 p-0 ${
                page === currentPage
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : ""
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="h-9 px-3"
          >
            →
          </Button>
        </div>
      </div>
    </div>
  );
}