// Inference engine for the exported AI4I2020 XGBoost pipeline.
// The original scikit-learn Pipeline (StandardScaler + OneHotEncoder + XGBClassifier,
// 300 trees, max_depth 8) was exported to a compact JSON tree structure so it can run
// inside the edge server runtime with identical numeric output to the .joblib model.
import model from "./pdm-model.json";

type Tree = {
  f: number[]; // split feature index (-1 = leaf)
  t: number[]; // split threshold
  y: number[]; // yes child
  n: number[]; // no child
  m: number[]; // missing child
  v: number[]; // leaf value
};

const NUMERIC_ORDER = [
  "airTemperature",
  "processTemperature",
  "rotationalSpeed",
  "torque",
  "toolWear",
] as const;

export type MachineType = "L" | "M" | "H";

export interface PredictionInput {
  type: MachineType;
  airTemperature: number;
  processTemperature: number;
  rotationalSpeed: number;
  torque: number;
  toolWear: number;
}

export interface PredictionOutput {
  prediction: 0 | 1;
  failure_probability: number;
}

/** Reproduces ColumnTransformer(StandardScaler + OneHotEncoder(handle_unknown="ignore")). */
function buildFeatureVector(input: PredictionInput): number[] {
  const features: number[] = [];

  NUMERIC_ORDER.forEach((key, i) => {
    // XGBoost evaluates split conditions in float32; match that precision exactly.
    features.push(Math.fround((input[key] - model.mean[i]) / model.scale[i]));
  });

  // One-hot block, categories are alphabetical: ["H", "L", "M"]
  for (const category of model.cats) {
    features.push(category === input.type ? 1 : 0);
  }

  return features;
}

function scoreTree(tree: Tree, x: number[]): number {
  let node = 0;
  while (tree.f[node] !== -1) {
    const value = x[tree.f[node]];
    if (Number.isNaN(value)) {
      node = tree.m[node];
    } else {
      node = value < tree.t[node] ? tree.y[node] : tree.n[node];
    }
  }
  return tree.v[node];
}

export function predictMachineCondition(input: PredictionInput): PredictionOutput {
  const x = buildFeatureVector(input);

  // base_score = 0.5 -> logit(0.5) = 0
  let margin = 0;
  for (const tree of model.trees as Tree[]) {
    margin = Math.fround(margin + scoreTree(tree, x));
  }

  const probability = 1 / (1 + Math.exp(-margin));

  return {
    prediction: probability >= 0.5 ? 1 : 0,
    failure_probability: probability,
  };
}
