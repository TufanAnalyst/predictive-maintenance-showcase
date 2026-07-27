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
    <section className="panel-surface flex min-h-full flex-col p-6 sm:p-8">
      <div className="border-b border-border pb-5">
        <h2 className="text-2xl font-semibold uppercase tracking-wide">Prediction Result</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Live inference from the trained AI4I2020 pipeline.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
          <Loader2 className="size-10 animate-spin text-primary" aria-hidden />
          <p className="font-display text-lg uppercase tracking-widest text-muted-foreground">
            Analyzing Machine Health...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center py-16">
          <p className="max-w-sm text-center text-sm text-destructive">{error}</p>
        </div>
      ) : !result ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
          <Gauge className="size-12 text-steel" aria-hidden />
          <p className="max-w-xs text-sm text-muted-foreground">
            Awaiting sensor input. Submit a reading to evaluate the machine's failure risk.
          </p>
        </div>
      ) : (
        <div className="animate-fade flex flex-1 flex-col gap-6 pt-6">
          <div
            className={`rounded-xl border p-6 ${
              isFailure
                ? "border-warning/50 bg-warning/10"
                : "border-success/50 bg-success/10"
            }`}
          >
            <div className="flex items-start gap-4">
              {isFailure ? (
                <AlertTriangle className="mt-0.5 size-10 shrink-0 text-warning" aria-hidden />
              ) : (
                <CheckCircle2 className="mt-0.5 size-10 shrink-0 text-success" aria-hidden />
              )}
              <div>
                <p className="label-caps">Status</p>
                <h3 className="mt-1 text-2xl font-semibold uppercase">
                  {isFailure ? "Machine Failure Predicted" : "Machine Operating Normally"}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {isFailure
                    ? "Sensor signature matches historical pre-failure patterns."
                    : "All monitored parameters fall within healthy operating bounds."}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card/60 p-5">
              <p className="label-caps">Failure Probability</p>
              <p className="mt-1 font-mono text-3xl font-semibold">
                {(result.failure_probability * 100).toFixed(2)}%
              </p>
              <ProbabilityBar
                value={result.failure_probability}
                tone={isFailure ? "warning" : "success"}
              />
            </div>
            <div className="rounded-lg border border-border bg-card/60 p-5">
              <p className="label-caps">Risk Level</p>
              <p className="mt-1 font-display text-3xl font-semibold uppercase">
                {result.risk_level}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Binary classification output:{" "}
                <span className="font-mono text-foreground">{result.prediction}</span>
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card/60 p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" aria-hidden />
              <p className="label-caps">Recommended Action</p>
            </div>
            <p className="mt-2 text-sm leading-relaxed">
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
