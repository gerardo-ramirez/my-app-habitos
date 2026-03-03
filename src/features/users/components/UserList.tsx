// src/features/users/components/UserList.tsx
'use client';
import { useUsers } from '../hooks/useUsers';
import { UserCard } from './UserCard';

export const UserList = () => {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) return <div className="text-red-500">Error al cargar usuarios.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users?.map((user) => (
        <UserCard 
          key={user.id} 
          user={user} 
          intent={user.id % 2 === 0 ? "highlight" : "primary"} // Ejemplo de lógica visual
        />
      ))}
    </div>
  );
};