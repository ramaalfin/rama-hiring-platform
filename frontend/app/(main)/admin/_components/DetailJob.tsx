"use client";

import { usePathname } from "next/navigation";

export default function DetailJob({ token }: { token?: string }) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments.pop();
  const formattedSegment = lastSegment
    ?.replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="">
      <p>{formattedSegment}</p>
    </div>
  );
}
