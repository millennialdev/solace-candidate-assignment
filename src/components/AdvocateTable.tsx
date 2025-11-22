import { useMemo, useState } from "react";
import { Advocate } from "@/types/advocate";
import { formatPhoneNumber, getPhoneLink } from "@/utils/format";
import { SpecialtyPill } from "./ui/SpecialtyPill";
import { ExperienceBadge } from "./ui/ExperienceBadge";

interface AdvocateTableProps {
  advocates: Advocate[];
}

type SortField = "firstName" | "lastName" | "city" | "degree" | "yearsOfExperience";
type SortDirection = "asc" | "desc";

export function AdvocateTable({ advocates }: AdvocateTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedAdvocates = useMemo(() => {
    if (!sortField) return advocates;

    return [...advocates].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [advocates, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="text-gray-400 ml-1">⇅</span>;
    }
    return (
      <span className="ml-1">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  if (advocates.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No advocates found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => handleSort("firstName")}
            >
              First Name <SortIcon field="firstName" />
            </th>
            <th
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => handleSort("lastName")}
            >
              Last Name <SortIcon field="lastName" />
            </th>
            <th
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => handleSort("city")}
            >
              City <SortIcon field="city" />
            </th>
            <th
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => handleSort("degree")}
            >
              Degree <SortIcon field="degree" />
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Specialties
            </th>
            <th
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => handleSort("yearsOfExperience")}
            >
              Experience <SortIcon field="yearsOfExperience" />
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Phone Number
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedAdvocates.map((advocate, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                {advocate.firstName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {advocate.lastName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {advocate.city}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <span className="font-medium">{advocate.degree}</span>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex flex-wrap max-w-md">
                  {advocate.specialties.map((specialty, idx) => (
                    <SpecialtyPill key={idx} specialty={specialty} />
                  ))}
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <ExperienceBadge years={advocate.yearsOfExperience} />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <a
                  href={getPhoneLink(advocate.phoneNumber)}
                  className="text-blue-600 hover:underline"
                >
                  {formatPhoneNumber(advocate.phoneNumber)}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
