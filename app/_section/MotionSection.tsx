"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Switch from "@/components/shared/input/Switch";
import type { GalleryState } from "../types";

type Props = { state: GalleryState; update: <K extends keyof GalleryState>(key: K, value: GalleryState[K]) => void };

export default function MotionSection({ state, update }: Props) {
  return <SectionCard title="Motion" subtitle="Motion controls for native gallery generation."><Switch label="Motion safe" checked={state.motion} onChange={(value) => update("motion", value)} /></SectionCard>;
}
