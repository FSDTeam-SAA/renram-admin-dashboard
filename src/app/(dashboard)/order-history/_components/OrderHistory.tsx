// app/orders/history/page.tsx   (or components/OrderHistory.tsx)
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
import { Eye } from "lucide-react";
import Link from "next/link";

// Dummy data (you can replace with real API later)
const dummyOrders = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  titleName: "John Doe",
  productName: "Enclomiphene",
  givenDate: "15/07/25",
  amount: "1,235",
}));

const ITEMS_PER_PAGE = 5; // as in your screenshot (showing 1 to 5)

export default function OrderHistory() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = dummyOrders.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = dummyOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div className="">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Order History
        </h1>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[180px] pl-6">Title/Name</TableHead>
              <TableHead className="w-[180px]">Product Name</TableHead>
              <TableHead className="w-[140px]">Given Date</TableHead>
              <TableHead className="w-[120px]">Amount</TableHead>
              <TableHead className="w-[100px] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow
                key={order.id}
                className="hover:bg-gray-50/70 border-b last:border-0"
              >
                <TableCell className="pl-6 font-medium">
                  {order.titleName}
                </TableCell>
                <TableCell className="text-gray-700">
                  {order.productName}
                </TableCell>
                <TableCell className="text-gray-600">
                  {order.givenDate}
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  {order.amount}
                </TableCell>
                <TableCell className="text-center">
                  <Link href={`/order-history/view-orderinfo/${order?.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-600 hover:text-gray-900"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer - Showing info + Pagination */}
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
