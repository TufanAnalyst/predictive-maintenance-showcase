/** Model performance: accuracy ring, confusion matrix and metric explanations. */

const ACCURACY = 98;

const MATRIX = [
  { label: "True Negative", value: 1905, tone: "success" as const },
  { label: "False Positive", value: 27, tone: "warning" as const },
  { label: "False Negative", value: 13, tone: "destructive" as const },
  { label: "True Positive", value: 55, tone: "success" as const },
];

const EXPLANATIONS = [
  { title: "True Negative (1905)", text: "Normal machines correctly classified as healthy." },
  {
    title: "False Positive (27)",
    text: "Model predicted failure although the machine was healthy.",
  },
  {
    title: "False Negative (13)",
    text: "Machine actually failed but the model predicted normal.",
  },
  { title: "True Positive (55)", text: "Machine failures correctly detected in advance." },
];

function AccuracyRing() {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - ACCURACY / 100);

  return (
    <div className="relative grid size-40 place-items-center">
      <svg viewBox="0 0 160 160" className="size-40 -rotate-90">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          strokeWidth="12"
          className="stroke-secondary"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          strokeWidth="12"
          strokeLinecap="round"
          className="stroke-primary"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-mono text-3xl font-semibold">{ACCURACY}%</p>
        <p className="label-caps mt-1">Accuracy</p>
      </div>
    </div>
  );
}

export function ModelPerformance() {
  return (
    <section id="performance" className="panel-surface p-6 sm:p-8">
      <h2 className="text-2xl font-semibold uppercase tracking-wide">Model Performance</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Evaluated on the held-out AI4I2020 test split (2,000 machine records).
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[auto_1fr]">
        <div className="flex justify-center lg:justify-start">
          <AccuracyRing />
        </div>

        <div>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/70">
                  <th className="label-caps p-3 text-left"></th>
                  <th className="label-caps p-3 text-left">Predicted Normal</th>
                  <th className="label-caps p-3 text-left">Predicted Failure</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                <tr className="border-t border-border">
                  <th className="label-caps p-3 text-left">Actual Normal</th>
                  <td className="p-3 text-success">{MATRIX[0].value}</td>
                  <td className="p-3 text-warning">{MATRIX[1].value}</td>
                </tr>
                <tr className="border-t border-border">
                  <th className="label-caps p-3 text-left">Actual Failure</th>
                  <td className="p-3 text-destructive">{MATRIX[2].value}</td>
                  <td className="p-3 text-success">{MATRIX[3].value}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            {EXPLANATIONS.map((item) => (
              <div key={item.title} className="rounded-lg border border-border bg-card/50 p-4">
                <dt className="font-display text-sm font-semibold uppercase tracking-wider">
                  {item.title}
                </dt>
                <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
