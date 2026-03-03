'use client';

import { Skeleton } from "@/components/ui/skeleton";

export const HabitSkeleton = () => {
  return (
    <div className="p-4 rounded-lg shadow-md mb-4 border border-emerald-500/30 bg-zinc-900/50 glassmorphism">
      <div className="flex items-center">
        <Skeleton className="w-6 h-6 rounded-full bg-zinc-800" />
        <div className="ml-3 flex-grow">
          <Skeleton className="h-5 w-3/4 mb-2 bg-zinc-800" />
          <Skeleton className="h-3 w-1/2 bg-zinc-800" />
        </div>
        <div className="flex">
          <Skeleton className="w-8 h-8 rounded-md mr-2 bg-zinc-800" />
          <Skeleton className="w-8 h-8 rounded-md bg-zinc-800" />
        </div>
      </div>
    </div>
  );
};

export const HabitSkeletonList = () => {
  return (
    <div className="space-y-4">
      <div className="bg-zinc-900/70 glassmorphism-dark border border-zinc-700/30 rounded-md p-3 mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <Skeleton className="w-5 h-5 mr-2 rounded-full bg-zinc-800" />
          <Skeleton className="h-4 w-40 bg-zinc-800" />
        </div>
        <Skeleton className="h-3 w-60 bg-zinc-800" />
      </div>
      
      {Array(5).fill(0).map((_, i) => (
        <HabitSkeleton key={i} />
      ))}
    </div>
  );
};