'use client';

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services/user.service";
import { usersListAdapter } from "../adapters/user.adapter";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const data = await getUsers();
      // El Senior nunca devuelve la data cruda. La adapta.
      return usersListAdapter(data);
    },
    // Configuraciones de Senior para mejorar la experiencia de usuario
    staleTime: 1000 * 60 * 5, // 5 minutos de data "fresca"
  });
};