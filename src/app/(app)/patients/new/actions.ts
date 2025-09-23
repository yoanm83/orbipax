"use server";

import { redirect } from "next/navigation";
import { createPatient } from "@/modules/patients/application/patients.actions";

export async function handleCreatePatient(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const dob = formData.get("dob") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;

  try {
    const result = await createPatient({
      firstName: firstName?.trim() || "",
      lastName: lastName?.trim() || "",
      dob: dob?.trim() || undefined,
      phone: phone?.trim() || undefined,
      email: email?.trim() || undefined,
    });

    console.log("Patient created successfully:", result);

  } catch (error) {
    console.error("Failed to create patient:", error);
    throw error;
  }

  // Redirect to patients list after successful creation
  redirect("/(app)/patients");
}