"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Slider from "@/components/shared/input/Slider";
import type { GalleryState } from "../types";

type Props = { state: GalleryState; update: <K extends keyof GalleryState>(key: K, value: GalleryState[K]) => void };

export default function ItemsSection({ state, update }: Props) {
  return <SectionCard title="Items" subtitle="Items controls for native gallery generation."><Slider label="Images" value={state.imageCount} min={1} max={12} step={1} onChange={(value) => update("imageCount", value)} /></SectionCard>;
}
