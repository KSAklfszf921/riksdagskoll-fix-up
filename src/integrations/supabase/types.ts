export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      anforanden: {
        Row: {
          anforande: string | null
          anforande_id: string
          anforandetyp: string | null
          created_at: string | null
          dok_datum: string | null
          dok_titel: string | null
          intressent_id: string | null
          kon: string | null
          nummer: string | null
          parti: string | null
          protokoll_url_xml: string | null
          relaterat_dokument_url: string | null
          rubrik: string | null
          talare: string | null
        }
        Insert: {
          anforande?: string | null
          anforande_id: string
          anforandetyp?: string | null
          created_at?: string | null
          dok_datum?: string | null
          dok_titel?: string | null
          intressent_id?: string | null
          kon?: string | null
          nummer?: string | null
          parti?: string | null
          protokoll_url_xml?: string | null
          relaterat_dokument_url?: string | null
          rubrik?: string | null
          talare?: string | null
        }
        Update: {
          anforande?: string | null
          anforande_id?: string
          anforandetyp?: string | null
          created_at?: string | null
          dok_datum?: string | null
          dok_titel?: string | null
          intressent_id?: string | null
          kon?: string | null
          nummer?: string | null
          parti?: string | null
          protokoll_url_xml?: string | null
          relaterat_dokument_url?: string | null
          rubrik?: string | null
          talare?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anforanden_intressent_id_fkey"
            columns: ["intressent_id"]
            isOneToOne: false
            referencedRelation: "ledamoter"
            referencedColumns: ["iid"]
          },
        ]
      }
      dokument: {
        Row: {
          created_at: string | null
          datum: string | null
          dok_id: string
          doktyp: string | null
          dokument_url_html: string | null
          dokument_url_pdf: string | null
          dokument_url_text: string | null
          hangar_id: string | null
          organ: string | null
          relaterat_id: string | null
          rm: string | null
          status: string | null
          titel: string | null
        }
        Insert: {
          created_at?: string | null
          datum?: string | null
          dok_id: string
          doktyp?: string | null
          dokument_url_html?: string | null
          dokument_url_pdf?: string | null
          dokument_url_text?: string | null
          hangar_id?: string | null
          organ?: string | null
          relaterat_id?: string | null
          rm?: string | null
          status?: string | null
          titel?: string | null
        }
        Update: {
          created_at?: string | null
          datum?: string | null
          dok_id?: string
          doktyp?: string | null
          dokument_url_html?: string | null
          dokument_url_pdf?: string | null
          dokument_url_text?: string | null
          hangar_id?: string | null
          organ?: string | null
          relaterat_id?: string | null
          rm?: string | null
          status?: string | null
          titel?: string | null
        }
        Relationships: []
      }
      kontaktuppgifter: {
        Row: {
          adress: string | null
          created_at: string | null
          epost: string | null
          id: number
          iid: string | null
          telefon: string | null
          typ: string | null
          uppgift: string | null
        }
        Insert: {
          adress?: string | null
          created_at?: string | null
          epost?: string | null
          id?: number
          iid?: string | null
          telefon?: string | null
          typ?: string | null
          uppgift?: string | null
        }
        Update: {
          adress?: string | null
          created_at?: string | null
          epost?: string | null
          id?: number
          iid?: string | null
          telefon?: string | null
          typ?: string | null
          uppgift?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kontaktuppgifter_iid_fkey"
            columns: ["iid"]
            isOneToOne: false
            referencedRelation: "ledamoter"
            referencedColumns: ["iid"]
          },
        ]
      }
      ledamoter: {
        Row: {
          bild_url_192: string | null
          bild_url_80: string | null
          biografi_xml_url: string | null
          created_at: string | null
          efternamn: string | null
          fodd_ar: number | null
          iid: string
          kon: string | null
          parti: string | null
          senast_uppdaterad: string | null
          status: string | null
          tilltalsnamn: string | null
          valkrets: string | null
          webbplats_url: string | null
        }
        Insert: {
          bild_url_192?: string | null
          bild_url_80?: string | null
          biografi_xml_url?: string | null
          created_at?: string | null
          efternamn?: string | null
          fodd_ar?: number | null
          iid: string
          kon?: string | null
          parti?: string | null
          senast_uppdaterad?: string | null
          status?: string | null
          tilltalsnamn?: string | null
          valkrets?: string | null
          webbplats_url?: string | null
        }
        Update: {
          bild_url_192?: string | null
          bild_url_80?: string | null
          biografi_xml_url?: string | null
          created_at?: string | null
          efternamn?: string | null
          fodd_ar?: number | null
          iid?: string
          kon?: string | null
          parti?: string | null
          senast_uppdaterad?: string | null
          status?: string | null
          tilltalsnamn?: string | null
          valkrets?: string | null
          webbplats_url?: string | null
        }
        Relationships: []
      }
      mandatperioder: {
        Row: {
          created_at: string | null
          id: number
          iid: string | null
          period: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          iid?: string | null
          period: string
        }
        Update: {
          created_at?: string | null
          id?: number
          iid?: string | null
          period?: string
        }
        Relationships: [
          {
            foreignKeyName: "mandatperioder_iid_fkey"
            columns: ["iid"]
            isOneToOne: false
            referencedRelation: "ledamoter"
            referencedColumns: ["iid"]
          },
        ]
      }
      uppdrag: {
        Row: {
          created_at: string | null
          from_date: string | null
          id: number
          iid: string | null
          organ: string | null
          roll: string | null
          status: string | null
          tom_date: string | null
          typ: string | null
        }
        Insert: {
          created_at?: string | null
          from_date?: string | null
          id?: number
          iid?: string | null
          organ?: string | null
          roll?: string | null
          status?: string | null
          tom_date?: string | null
          typ?: string | null
        }
        Update: {
          created_at?: string | null
          from_date?: string | null
          id?: number
          iid?: string | null
          organ?: string | null
          roll?: string | null
          status?: string | null
          tom_date?: string | null
          typ?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uppdrag_iid_fkey"
            columns: ["iid"]
            isOneToOne: false
            referencedRelation: "ledamoter"
            referencedColumns: ["iid"]
          },
        ]
      }
      voteringar: {
        Row: {
          avser: string | null
          created_at: string | null
          dok_id: string | null
          id: number
          intressent_id: string | null
          namn: string | null
          parti: string | null
          rost: string | null
          valkrets: string | null
          votering_datum: string | null
          votering_id: string | null
        }
        Insert: {
          avser?: string | null
          created_at?: string | null
          dok_id?: string | null
          id?: number
          intressent_id?: string | null
          namn?: string | null
          parti?: string | null
          rost?: string | null
          valkrets?: string | null
          votering_datum?: string | null
          votering_id?: string | null
        }
        Update: {
          avser?: string | null
          created_at?: string | null
          dok_id?: string | null
          id?: number
          intressent_id?: string | null
          namn?: string | null
          parti?: string | null
          rost?: string | null
          valkrets?: string | null
          votering_datum?: string | null
          votering_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voteringar_dok_id_fkey"
            columns: ["dok_id"]
            isOneToOne: false
            referencedRelation: "dokument"
            referencedColumns: ["dok_id"]
          },
          {
            foreignKeyName: "voteringar_intressent_id_fkey"
            columns: ["intressent_id"]
            isOneToOne: false
            referencedRelation: "ledamoter"
            referencedColumns: ["iid"]
          },
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
