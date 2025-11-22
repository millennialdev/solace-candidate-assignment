interface ExperienceBadgeProps {
  years: number;
}

export function ExperienceBadge({ years }: ExperienceBadgeProps) {
  const getBadgeColor = (years: number) => {
    if (years >= 10) return "bg-green-100 text-green-800";
    if (years >= 5) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <span className={`inline-block text-xs px-2 py-1 rounded ${getBadgeColor(years)}`}>
      {years} {years === 1 ? "year" : "years"}
    </span>
  );
}
