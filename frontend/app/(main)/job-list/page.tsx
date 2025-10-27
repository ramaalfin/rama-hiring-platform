import React from "react";
import { cookies } from "next/headers";

const AdminJobListPage = () => {
  const token = cookies().get("accessToken")?.value;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Job List candidate</h1>
    </div>
  );
};

export default AdminJobListPage;
