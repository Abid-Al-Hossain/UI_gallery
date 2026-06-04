"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Slider from "@/components/shared/input/Slider";
import type { GalleryState } from "../types";

type Props = { state: GalleryState; update: <K extends keyof GalleryState>(key: K, value: GalleryState[K]) => void };

export default function RadiusSection({ state, update }: Props) {
  return <SectionCard title="Radius" subtitle="Radius controls for native gallery generation."><Slider label="Radius" value={state.radius} min={0} max={56} step={1} onChange={(value) => update("radius", value)} /></SectionCard>;
}
