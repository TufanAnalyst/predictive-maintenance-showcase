/** Prediction result panel: status card, probability gauge, risk level and recommended action. */
import { AlertTriangle, CheckCircle2, Gauge, Loader2, ShieldCheck } from "lucide-react";
import type { PredictResult } from "@/lib/predict.functions";

function ProbabilityBar({ value, tone }: { value: number; tone: "success" | "warning" }) {
  return (
    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className={`h-full rounded-full transition-[width] duration-700 ease-out ${
          tone === "success" ? "bg-success" : "bg-warning"
        }`}
        style={{ width: `${Math.max(2, Math.min(100, value * 100))}%` }}
      />
    </div>
  );
}

export function PredictionResultPanel({
  result,
  loading,
  error,
}: {
  result: PredictResult | null;
  loading: boolean;
  error: string | null;
}) {
  const isFailure = result?.prediction === 1;

  return (
    <section className="panel-surface flex min-h-full flex-col p-4 sm:p-5">
      <div className="border-b border-border pb-3">
        <h2 className="text-base font-semibold uppercase tracking-wide">Prediction Result</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Live inference from the trained AI4I2020 pipeline.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
          <Loader2 className="size-7 animate-spin text-primary" aria-hidden />
          <p className="font-display text-xs uppercase tracking-widest text-muted-foreground">
            Analyzing Machine Health...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center py-10">
          <p className="max-w-sm text-center text-xs text-destructive">{error}</p>
        </div>
      ) : !result ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
          <Gauge className="size-8 text-steel" aria-hidden />
          <p className="max-w-xs text-xs text-muted-foreground">
            Awaiting sensor input. Submit a reading to evaluate the machine's failure risk.
          </p>
        </div>
      ) : (
        <div className="animate-fade flex flex-1 flex-col gap-3 pt-4">
          <div
            className={`rounded-lg border p-4 ${
              isFailure ? "border-warning/50 bg-warning/10" : "border-success/50 bg-success/10"
            }`}
          >
            <div className="flex items-start gap-3">
              {isFailure ? (
                <AlertTriangle className="mt-0.5 size-6 shrink-0 text-warning" aria-hidden />
              ) : (
                <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-success" aria-hidden />
              )}
              <div>
                <p className="label-caps">Status</p>
                <h3 className="mt-0.5 text-sm font-semibold uppercase">
                  {isFailure ? "Machine Failure Predicted" : "Machine Operating Normally"}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {isFailure
                    ? "Sensor signature matches historical pre-failure patterns."
                    : "All monitored parameters fall within healthy operating bounds."}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-card/60 p-3">
              <p className="label-caps">Failure Probability</p>
              <p className="mt-0.5 font-mono text-xl font-semibold">
                {(result.failure_probability * 100).toFixed(2)}%
              </p>
              <ProbabilityBar
                value={result.failure_probability}
                tone={isFailure ? "warning" : "success"}
              />
            </div>
            <div className="rounded-md border border-border bg-card/60 p-3">
              <p className="label-caps">Risk Level</p>
              <p className="mt-0.5 font-display text-xl font-semibold uppercase">
                {result.risk_level}
              </p>
              <p className="mt-1 text-[0.7rem] text-muted-foreground">
                Binary classification output:{" "}
                <span className="font-mono text-foreground">{result.prediction}</span>
              </p>
            </div>
          </div>

          <div className="rounded-md border border-border bg-card/60 p-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-primary" aria-hidden />
              <p className="label-caps">Recommended Action</p>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed">
              {isFailure
                ? "Inspect immediately to prevent unexpected downtime. Isolate the asset, verify tool wear and torque load, and schedule corrective maintenance before the next production run."
                : "Continue scheduled maintenance. Keep monitoring tool wear and process temperature trends at the regular inspection interval."}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
