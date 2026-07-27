/**
 * Public HTTP prediction endpoint (equivalent of the FastAPI POST /predict route).
 * Accepts either the frontend field names or the raw AI4I2020 column names.
 */
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  type: z.enum(["L", "M", "H"]),
  airTemperature: z.number().finite(),
  processTemperature: z.number().finite(),
  rotationalSpeed: z.number().finite(),
  torque: z.number().finite(),
  toolWear: z.number().finite(),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const Route = createFileRoute("/api/public/predict")({
  server: {
    handlers: {
      GET: async () =>
        json({
          service: "AI4I2020 Predictive Maintenance API",
          status: "online",
          endpoints: { predict: "POST /api/public/predict" },
        }),
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return json({ error: "Invalid JSON body" }, 400);
        }

        const raw = payload as Record<string, unknown>;
        const normalized = {
          type: raw.type ?? raw.Type,
          airTemperature: raw.airTemperature ?? raw["Air temperature [K]"],
          processTemperature: raw.processTemperature ?? raw["Process temperature [K]"],
          rotationalSpeed: raw.rotationalSpeed ?? raw["Rotational speed [rpm]"],
          torque: raw.torque ?? raw["Torque [Nm]"],
          toolWear: raw.toolWear ?? raw["Tool wear [min]"],
        };

        const parsed = schema.safeParse(normalized);
        if (!parsed.success) {
          return json({ error: "Validation failed", issues: parsed.error.issues }, 422);
        }

        const { predictMachineCondition } = await import("@/lib/pdm-model.server");
        return json(predictMachineCondition(parsed.data));
      },
    },
  },
});
