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
  name: string;
  description: string;
  treatmentQuestions: { question: string; options: string[]; answare: string; _id: string }[];
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

const ITEMS_PER_PAGE = 3;

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/treatment`);
      if (!res.ok) throw new Error("Failed to fetch treatments");
      const result = await res.json();
      return result.data || [];
    },
  });

  // ─── Delete Mutation ─────────────────────────────
  const deleteTreatent = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/treatment/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      });
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

  if (isLoading) return <p>Loading treatments...</p>;
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

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex-1 text-center">
            <h1 className="text-[36px] leading-[120px] font-bold text-[#000000]">
              All Treatment
            </h1>
          </div>

          <Link href="/all-treatment/add-treatment">
            <button className="bg-[#0024DA] hover:bg-[#0024DA]/90 text-white text-sm font-medium px-4 h-[48px] transition-colors duration-200 whitespace-nowrap rounded-[8px]">
              Add new  +
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
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-md shadow-md px-2 py-1.5 rounded-full border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Link href={`/all-treatment/edit-treatment/${treatment._id}`}>
                  <button
                    title="Edit"
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-50 transition-colors"
                  >
                    <Pencil size={14} className="text-blue-600" />
                  </button>
                </Link>

                <Link href={`/all-treatment/view-treatment/${treatment._id}`}>
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

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-3 pr-28">
                  <CardTitle className="text-2xl">{treatment.name}</CardTitle>
                </div>
                <CardDescription className="pt-2 text-base leading-relaxed">
                  {treatment.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 pb-6">
                <ul className="space-y-2.5 text-sm">
                  {treatment.treatmentQuestions.map((question, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-600 text-base mt-0.5">✔</span>
                      <span>{question.question}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Manual Pagination */}
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
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center h-10 w-10 rounded-md border transition-colors duration-200 ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 active:bg-gray-100"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`flex items-center justify-center h-10 w-10 rounded-md border text-sm font-medium transition-all duration-200 ${
                      page === currentPage
                        ? "bg-blue-600 text-white border-blue-600 font-semibold shadow-sm"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 active:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
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

        {/* Delete Confirmation Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Treatment</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {selectedTreatment?.name}
                </span>
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