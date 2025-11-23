"use client";

import { memo, useState } from "react";
import { Advocate } from "@/types/advocate";
import { formatPhoneNumber, getPhoneLink } from "@/utils/format";
import { SpecialtyPill } from "./ui/SpecialtyPill";
import { ExperienceBadge } from "./ui/ExperienceBadge";
import { AdvocateProfileModal } from "./AdvocateProfileModal";

interface AdvocateCardProps {
  advocate: Advocate;
}

function AdvocateCardComponent({ advocate }: AdvocateCardProps) {
  const fullName = `${advocate.firstName} ${advocate.lastName}`;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <article
      className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow bg-white"
      aria-label={`${fullName}, ${advocate.degree} in ${advocate.city}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {fullName}
          </h3>
          <p className="text-sm text-gray-600">
            {advocate.degree} • {advocate.city}
          </p>
        </div>
        <ExperienceBadge years={advocate.yearsOfExperience} />
      </div>

      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-2" id={`specialties-${advocate.id}`}>
          Specialties:
        </p>
        <div
          className="flex flex-wrap"
          role="list"
          aria-labelledby={`specialties-${advocate.id}`}
        >
          {advocate.specialties.map((specialty, index) => (
            <SpecialtyPill key={index} specialty={specialty} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <a
          href={getPhoneLink(advocate.phoneNumber)}
          className="text-blue-600 hover:underline font-medium text-sm"
          aria-label={`Call ${fullName} at ${formatPhoneNumber(advocate.phoneNumber)}`}
        >
          {formatPhoneNumber(advocate.phoneNumber)}
        </a>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          aria-label={`View profile for ${fullName}`}
        >
          View Profile
        </button>
      </div>

      <AdvocateProfileModal
        advocate={advocate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </article>
  );
}

export const AdvocateCard = memo(AdvocateCardComponent);
