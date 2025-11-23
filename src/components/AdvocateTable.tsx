"use client";

import { useState } from "react";
import { Advocate } from "@/types/advocate";
import { formatPhoneNumber, getPhoneLink } from "@/utils/format";
import { SpecialtyPill } from "./ui/SpecialtyPill";
import { ExperienceBadge } from "./ui/ExperienceBadge";
import { AdvocateProfileModal } from "./AdvocateProfileModal";

interface AdvocateTableProps {
  advocates: Advocate[];
}

/**
 * AdvocateTable displays advocates in a table format
 * Note: Sorting is handled by the parent component (page.tsx)
 * to maintain consistency with filters
 */
export function AdvocateTable({ advocates }: AdvocateTableProps) {
  const [selectedAdvocate, setSelectedAdvocate] = useState<Advocate | null>(null);

  if (advocates.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No advocates found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table
        className="min-w-full border-collapse border border-gray-300"
        aria-label="Advocates directory"
        role="table"
      >
        <caption className="sr-only">
          List of mental health advocates with their credentials, specialties, and contact information
        </caption>
        <thead className="bg-gray-100">
          <tr>
            <th scope="col" className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
              First Name
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
              Last Name
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
              City
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
              Degree
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
              Specialties
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
              Experience
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
              Phone Number
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {advocates.map((advocate, index) => {
            const fullName = `${advocate.firstName} ${advocate.lastName}`;
            return (
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
                  <div className="flex flex-wrap max-w-md" role="list" aria-label="Specialties">
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
                    aria-label={`Call ${fullName} at ${formatPhoneNumber(advocate.phoneNumber)}`}
                  >
                    {formatPhoneNumber(advocate.phoneNumber)}
                  </a>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => setSelectedAdvocate(advocate)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                    aria-label={`View profile for ${fullName}`}
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedAdvocate && (
        <AdvocateProfileModal
          advocate={selectedAdvocate}
          isOpen={!!selectedAdvocate}
          onClose={() => setSelectedAdvocate(null)}
        />
      )}
    </div>
  );
}
