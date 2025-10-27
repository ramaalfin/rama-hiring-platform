import React from "react";
import { cookies } from "next/headers";
import JobList from "../_components/JobList";
import { Input } from "@/components/ui/input";
import RecruitBanner from "../_components/RecruiteBanner";
import JobFormModal from "../_components/JobFormModal";

const AdminJobListPage = () => {
  const token = cookies().get("accessToken")?.value;

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="block lg:hidden">
        <JobFormModal token={token!} bgColor="bg-secondary" />
      </div>

      <div className="lg:col-span-3">
        <Input placeholder="Search by job detail" />
        <JobList token={token!} />
      </div>

      <div className="hidden lg:block lg:col-span-1">
        <RecruitBanner token={token!} />
      </div>
    </div>
  );
};

export default AdminJobListPage;
