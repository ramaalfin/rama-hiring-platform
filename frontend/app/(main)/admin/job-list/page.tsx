import React from "react";
import { cookies } from "next/headers";
import JobList from "../_components/JobList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RecruitBanner from "../_components/RecruiteBanner";

const AdminJobListPage = () => {
  const token = cookies().get("accessToken")?.value;

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="block lg:hidden">
        <Button variant="secondary" className="w-full">
          Create New Job
        </Button>
      </div>

      <div className="lg:col-span-3">
        <Input placeholder="Search by job detail" />
        <div className="min-h-screen flex items-center justify-center">
          <JobList token={token!} />
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-1">
        <RecruitBanner />
      </div>
    </div>
  );
};

export default AdminJobListPage;
