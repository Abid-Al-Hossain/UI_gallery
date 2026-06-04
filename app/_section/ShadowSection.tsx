"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Slider from "@/components/shared/input/Slider";
import type { GalleryState } from "../types";

type Props = { state: GalleryState; update: <K extends keyof GalleryState>(key: K, value: GalleryState[K]) => void };

export default function ShadowSection({ state, update }: Props) {
  return <SectionCard title="Shadow" subtitle="Shadow controls for native gallery generation."><Slider label="Shadow" value={state.shadow} min={0} max={80} step={1} onChange={(value) => update("shadow", value)} /></SectionCard>;
}
