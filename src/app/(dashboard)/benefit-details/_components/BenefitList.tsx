"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

type Treatment = {
  _id: string;
  title: string;
  category: string;
  description: string;
  treatmentQuestions: {
    question: string;
    options: string[];
    answare: string;
    _id: string;
  }[];
  createBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
    phoneNumber: string;
  };
  createdAt: string;
  updatedAt: string;
};

const ITEMS_PER_PAGE = 9;

export default function AllTreatments() {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);

  const queryClient = useQueryClient();
  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken || "";

  // ─── Fetch API Treatments ─────────────────────────────
  const { data, isLoading, error } = useQuery<Treatment[]>({
    queryKey: ["treatments"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/treatment-benefit`,
      );
      if (!res.ok) throw new Error("Failed to fetch treatments");
      const result = await res.json();
      return result.data || [];
    },
  });

  // ─── Delete Mutation ─────────────────────────────
  const deleteTreatent = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/treatment-benefit/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );
      if (!res.ok) throw new Error("Failed to delete treatment");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatments"] });
      setModalOpen(false);
      goToPage(1);
    },
    onError: (error) => {
      console.error("Delete error:", error);
    },
  });

  // ─── Skeleton ─────────────────────────────────────────
  if (isLoading) return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex-1 text-center">
            <h1 className="text-[36px] font-bold text-[#000000]">All Treatment</h1>
          </div>
          <Link href="/benefit-details/add-benefits">
            <button className="bg-[#0024DA] hover:bg-[#0024DA]/90 text-white text-sm font-medium px-4 h-[48px] transition-colors duration-200 whitespace-nowrap rounded-[8px]">
              Add new +
            </button>
          </Link>
        </div>

        {/* Skeleton Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8 min-h-[400px]">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse border rounded-lg overflow-hidden flex flex-col p-5 gap-4">
              {/* Title skeleton */}
              <div className="h-7 w-2/3 bg-gray-200 rounded" />
              {/* Category skeleton */}
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
              {/* Description skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                <div className="h-4 w-4/6 bg-gray-200 rounded" />
                <div className="h-4 w-3/6 bg-gray-200 rounded" />
              </div>
              {/* Questions skeleton */}
              <div className="space-y-2.5 mt-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-200 rounded-full flex-shrink-0" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  if (error) return <p>Error loading treatments</p>;

  const totalItems = data?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = (data || []).slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const openDeleteModal = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTreatment) {
      deleteTreatent.mutate(selectedTreatment._id);
    }
  };

  // ─── Pagination pages with dots ───────────────────────
  const getPaginationPages = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [];
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex-1 text-center">
            <h1 className="text-[36px] font-bold text-[#000000]">
              All Treatment
            </h1>
          </div>
          <Link href="/benefit-details/add-benefits">
            <button className="bg-[#0024DA] hover:bg-[#0024DA]/90 text-white text-sm font-medium px-4 h-[48px] transition-colors duration-200 whitespace-nowrap rounded-[8px]">
              Add new +
            </button>
          </Link>
        </div>

        {/* Treatment Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8 min-h-[400px]">
          {currentItems.map((treatment) => (
            <Card
              key={treatment._id}
              className="group relative flex flex-col transition-all hover:shadow-xl overflow-hidden border"
            >
              {/* Action buttons */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-md shadow-md px-2 py-1.5 rounded-full border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Link href={`/benefit-details/edit-benefits/${treatment._id}`}>
                  <button
                    title="Edit"
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-50 transition-colors"
                  >
                    <Pencil size={14} className="text-blue-600" />
                  </button>
                </Link>
                <Link href={`/benefit-details/view-benefits/${treatment._id}`}>
                  <button
                    title="View"
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-indigo-50 transition-colors"
                  >
                    <Eye size={14} className="text-indigo-600" />
                  </button>
                </Link>
                <button
                  title="Delete"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors"
                  onClick={() => openDeleteModal(treatment)}
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>

              <CardHeader className="pb-3">
                <div className="pr-24">
                  <CardTitle
                    className="text-2xl mb-1"
                    dangerouslySetInnerHTML={{ __html: treatment.title || "" }}
                  />
                  <p
                    className="text-sm text-gray-500 font-medium"
                    dangerouslySetInnerHTML={{
                      __html: `Category: ${treatment.category || ""}`,
                    }}
                  />
                </div>
                <CardDescription
                  className="pt-2 text-base leading-relaxed line-clamp-4"
                  dangerouslySetInnerHTML={{ __html: treatment.description || "" }}
                />
              </CardHeader>

              <CardContent className="flex-1 pb-6">
                <ul className="space-y-2 text-sm">
                  {treatment.treatmentQuestions.map((question, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-600 text-base mt-0.5">✓</span>
                      <span dangerouslySetInnerHTML={{ __html: question.question || "" }} />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
            {totalItems > 0 && (
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1}–
                {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of {totalItems}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center h-9 w-9 rounded-md border transition-colors ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {getPaginationPages().map((page, i) =>
                page === "..." ? (
                  <span
                    key={`dots-${i}`}
                    className="flex items-center justify-center h-9 w-9 text-gray-400 text-sm"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page as number)}
                    className={`flex items-center justify-center h-9 w-9 rounded-md border text-sm font-medium transition-all ${
                      page === currentPage
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center h-9 w-9 rounded-md border transition-colors ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Treatment</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-semibold">{selectedTreatment?.title}</span>
                ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}