export default function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    className,
  };

  switch (slug) {
    case "pizza":
      return (
        <svg {...common}>
          <path d="M12 2c4 5 8 11 8 13a8 8 0 0 1-16 0c0-2 4-8 8-13z" />
        </svg>
      );
    case "burgers":
      return (
        <svg {...common}>
          <path d="M4 11h16a1 1 0 0 1 1 1 6 6 0 0 1-6 6H9a6 6 0 0 1-6-6 1 1 0 0 1 1-1z" />
          <path d="M5 11a7 5 0 0 1 14 0" />
          <path d="M3.5 17h17" />
        </svg>
      );
    case "wraps":
      return (
        <svg {...common}>
          <path d="M6 4c8 0 14 6 14 14" />
          <path d="M6 4v16" />
          <path d="M6 4c0 0 6 2 6 8s-6 8-6 8" />
        </svg>
      );
    case "pasta":
      return (
        <svg {...common}>
          <path d="M3 12a9 5 0 0 0 18 0" />
          <path d="M3 12a9 5 0 0 1 18 0" />
          <path d="M7 10c1 2 1 3 0 5M12 9c1 2 1 4 0 6M17 10c1 2 1 3 0 5" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
