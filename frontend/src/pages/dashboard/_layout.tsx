import React, { ReactElement } from "react";

import { Sidebar } from "@/components/Sidebar";

type DashboardLayoutProps = {
  children: ReactElement;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ padding: "3em 2em" }}>{children}</div>
    </div>
  );
}
