import React from "react";
import { cookies } from "next/headers";
import JobFormModal from "../_components/JobFormModal";
import JobList from "../_components/JobList";

const AdminHomePage = () => {
  const token = cookies().get("accessToken")?.value;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Job List</h1>

      <JobList token={token!} />
      {/* <JobFormModal token={token} /> */}
      {/* TODO: di sini nanti render daftar Job */}
    </div>
  );
};

export default AdminHomePage;
