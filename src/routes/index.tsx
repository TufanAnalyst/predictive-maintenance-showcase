import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Activity, Cpu } from "lucide-react";

import factoryBg from "@/assets/factory-bg.jpg";
import { MachineInputForm } from "@/components/pdm/MachineInputForm";
import { PredictionResultPanel } from "@/components/pdm/PredictionResultPanel";
import { ModelPerformance } from "@/components/pdm/ModelPerformance";
import { AboutModel } from "@/components/pdm/AboutModel";
import { ContactSection } from "@/components/pdm/ContactSection";
import { predictMachine, type PredictPayload, type PredictResult } from "@/lib/predict.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI4I2020 Predictive Maintenance System | Machine Failure Prediction" },
      {
        name: "description",
        content:
          "Industrial AI dashboard predicting machine failure from live sensor data using a trained XGBoost pipeline on the AI4I2020 dataset.",
      },
      { property: "og:title", content: "AI4I2020 Predictive Maintenance System" },
      {
        property: "og:description",
        content:
          "AI-powered machine failure prediction using industrial sensor data. Built and integrated by Ahmad Munir.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const runPrediction = useServerFn(predictMachine);
  const [result, setResult] = useState<PredictResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(payload: PredictPayload) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await runPrediction({ data: payload });
      setResult(response);
    } catch {
      setError("Prediction service unavailable. Please retry the request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Full-screen industrial background, blurred with a dark overlay for readability */}
      <div className="fixed inset-0 -z-10">
        <img
          src={factoryBg}
          alt="CNC milling machine on a modern manufacturing floor"
          width={1920}
          height={1088}
          className="size-full scale-105 object-cover blur-[3px]"
        />
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
      </div>

      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-sm bg-primary">
              <Cpu className="size-4 text-primary-foreground" aria-hidden />
            </span>
            <span className="font-display text-xs font-semibold uppercase tracking-[0.14em]">
              AM<span className="text-muted-foreground">/Industrial AI</span>
            </span>
          </div>

          <p className="hidden font-display text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground md:block">
            Predictive Maintenance Console
          </p>

          <div className="flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-2.5 py-1">
            <span className="size-1.5 animate-pulse rounded-full bg-success" />
            <span className="font-display text-[0.65rem] font-semibold uppercase tracking-widest text-success">
              Model Online
            </span>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6">
        <section className="animate-rise">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-2.5 py-1">
            <Activity className="size-3 text-accent" aria-hidden />
            <span className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              AI Powered · XGBoost Inference Engine
            </span>
          </div>

          <h1 className="mt-2.5 max-w-3xl text-xl font-semibold uppercase leading-tight tracking-tight sm:text-3xl">
            AI4I2020 Predictive Maintenance System
          </h1>
          <p className="mt-1.5 max-w-2xl text-xs text-muted-foreground sm:text-sm">
            AI-powered machine failure prediction using industrial sensor data.
          </p>
          <p className="mt-1.5 font-display text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent">
            Built and integrated by Ahmad Munir
          </p>
        </section>

        <div className="mt-5 grid animate-rise gap-4 lg:grid-cols-2">
          <MachineInputForm onSubmit={handleSubmit} loading={loading} />
          <PredictionResultPanel result={result} loading={loading} error={error} />
        </div>

        <div className="mt-4 space-y-4">
          <ModelPerformance />
          <AboutModel />
          <ContactSection />
        </div>
      </main>

      <footer className="border-t border-border bg-background/80 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1 px-4 text-[0.7rem] text-muted-foreground sm:flex-row sm:px-6">
          <p>AI4I2020 Predictive Maintenance System</p>
          <p>Built and integrated by Ahmad Munir</p>
        </div>
      </footer>

      <footer className="border-t border-border bg-background/80 py-6 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-muted-foreground sm:flex-row sm:px-8">
          <p>AI4I2020 Predictive Maintenance System</p>
          <p>Built and integrated by Ahmad Munir</p>
        </div>
      </footer>
    </div>
  );
}
