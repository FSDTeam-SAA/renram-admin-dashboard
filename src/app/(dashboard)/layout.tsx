import Header from "@/components/share/Header";
import { Sidebar } from "@/components/share/Sidebar";
// import { useSession } from "next-auth/react";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  // const session = useSession();
  // console.log(session?.data);
  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-y-auto p-6 mt-[80px] bg-[#EDEEF1]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default layout;