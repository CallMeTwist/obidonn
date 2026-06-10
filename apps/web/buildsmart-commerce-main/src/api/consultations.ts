import apiClient from "@/api/apiClient";

export type ServiceType = "architectural" | "interior";

export interface ConsultationPayload {
  name: string;
  email: string;
  phone?: string;
  service_type: ServiceType;
  project_type?: string;
  message: string;
}

export interface ConsultationBooking extends ConsultationPayload {
  id: number;
  status: string;
  created_at?: string;
}

export async function submitConsultation(payload: ConsultationPayload): Promise<ConsultationBooking> {
  const { data } = await apiClient.post<{ message: string; data: ConsultationBooking }>(
    "/consultations",
    payload,
  );
  return data.data;
}
