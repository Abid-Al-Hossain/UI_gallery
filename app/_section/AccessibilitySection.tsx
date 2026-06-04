"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Input from "@/components/shared/input/Input";
import type { GalleryState } from "../types";

type Props = { state: GalleryState; update: <K extends keyof GalleryState>(key: K, value: GalleryState[K]) => void };

export default function AccessibilitySection({ state, update }: Props) {
  return <SectionCard title="Accessibility" subtitle="Accessibility controls for native gallery generation."><Input label="Accessible label" value={state.ariaLabel} onChange={(value) => update("ariaLabel", value)} /></SectionCard>;
}
