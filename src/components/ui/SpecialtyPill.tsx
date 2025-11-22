interface SpecialtyPillProps {
  specialty: string;
}

export function SpecialtyPill({ specialty }: SpecialtyPillProps) {
  return (
    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
      {specialty}
    </span>
  );
}
