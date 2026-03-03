'use client';

import { useUser, useLogout } from '../hooks';
import { Button } from '@/components/ui/button';

export const UserMenu = () => {
  const { data: userData, isLoading } = useUser();
  const logout = useLogout();
  const user = userData?.user;

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="h-4 w-24 bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm">
        <span className="block font-medium">{user.email}</span>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => logout.mutate()}
      >
        Cerrar Sesión
      </Button>
    </div>
  );
};