"use client";

import { useEffect, useState, useMemo } from "react";
import { Advocate, AdvocatesResponse } from "@/types/advocate";
import { formatPhoneNumber, getPhoneLink } from "@/utils/format";
import { useDebounce } from "@/hooks/useDebounce";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    console.log("fetching advocates...");
    setLoading(true);
    setError(null);

    // Fetch all advocates with a high limit to support client-side filtering
    // In PR 3, we'll implement server-side filtering and proper pagination
    fetch("/api/advocates?limit=100")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch advocates");
        }
        return response.json();
      })
      .then((jsonResponse: AdvocatesResponse) => {
        setAdvocates(jsonResponse.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching advocates:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredAdvocates = useMemo(() => {
    if (!debouncedSearchTerm) {
      return advocates;
    }

    console.log("filtering advocates...");
    const searchLower = debouncedSearchTerm.toLowerCase();

    return advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchLower) ||
        advocate.lastName.toLowerCase().includes(searchLower) ||
        advocate.city.toLowerCase().includes(searchLower) ||
        advocate.degree.toLowerCase().includes(searchLower) ||
        advocate.specialties.some((specialty) =>
          specialty.toLowerCase().includes(searchLower)
        ) ||
        advocate.yearsOfExperience.toString().includes(searchLower)
      );
    });
  }, [advocates, debouncedSearchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleReset = () => {
    setSearchTerm("");
  };

  if (loading) {
    return (
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-8">Solace Advocates</h1>
        <p className="text-gray-600">Loading advocates...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-8">Solace Advocates</h1>
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          <p className="font-semibold">Error loading advocates</p>
          <p className="text-sm">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-8">Solace Advocates</h1>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <label htmlFor="search" className="block text-sm font-medium mb-2">
          Search
        </label>
        <p className="text-sm text-gray-600 mb-2">
          Searching for:{" "}
          <span className="font-semibold">
            {searchTerm || "(all advocates)"}
          </span>
        </p>
        <div className="flex gap-2">
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name, city, degree, specialty, or experience..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-medium transition-colors"
          >
            Reset Search
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                First Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Last Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                City
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Degree
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Specialties
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Years of Experience
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Phone Number
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                >
                  No advocates found matching &quot;{searchTerm}&quot;
                </td>
              </tr>
            ) : (
              filteredAdvocates.map((advocate, index) => (
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
                    {advocate.degree}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {advocate.specialties.join(", ")}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {advocate.yearsOfExperience}
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
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredAdvocates.length} of {advocates.length} advocates
      </div>
    </main>
  );
}
