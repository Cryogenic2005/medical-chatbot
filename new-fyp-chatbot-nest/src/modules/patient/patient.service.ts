import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PatientService {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Create a new patient profile
   * @param patientData - The patient data to be created. Expected to contain the following fields:
   * - full_name: string
   * - gender: string
   * - age: number
   * - phone_number: string
   * @returns The result of the operation
   */
  async createPatient(patientData: any) {
    try {
      // Insert into patients table
      const { error: patientsError } = await this.supabaseService
        .getClient()
        .from('patients')
        .insert([patientData]);

      if (patientsError) {
        throw new Error(
          `Error inserting into table: ${patientsError.message}`,
        );
      }

      return { success: true, message: 'Patient created successfully' };
    } catch (error) {
      throw new Error(`Failed to create patient: ${error.message}`);
    }
  }

  async addNewPatient(patientData: any) {
    try {
      // Insert into doctor_inputs table
      const { error: insertError } = await this.supabaseService
        .getClient()
        .from('patients')
        .update([patientData])
        .eq('id', patientData.id);

      if (insertError) {
        throw new Error(
          `Error inserting into patients: ${insertError.message}`,
        );
      }

      // If successful, pass the doctorInputData to addPatientToDisplayTable
      await this.addPatientToDisplayTable(patientData.id);

      return { success: true, message: 'Patient added successfully' };
    } catch (error) {
      throw new Error(`Failed to add new patient: ${error.message}`);
    }
  }

  async addPatientToDisplayTable(
    patientId: any,
  ): Promise<any> {
    try {
      // Fetch the patients table data by patient_id
      const { data: patientData, error: patientError } = await this.supabaseService
        .getClient()
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (patientError) {
        throw new Error(`Error fetching patient data: ${patientError.message}`);
      }

      // Ensure that all required data exists
      if (!patientData) {
        return {
          success: false,
          message: 'Unable to find patient data',
        };
      }

      const newDisplayRecord = {
        patient_id: patientData.id,
        full_name: patientData.full_name,
        phone_number: patientData.phone_number,
        age: patientData.age,
        gender: patientData.gender,
        medical_condition: patientData.medical_condition,
        disability_level: patientData.disability_level,
      };

      // Insert the new display record into the patient_display table
      const { error: insertError } = await this.supabaseService
        .getClient()
        .from('patient_display')
        .insert([newDisplayRecord]);

      if (insertError) {
        throw new Error(
          `Error inserting into patient_display: ${insertError.message}`,
        );
      }

      return {
        success: true,
        message: 'Patient added to display table successfully',
      };
    } catch (error) {
      console.log(error.message);
      throw new Error(
        `Failed to add patient to display table: ${error.message}`,
      );
    }
  }

  // New function to fetch doctor_inputs by patient_id
  async getDoctorInputsByPatientId(patientId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('doctor_inputs')
        .select('*') // Select all columns, or specify the necessary columns
        .eq('patient_id', patientId)
        .single();

      if (error) {
        throw new Error(`Error fetching doctor inputs: ${error.message}`);
      }

      return data; // Return the fetched data directly
    } catch (error) {
      console.error('Error fetching doctor inputs:', error.message);
      throw error; // Rethrow the error to handle it properly
    }
  }
}
