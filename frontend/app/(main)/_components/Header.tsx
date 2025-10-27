import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useParams, usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").filter(Boolean).pop();

  //   clear characters like hyphen or underscore
  const formattedSegment = lastSegment
    ?.replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="w-full">
      <div className="flex h-[60px] items-center border-b border-[#00002f26] px-2">
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1" />

          <h1 className="ml-4 text-lg font-semibold capitalize">
            {formattedSegment}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
