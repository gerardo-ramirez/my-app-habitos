// src/app/users/page.tsx
import { UserList } from "@/features/users";

// Este es un Server Component. SEO amigable.
export default function UsersPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Users Directory</h1>
      <UserList />
    </div>
  );
}