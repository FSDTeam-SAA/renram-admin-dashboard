"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

function ViewOrderInfo() {
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const params = useParams();
  const orderId = params?.id;

  // ─── Fetch Single Order ──────────────────────────────────────────
  const { data: orderData, isLoading } = useQuery({
    queryKey: ["singleOrder", orderId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment/${orderId}`
      );
      if (!res.ok) throw new Error("Failed to fetch order details");
      const result = await res.json();
      return result?.data;
    },
  });

  const items = orderData?.items || [];
  const totalProducts = items.length;
  const currentItem = items[activeProductIndex];
  const product = currentItem?.product;

  const handlePrevProduct = () => {
    setActiveProductIndex((prev) => (prev === 0 ? totalProducts - 1 : prev - 1));
    setActiveImageIndex(0);
  };

  const handleNextProduct = () => {
    setActiveProductIndex((prev) => (prev === totalProducts - 1 ? 0 : prev + 1));
    setActiveImageIndex(0);
  };

  // ─── Skeleton ────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="animate-pulse px-5 py-5">
      <div className="h-10 w-64 bg-gray-200 rounded mx-auto mb-10" />
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-[120px] h-[58px] bg-gray-200 rounded-lg" />
          ))}
        </div>
        <div className="w-[450px] h-[450px] bg-gray-200 rounded-xl" />
        <div className="flex-1 space-y-4">
          <div className="h-10 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
          <div className="h-10 w-1/3 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="">
      {/* Top Header */}
      <div className="px-5 py-3 mb-[30px]">
        <h1 className="text-[36px] leading-[120px] font-bold text-[#000000] text-center">
          Product Details
        </h1>
      </div>

      {/* Main Content */}
      <div className="px-5 py-5">
        {/* Product Top Section */}
        <div className="p-4 mb-5">
          <div className="flex gap-4">

            {/* Thumbnail Column */}
            <div className="flex flex-col gap-2">
              {product?.image?.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-[120px] h-[58px] rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIndex === i
                      ? "border-blue-500"
                      : "border-gray-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    width={500}
                    height={300}
                    src={img}
                    alt={`thumb-${i}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div
              className="relative flex-shrink-0 rounded-xl overflow-hidden"
              style={{ width: "450px", height: "450px" }}
            >
              <Image
                width={600}
                height={600}
                src={product?.image?.[activeImageIndex] || "/images/carusal1.png"}
                alt="product"
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Product counter badge */}
              {totalProducts > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full">
                  Product {activeProductIndex + 1} of {totalProducts}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h2 className="lg:text-[40px] md:text-[35px] text-[30px] font-bold text-[#212121] mb-2">
                {product?.name}
              </h2>
              <p className="text-[20px] text-[#4E4E4E] leading-[150%] mb-3">
                {product?.description}
              </p>
              <p className="text-[20px] text-black mb-[20px] font-normal">
                {product?.category}
              </p>
              <p className="lg:text-[40px] md:text-[35px] text-[30px] font-bold text-gray-900 mb-1">
                ${currentItem?.price}
              </p>
              <p className="text-[20px] text-black mt-[5px] font-normal">
                Size: {currentItem?.size}
              </p>
              <p className="text-[20px] text-black mt-[5px] font-normal">
                Qty: {currentItem?.qty}
              </p>

              {/* Prev / Next Product Buttons */}
              {totalProducts > 1 && (
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={handlePrevProduct}
                    className="px-5 py-2 rounded-lg border border-gray-300 text-[16px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={handleNextProduct}
                    className="px-5 py-2 rounded-lg border border-gray-300 text-[16px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* What will you get */}
        <div className="" style={{ borderColor: "#93c5fd" }}>
          <h3 className="lg:text-[40px] md:text-[35px] text-[30px] font-bold text-[#212121] mb-2">
            What will you get?
          </h3>
          <p className="text-[20px] text-[#4E4E4E] leading-[150%] mb-3">
            {product?.whatWillYouGet}
          </p>
        </div>
      </div>

      {/* Purchased User */}
      <div className="space-y-4 mt-10">
        {orderData?.user ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 transition-shadow">
            {/* Left side - Avatar + Name */}
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-gray-100">
                {orderData.user.profilePicture ? (
                  <Image
                    src={orderData.user.profilePicture}
                    alt={orderData.user.firstName}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg font-medium">
                    {orderData.user.firstName?.[0]}
                    {orderData.user.lastName?.[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {orderData.user.firstName} {orderData.user.lastName}
                </h3>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Purchased date:{" "}
              {new Date(orderData.createdAt).toLocaleDateString("en-GB")}
            </p>

            {/* Right side - Amount */}
            <div className="text-right flex gap-10 items-center">
              <p className="text-sm text-gray-500">Amount : </p>
              <p className="text-xl font-bold text-gray-900">${orderData.amount}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400 text-[18px] py-10">
            No purchases yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default ViewOrderInfo;