import { Advocate } from "@/types/advocate";
import { formatPhoneNumber } from "./format";

/**
 * Exports advocates data to CSV format
 * @param advocates - Array of advocates to export
 * @param filename - Optional filename (default: advocates-{timestamp}.csv)
 */
export function exportToCSV(advocates: Advocate[], filename?: string): void {
  if (advocates.length === 0) {
    alert("No advocates to export");
    return;
  }

  // CSV headers
  const headers = [
    "First Name",
    "Last Name",
    "City",
    "Degree",
    "Specialties",
    "Years of Experience",
    "Phone Number",
  ];

  // Convert advocates to CSV rows
  const rows = advocates.map((advocate) => [
    advocate.firstName,
    advocate.lastName,
    advocate.city,
    advocate.degree,
    advocate.specialties.join("; "), // Join specialties with semicolon
    advocate.yearsOfExperience.toString(),
    formatPhoneNumber(advocate.phoneNumber),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  const defaultFilename = `advocates-${new Date().toISOString().split("T")[0]}.csv`;
  link.setAttribute("href", url);
  link.setAttribute("download", filename || defaultFilename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
