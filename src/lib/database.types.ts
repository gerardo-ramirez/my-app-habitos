export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      habits: {
        Row: {
          id: string
          title: string
          description: string | null
          created_at: string
          user_id: string
          is_completed: boolean
          last_completed_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          created_at?: string
          user_id: string
          is_completed?: boolean
          last_completed_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          created_at?: string
          user_id?: string
          is_completed?: boolean
          last_completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "habits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Tipos para autenticación
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Tipos específicos para habits
export type Habit = Tables<'habits'>
export type NewHabit = InsertTables<'habits'>
export type UpdateHabit = UpdateTables<'habits'>