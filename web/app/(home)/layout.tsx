import Header from "@/components/header";
import React, { ReactNode } from "react";

function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default HomeLayout;
