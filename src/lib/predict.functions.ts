import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  type: z.enum(["L", "M", "H"]),
  airTemperature: z.number().finite(),
  processTemperature: z.number().finite(),
  rotationalSpeed: z.number().finite(),
  torque: z.number().finite(),
  toolWear: z.number().finite(),
});

export type PredictPayload = z.infer<typeof inputSchema>;

export interface PredictResult {
  prediction: 0 | 1;
  failure_probability: number;
  risk_level: "Low" | "Moderate" | "Elevated" | "Critical";
}

function riskLevel(p: number): PredictResult["risk_level"] {
  if (p < 0.1) return "Low";
  if (p < 0.35) return "Moderate";
  if (p < 0.7) return "Elevated";
  return "Critical";
}

export const predictMachine = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<PredictResult> => {
    const { predictMachineCondition } = await import("./pdm-model.server");
    const result = predictMachineCondition(data);
    return { ...result, risk_level: riskLevel(result.failure_probability) };
  });
