"use client";

import React from "react";
import { Pencil, Eye, Trash2 } from "lucide-react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "NAD+",
    image: "/images/product.png",
  },
  {
    id: 2,
    name: "MIC-B12",
    image: "/images/product.png",
  },
  {
    id: 3,
    name: "Glutathione",
    image: "/images/product.png",
  },
  {
    id: 4,
    name: "NAD+",
    image: "/images/product.png",
  },
  {
    id: 5,
    name: "MIC-B12",
    image: "/images/product.png",
  },
  {
    id: 6,
    name: "Glutathione",
    image: "/images/product.png",
  },
];

function AllProducts() {
  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex-1 text-center">
          <h1 className="text-[36px] leading-[120px] font-bold text-[#000000]">
            All Products
          </h1>
        </div>

        <button className="bg-[#0024DA] hover:bg-[#0024DA]/90 text-white text-sm font-medium px-4 h-[48px] transition-colors duration-200 whitespace-nowrap rounded-[8px]">
          Add Products +
        </button>
      </div>

      {/* Grid Container */}
      <div className="overflow-hidden" style={{ borderColor: "#60a5fa" }}>
        <div className="grid grid-cols-3 gap-6">
          {products.map((product) => {
            return (
              <div key={product.id} className="relative flex flex-col">
                {/* Image */}
                <div className="relative h-[210px] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                  {/* Action Icons */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md shadow-md px-2 py-1 rounded-full border border-gray-200">
                    <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-blue-100 transition-all duration-200 hover:scale-105">
                      <Pencil size={13} className="text-blue-600" />
                    </button>

                    <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-indigo-100 transition-all duration-200 hover:scale-105">
                      <Eye size={13} className="text-indigo-600" />
                    </button>

                    <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-100 transition-all duration-200 hover:scale-105">
                      <Trash2 size={13} className="text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Product Name */}
                <div className="px-3 py-2.5 bg-white">
                  <p className="text-xl font-medium text-gray-800">
                    {product.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AllProducts;
