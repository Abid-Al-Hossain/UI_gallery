"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Select from "@/components/shared/input/Select";
import type { GalleryState } from "../types";

type Props = { state: GalleryState; update: <K extends keyof GalleryState>(key: K, value: GalleryState[K]) => void };

export default function LayoutSection({ state, update }: Props) {
  return <SectionCard title="Layout" subtitle="Layout controls for native gallery generation.">
      <div className="space-y-4"><Select label="Aspect ratio" value={state.aspectRatio} options={[
  "square",
  "16/9",
  "4/3",
  "portrait"
]} onChange={(value) => update("aspectRatio", value)} />
<Select label="Fit" value={state.fit} options={[
  "cover",
  "contain",
  "fill"
]} onChange={(value) => update("fit", value)} /></div>
    </SectionCard>;
}
