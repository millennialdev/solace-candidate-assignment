interface AvatarProps {
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Avatar component displaying user initials
 * Uses a color scheme based on the first letter of the name
 */
export function Avatar({ firstName, lastName, size = "md" }: AvatarProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  // Generate consistent color based on first letter
  const getColorClasses = (letter: string) => {
    const colors = [
      "bg-blue-500 text-white",
      "bg-green-500 text-white",
      "bg-purple-500 text-white",
      "bg-pink-500 text-white",
      "bg-indigo-500 text-white",
      "bg-yellow-500 text-gray-900",
      "bg-red-500 text-white",
      "bg-teal-500 text-white",
    ];

    const index = letter.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${getColorClasses(
        firstName.charAt(0)
      )} rounded-full flex items-center justify-center font-semibold`}
      aria-label={`${firstName} ${lastName} avatar`}
    >
      {initials}
    </div>
  );
}
