/** Technical specification of the deployed model pipeline. */
import { Boxes, Cpu, Database, Layers, Server, SlidersHorizontal } from "lucide-react";

const SPECS = [
  { icon: Cpu, label: "Algorithm", value: "XGBoost Classifier" },
  { icon: Database, label: "Dataset", value: "AI4I2020 Predictive Maintenance Dataset" },
  { icon: Layers, label: "Pipeline", value: "Scikit-Learn Pipeline" },
  { icon: SlidersHorizontal, label: "Preprocessing", value: "StandardScaler · OneHotEncoder" },
  { icon: Boxes, label: "Prediction", value: "Binary Classification (Normal / Failure)" },
  { icon: Server, label: "Serving", value: "final_pipeline.joblib · secure server endpoint" },
];

export function AboutModel() {
  return (
    <section id="about" className="panel-surface p-6 sm:p-8">
      <h2 className="text-2xl font-semibold uppercase tracking-wide">About the Model</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        The exact trained pipeline is served in production — 300 boosted trees, max depth 8.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SPECS.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-lg border border-border bg-card/50 p-5">
            <Icon className="size-5 text-primary" aria-hidden />
            <p className="label-caps mt-3">{label}</p>
            <p className="mt-1 text-sm font-medium">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
