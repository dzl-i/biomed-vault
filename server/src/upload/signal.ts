import { CategoryType, SignalType } from "@prisma/client";
import { createSignal } from "../helper/uploadHelper";

export async function uploadSignal(patientId: string, name: string, description: string, signalType: SignalType, dataPoints: string, duration: number, sampleRate: number, categories: CategoryType[]) {
  const signal = await createSignal(patientId, name, description, signalType, dataPoints, duration, sampleRate, categories);
  if (signal === null) throw { status: 400, message: "Invalid patient." };

  return {
    id: signal.id,
    name: signal.name,
    description: signal.description,
    signalType: signal.signalType,
    categories: categories
  }
}
