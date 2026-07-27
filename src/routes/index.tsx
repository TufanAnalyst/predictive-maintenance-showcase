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
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-md bg-primary">
              <Cpu className="size-5 text-primary-foreground" aria-hidden />
            </span>
            <span className="font-display text-sm font-semibold uppercase tracking-[0.18em]">
              AM<span className="text-muted-foreground">/Industrial AI</span>
            </span>
          </div>

          <p className="hidden font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground md:block">
            Predictive Maintenance Console
          </p>

          <div className="flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-3 py-1.5">
            <span className="size-2 animate-pulse rounded-full bg-success" />
            <span className="font-display text-xs font-semibold uppercase tracking-widest text-success">
              Model Online
            </span>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-8">
        <section className="animate-rise">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5">
            <Activity className="size-3.5 text-accent" aria-hidden />
            <span className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              AI Powered · XGBoost Inference Engine
            </span>
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold uppercase leading-[1.05] tracking-tight sm:text-6xl">
            AI4I2020 Predictive Maintenance System
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            AI-powered machine failure prediction using industrial sensor data.
          </p>
          <p className="mt-3 font-display text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Built and integrated by Ahmad Munir
          </p>
        </section>

        <div className="mt-10 grid animate-rise gap-6 lg:grid-cols-2">
          <MachineInputForm onSubmit={handleSubmit} loading={loading} />
          <PredictionResultPanel result={result} loading={loading} error={error} />
        </div>

        <div className="mt-6 space-y-6">
          <ModelPerformance />
          <AboutModel />
          <ContactSection />
        </div>
      </main>

      <footer className="border-t border-border bg-background/80 py-6 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-muted-foreground sm:flex-row sm:px-8">
          <p>AI4I2020 Predictive Maintenance System</p>
          <p>Built and integrated by Ahmad Munir</p>
        </div>
      </footer>
    </div>
  );
}
