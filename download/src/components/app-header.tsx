import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <nav className="flex w-full flex-row items-center justify-between gap-6 text-lg font-medium md:text-sm">
        <a
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl text-primary">EduPrep AI</span>
        </a>
      </nav>
    </header>
  );
}
