import { BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AppSidebar } from "@/components/app-sidebar";


export default function PrivateLayout({ children }: { children: React.ReactNode }) {
   return (
    <SidebarProvider defaultOpen={false}>
    {/* <AppSidebar /> */}
    <div className="flex w-full h-full">
    <AppSidebar />
    <div className="flex-1 flex flex-col">
       <header  className="flex flex-row">
          <SidebarTrigger  className="-ml-1" />
          {/* <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          /> */}
      </header>
      <div className="flex w-full relative overflow-hidden flex-1 flex-col gap-4 p-1 pt-0 overflow-hidden">
        {children}
       
      </div> 
    </div>
  </div>
    {/* <SidebarInset> */}
      {/* <header  className="flex flex-row">
        
          <SidebarTrigger  className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
       
      </header>
      <div className="flex w-full relative overflow-hidden flex-1 flex-col gap-4 p-1 pt-0 overflow-hidden">
        {children}
       
      </div> */}
    {/* // </SidebarInset> */}
  </SidebarProvider>
   )
}
