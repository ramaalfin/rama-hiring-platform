"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ApplyFormModal from "./ApplyFormModal";

const dummyData = {
  jobs: [
    {
      id: "1",
      jobName: "Frontend Developer",
      companyName: "Astra",
      location: "Jakarta Selatan",
      jobType: "Full-Time",
      minimumSalary: 8000000,
      maximumSalary: 15000000,
      createdAt: "2025-10-01T10:00:00Z",
      jobDescription: [
        "Develop, test, and maintain responsive, high-performance web applications using modern front-end technologies.",
        "Collaborate with UI/UX designers to translate wireframes and prototypes into functional code.",
        "Integrate front-end components with APIs and backend services.",
        "Ensure cross-browser compatibility and optimize applications for maximum speed and scalability.",
      ],
    },
    {
      id: "2",
      jobName: "Backend Engineer",
      companyName: "Telkom Indonesia",
      location: "Bandung",
      jobType: "Full-Time",
      minimumSalary: 10000000,
      maximumSalary: 18000000,
      createdAt: "2025-09-25T09:30:00Z",
      jobDescription: [
        "Design and maintain scalable APIs.",
        "Implement secure and optimized backend logic.",
        "Collaborate with frontend engineers to ensure seamless integration.",
      ],
    },
    {
      id: "3",
      jobName: "UI/UX Designer",
      companyName: "Tokopedia",
      location: "Jakarta Pusat",
      jobType: "Contract",
      minimumSalary: 7000000,
      maximumSalary: 12000000,
      createdAt: "2025-10-05T14:00:00Z",
      jobDescription: [
        "Design user-centered interfaces and prototypes.",
        "Conduct usability testing and gather feedback.",
        "Work closely with developers to ensure accurate design implementation.",
      ],
    },
    {
      id: "4",
      jobName: "UI/UX Designer",
      companyName: "Tokopedia",
      location: "Jakarta Pusat",
      jobType: "Contract",
      minimumSalary: 7000000,
      maximumSalary: 12000000,
      createdAt: "2025-10-05T14:00:00Z",
      jobDescription: [
        "Design user-centered interfaces and prototypes.",
        "Conduct usability testing and gather feedback.",
        "Work closely with developers to ensure accurate design implementation.",
      ],
    },
    {
      id: "5",
      jobName: "UI/UX Designer",
      companyName: "Tokopedia",
      location: "Jakarta Pusat",
      jobType: "Contract",
      minimumSalary: 7000000,
      maximumSalary: 12000000,
      createdAt: "2025-10-05T14:00:00Z",
      jobDescription: [
        "Design user-centered interfaces and prototypes.",
        "Conduct usability testing and gather feedback.",
        "Work closely with developers to ensure accurate design implementation.",
      ],
    },
  ],
};

const CandidateJobList = ({ token }: { token: string }) => {
  const [selectedJob, setSelectedJob] = useState(dummyData.jobs[0]);

  return (
    <div className="space-y-4">
      {dummyData.jobs.length > 0 && (
        <div className="grid grid-cols-5 gap-4 mt-4">
          {/* --- Left Section: List of Jobs --- */}{" "}
          <div className="col-span-2 space-y-2 overflow-y-auto max-h-[80vh] pr-2">
            {dummyData.jobs.map((job) => {
              const isActive = selectedJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`flex flex-col gap-2 rounded-xl p-4 cursor-pointer transition shadow-md ${
                    isActive
                      ? "bg-[#F7FEFF] border border-primary"
                      : "bg-white border border-neutral-200 hover:bg-gray-50"
                  }`}
                >
                  {" "}
                  <div className="space-y-2 flex flex-col">
                    {" "}
                    <div className="flex flex-row gap-4 items-start">
                      {" "}
                      <Image
                        width={50}
                        height={50}
                        src="/assets/logo/Logo.svg"
                        alt="logo rakamin"
                        className="w-12"
                      />{" "}
                      <div className="flex flex-col">
                        {" "}
                        <h3 className="font-semibold text-neutral-800">
                          {job.jobName}{" "}
                        </h3>{" "}
                        <p className="text-sm text-neutral-600">
                          {job.companyName}{" "}
                        </p>{" "}
                      </div>{" "}
                    </div>
                    <div className="h-px my-6 border-dashed border border-neutral-40"></div>
                    <span className="text-neutral-90 text-sm">
                      {job.location}
                    </span>
                    <span className="text-neutral-90 text-sm">
                      Rp{job.minimumSalary.toLocaleString()} - Rp
                      {job.maximumSalary.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* --- Right Section: Job Detail --- */}
          <div className="col-span-3 border border-neutral-40 p-4 rounded-lg bg-white">
            {selectedJob ? (
              <>
                <div className="flex flex-row justify-between items-center">
                  <div className="space-y-2">
                    <div className="flex flex-row gap-4 items-start">
                      <Image
                        width={50}
                        height={50}
                        src="/assets/logo/Logo.svg"
                        alt="logo rakamin"
                        className="w-12"
                      />
                      <div className="flex flex-col space-y-1">
                        <div className="w-fit bg-primary rounded-md py-1 px-2">
                          <p className="text-white text-sm font-semibold">
                            {selectedJob.jobType}
                          </p>
                        </div>
                        <h3 className="font-semibold text-neutral-800 text-lg">
                          {selectedJob.jobName}
                        </h3>
                        <p className="text-sm text-neutral-600">
                          {selectedJob.companyName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <ApplyFormModal
                    token={token!}
                    bgColor="bg-secondary"
                    jobName={selectedJob?.jobName}
                    companyName={selectedJob?.companyName}
                  />
                </div>

                <div className="h-px my-4 bg-neutral-40"></div>

                <ul className="list-disc pl-4 space-y-2">
                  {selectedJob.jobDescription.map((desc, i) => (
                    <li key={i} className="text-neutral-90 text-sm">
                      {desc}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      )}

      {!dummyData ||
        (dummyData?.jobs.length === 0 && (
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
          </div>
        ))}
    </div>
  );
};

export default CandidateJobList;
