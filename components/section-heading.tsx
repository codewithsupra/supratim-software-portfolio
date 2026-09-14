export function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="mt-8 max-w-[46rem] font-display text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl"
    >
      {children}
    </h2>
  );
}
