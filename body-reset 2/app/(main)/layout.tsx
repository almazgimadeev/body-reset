import { BottomNavigation } from "@/components/BottomNavigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-24">
      {children}
      <BottomNavigation />
    </div>
  );
}
