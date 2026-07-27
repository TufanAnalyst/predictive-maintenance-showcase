/** Technical specification of the deployed model pipeline. */
import { Boxes, Cpu, Database, Layers, Server, SlidersHorizontal } from "lucide-react";

const SPECS = [
  { icon: Cpu, label: "Algorithm", value: "XGBoost Classifier" },
  { icon: Database, label: "Dataset", value: "AI4I2020 Predictive Maintenance Dataset" },
  { icon: Layers, label: "Pipeline", value: "Scikit-Learn Pipeline" },
  {
    icon: SlidersHorizontal,
    label: "Preprocessing",
    value: "StandardScaler · OneHotEncoder · ColumnTransformer · SMOTE",
  },
  { icon: Boxes, label: "Prediction", value: "Binary Classification (Normal / Failure)" },
  { icon: Server, label: "Serving", value: "final_pipeline.joblib · secure server endpoint" },
];

export function AboutModel() {
  return (
    <section id="about" className="panel-surface p-4 sm:p-5">
      <h2 className="text-base font-semibold uppercase tracking-wide">About the Model</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        The exact trained pipeline is served in production — 300 boosted trees, max depth 8.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SPECS.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-md border border-border bg-card/50 p-3">
            <Icon className="size-4 text-primary" aria-hidden />
            <p className="label-caps mt-2">{label}</p>
            <p className="mt-0.5 text-xs font-medium">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
