"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState, type CSSProperties } from "react";
import type { GalleryState } from "../types";

function shell(state: GalleryState): CSSProperties {
  return { width: state.width, minHeight: state.height, padding: state.padding, gap: state.gap, borderRadius: state.radius, border: `${state.borderWidth}px solid ${state.border}`, boxShadow: `0 ${Math.round(state.shadow / 3)}px ${state.shadow}px rgba(0,0,0,.28)`, background: state.background, color: state.foreground, fontFamily: state.fontFamily, opacity: state.disabled ? 0.55 : 1 };
}

function imageDataUri(index: number, accent: string, background: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${accent}" offset="0"/><stop stop-color="${background}" offset="1"/></linearGradient></defs><rect width="800" height="560" fill="url(#g)"/><circle cx="${180 + index * 28}" cy="150" r="90" fill="rgba(255,255,255,.22)"/><path d="M0 470 C160 380 260 430 390 350 C520 270 650 330 800 230 L800 560 L0 560 Z" fill="rgba(255,255,255,.24)"/><text x="56" y="86" fill="white" font-family="Arial" font-size="44" font-weight="700">Gallery ${index + 1}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export default function LivePreview({ state }: { state: GalleryState }) {
  const itemCount = Math.max(1, state.imageCount);
  const [selectedIndex, setSelectedIndex] = useState(state.selectable ? 0 : -1);
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const categories = ["All", "Featured", "Editorial"];
  const layoutMode = state.filterMode === "masonry" ? "masonry" : state.filterMode === "list" ? "list" : "grid";
  const images = useMemo(() => Array.from({ length: itemCount }, (_, index) => ({
    id: `${state.id}-image-${index + 1}`,
    title: `${state.label} ${index + 1}`,
    alt: `${state.label} ${index + 1} artwork for ${state.title}`,
    caption: index === 0 ? state.description : `${state.helper} Image ${index + 1}.`,
    category: index % 2 === 0 ? "Featured" : "Editorial",
    src: imageDataUri(index, state.accent, state.background),
  })), [itemCount, state.accent, state.background, state.description, state.helper, state.id, state.label, state.title]);
  const visibleImages = activeFilter === "All" ? images : images.filter((image) => image.category === activeFilter);
  const lightboxImage = lightboxIndex === null ? null : images[lightboxIndex];
  const aspectRatio = state.aspectRatio === "portrait" ? "3 / 4" : state.aspectRatio;
  const panel = shell(state);

  return <section id={state.id} role={state.role} aria-label={state.ariaLabel} tabIndex={state.tabIndex} style={panel} className="grid">
    <div className="grid gap-4">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: state.accent }}>{state.label}</p>
        <h3 className="mt-2" style={{ fontSize: state.titleSize, fontWeight: state.fontWeight }}>{state.title}</h3>
        <p className="mt-2" style={{ color: state.muted, fontSize: state.bodySize }}>{state.description}</p>
      </header>
      {state.filterMode !== "none" && <div role="group" aria-label="Filter gallery" className="flex flex-wrap gap-2">
        {categories.map((category) => <button key={category} type="button" onClick={() => setActiveFilter(category)} disabled={state.disabled} aria-pressed={activeFilter === category} className="rounded-full border px-3 py-2 text-xs font-semibold" style={{ borderColor: activeFilter === category ? state.accent : state.border, background: activeFilter === category ? state.accent : "transparent", color: activeFilter === category ? state.background : state.foreground }}>{category}</button>)}
      </div>}
      <div data-layout={layoutMode} style={{ display: layoutMode === "list" ? "grid" : layoutMode === "masonry" ? "block" : "grid", columns: layoutMode === "masonry" ? Math.max(1, state.columns) : undefined, gridTemplateColumns: layoutMode === "grid" ? `repeat(${Math.max(1, state.columns)}, minmax(0, 1fr))` : undefined, gap: state.gap }}>
        {visibleImages.map((image) => {
          const originalIndex = images.findIndex((item) => item.id === image.id);
          const selected = state.selectable && selectedIndex === originalIndex;
          return <figure key={image.id} aria-selected={selected || undefined} className="border p-2" style={{ breakInside: "avoid", margin: layoutMode === "masonry" ? `0 0 ${state.gap}px` : 0, display: layoutMode === "list" ? "grid" : "block", gridTemplateColumns: layoutMode === "list" ? "minmax(120px, 220px) 1fr" : undefined, gap: state.gap, borderColor: selected ? state.accent : state.border, borderRadius: Math.max(10, state.radius - 10), background: "rgba(255,255,255,.05)" }}>
            <button type="button" disabled={state.disabled} aria-label={`Open ${image.title} in lightbox`} onClick={() => { setSelectedIndex(originalIndex); setLightboxIndex(originalIndex); }} className="block w-full border-0 bg-transparent p-0 text-left">
              <img src={image.src} alt={image.alt} title={image.title} loading="lazy" className="block w-full" style={{ aspectRatio, objectFit: state.fit, borderRadius: Math.max(8, state.radius - 14) }} />
            </button>
            {state.showCaptions && <figcaption className={layoutMode === "list" ? "" : "mt-2"}>
              <strong>{image.title}</strong>
              <p className="mt-1" style={{ color: state.muted, fontSize: state.bodySize }}>{image.caption}</p>
              <span className="text-xs" style={{ color: state.accent }}>{image.category}</span>
            </figcaption>}
          </figure>;
        })}
      </div>
      <p aria-live="polite" className="text-xs" style={{ color: state.muted }}>{visibleImages.length} images shown. {state.selectable && selectedIndex >= 0 ? `${images[selectedIndex]?.title} selected.` : "Selection off."}</p>
    </div>
    {lightboxImage && <div role="dialog" aria-modal="true" aria-label={lightboxImage.title} className="absolute inset-4 z-10 grid place-items-center rounded-3xl p-4" style={{ background: "rgba(2,6,23,.76)" }}>
      <figure className="m-0 w-full max-w-[520px] p-4" style={{ borderRadius: state.radius, background: state.background, color: state.foreground }}>
        <img src={lightboxImage.src} alt={lightboxImage.alt} title={lightboxImage.title} className="w-full" style={{ borderRadius: Math.max(8, state.radius - 12) }} />
        <figcaption className="mt-3">
          <strong>{lightboxImage.title}</strong>
          <p className="my-2" style={{ color: state.muted }}>{lightboxImage.caption}</p>
          <button type="button" onClick={() => setLightboxIndex(null)} className="rounded-full border px-4 py-2 text-sm" style={{ borderColor: state.border }}>Close lightbox</button>
        </figcaption>
      </figure>
    </div>}
  </section>;
}
