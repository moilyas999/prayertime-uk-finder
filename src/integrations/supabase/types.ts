export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ad_settings: {
        Row: {
          ad_type: string
          created_at: string
          id: string
          is_enabled: boolean
          location: string
          updated_at: string
        }
        Insert: {
          ad_type: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          location: string
          updated_at?: string
        }
        Update: {
          ad_type?: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          location?: string
          updated_at?: string
        }
        Relationships: []
      }
      analytics: {
        Row: {
          id: string
          lat: number | null
          lng: number | null
          postcode: string
          search_time: string
        }
        Insert: {
          id?: string
          lat?: number | null
          lng?: number | null
          postcode: string
          search_time?: string
        }
        Update: {
          id?: string
          lat?: number | null
          lng?: number | null
          postcode?: string
          search_time?: string
        }
        Relationships: []
      }
      business_profiles: {
        Row: {
          approved: boolean
          business_name: string
          contact_email: string
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          industry: string
          linkedin_url: string | null
          location_city: string
          location_country: string
          logo_url: string | null
          services: string[] | null
          slug: string
          tags: string[] | null
          updated_at: string
          user_id: string
          website_url: string | null
          whatsapp_number: string | null
        }
        Insert: {
          approved?: boolean
          business_name: string
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry: string
          linkedin_url?: string | null
          location_city: string
          location_country: string
          logo_url?: string | null
          services?: string[] | null
          slug: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
          website_url?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          approved?: boolean
          business_name?: string
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string
          linkedin_url?: string | null
          location_city?: string
          location_country?: string
          logo_url?: string | null
          services?: string[] | null
          slug?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          currency: string
          donor_email: string | null
          donor_name: string | null
          id: string
          is_anonymous: boolean
          message: string | null
          mosque_id: string
          payment_method: string | null
          status: string
          transaction_reference: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean
          message?: string | null
          mosque_id: string
          payment_method?: string | null
          status?: string
          transaction_reference?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean
          message?: string | null
          mosque_id?: string
          payment_method?: string | null
          status?: string
          transaction_reference?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_mosque_id_fkey"
            columns: ["mosque_id"]
            isOneToOne: false
            referencedRelation: "mosques"
            referencedColumns: ["id"]
          },
        ]
      }
      iqama_times: {
        Row: {
          approved: boolean
          asr: string | null
          created_at: string
          dhuhr: string | null
          fajr: string | null
          id: string
          isha: string | null
          maghrib: string | null
          mosque_id: string
          notes: string | null
          recurring: boolean
          submitted_by_email: string | null
          updated_at: string
        }
        Insert: {
          approved?: boolean
          asr?: string | null
          created_at?: string
          dhuhr?: string | null
          fajr?: string | null
          id?: string
          isha?: string | null
          maghrib?: string | null
          mosque_id: string
          notes?: string | null
          recurring?: boolean
          submitted_by_email?: string | null
          updated_at?: string
        }
        Update: {
          approved?: boolean
          asr?: string | null
          created_at?: string
          dhuhr?: string | null
          fajr?: string | null
          id?: string
          isha?: string | null
          maghrib?: string | null
          mosque_id?: string
          notes?: string | null
          recurring?: boolean
          submitted_by_email?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iqama_times_mosque_id_fkey"
            columns: ["mosque_id"]
            isOneToOne: false
            referencedRelation: "mosques"
            referencedColumns: ["id"]
          },
        ]
      }
      mosques: {
        Row: {
          address: string | null
          admin_email: string
          approved: boolean
          created_at: string
          donation_goal: number | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          postcode: string
          updated_at: string
          website_url: string | null
          widget_theme: Json | null
        }
        Insert: {
          address?: string | null
          admin_email: string
          approved?: boolean
          created_at?: string
          donation_goal?: number | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          postcode: string
          updated_at?: string
          website_url?: string | null
          widget_theme?: Json | null
        }
        Update: {
          address?: string | null
          admin_email?: string
          approved?: boolean
          created_at?: string
          donation_goal?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          postcode?: string
          updated_at?: string
          website_url?: string | null
          widget_theme?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_accounts: {
        Row: {
          created_at: string
          email: string
          id: string
          postcode: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          postcode?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          postcode?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notification_settings: {
        Row: {
          device_token: string | null
          enable_email: boolean
          enable_push: boolean
          enable_sms: boolean
          id: string
          notification_time: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          device_token?: string | null
          enable_email?: boolean
          enable_push?: boolean
          enable_sms?: boolean
          id?: string
          notification_time?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          device_token?: string | null
          enable_email?: boolean
          enable_push?: boolean
          enable_sms?: boolean
          id?: string
          notification_time?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          auto_location_enabled: boolean
          created_at: string
          default_postcode: string | null
          id: string
          prayer_method: number
          updated_at: string
          use_current_location: boolean
          user_id: string
        }
        Insert: {
          auto_location_enabled?: boolean
          created_at?: string
          default_postcode?: string | null
          id?: string
          prayer_method?: number
          updated_at?: string
          use_current_location?: boolean
          user_id: string
        }
        Update: {
          auto_location_enabled?: boolean
          created_at?: string
          default_postcode?: string | null
          id?: string
          prayer_method?: number
          updated_at?: string
          use_current_location?: boolean
          user_id?: string
        }
        Relationships: []
      }
      users_reminder_signups: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          postcode: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          postcode: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          postcode?: string
        }
        Relationships: []
      }
      widget_analytics: {
        Row: {
          created_at: string
          date: string
          id: string
          mosque_id: string | null
          region: string | null
          updated_at: string
          views: number
          widget_id: string | null
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          mosque_id?: string | null
          region?: string | null
          updated_at?: string
          views?: number
          widget_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          mosque_id?: string | null
          region?: string | null
          updated_at?: string
          views?: number
          widget_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "widget_analytics_mosque_id_fkey"
            columns: ["mosque_id"]
            isOneToOne: false
            referencedRelation: "mosques"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "widget_analytics_widget_id_fkey"
            columns: ["widget_id"]
            isOneToOne: false
            referencedRelation: "widget_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      widget_instances: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          postcode: string
          size: string
          theme: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          postcode: string
          size?: string
          theme?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          postcode?: string
          size?: string
          theme?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_slug: {
        Args: { input_text: string }
        Returns: string
      }
    }
    Enums: {
      user_role: "admin" | "business"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "business"],
    },
  },
} as const
