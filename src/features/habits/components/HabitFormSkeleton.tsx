'use client';

import { Skeleton } from "@/components/ui/skeleton";

export const HabitFormSkeleton = () => {
  return (
    <div className="bg-zinc-900/50 glassmorphism rounded-lg shadow-md p-6 mb-6 border border-emerald-500/30">
      <Skeleton className="h-7 w-1/3 mb-4 bg-zinc-800" />
      
      <div className="mb-4">
        <Skeleton className="h-5 w-1/4 mb-1 bg-zinc-800" />
        <Skeleton className="h-10 w-full bg-zinc-800" />
      </div>
      
      <div className="mb-4">
        <Skeleton className="h-5 w-1/3 mb-1 bg-zinc-800" />
        <Skeleton className="h-24 w-full bg-zinc-800" />
      </div>
      
      <Skeleton className="h-10 w-full bg-zinc-800" />
    </div>
  );
};