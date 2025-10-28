"use client";

import { Button } from "@/components/ui/button";
import { getAdminJobsFn, getAllJobsQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import JobFormModal from "./JobFormModal";
import { useAuthStore } from "@/stores/authStore";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const data = {
  jobs: [
    {
      id: "1",
      jobName: "Frontend Developer",
      minimumSalary: 8000000,
      maximumSalary: 15000000,
      createdAt: "2025-10-01T10:00:00Z",
    },
    {
      id: "2",
      jobName: "Backend Engineer",
      minimumSalary: 10000000,
      maximumSalary: 18000000,
      createdAt: "2025-09-25T09:30:00Z",
    },
    {
      id: "3",
      jobName: "UI/UX Designer",
      minimumSalary: 7000000,
      maximumSalary: 12000000,
      createdAt: "2025-10-05T14:00:00Z",
    },
  ],
};

const JobList = ({ token }: { token: string }) => {
  const user = useAuthStore((state) => state.user);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [statusFilter, setStatusFilter] = useState("all");

  // const { data, isLoading, isError, error } = useQuery({
  //   queryKey: ["adminJobs", user?.id],
  //   queryFn: () => getAdminJobsFn(user!.id, token!),
  //   enabled: !!user?.id && !!token,
  // });

  // const data = null;
  const isLoading = false;
  const isError = false;
  const error = null;

  // const filteredAndSortedJobs = useMemo(() => {
  //   if (!data) return [];

  //   let jobs = [...data];

  //   // Filter by keyword
  //   if (searchKeyword) {
  //     const lowerKeyword = searchKeyword.toLowerCase();
  //     jobs = jobs.filter(
  //       (job: any) =>
  //         job.jobName.toLowerCase().includes(lowerKeyword) ||
  //         job.jobDescription?.toLowerCase().includes(lowerKeyword)
  //     );
  //   }

  //   // Filter by status
  //   if (statusFilter !== "all") {
  //     jobs = jobs.filter((job: any) => job.status === statusFilter);
  //   }

  //   // Sorting
  //   switch (sortBy) {
  //     case "date-asc":
  //       jobs.sort(
  //         (a: any, b: any) =>
  //           new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  //       );
  //       break;
  //     case "date-desc":
  //       jobs.sort(
  //         (a: any, b: any) =>
  //           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //       );
  //       break;
  //     case "min-salary":
  //       jobs.sort((a: any, b: any) => a.minimumSalary - b.minimumSalary);
  //       break;
  //     case "max-salary":
  //       jobs.sort((a: any, b: any) => b.maximumSalary - a.maximumSalary);
  //       break;
  //   }

  //   return jobs;
  // }, [data, searchKeyword, sortBy, statusFilter]);

  if (isLoading)
    return <p className="text-center text-gray-500 mt-8">Loading jobs...</p>;

  if (isError)
    return (
      <p className="text-center text-red-500 mt-8">
        Error: {(error as Error).message}
      </p>
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <Input
          placeholder="Search by job title or description"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full sm:w-1/2"
        />

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest</SelectItem>
            <SelectItem value="date-asc">Oldest</SelectItem>
            <SelectItem value="min-salary">Lowest Salary</SelectItem>
            <SelectItem value="max-salary">Highest Salary</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 mt-4">
        {data.jobs.length > 0 &&
          data.jobs.map((job: any) => (
            <div
              key={job.id}
              className="flex flex-col gap-2 rounded-xl p-4 transition shadow-md bg-white border border-neutral-200"
            >
              <div className="border border-neutral-40 w-fit rounded-md">
                {job.createdAt && (
                  <p className="text-sm text-neutral-90 p-2">
                    started on {format(new Date(job.createdAt), "d MMM yyyy")}
                  </p>
                )}
              </div>

              <div className="flex flex-row justify-between items-center">
                <div className="space-y-2">
                  <h3 className="font-semibold text-neutral-800">
                    {job.jobName}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {job.minimumSalary} - {job.maximumSalary}
                  </p>
                </div>

                <Link href={`/admin/job-list/${job.jobName}`}>
                  <Button
                    variant="default"
                    className="bg-primary text-white hover:bg-opacity-90"
                  >
                    Manage Job
                  </Button>
                </Link>
              </div>
            </div>
          ))}

        {!data ||
          (data.jobs.length === 0 && (
            <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-4">
              <Image
                src="/assets/illustration/Empty State.svg"
                alt="No Data"
                width={1200}
                height={800}
                className="size-60 object-contain"
              />
              <h2 className="text-lg font-semibold text-neutral-90">
                No job openings available
              </h2>
              <p className="text-neutral-90">
                Create a job opening now and start the candidate process.
              </p>

              <JobFormModal token={token!} bgColor="bg-secondary" />
            </div>
          ))}
      </div>
    </div>
  );
};

export default JobList;
