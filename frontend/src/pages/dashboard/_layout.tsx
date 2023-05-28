import React, { ReactElement, useEffect } from "react";

import { Sidebar } from "@/components/Sidebar";
import { changePageTitle } from "@/utils";

type DashboardLayoutProps = {
  children: ReactElement;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  useEffect(() => {
    changePageTitle("Dashboard - Mally");
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ padding: "3em 2em" }}>{children}</div>
    </div>
  );
}
