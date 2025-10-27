"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Candidate {
  id: string;
  fullName: string;
  gender: string;
  domicile: string;
  email: string;
  phoneNumber: string;
  linkedinLink: string;
  dateOfBirth: string;
}

const dummyCandidates: Candidate[] = [
  {
    id: "1",
    fullName: "Alfin Rama",
    gender: "Male",
    domicile: "Jakarta",
    email: "alfin@example.com",
    phoneNumber: "08123456789",
    linkedinLink: "https://linkedin.com/in/alfin",
    dateOfBirth: "1998-06-20",
  },
  {
    id: "2",
    fullName: "Siti Aisyah",
    gender: "Female",
    domicile: "Bandung",
    email: "aisyah@example.com",
    phoneNumber: "08121234567",
    linkedinLink: "https://linkedin.com/in/aisyah",
    dateOfBirth: "1996-03-11",
  },
  {
    id: "3",
    fullName: "Rizky Maulana",
    gender: "Male",
    domicile: "Surabaya",
    email: "rizky@example.com",
    phoneNumber: "0813332211",
    linkedinLink: "https://linkedin.com/in/rizky",
    dateOfBirth: "1999-09-09",
  },
  {
    id: "4",
    fullName: "Rizky Maulana",
    gender: "Male",
    domicile: "Surabaya",
    email: "rizky@example.com",
    phoneNumber: "0813332211",
    linkedinLink: "https://linkedin.com/in/rizky",
    dateOfBirth: "1999-09-09",
  },
  {
    id: "5",
    fullName: "Rizky Maulana",
    gender: "Male",
    domicile: "Surabaya",
    email: "rizky@example.com",
    phoneNumber: "0813332211",
    linkedinLink: "https://linkedin.com/in/rizky",
    dateOfBirth: "1999-09-09",
  },
  {
    id: "6",
    fullName: "Rizky Maulana",
    gender: "Male",
    domicile: "Surabaya",
    email: "rizky@example.com",
    phoneNumber: "0813332211",
    linkedinLink: "https://linkedin.com/in/rizky",
    dateOfBirth: "1999-09-09",
  },
  {
    id: "7",
    fullName: "Rizky Maulana",
    gender: "Male",
    domicile: "Surabaya",
    email: "rizky@example.com",
    phoneNumber: "0813332211",
    linkedinLink: "https://linkedin.com/in/rizky",
    dateOfBirth: "1999-09-09",
  },
];

export default function DetailJob({ token }: { token?: string }) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments.pop();

  // Decode URL-encoded chars (misal %20 jadi spasi)
  const decodedSegment = lastSegment ? decodeURIComponent(lastSegment) : "";

  // Ubah format: ganti underscore/dash jadi spasi dan kapitalisasi awal kata
  const formattedSegment = decodedSegment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof Candidate>("fullName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const limit = 5;

  // ---- Filtered & Sorted data ----
  const filteredData = useMemo(() => {
    let data = dummyCandidates;

    // Filter by gender
    if (genderFilter !== "all") {
      data = data.filter((item) => item.gender === genderFilter);
    }

    // Search
    if (search) {
      const keyword = search.toLowerCase();
      data = data.filter(
        (item) =>
          item.fullName.toLowerCase().includes(keyword) ||
          item.email.toLowerCase().includes(keyword) ||
          item.domicile.toLowerCase().includes(keyword)
      );
    }

    // Sorting
    data = [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });

    return data;
  }, [search, genderFilter, sortField, sortOrder]);

  // ---- Pagination ----
  const totalPages = Math.ceil(filteredData.length / limit);
  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  // ---- Toggle sorting ----
  const handleSort = (field: keyof Candidate) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // ---- Checkbox handlers ----
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedData.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  const allSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedIds.includes(item.id));

  return (
    <div className="space-y-4">
      <p className="text-neutral-1000 text-lg font-bold">{formattedSegment}</p>

      {filteredData.length > 0 ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Input
              placeholder="Search candidate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />

            <Select
              value={genderFilter}
              onValueChange={(val) => setGenderFilter(val)}
            >
              <SelectTrigger className="w-[180px]">
                <span>
                  {genderFilter === "all" ? "All Genders" : genderFilter}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-30">
                  <TableHead className="w-10">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={(checked) =>
                        toggleSelectAll(checked === true)
                      }
                    />
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("fullName")}
                    className="cursor-pointer text-neutral-1000 font-bold p-4"
                  >
                    Full Name{" "}
                    {sortField === "fullName"
                      ? sortOrder === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </TableHead>
                  <TableHead className="text-neutral-1000 font-bold p-4">
                    Email
                  </TableHead>
                  <TableHead className="text-neutral-1000 font-bold p-4">
                    Phone Number
                  </TableHead>
                  <TableHead className="text-neutral-1000 font-bold p-4">
                    Date of Birth
                  </TableHead>
                  <TableHead className="text-neutral-1000 font-bold p-4">
                    Domicile
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("gender")}
                    className="cursor-pointer text-neutral-1000 font-bold p-4"
                  >
                    Gender{" "}
                    {sortField === "gender"
                      ? sortOrder === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </TableHead>
                  <TableHead className="text-neutral-1000 font-bold">
                    LinkedIn
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="w-10">
                      <Checkbox
                        checked={selectedIds.includes(candidate.id)}
                        onCheckedChange={(checked) =>
                          toggleSelect(candidate.id, checked === true)
                        }
                      />
                    </TableCell>
                    <TableCell className="p-4">{candidate.fullName}</TableCell>
                    <TableCell className="p-4">{candidate.email}</TableCell>
                    <TableCell className="p-4">
                      {candidate.phoneNumber}
                    </TableCell>
                    <TableCell className="p-4">
                      {candidate.dateOfBirth}
                    </TableCell>
                    <TableCell className="p-4">{candidate.domicile}</TableCell>
                    <TableCell className="p-4">{candidate.gender}</TableCell>
                    <TableCell className="p-4">
                      <a
                        href={candidate.linkedinLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {candidate?.linkedinLink || ""}
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-4 mt-4 justify-end">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <p>
              Page {page} of {totalPages}
            </p>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-4">
          <Image
            src="/assets/illustration/Empty Candidate.svg"
            alt="No Data"
            width={1200}
            height={800}
            className="size-60 object-contain"
          />
          <h2 className="text-lg font-semibold text-neutral-90">
            No candidate found
          </h2>
          <p className="text-neutral-90">
            Share your job vacancies so that more candidates will apply.{" "}
          </p>
        </div>
      )}
    </div>
  );
}
