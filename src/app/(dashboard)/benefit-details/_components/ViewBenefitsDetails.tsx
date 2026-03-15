"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
};

type TreatmentQuestion = {
  question: string;
  options: string[];
  answare: string;
};

export default function ViewBenefitsDetails() {
  const params = useParams();
  const treatmentId = params.id as string;

  const [treatmentName, setTreatmentName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  // ─── Fetch Single Treatment ─────────────────────────
  const { data: singleTreatment } = useQuery({
    queryKey: ["singleTreatment", treatmentId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/treatment-benefit/${treatmentId}`
      );
      if (!res.ok) throw new Error("Failed to fetch treatment");
      const result = await res.json();
      return result.data;
    },
  });

  // ─── Populate default input values ───────────────────
  useEffect(() => {
    if (singleTreatment) {
      setTreatmentName(singleTreatment.title || "");
      setCategory(singleTreatment.category || "");
      setDescription(singleTreatment.description || "");
      setQuestions(
        singleTreatment.treatmentQuestions?.map(
          (q: TreatmentQuestion, i: number) => ({
            id: i + 1,
            question: q.question,
            options: q.options,
            correctAnswer: q.answare,
          })
        ) || []
      );
    }
  }, [singleTreatment]);

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        question:
          "Which of the following best describes what you're experiencing right now?",
        options: ["", "", "", "", ""],
        correctAnswer: "",
      },
    ]);
  };


  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/benefit-details">
              <button className="text-gray-600 hover:text-gray-800 transition-colors">
                <ArrowLeft size={20} />
              </button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              View Treatment
            </h1>
          </div>
        </div>

        <Card className="border-blue-200 shadow-sm">
          <CardContent className="p-6 md:p-8 space-y-8">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Treatment Name</Label>
              <Input
                id="name"
                value={treatmentName}
                disabled
                className="h-11 bg-gray-50"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Treatment Category</Label>
              <Select value={category} disabled>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Men HRT">Men HRT</SelectItem>
                  <SelectItem value="Women HRT">Women HRT</SelectItem>
                  <SelectItem value="General Wellness">General Wellness</SelectItem>
                  <SelectItem value="Performance">Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
<div className="space-y-2">
  <Label>Treatment Description</Label>
  <div
    className="min-h-[140px] bg-gray-50 p-2 rounded border"
    dangerouslySetInnerHTML={{ __html: description || "" }}
  />
</div>

            {/* Questions */}
            <div className="space-y-6 pt-6 border-t">
              <h2 className="text-xl font-semibold">Treatment Questions</h2>

              {questions.map((q, qIndex) => (
                <div
                  key={q.id}
                  className="rounded-lg border bg-white p-5 shadow-sm space-y-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-medium text-gray-900">
                      Question {qIndex + 1}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Label>Question Text</Label>
                    <Input value={q.question} disabled className="bg-gray-50" />
                  </div>

                  <div className="space-y-2">
                    <Label>Options</Label>
                    <div className="space-y-2.5">
                      {q.options.map((opt, i) => (
                        <Input
                          key={i}
                          value={opt}
                          disabled
                          placeholder={`Option ${i + 1}`}
                          className="bg-gray-50"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Correct Answer</Label>
                    <Select value={q.correctAnswer} disabled>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {q.options
                          .filter((opt) => opt.trim() !== "")
                          .map((opt, i) => (
                            <SelectItem key={i} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    {q.correctAnswer && (
                      <p className="text-sm text-green-600 mt-1.5 flex items-center gap-1.5">
                        <span>✓</span> {q.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Optional: allow adding questions for view mode (read-only) */}
              <Button
                variant="outline"
                className="w-full border-dashed border-2 py-6 text-muted-foreground hover:text-foreground hover:border-gray-400"
                onClick={addNewQuestion}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add new question +
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}