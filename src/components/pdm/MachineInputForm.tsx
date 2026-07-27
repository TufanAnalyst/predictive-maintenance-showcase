/**
 * Machine input form — one dedicated, documented control per sensor feature.
 * Machine Type is shown as Low / Medium / High and converted to L / M / H
 * before it reaches the model.
 */
import { useState } from "react";
import { Loader2, Play } from "lucide-react";
import type { PredictPayload } from "@/lib/predict.functions";

type FieldKey =
  | "airTemperature"
  | "processTemperature"
  | "rotationalSpeed"
  | "torque"
  | "toolWear";

interface FieldSpec {
  key: FieldKey;
  label: string;
  description: string;
  unit: string;
  example: number;
  step: string;
}

const FIELDS: FieldSpec[] = [
  {
    key: "airTemperature",
    label: "Air Temperature",
    description: "Ambient air temperature measured at the machine enclosure.",
    unit: "K",
    example: 298.5,
    step: "0.1",
  },
  {
    key: "processTemperature",
    label: "Process Temperature",
    description: "Temperature of the active machining process.",
    unit: "K",
    example: 308.7,
    step: "0.1",
  },
  {
    key: "rotationalSpeed",
    label: "Rotational Speed",
    description: "Spindle rotational speed under current load.",
    unit: "rpm",
    example: 1550,
    step: "1",
  },
  {
    key: "torque",
    label: "Torque",
    description: "Torque applied by the spindle drive.",
    unit: "Nm",
    example: 42,
    step: "0.1",
  },
  {
    key: "toolWear",
    label: "Tool Wear",
    description: "Cumulative minutes of wear on the mounted tool.",
    unit: "min",
    example: 125,
    step: "1",
  },
];

// The operator picks a readable quality tier; the model receives L / M / H.
const TYPE_OPTIONS = [
  { label: "Low", value: "L" as const, hint: "Low-grade product variant" },
  { label: "Medium", value: "M" as const, hint: "Medium-grade product variant" },
  { label: "High", value: "H" as const, hint: "High-grade product variant" },
];

type FormState = Record<FieldKey, string>;

const EMPTY: FormState = {
  airTemperature: "",
  processTemperature: "",
  rotationalSpeed: "",
  torque: "",
  toolWear: "",
};

export function MachineInputForm({
  onSubmit,
  loading,
}: {
  onSubmit: (payload: PredictPayload) => void;
  loading: boolean;
}) {
  const [type, setType] = useState<"L" | "M" | "H">("L");
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

  function validate(): PredictPayload | null {
    const nextErrors: Partial<Record<FieldKey, string>> = {};
    for (const field of FIELDS) {
      const raw = values[field.key].trim();
      if (raw === "") {
        nextErrors[field.key] = `${field.label} is required before running a prediction.`;
      } else if (Number.isNaN(Number(raw))) {
        nextErrors[field.key] = `Enter a valid numeric value in ${field.unit}.`;
      } else if (Number(raw) < 0) {
        nextErrors[field.key] = "Sensor readings cannot be negative.";
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return null;

    return {
      type,
      airTemperature: Number(values.airTemperature),
      processTemperature: Number(values.processTemperature),
      rotationalSpeed: Number(values.rotationalSpeed),
      torque: Number(values.torque),
      toolWear: Number(values.toolWear),
    };
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const payload = validate();
    if (payload) onSubmit(payload);
  }

  function fillAll() {
    setValues({
      airTemperature: "298.5",
      processTemperature: "308.7",
      rotationalSpeed: "1550",
      torque: "42",
      toolWear: "125",
    });
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} className="panel-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
        <div>
          <h2 className="text-2xl font-semibold uppercase tracking-wide">Machine Input</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter live sensor readings from the production asset.
          </p>
        </div>
        <button
          type="button"
          onClick={fillAll}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
        >
          Load sample reading
        </button>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="machine-type" className="label-caps">
              Machine Type
            </label>
            <span className="font-mono text-[0.7rem] text-muted-foreground">categorical</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Product quality variant of the workpiece being machined.
          </p>
          <select
            id="machine-type"
            value={type}
            onChange={(e) => setType(e.target.value as "L" | "M" | "H")}
            className="field-input focus:field-input-focus mt-2 appearance-none"
          >
            {TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-card">
                {option.label} — {option.hint}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {FIELDS.map((field) => (
            <div key={field.key}>
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={field.key} className="label-caps">
                  {field.label}
                </label>
                <span className="font-mono text-[0.7rem] text-muted-foreground">{field.unit}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{field.description}</p>
              <div className="mt-2 flex gap-2">
                <input
                  id={field.key}
                  type="number"
                  step={field.step}
                  inputMode="decimal"
                  placeholder={`e.g. ${field.example}`}
                  value={values[field.key]}
                  onChange={(e) => {
                    setValues((prev) => ({ ...prev, [field.key]: e.target.value }));
                    setErrors((prev) => ({ ...prev, [field.key]: undefined }));
                  }}
                  aria-invalid={Boolean(errors[field.key])}
                  className="field-input focus:field-input-focus font-mono aria-invalid:border-destructive"
                />
                <button
                  type="button"
                  onClick={() => {
                    setValues((prev) => ({ ...prev, [field.key]: String(field.example) }));
                    setErrors((prev) => ({ ...prev, [field.key]: undefined }));
                  }}
                  className="shrink-0 rounded-md border border-border bg-secondary px-3 text-xs font-semibold uppercase tracking-widest text-secondary-foreground transition-colors hover:border-ring hover:bg-muted"
                >
                  Example
                </button>
              </div>
              {errors[field.key] ? (
                <p className="mt-1.5 text-xs font-medium text-destructive">{errors[field.key]}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-lg bg-primary px-6 py-4 font-display text-lg font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden />
            Analyzing Machine Health...
          </>
        ) : (
          <>
            <Play className="size-5" aria-hidden />
            Predict Machine Condition
          </>
        )}
      </button>
    </form>
  );
}
