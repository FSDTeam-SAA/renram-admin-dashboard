import Header from "@/components/share/Header";
import { Sidebar } from "@/components/share/Sidebar";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="w-full mt-[80px] p-6 bg-[#EDEEF1]">{children}</div>
      </div>
    </>
  );
}

export default layout;
