"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Switch from "@/components/shared/input/Switch";
import type { GalleryState } from "../types";

type Props = { state: GalleryState; update: <K extends keyof GalleryState>(key: K, value: GalleryState[K]) => void };

export default function BehaviorSection({ state, update }: Props) {
  return <SectionCard title="Behavior" subtitle="Behavior controls for native gallery generation."><Switch label="Disabled" checked={state.disabled} onChange={(value) => update("disabled", value)} /></SectionCard>;
}
