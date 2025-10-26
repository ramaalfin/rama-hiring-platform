// src/app/(admin)/admin/_components/JobList.tsx
"use client";

import { Button } from "@/components/ui/button";
import { getAllJobsQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { format } from "date-fns";

const JobList = ({ token }: { token: string }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => getAllJobsQueryFn(token),
  });

  if (isLoading) return <p>Loading jobs...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  if (!data || data.length === 0)
    return <p className="text-gray-500">No jobs found.</p>;

  return (
    <div className="grid gap-4 mt-4">
      {data.jobs.map((job: any) => (
        <div className="flex flex-col gap-2 rounded-xl p-4 transition shadow-md">
          <div className="border border-neutral-40 w-fit rounded-md">
            {job.createdAt && (
              <p className="text-sm text-neutral-90 p-2">
                {/* 2 oct 2025 */}
                started on {format(new Date(job.createdAt), "d MMM yyyy")}
              </p>
            )}
          </div>

          <div className="flex flex-row justify-between items-center">
            <div key={job.id} className=" space-y-2">
              <h3 className="font-semibold text-neutral-80">{job.jobName}</h3>
              <p className="text-sm">
                {job.minimumSalary} - {job.maximumSalary}
              </p>
            </div>

            <Link href={`/admin/jobs/${job.id}`}>
              <Button
                variant="default"
                className="w-full bg-primary text-white hover:bg-opacity-90"
              >
                Manage Job
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobList;
