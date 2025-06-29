"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Menu, ChevronLeft, ChevronRight, LayoutDashboard, Car } from "lucide-react";
import React from "react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      {/* Mobile: Sheet Drawer */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open sidebar">
              <span className="sr-only">Open sidebar</span>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent onNavigate={() => setOpen(false)} collapsed={false} />
          </SheetContent>
        </Sheet>
      </div>
      {/* Desktop: Fixed Sidebar */}
      <aside
        className={`hidden md:flex h-screen transition-all duration-300 border-r border-border flex-col p-4 fixed left-0 top-0 z-40 bg-card ${collapsed ? "w-20" : "w-64"} relative`}
      >
        {/* Collapse/Expand Button at Top Right */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
        <div className="mb-8 mt-8 flex items-center justify-center">
          <Card className="shadow-none border-none bg-transparent p-0 w-full">
            <CardHeader className="px-0 pb-0 flex flex-row items-center gap-2 justify-center">
              <span className="text-2xl font-bold">
                {!collapsed ? "Fleet Manager" : "FM"}
              </span>
            </CardHeader>
          </Card>
        </div>
        <SidebarContent collapsed={collapsed} />
      </aside>
    </>
  );
}

function SidebarContent({ onNavigate, collapsed }: { onNavigate?: () => void; collapsed: boolean }) {
  return (
    <nav className="flex flex-col gap-2">
      <Button asChild variant="ghost" className="justify-start w-full gap-2" onClick={onNavigate}>
        <Link href="/dashboard">
          <LayoutDashboard className="w-5 h-5" />
          {!collapsed && <span>Dashboard</span>}
        </Link>
      </Button>
      <Button asChild variant="ghost" className="justify-start w-full gap-2" onClick={onNavigate}>
        <Link href="/vehicles">
          <Car className="w-5 h-5" />
          {!collapsed && <span>Vehicle Management</span>}
        </Link>
      </Button>
    </nav>
  );
} 