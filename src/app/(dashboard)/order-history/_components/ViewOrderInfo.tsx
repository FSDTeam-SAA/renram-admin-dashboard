"use client";

import React, { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const product = {
  name: "NAD+",
  category: "Men HRT",
  price: "$54",
  size: "Small",
  description:
    "NAD+ (Nicotinamide Adenine Dinucleotide) is a vital coenzyme naturally found in the body and involved in key cellular processes. This premium NAD+ formulation is designed for individuals looking to support overall wellness, energy balance, and cellular health as part of a modern lifestyle.",
  whatYouGet:
    "You'll receive a carefully prepared NAD+ product designed to meet high-quality standards. Each unit is packaged securely to ensure consistency and reliability. Ideal for individuals incorporating NAD+ into their wellness routine, this product offers a streamlined and easy-to-use experience.",
  images: [
    "/images/carusal1.png",
    "/images/carusal1.png",
    "/images/carusal1.png",
    "/images/carusal1.png",
    "/images/carusal1.png",
  ],
};

const purchases = [
  {
    name: "Marvin McKinney",
    date: "15/07/25",
    amount: "1,235",
    initials: "MM",
  },
  {
    name: "John Doe",
    date: "12/06/25",
    amount: "890",
    initials: "JD",
  },
  {
    name: "Sarah Wilson",
    date: "03/05/25",
    amount: "2,450",
    initials: "SW",
  },
  {
    name: "Alex Carter",
    date: "28/04/25",
    amount: "675",
    initials: "AC",
  },
];

function ViewOrderInfo() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <div className="">
      {/* Top Header */}
      <div className="px-5 py-3 flex items-center justify-between mb-[30px]">
        <button className="text-gray-600 hover:text-gray-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-[36px] leading-[120px] font-bold text-[#000000]">
          Product Details
        </h1>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 h-[48px] rounded-lg shadow-sm transition-all duration-200">
          <Pencil size={14} />
          Edit Product
        </button>
      </div>

      {/* Main Content */}
      <div className="px-5 py-5">
        {/* Product Top Section */}
        <div className="p-4 mb-5">
          <div className="flex gap-4">
            {/* Thumbnail Column */}
            <div className="flex flex-col gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-[120px] h-[58px] rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeIndex === i
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

            {/* Main Image with arrows */}
            <div
              className="relative flex-shrink-0 rounded-xl overflow-hidden"
              style={{ width: "450px", height: "450px" }}
            >
              <Image
                width={300}
                height={300}
                src={product.images[activeIndex]}
                alt="product"
                className="w-full h-full object-cover"
              />
              <button
                onClick={handlePrev}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft size={14} className="text-gray-700" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight size={14} className="text-gray-700" />
              </button>
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h2 className="lg:text-[40px] md:text-[35px] text-[30px] font-bold text-[#212121] mb-2">
                {product.name}
              </h2>
              <p className="text-[20px] text-[#4E4E4E] leading-[150%] mb-3">
                {product.description}
              </p>
              <p className="text-[20px] text-black mb-[20px] font-normal">
                {product.category}
              </p>
              <p className="lg:text-[40px] md:text-[35px] text-[30px] font-bold text-gray-900 mb-1">
                {product.price}
              </p>
              <p className="text-[20px] text-black mt-[20px] font-normal">
                {product.size}
              </p>
            </div>
          </div>
        </div>

        {/* What will you get */}
        <div className="" style={{ borderColor: "#93c5fd" }}>
          <h3 className="lg:text-[40px] md:text-[35px] text-[30px] font-bold text-[#212121] mb-2">
            What will you get?
          </h3>
          <p className="text-[20px] text-[#4E4E4E] leading-[150%] mb-3">
            {product.whatYouGet}
          </p>
        </div>
      </div>

      <div className="space-y-4 mt-10">
        {purchases.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 transition-shadow"
          >
            {/* Left side - Avatar + Name + Date */}
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-gray-100">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg font-medium">
                  {item.initials}
                </AvatarFallback>
              </Avatar>

              <div>
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
              </div>
            </div>

            <p className="text-sm text-gray-500">Purchased date: {item.date}</p>

            {/* Right side - Amount */}
            <div className="text-right flex gap-10 items-center">
              <p className="text-sm text-gray-500">Amount : </p>
              <p className="text-xl font-bold text-gray-900">${item.amount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewOrderInfo;
