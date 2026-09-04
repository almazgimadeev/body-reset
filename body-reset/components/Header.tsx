export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-5 pb-2 pt-6">
      <h1 className="text-[22px] font-semibold text-primary">{title}</h1>
      {subtitle && <p className="mt-0.5 text-[14px] text-secondary">{subtitle}</p>}
    </div>
  );
}
