// src/features/users/components/UserCard.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { UserUI } from "../types";

// 🎨 Definición de variantes con CVA
const cardVariants = cva(
  "p-4 rounded-lg border transition-all duration-200 shadow-sm hover:shadow-md",
  {
    variants: {
      intent: {
        primary: "bg-white border-gray-200 text-meli-black",
        highlight: "bg-blue-50 border-meli-blue/30 text-meli-blue",
        dark: "bg-meli-black text-white border-transparent",
      },
      size: {
        default: "w-full",
        compact: "w-64 text-sm",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "default",
    },
  }
);

interface UserCardProps 
  extends VariantProps<typeof cardVariants> {
  user: UserUI;
  className?: string;
}

export const UserCard = ({ user, intent, size, className }: UserCardProps) => {
  return (
    <div className={cn(cardVariants({ intent, size, className }))}>
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-lg leading-none">{user.fullName}</h3>
        <p className="text-meli-gray italic">{user.email}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider opacity-70">
            📍 {user.location}
          </span>
        </div>
      </div>
    </div>
  );
};