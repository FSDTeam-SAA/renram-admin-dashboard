/* eslint-disable @typescript-eslint/no-explicit-any */
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

type ProductItem = {
  product: {
    _id: string;
    name: string;
  };
  qty: number;
  size: string;
  price: number;
  _id: string;
};

type Order = {
  _id: string;
  user: {
    _id: string;
    email: string;
  };
  items: ProductItem[];
  amount: number;
  createdAt: string;
};

const ITEMS_PER_PAGE = 5;

export default function OrderHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken || "";

  const { data: ordersData = [], isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch orders");
      const result = await res.json();
      return result.data || [];
    },
  });

  const totalItems = ordersData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = ordersData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getUserInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  if (error) return <p>Error loading orders</p>;

  return (
    <div className="">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center">
          Order History
        </h1>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[220px] pl-6">User</TableHead>
              <TableHead className="w-[200px]">Products</TableHead>
              <TableHead className="w-[140px]">Date</TableHead>
              <TableHead className="w-[120px]">Amount (USD)</TableHead>
              <TableHead className="w-[120px] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? // ─── Skeleton Rows ────────────────────────────────
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6 py-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                        <Skeleton className="h-4 w-36" />
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-44" />
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center justify-center">
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : // ─── Real Rows ────────────────────────────────────
                paginatedOrders.map((order: Order) => (
                  <TableRow
                    key={order._id}
                    className="hover:bg-gray-50/70 border-b last:border-0"
                  >
                    {/* User */}
                    <TableCell className="pl-6 font-medium py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-gray-500 text-white font-medium">
                            {getUserInitials(order.user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{order.user.email}</span>
                      </div>
                    </TableCell>

                    {/* Products */}
                    <TableCell className="text-gray-700">
                      {order.items
                        .map(
                          (item: any) =>
                            `${item.product.name} x${item.qty} (${item.size})`
                        )
                        .join(", ")}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="font-medium text-gray-900">
                      {order.amount}
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-3">
                        <Link href={`/order-history/view-orderinfo/${order._id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 border border-[#0024DA]"
                          >
                            <Eye className="h-4 w-4 text-gray-600" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          {totalItems > 0 && (
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1}–
              {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of {totalItems}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
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