import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface AppLayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, hideFooter = false }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-slate-800">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};
