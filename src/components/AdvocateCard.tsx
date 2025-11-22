import { Advocate } from "@/types/advocate";
import { formatPhoneNumber, getPhoneLink } from "@/utils/format";
import { SpecialtyPill } from "./ui/SpecialtyPill";
import { ExperienceBadge } from "./ui/ExperienceBadge";

interface AdvocateCardProps {
  advocate: Advocate;
}

export function AdvocateCard({ advocate }: AdvocateCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {advocate.firstName} {advocate.lastName}
          </h3>
          <p className="text-sm text-gray-600">
            {advocate.degree} • {advocate.city}
          </p>
        </div>
        <ExperienceBadge years={advocate.yearsOfExperience} />
      </div>

      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
        <div className="flex flex-wrap">
          {advocate.specialties.map((specialty, index) => (
            <SpecialtyPill key={index} specialty={specialty} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <a
          href={getPhoneLink(advocate.phoneNumber)}
          className="text-blue-600 hover:underline font-medium text-sm"
        >
          {formatPhoneNumber(advocate.phoneNumber)}
        </a>
        <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
          View Profile
        </button>
      </div>
    </div>
  );
}
