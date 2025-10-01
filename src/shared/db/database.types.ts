export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  orbipax_core: {
    Tables: {
      appointments: {
        Row: {
          appt_slot: unknown | null
          clinician_id: string
          created_at: string
          created_by: string
          ends_at: string
          id: string
          location: string | null
          notes_internal: string | null
          organization_id: string
          patient_id: string
          reason: string | null
          starts_at: string
          status: Database["orbipax_core"]["Enums"]["appointment_status"]
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          appt_slot?: unknown | null
          clinician_id: string
          created_at?: string
          created_by: string
          ends_at: string
          id?: string
          location?: string | null
          notes_internal?: string | null
          organization_id: string
          patient_id: string
          reason?: string | null
          starts_at: string
          status?: Database["orbipax_core"]["Enums"]["appointment_status"]
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          appt_slot?: unknown | null
          clinician_id?: string
          created_at?: string
          created_by?: string
          ends_at?: string
          id?: string
          location?: string | null
          notes_internal?: string | null
          organization_id?: string
          patient_id?: string
          reason?: string | null
          starts_at?: string
          status?: Database["orbipax_core"]["Enums"]["appointment_status"]
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_clinician_id_fkey"
            columns: ["clinician_id"]
            isOneToOne: false
            referencedRelation: "clinicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: Database["orbipax_core"]["Enums"]["audit_action"]
          actor_user_id: string
          id: string
          meta: Json | null
          method: string | null
          occurred_at: string
          organization_id: string
          route: string | null
          subject_id: string | null
          subject_type: Database["orbipax_core"]["Enums"]["subject_type"]
        }
        Insert: {
          action: Database["orbipax_core"]["Enums"]["audit_action"]
          actor_user_id: string
          id?: string
          meta?: Json | null
          method?: string | null
          occurred_at?: string
          organization_id: string
          route?: string | null
          subject_id?: string | null
          subject_type: Database["orbipax_core"]["Enums"]["subject_type"]
        }
        Update: {
          action?: Database["orbipax_core"]["Enums"]["audit_action"]
          actor_user_id?: string
          id?: string
          meta?: Json | null
          method?: string | null
          occurred_at?: string
          organization_id?: string
          route?: string | null
          subject_id?: string | null
          subject_type?: Database["orbipax_core"]["Enums"]["subject_type"]
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      authorization_records: {
        Row: {
          authorization_number: string
          authorization_type: string
          created_at: string
          end_date: string | null
          id: string
          notes: string | null
          organization_id: string
          patient_id: string
          start_date: string
          units_approved: number | null
          updated_at: string | null
        }
        Insert: {
          authorization_number: string
          authorization_type: string
          created_at?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          patient_id: string
          start_date: string
          units_approved?: number | null
          updated_at?: string | null
        }
        Update: {
          authorization_number?: string
          authorization_type?: string
          created_at?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          patient_id?: string
          start_date?: string
          units_approved?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "authorization_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "authorization_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "authorization_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "authorization_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      clinicians: {
        Row: {
          created_at: string
          deactivated_at: string | null
          display_name: string
          id: string
          languages: string[] | null
          license_expires_at: string | null
          license_number: string | null
          license_state: string | null
          max_caseload: number | null
          npi: string | null
          organization_id: string
          specialties: string[] | null
          status: Database["orbipax_core"]["Enums"]["clinician_status"]
          time_zone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          deactivated_at?: string | null
          display_name: string
          id?: string
          languages?: string[] | null
          license_expires_at?: string | null
          license_number?: string | null
          license_state?: string | null
          max_caseload?: number | null
          npi?: string | null
          organization_id: string
          specialties?: string[] | null
          status?: Database["orbipax_core"]["Enums"]["clinician_status"]
          time_zone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          deactivated_at?: string | null
          display_name?: string
          id?: string
          languages?: string[] | null
          license_expires_at?: string | null
          license_number?: string | null
          license_state?: string | null
          max_caseload?: number | null
          npi?: string | null
          organization_id?: string
          specialties?: string[] | null
          status?: Database["orbipax_core"]["Enums"]["clinician_status"]
          time_zone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clinicians_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinicians_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_signatures: {
        Row: {
          consent_id: string
          created_at: string
          id: string
          ip_hash: string | null
          method: string
          organization_id: string
          patient_id: string
          pdf_snapshot_id: string | null
          signed_at: string
          signed_by_user: string | null
          user_agent_hash: string | null
        }
        Insert: {
          consent_id: string
          created_at?: string
          id?: string
          ip_hash?: string | null
          method: string
          organization_id: string
          patient_id: string
          pdf_snapshot_id?: string | null
          signed_at?: string
          signed_by_user?: string | null
          user_agent_hash?: string | null
        }
        Update: {
          consent_id?: string
          created_at?: string
          id?: string
          ip_hash?: string | null
          method?: string
          organization_id?: string
          patient_id?: string
          pdf_snapshot_id?: string | null
          signed_at?: string
          signed_by_user?: string | null
          user_agent_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consent_signatures_consent_id_fkey"
            columns: ["consent_id"]
            isOneToOne: false
            referencedRelation: "consents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consent_signatures_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consent_signatures_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consent_signatures_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consent_signatures_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
          {
            foreignKeyName: "consent_signatures_pdf_snapshot_id_fkey"
            columns: ["pdf_snapshot_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      consents: {
        Row: {
          code: string
          created_at: string
          document_id: string | null
          id: string
          organization_id: string
          status: Database["orbipax_core"]["Enums"]["consent_status"]
          title: string
          version: string
        }
        Insert: {
          code: string
          created_at?: string
          document_id?: string | null
          id?: string
          organization_id: string
          status?: Database["orbipax_core"]["Enums"]["consent_status"]
          title: string
          version: string
        }
        Update: {
          code?: string
          created_at?: string
          document_id?: string | null
          id?: string
          organization_id?: string
          status?: Database["orbipax_core"]["Enums"]["consent_status"]
          title?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "consents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnoses_clinical: {
        Row: {
          completed_at: string | null
          created_at: string
          diagnoses: Json | null
          functional_assessment: Json | null
          id: string
          last_modified: string | null
          organization_id: string
          patient_id: string | null
          psychiatric_evaluation: Json | null
          session_id: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          diagnoses?: Json | null
          functional_assessment?: Json | null
          id?: string
          last_modified?: string | null
          organization_id: string
          patient_id?: string | null
          psychiatric_evaluation?: Json | null
          session_id: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          diagnoses?: Json | null
          functional_assessment?: Json | null
          id?: string
          last_modified?: string | null
          organization_id?: string
          patient_id?: string | null
          psychiatric_evaluation?: Json | null
          session_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          bucket: string
          created_at: string
          encrypted_at_rest: boolean
          file_size_bytes: number
          id: string
          kind: Database["orbipax_core"]["Enums"]["document_kind"]
          mime_type: string
          organization_id: string
          owner_patient_id: string | null
          sha256_hex: string
          storage_path: string
          uploaded_by: string
        }
        Insert: {
          bucket: string
          created_at?: string
          encrypted_at_rest?: boolean
          file_size_bytes: number
          id?: string
          kind?: Database["orbipax_core"]["Enums"]["document_kind"]
          mime_type: string
          organization_id: string
          owner_patient_id?: string | null
          sha256_hex: string
          storage_path: string
          uploaded_by: string
        }
        Update: {
          bucket?: string
          created_at?: string
          encrypted_at_rest?: boolean
          file_size_bytes?: number
          id?: string
          kind?: Database["orbipax_core"]["Enums"]["document_kind"]
          mime_type?: string
          organization_id?: string
          owner_patient_id?: string | null
          sha256_hex?: string
          storage_path?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_owner_patient_id_fkey"
            columns: ["owner_patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_owner_patient_id_fkey"
            columns: ["owner_patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      encounters: {
        Row: {
          clinician_id: string | null
          created_at: string
          created_by: string
          id: string
          location: string | null
          occurred_at: string
          organization_id: string
          patient_id: string
        }
        Insert: {
          clinician_id?: string | null
          created_at?: string
          created_by: string
          id?: string
          location?: string | null
          occurred_at: string
          organization_id: string
          patient_id: string
        }
        Update: {
          clinician_id?: string | null
          created_at?: string
          created_by?: string
          id?: string
          location?: string | null
          occurred_at?: string
          organization_id?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "encounters_clinician_id_fkey"
            columns: ["clinician_id"]
            isOneToOne: false
            referencedRelation: "clinicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encounters_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encounters_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encounters_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encounters_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      insurance_records: {
        Row: {
          annual_mental_health_limit: number | null
          carrier: string
          created_at: string
          effective_date: string
          expiration_date: string | null
          group_number: string | null
          has_mental_health_coverage: boolean
          id: string
          insurance_type:
            | Database["orbipax_core"]["Enums"]["insurance_type"]
            | null
          is_primary: boolean
          is_verified: boolean
          member_id: string
          mental_health_copay: number | null
          mental_health_deductible: number | null
          organization_id: string
          patient_id: string
          plan_kind:
            | Database["orbipax_core"]["Enums"]["insurance_plan_kind"]
            | null
          plan_name: string | null
          plan_type: string | null
          relationship_to_subscriber: string | null
          requires_preauth: boolean
          subscriber_date_of_birth: string | null
          subscriber_name: string | null
          subscriber_ssn_ciphertext: string | null
          subscriber_ssn_last4: string | null
          updated_at: string | null
          verification_date: string | null
          verification_notes: string | null
        }
        Insert: {
          annual_mental_health_limit?: number | null
          carrier: string
          created_at?: string
          effective_date: string
          expiration_date?: string | null
          group_number?: string | null
          has_mental_health_coverage?: boolean
          id?: string
          insurance_type?:
            | Database["orbipax_core"]["Enums"]["insurance_type"]
            | null
          is_primary?: boolean
          is_verified?: boolean
          member_id: string
          mental_health_copay?: number | null
          mental_health_deductible?: number | null
          organization_id: string
          patient_id: string
          plan_kind?:
            | Database["orbipax_core"]["Enums"]["insurance_plan_kind"]
            | null
          plan_name?: string | null
          plan_type?: string | null
          relationship_to_subscriber?: string | null
          requires_preauth?: boolean
          subscriber_date_of_birth?: string | null
          subscriber_name?: string | null
          subscriber_ssn_ciphertext?: string | null
          subscriber_ssn_last4?: string | null
          updated_at?: string | null
          verification_date?: string | null
          verification_notes?: string | null
        }
        Update: {
          annual_mental_health_limit?: number | null
          carrier?: string
          created_at?: string
          effective_date?: string
          expiration_date?: string | null
          group_number?: string | null
          has_mental_health_coverage?: boolean
          id?: string
          insurance_type?:
            | Database["orbipax_core"]["Enums"]["insurance_type"]
            | null
          is_primary?: boolean
          is_verified?: boolean
          member_id?: string
          mental_health_copay?: number | null
          mental_health_deductible?: number | null
          organization_id?: string
          patient_id?: string
          plan_kind?:
            | Database["orbipax_core"]["Enums"]["insurance_plan_kind"]
            | null
          plan_name?: string | null
          plan_type?: string | null
          relationship_to_subscriber?: string | null
          requires_preauth?: boolean
          subscriber_date_of_birth?: string | null
          subscriber_name?: string | null
          subscriber_ssn_ciphertext?: string | null
          subscriber_ssn_last4?: string | null
          updated_at?: string | null
          verification_date?: string | null
          verification_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      intake_session_map: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          patient_id: string
          session_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          patient_id: string
          session_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          patient_id?: string
          session_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_intake_session_map_org"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_intake_session_map_org"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_intake_session_map_patient"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_intake_session_map_patient"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      intake_submissions: {
        Row: {
          consent_signature_id: string | null
          id: string
          insurance_card_back: string | null
          insurance_card_front: string | null
          organization_id: string
          patient_id: string
          snapshot: Json
          submitted_at: string
          submitted_by: string
          version: string
        }
        Insert: {
          consent_signature_id?: string | null
          id?: string
          insurance_card_back?: string | null
          insurance_card_front?: string | null
          organization_id: string
          patient_id: string
          snapshot: Json
          submitted_at?: string
          submitted_by: string
          version?: string
        }
        Update: {
          consent_signature_id?: string | null
          id?: string
          insurance_card_back?: string | null
          insurance_card_front?: string | null
          organization_id?: string
          patient_id?: string
          snapshot?: Json
          submitted_at?: string
          submitted_by?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "intake_submissions_consent_signature_id_fkey"
            columns: ["consent_signature_id"]
            isOneToOne: false
            referencedRelation: "consent_signatures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intake_submissions_insurance_card_back_fkey"
            columns: ["insurance_card_back"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intake_submissions_insurance_card_front_fkey"
            columns: ["insurance_card_front"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intake_submissions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intake_submissions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intake_submissions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intake_submissions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      notes: {
        Row: {
          amended_from: string | null
          author_user_id: string
          body: string | null
          created_at: string
          encounter_id: string | null
          id: string
          organization_id: string
          patient_id: string
          signed_at: string | null
          status: Database["orbipax_core"]["Enums"]["note_status"]
          title: string | null
          updated_at: string | null
        }
        Insert: {
          amended_from?: string | null
          author_user_id: string
          body?: string | null
          created_at?: string
          encounter_id?: string | null
          id?: string
          organization_id: string
          patient_id: string
          signed_at?: string | null
          status?: Database["orbipax_core"]["Enums"]["note_status"]
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          amended_from?: string | null
          author_user_id?: string
          body?: string | null
          created_at?: string
          encounter_id?: string | null
          id?: string
          organization_id?: string
          patient_id?: string
          signed_at?: string | null
          status?: Database["orbipax_core"]["Enums"]["note_status"]
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_amended_from_fkey"
            columns: ["amended_from"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_encounter_id_fkey"
            columns: ["encounter_id"]
            isOneToOne: false
            referencedRelation: "encounters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      organization_memberships: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: Database["orbipax_core"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role?: Database["orbipax_core"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: Database["orbipax_core"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          name: string
          slug: string
          timezone: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          slug: string
          timezone?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          slug?: string
          timezone?: string
        }
        Relationships: []
      }
      patient_addresses: {
        Row: {
          address: string | null
          address_line_1: string
          address_line_2: string | null
          address_type: string
          city: string
          country: string | null
          county: string | null
          created_at: string
          id: string
          is_primary: boolean
          organization_id: string
          patient_id: string
          postal_code: string | null
          state: string
          updated_at: string | null
          zip_code: string
        }
        Insert: {
          address?: string | null
          address_line_1: string
          address_line_2?: string | null
          address_type: string
          city: string
          country?: string | null
          county?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          organization_id: string
          patient_id: string
          postal_code?: string | null
          state: string
          updated_at?: string | null
          zip_code: string
        }
        Update: {
          address?: string | null
          address_line_1?: string
          address_line_2?: string | null
          address_type?: string
          city?: string
          country?: string | null
          county?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          organization_id?: string
          patient_id?: string
          postal_code?: string | null
          state?: string
          updated_at?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_addresses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_addresses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_addresses_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_addresses_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      patient_allergies: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          organization_id: string
          patient_id: string
          reaction: string | null
          severity: Database["orbipax_core"]["Enums"]["allergy_severity"] | null
          substance: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          organization_id: string
          patient_id: string
          reaction?: string | null
          severity?:
            | Database["orbipax_core"]["Enums"]["allergy_severity"]
            | null
          substance: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          organization_id?: string
          patient_id?: string
          reaction?: string | null
          severity?:
            | Database["orbipax_core"]["Enums"]["allergy_severity"]
            | null
          substance?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_allergies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_allergies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_allergies_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_allergies_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      patient_clinical_info: {
        Row: {
          chronic_conditions_note: string | null
          created_at: string
          disability_accommodations: string | null
          id: string
          last_physical_exam_date: string | null
          organization_id: string
          patient_id: string
          preferred_pronouns: string | null
          primary_language: string | null
          risk_suicide_flag: boolean | null
          risk_violence_flag: boolean | null
          updated_at: string | null
        }
        Insert: {
          chronic_conditions_note?: string | null
          created_at?: string
          disability_accommodations?: string | null
          id?: string
          last_physical_exam_date?: string | null
          organization_id: string
          patient_id: string
          preferred_pronouns?: string | null
          primary_language?: string | null
          risk_suicide_flag?: boolean | null
          risk_violence_flag?: boolean | null
          updated_at?: string | null
        }
        Update: {
          chronic_conditions_note?: string | null
          created_at?: string
          disability_accommodations?: string | null
          id?: string
          last_physical_exam_date?: string | null
          organization_id?: string
          patient_id?: string
          preferred_pronouns?: string | null
          primary_language?: string | null
          risk_suicide_flag?: boolean | null
          risk_violence_flag?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_clinical_info_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_clinical_info_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_clinical_info_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_clinical_info_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      patient_conditions: {
        Row: {
          code: string | null
          code_system: string | null
          created_at: string
          description: string
          id: string
          onset_date: string | null
          organization_id: string
          patient_id: string
          resolved_date: string | null
          status: Database["orbipax_core"]["Enums"]["condition_status"]
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          code_system?: string | null
          created_at?: string
          description: string
          id?: string
          onset_date?: string | null
          organization_id: string
          patient_id: string
          resolved_date?: string | null
          status?: Database["orbipax_core"]["Enums"]["condition_status"]
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          code_system?: string | null
          created_at?: string
          description?: string
          id?: string
          onset_date?: string | null
          organization_id?: string
          patient_id?: string
          resolved_date?: string | null
          status?: Database["orbipax_core"]["Enums"]["condition_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_conditions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_conditions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_conditions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_conditions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      patient_contacts: {
        Row: {
          alternate_phone: string | null
          contact_preference: string | null
          created_at: string
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          id: string
          is_emergency: boolean
          name: string | null
          organization_id: string
          patient_id: string
          phone: string | null
          primary_phone: string | null
          relationship: string | null
          updated_at: string | null
        }
        Insert: {
          alternate_phone?: string | null
          contact_preference?: string | null
          created_at?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          id?: string
          is_emergency?: boolean
          name?: string | null
          organization_id: string
          patient_id: string
          phone?: string | null
          primary_phone?: string | null
          relationship?: string | null
          updated_at?: string | null
        }
        Update: {
          alternate_phone?: string | null
          contact_preference?: string | null
          created_at?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          id?: string
          is_emergency?: boolean
          name?: string | null
          organization_id?: string
          patient_id?: string
          phone?: string | null
          primary_phone?: string | null
          relationship?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_contacts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_contacts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      patient_eligibility_criteria: {
        Row: {
          age_group: string | null
          created_at: string | null
          currently_in_treatment: string | null
          diagnosis_verified: boolean | null
          domestic_violence: string | null
          functional_impairment_level: string | null
          has_child_welfare: boolean | null
          has_diagnosed_mental_health: string | null
          has_legal_involvement: boolean | null
          homelessness: string | null
          id: string
          impacts_daily: string | null
          impacts_relationships: string | null
          impacts_work: string | null
          is_eligible_by_age: boolean | null
          is_pregnant_postpartum: boolean | null
          is_veteran: boolean | null
          last_treatment_date: string | null
          organization_id: string
          patient_id: string
          previous_mental_health_treatment: string | null
          reason_for_leaving: string | null
          resides_in_service_area: string | null
          service_area_county: string | null
          substance_use: string | null
          suicidal_ideation: string | null
          updated_at: string | null
        }
        Insert: {
          age_group?: string | null
          created_at?: string | null
          currently_in_treatment?: string | null
          diagnosis_verified?: boolean | null
          domestic_violence?: string | null
          functional_impairment_level?: string | null
          has_child_welfare?: boolean | null
          has_diagnosed_mental_health?: string | null
          has_legal_involvement?: boolean | null
          homelessness?: string | null
          id?: string
          impacts_daily?: string | null
          impacts_relationships?: string | null
          impacts_work?: string | null
          is_eligible_by_age?: boolean | null
          is_pregnant_postpartum?: boolean | null
          is_veteran?: boolean | null
          last_treatment_date?: string | null
          organization_id: string
          patient_id: string
          previous_mental_health_treatment?: string | null
          reason_for_leaving?: string | null
          resides_in_service_area?: string | null
          service_area_county?: string | null
          substance_use?: string | null
          suicidal_ideation?: string | null
          updated_at?: string | null
        }
        Update: {
          age_group?: string | null
          created_at?: string | null
          currently_in_treatment?: string | null
          diagnosis_verified?: boolean | null
          domestic_violence?: string | null
          functional_impairment_level?: string | null
          has_child_welfare?: boolean | null
          has_diagnosed_mental_health?: string | null
          has_legal_involvement?: boolean | null
          homelessness?: string | null
          id?: string
          impacts_daily?: string | null
          impacts_relationships?: string | null
          impacts_work?: string | null
          is_eligible_by_age?: boolean | null
          is_pregnant_postpartum?: boolean | null
          is_veteran?: boolean | null
          last_treatment_date?: string | null
          organization_id?: string
          patient_id?: string
          previous_mental_health_treatment?: string | null
          reason_for_leaving?: string | null
          resides_in_service_area?: string | null
          service_area_county?: string | null
          substance_use?: string | null
          suicidal_ideation?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_eligibility_criteria_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_eligibility_criteria_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_eligibility_criteria_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: true
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_eligibility_criteria_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: true
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      patient_eligibility_determination: {
        Row: {
          appeal_date: string | null
          appeal_outcome: string | null
          appeal_status: string | null
          created_at: string | null
          determination_date: string
          determined_by: string | null
          documents_json: Json | null
          expiration_date: string | null
          id: string
          is_current: boolean
          method: string | null
          notes: string | null
          organization_id: string
          patient_id: string
          programs_json: Json | null
          status: string
          updated_at: string | null
        }
        Insert: {
          appeal_date?: string | null
          appeal_outcome?: string | null
          appeal_status?: string | null
          created_at?: string | null
          determination_date?: string
          determined_by?: string | null
          documents_json?: Json | null
          expiration_date?: string | null
          id?: string
          is_current?: boolean
          method?: string | null
          notes?: string | null
          organization_id: string
          patient_id: string
          programs_json?: Json | null
          status: string
          updated_at?: string | null
        }
        Update: {
          appeal_date?: string | null
          appeal_outcome?: string | null
          appeal_status?: string | null
          created_at?: string | null
          determination_date?: string
          determined_by?: string | null
          documents_json?: Json | null
          expiration_date?: string | null
          id?: string
          is_current?: boolean
          method?: string | null
          notes?: string | null
          organization_id?: string
          patient_id?: string
          programs_json?: Json | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_eligibility_determination_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_eligibility_determination_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_eligibility_determination_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_eligibility_determination_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      patient_financial_information: {
        Row: {
          annual_gross_income: number | null
          assets_json: Json | null
          benefits_json: Json | null
          created_at: string | null
          dependents_count: number | null
          employment_status: string | null
          federal_poverty_level_pct: number | null
          household_size: number | null
          id: string
          income_sources: string | null
          monthly_gross_income: number | null
          monthly_net_income: number | null
          notes: string | null
          organization_id: string
          patient_id: string
          sliding_scale_eligible: boolean | null
          updated_at: string | null
        }
        Insert: {
          annual_gross_income?: number | null
          assets_json?: Json | null
          benefits_json?: Json | null
          created_at?: string | null
          dependents_count?: number | null
          employment_status?: string | null
          federal_poverty_level_pct?: number | null
          household_size?: number | null
          id?: string
          income_sources?: string | null
          monthly_gross_income?: number | null
          monthly_net_income?: number | null
          notes?: string | null
          organization_id: string
          patient_id: string
          sliding_scale_eligible?: boolean | null
          updated_at?: string | null
        }
        Update: {
          annual_gross_income?: number | null
          assets_json?: Json | null
          benefits_json?: Json | null
          created_at?: string | null
          dependents_count?: number | null
          employment_status?: string | null
          federal_poverty_level_pct?: number | null
          household_size?: number | null
          id?: string
          income_sources?: string | null
          monthly_gross_income?: number | null
          monthly_net_income?: number | null
          notes?: string | null
          organization_id?: string
          patient_id?: string
          sliding_scale_eligible?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_financial_information_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_financial_information_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_financial_information_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: true
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_financial_information_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: true
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      patient_guardians: {
        Row: {
          created_at: string
          email: string | null
          guardian_type: string
          id: string
          name: string
          organization_id: string
          patient_id: string
          phone: string | null
          relationship: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          guardian_type: string
          id?: string
          name: string
          organization_id: string
          patient_id: string
          phone?: string | null
          relationship?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          guardian_type?: string
          id?: string
          name?: string
          organization_id?: string
          patient_id?: string
          phone?: string | null
          relationship?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_guardians_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_guardians_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_guardians_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_guardians_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      patient_insurance: {
        Row: {
          created_at: string
          effective_date: string | null
          eligibility_date: string | null
          end_date: string | null
          group_number: string | null
          id: string
          insurance_type: string | null
          is_primary: boolean
          medicaid_effective_date: string | null
          medicaid_id: string | null
          medicare_id: string | null
          member_id: string | null
          metadata: Json | null
          organization_id: string
          patient_id: string
          payer_name: string | null
          program_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          effective_date?: string | null
          eligibility_date?: string | null
          end_date?: string | null
          group_number?: string | null
          id?: string
          insurance_type?: string | null
          is_primary?: boolean
          medicaid_effective_date?: string | null
          medicaid_id?: string | null
          medicare_id?: string | null
          member_id?: string | null
          metadata?: Json | null
          organization_id: string
          patient_id: string
          payer_name?: string | null
          program_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          effective_date?: string | null
          eligibility_date?: string | null
          end_date?: string | null
          group_number?: string | null
          id?: string
          insurance_type?: string | null
          is_primary?: boolean
          medicaid_effective_date?: string | null
          medicaid_id?: string | null
          medicare_id?: string | null
          member_id?: string | null
          metadata?: Json | null
          organization_id?: string
          patient_id?: string
          payer_name?: string | null
          program_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_insurance_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_insurance_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_insurance_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_insurance_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      patient_medications: {
        Row: {
          adherence_note: string | null
          created_at: string
          dose: string | null
          end_date: string | null
          frequency: string | null
          id: string
          medication_name: string
          organization_id: string
          patient_id: string
          prescribing_provider: string | null
          route: string | null
          side_effects: string | null
          start_date: string | null
          status: Database["orbipax_core"]["Enums"]["med_status"]
          updated_at: string | null
        }
        Insert: {
          adherence_note?: string | null
          created_at?: string
          dose?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          medication_name: string
          organization_id: string
          patient_id: string
          prescribing_provider?: string | null
          route?: string | null
          side_effects?: string | null
          start_date?: string | null
          status?: Database["orbipax_core"]["Enums"]["med_status"]
          updated_at?: string | null
        }
        Update: {
          adherence_note?: string | null
          created_at?: string
          dose?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          medication_name?: string
          organization_id?: string
          patient_id?: string
          prescribing_provider?: string | null
          route?: string | null
          side_effects?: string | null
          start_date?: string | null
          status?: Database["orbipax_core"]["Enums"]["med_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_medications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_medications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_medications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_medications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      patient_providers: {
        Row: {
          address: string | null
          authorized_to_share: boolean | null
          created_at: string
          email: string | null
          evaluation_date: string | null
          fax: string | null
          id: string
          name: string
          notes: string | null
          organization_id: string
          patient_id: string
          phone: string | null
          practice: string | null
          provider_type: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          authorized_to_share?: boolean | null
          created_at?: string
          email?: string | null
          evaluation_date?: string | null
          fax?: string | null
          id?: string
          name: string
          notes?: string | null
          organization_id: string
          patient_id: string
          phone?: string | null
          practice?: string | null
          provider_type: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          authorized_to_share?: boolean | null
          created_at?: string
          email?: string | null
          evaluation_date?: string | null
          fax?: string | null
          id?: string
          name?: string
          notes?: string | null
          organization_id?: string
          patient_id?: string
          phone?: string | null
          practice?: string | null
          provider_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_providers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_providers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_providers_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_providers_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      patient_referrals: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          organization_id: string
          patient_id: string
          reason: string | null
          received_at: string
          referred_by_name: string | null
          source: Database["orbipax_core"]["Enums"]["referral_source"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          organization_id: string
          patient_id: string
          reason?: string | null
          received_at?: string
          referred_by_name?: string | null
          source: Database["orbipax_core"]["Enums"]["referral_source"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          organization_id?: string
          patient_id?: string
          reason?: string | null
          received_at?: string
          referred_by_name?: string | null
          source?: Database["orbipax_core"]["Enums"]["referral_source"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_referrals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_referrals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_referrals_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_referrals_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      patients: {
        Row: {
          created_at: string
          created_by: string
          dob: string | null
          email: string | null
          ethnicity: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          marital_status: string | null
          middle_name: string | null
          organization_id: string
          phone: string | null
          preferred_name: string | null
          race: string | null
          session_id: string | null
          updated_at: string | null
          veteran_status: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          dob?: string | null
          email?: string | null
          ethnicity?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          marital_status?: string | null
          middle_name?: string | null
          organization_id: string
          phone?: string | null
          preferred_name?: string | null
          race?: string | null
          session_id?: string | null
          updated_at?: string | null
          veteran_status?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          dob?: string | null
          email?: string | null
          ethnicity?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          marital_status?: string | null
          middle_name?: string | null
          organization_id?: string
          phone?: string | null
          preferred_name?: string | null
          race?: string | null
          session_id?: string | null
          updated_at?: string | null
          veteran_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      session_activity: {
        Row: {
          event: string
          id: string
          ip_hash: string | null
          occurred_at: string
          organization_id: string
          user_agent_hash: string | null
          user_id: string
        }
        Insert: {
          event: string
          id?: string
          ip_hash?: string | null
          occurred_at?: string
          organization_id: string
          user_agent_hash?: string | null
          user_id: string
        }
        Update: {
          event?: string
          id?: string
          ip_hash?: string | null
          occurred_at?: string
          organization_id?: string
          user_agent_hash?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_activity_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_activity_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_goals: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          organization_id: string
          patient_id: string
          start_date: string
          status: Database["orbipax_core"]["Enums"]["goal_status"]
          target_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          organization_id: string
          patient_id: string
          start_date?: string
          status?: Database["orbipax_core"]["Enums"]["goal_status"]
          target_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          organization_id?: string
          patient_id?: string
          start_date?: string
          status?: Database["orbipax_core"]["Enums"]["goal_status"]
          target_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_goals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_goals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_goals_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_goals_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      treatment_objectives: {
        Row: {
          baseline_value: string | null
          created_at: string
          description: string
          due_date: string | null
          goal_id: string
          id: string
          metric: string | null
          organization_id: string
          status: Database["orbipax_core"]["Enums"]["goal_status"]
          target_value: string | null
          updated_at: string | null
        }
        Insert: {
          baseline_value?: string | null
          created_at?: string
          description: string
          due_date?: string | null
          goal_id: string
          id?: string
          metric?: string | null
          organization_id: string
          status?: Database["orbipax_core"]["Enums"]["goal_status"]
          target_value?: string | null
          updated_at?: string | null
        }
        Update: {
          baseline_value?: string | null
          created_at?: string
          description?: string
          due_date?: string | null
          goal_id?: string
          id?: string
          metric?: string | null
          organization_id?: string
          status?: Database["orbipax_core"]["Enums"]["goal_status"]
          target_value?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_objectives_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "treatment_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_objectives_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_objectives_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          full_name: string | null
          organization_id: string
          role: Database["orbipax_core"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          organization_id: string
          role?: Database["orbipax_core"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          organization_id?: string
          role?: Database["orbipax_core"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_intake_latest_snapshots: {
        Row: {
          organization_id: string | null
          patient_id: string | null
          snapshot: Json | null
          submitted_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "intake_submissions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intake_submissions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intake_submissions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intake_submissions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      v_my_organizations: {
        Row: {
          created_at: string | null
          id: string | null
          name: string | null
          role: Database["orbipax_core"]["Enums"]["user_role"] | null
          slug: string | null
        }
        Relationships: []
      }
      v_patient_insurance_eligibility_snapshot: {
        Row: {
          determination: Json | null
          eligibility_criteria: Json | null
          financials: Json | null
          insurance: Json | null
          organization_id: string | null
          patient_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      v_patient_providers_by_session: {
        Row: {
          address: string | null
          authorized_to_share: boolean | null
          created_at: string | null
          email: string | null
          evaluation_date: string | null
          fax: string | null
          name: string | null
          notes: string | null
          organization_id: string | null
          patient_id: string | null
          patient_provider_id: string | null
          phone: string | null
          practice: string | null
          provider_type: string | null
          session_id: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_providers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_providers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_my_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_providers_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_providers_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "v_patient_insurance_eligibility_snapshot"
            referencedColumns: ["patient_id"]
          },
        ]
      }
    }
    Functions: {
      get_intake_latest_snapshot: {
        Args: { p_patient_id: string }
        Returns: Json
      }
      has_role: {
        Args: { min_role: string }
        Returns: boolean
      }
      is_member: {
        Args: { p_org: string }
        Returns: boolean
      }
      jwt_organization_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      slugify: {
        Args: { txt: string }
        Returns: string
      }
      upsert_insurance_with_primary_swap: {
        Args: { p_patient_id: string; p_record: Json }
        Returns: string
      }
      user_org: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      allergy_severity: "mild" | "moderate" | "severe" | "unknown"
      appointment_status:
        | "scheduled"
        | "checked_in"
        | "completed"
        | "no_show"
        | "cancelled"
      audit_action:
        | "login"
        | "logout"
        | "create"
        | "read"
        | "update"
        | "delete"
        | "access_denied"
        | "export"
        | "import"
      clinician_status: "active" | "inactive" | "suspended"
      condition_status: "active" | "resolved" | "remission" | "unknown"
      consent_status: "draft" | "active" | "revoked" | "expired"
      document_kind:
        | "general"
        | "consent"
        | "id"
        | "insurance"
        | "lab"
        | "other"
      goal_status: "active" | "on_hold" | "completed" | "discontinued"
      insurance_plan_kind: "hmo" | "ppo" | "epo" | "pos" | "hdhp" | "other"
      insurance_type:
        | "commercial"
        | "medicaid"
        | "medicare"
        | "self_pay"
        | "other"
      med_status: "active" | "discontinued" | "prn"
      note_status: "draft" | "signed" | "amended"
      referral_source:
        | "self"
        | "family"
        | "provider"
        | "hospital"
        | "school"
        | "court"
        | "employer"
        | "other"
      subject_type:
        | "patient"
        | "clinician"
        | "encounter"
        | "note"
        | "appointment"
        | "document"
        | "organization"
        | "other"
      user_role: "clinician" | "supervisor" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gbt_bit_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bool_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bool_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bpchar_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_bytea_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_cash_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_cash_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_date_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_date_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_enum_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_enum_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float4_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float4_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_float8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_inet_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int2_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int2_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int4_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int4_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_int8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_intv_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad8_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_macad8_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_numeric_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_oid_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_oid_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_text_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_time_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_time_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_timetz_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_ts_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_ts_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_tstz_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_uuid_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_uuid_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_var_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbt_var_fetch: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey_var_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey_var_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey16_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey16_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey2_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey2_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey32_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey32_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey4_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey4_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey8_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gbtreekey8_out: {
        Args: { "": unknown }
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
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
  orbipax_core: {
    Enums: {
      allergy_severity: ["mild", "moderate", "severe", "unknown"],
      appointment_status: [
        "scheduled",
        "checked_in",
        "completed",
        "no_show",
        "cancelled",
      ],
      audit_action: [
        "login",
        "logout",
        "create",
        "read",
        "update",
        "delete",
        "access_denied",
        "export",
        "import",
      ],
      clinician_status: ["active", "inactive", "suspended"],
      condition_status: ["active", "resolved", "remission", "unknown"],
      consent_status: ["draft", "active", "revoked", "expired"],
      document_kind: ["general", "consent", "id", "insurance", "lab", "other"],
      goal_status: ["active", "on_hold", "completed", "discontinued"],
      insurance_plan_kind: ["hmo", "ppo", "epo", "pos", "hdhp", "other"],
      insurance_type: [
        "commercial",
        "medicaid",
        "medicare",
        "self_pay",
        "other",
      ],
      med_status: ["active", "discontinued", "prn"],
      note_status: ["draft", "signed", "amended"],
      referral_source: [
        "self",
        "family",
        "provider",
        "hospital",
        "school",
        "court",
        "employer",
        "other",
      ],
      subject_type: [
        "patient",
        "clinician",
        "encounter",
        "note",
        "appointment",
        "document",
        "organization",
        "other",
      ],
      user_role: ["clinician", "supervisor", "admin"],
    },
  },
  public: {
    Enums: {},
  },
} as const
