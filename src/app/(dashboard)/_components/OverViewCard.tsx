import Image from "next/image";
import React from "react";

function OverViewCard() {
  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#272727]">Over View</h1>
          <p className="text-base text-[#929292] mt-3">Dashboard</p>
        </div>
        <button className="bg-[#0024DA] hover:bg-[#0024DA]/90 text-white text-sm font-medium px-4 h-[48px] rounded-lg transition-colors duration-200">
          Add Product +
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Sell Card */}
        <div className="bg-white rounded-[6px] p-5 shadow-[0px_2px_6px_0px_#00000014] flex items-center justify-between h-[120px]">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Total Sell
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
              <span className="text-lg font-bold text-gray-800">132,570</span>
            </div>
          </div>

          <div className="relative w-12 h-12">
            <Image
              src="/images/cardimage1.svg"
              alt="Total Sell"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Live Product Card */}
        <div className="bg-white rounded-[6px] p-5 shadow-[0px_2px_6px_0px_#00000014] flex items-center justify-between h-[120px]">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Live Product
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block"></span>
              <span className="text-lg font-bold text-gray-800">08</span>
            </div>
          </div>

          <div className="relative w-12 h-12">
            <Image
              src="/images/cardiamge2.svg"
              alt="Live Product"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverViewCard;