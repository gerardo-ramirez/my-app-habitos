'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DailyStats } from "@/features/habits/adapters/statsAdapterServer";

interface StatsTableProps {
  stats: DailyStats[];
}

const StatsTable = ({ stats }: StatsTableProps) => {
  // Formatear fecha para mostrar de manera legible
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 rounded-lg overflow-hidden">
      <Table>
        <TableCaption>Estadísticas de los últimos 30 días</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Fecha</TableHead>
            <TableHead className="text-center">Completados</TableHead>
            <TableHead className="text-center">Incompletos</TableHead>
            <TableHead className="text-center">Cancelados</TableHead>
            <TableHead className="text-center">Total</TableHead>
            <TableHead className="text-right">% Completado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.map((day) => {
            const completionRate = day.total > 0 
              ? Math.round((day.completed / day.total) * 100) 
              : 0;
              
            return (
              <TableRow key={day.date}>
                <TableCell className="font-medium">{formatDate(day.date)}</TableCell>
                <TableCell className="text-center">
                  <span className="text-cyan-400">{day.completed}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-amber-400">{day.incomplete}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-rose-400">{day.cancelled}</span>
                </TableCell>
                <TableCell className="text-center">{day.total}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    <div className="w-24 bg-zinc-800 rounded-full h-2 mr-2">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full" 
                        style={{ width: `${completionRate}%` }}
                      ></div>
                    </div>
                    <span>{completionRate}%</span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default StatsTable;