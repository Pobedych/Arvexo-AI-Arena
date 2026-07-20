type ArvexoLogoProps = {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
};

export function ArvexoLogo({ className = "", markClassName = "", wordmarkClassName = "" }: ArvexoLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        aria-hidden="true"
        className={`h-8 w-8 shrink-0 text-[#15171c] ${markClassName}`}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18 6H7V42H18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M30 6H41V42H30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 24H30" stroke="#63B85B" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span aria-hidden="true" className={`whitespace-nowrap text-[18px] font-medium leading-none tracking-[-.045em] ${wordmarkClassName}`}>
        arvexo
      </span>
      <span className="sr-only">Arvexo Arena</span>
    </span>
  );
}
