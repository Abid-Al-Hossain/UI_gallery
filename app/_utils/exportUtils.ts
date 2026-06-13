import type { GalleryState } from "../types";

export type ExportPayload = { fileName: string; mimeType: "text/plain;charset=utf-8"; content: string };

export function buildExportPayload(state: GalleryState, fileName = "gallery") : ExportPayload {
  return { fileName: `${fileName || "gallery"}.jsx`, mimeType: "text/plain;charset=utf-8", content: buildReactCode(state) };
}

export function buildReactCode(state: GalleryState) {
  return `import * as React from "react";

const state = ${JSON.stringify(state, null, 2)};

function imageDataUri(index, accent, background) {
  const svg = \`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="\${accent}" offset="0"/>
          <stop stop-color="\${background}" offset="1"/>
        </linearGradient>
      </defs>
      <rect width="800" height="560" fill="url(#g)"/>
      <circle cx="\${180 + index * 28}" cy="150" r="90" fill="rgba(255,255,255,.22)"/>
      <path d="M0 470 C160 380 260 430 390 350 C520 270 650 330 800 230 L800 560 L0 560 Z" fill="rgba(255,255,255,.24)"/>
      <text x="56" y="86" fill="white" font-family="Arial" font-size="44" font-weight="700">Gallery \${index + 1}</text>
    </svg>\`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

export default function GalleryComponent() {
  const itemCount = Math.max(1, state.imageCount);
  const [selectedIndex, setSelectedIndex] = React.useState(state.selectable ? 0 : -1);
  const [activeFilter, setActiveFilter] = React.useState("All");
  const [lightboxIndex, setLightboxIndex] = React.useState(null);
  const categories = ["All", "Featured", "Editorial"];
  const layoutMode = state.filterMode === "masonry" ? "masonry" : state.filterMode === "list" ? "list" : "grid";
  const images = React.useMemo(() => Array.from({ length: itemCount }, (_, index) => ({
    id: \`image-\${index + 1}\`,
    title: \`\${state.label} \${index + 1}\`,
    alt: \`\${state.label} \${index + 1} artwork for \${state.title}\`,
    caption: index === 0 ? state.description : \`\${state.helper} Image \${index + 1}.\`,
    category: index % 2 === 0 ? "Featured" : "Editorial",
    src: imageDataUri(index, state.accent, state.background),
  })), [itemCount]);
  const visibleImages = activeFilter === "All" ? images : images.filter((image) => image.category === activeFilter);
  const lightboxImage = lightboxIndex === null ? null : images[lightboxIndex];
  const aspectRatio = state.aspectRatio === "portrait" ? "3 / 4" : state.aspectRatio;

  return (
    <section
      id={state.id}
      role={state.role}
      aria-label={state.ariaLabel}
      tabIndex={state.tabIndex}
      style={{
        width: state.width,
        minHeight: state.height,
        padding: state.padding,
        borderRadius: state.radius,
        border: state.borderWidth + "px solid " + state.border,
        boxShadow: "0 " + Math.round(state.shadow / 3) + "px " + state.shadow + "px rgba(0,0,0,.28)",
        background: state.background,
        color: state.foreground,
        fontFamily: state.fontFamily,
        opacity: state.disabled ? 0.55 : 1,
      }}
    >
      <div style={{ display: "grid", gap: state.gap }}>
        <header>
          <p style={{ margin: 0, color: state.accent, fontSize: 12, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase" }}>
            {state.label}
          </p>
          <h2 style={{ margin: "8px 0 0", fontSize: state.titleSize, fontWeight: state.fontWeight }}>{state.title}</h2>
          <p style={{ margin: "8px 0 0", color: state.muted, fontSize: state.bodySize }}>{state.description}</p>
        </header>

        {state.filterMode !== "none" && (
          <div role="group" aria-label="Filter gallery" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map((category) => (
              <button key={category} type="button" onClick={() => setActiveFilter(category)} disabled={state.disabled} aria-pressed={activeFilter === category} style={{ border: "1px solid " + (activeFilter === category ? state.accent : state.border), borderRadius: 999, padding: "8px 12px", background: activeFilter === category ? state.accent : "transparent", color: activeFilter === category ? state.background : state.foreground }}>
                {category}
              </button>
            ))}
          </div>
        )}

        <div
          data-layout={layoutMode}
          style={{
            display: layoutMode === "list" ? "grid" : layoutMode === "masonry" ? "block" : "grid",
            columns: layoutMode === "masonry" ? Math.max(1, state.columns) : undefined,
            gridTemplateColumns: layoutMode === "grid" ? "repeat(" + Math.max(1, state.columns) + ", minmax(0, 1fr))" : undefined,
            gap: state.gap,
          }}
        >
          {visibleImages.map((image) => {
            const originalIndex = images.findIndex((item) => item.id === image.id);
            const selected = state.selectable && selectedIndex === originalIndex;
            return (
              <figure key={image.id} aria-selected={selected || undefined} style={{ breakInside: "avoid", margin: layoutMode === "masonry" ? "0 0 " + state.gap + "px" : 0, display: layoutMode === "list" ? "grid" : "block", gridTemplateColumns: layoutMode === "list" ? "minmax(120px, 220px) 1fr" : undefined, gap: state.gap, padding: 10, borderRadius: Math.max(10, state.radius - 10), border: "1px solid " + (selected ? state.accent : state.border), background: "rgba(255,255,255,.05)", transition: state.transitionDuration > 0 ? "$1" : "none" }}>
                <button type="button" disabled={state.disabled} aria-label={\`Open \${image.title} in lightbox\`} onClick={() => { setSelectedIndex(originalIndex); setLightboxIndex(originalIndex); }} style={{ display: "block", width: "100%", padding: 0, border: 0, background: "transparent", cursor: state.disabled ? "not-allowed" : "zoom-in" }}>
                  <img src={image.src} alt={image.alt} title={image.title} loading="lazy" style={{ display: "block", width: "100%", aspectRatio, objectFit: state.fit, borderRadius: Math.max(8, state.radius - 14) }} />
                </button>
                {state.showCaptions && (
                  <figcaption style={{ marginTop: layoutMode === "list" ? 0 : 10 }}>
                    <strong>{image.title}</strong>
                    <p style={{ margin: "4px 0 0", color: state.muted, fontSize: state.bodySize }}>{image.caption}</p>
                    <span style={{ color: state.accent, fontSize: 12 }}>{image.category}</span>
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>

        <p aria-live="polite" style={{ margin: 0, color: state.muted, fontSize: 12 }}>
          {visibleImages.length} images shown. {state.selectable && selectedIndex >= 0 ? images[selectedIndex]?.title + " selected." : "Selection off."}
        </p>
      </div>

      {lightboxImage && (
        <div role="dialog" aria-modal="true" aria-label={lightboxImage.title} style={{ position: "fixed", inset: 0, zIndex: 50, display: "grid", placeItems: "center", padding: 24, background: "rgba(2,6,23,.82)" }}>
          <figure style={{ width: "min(920px, 100%)", margin: 0, padding: 16, borderRadius: state.radius, background: state.background, color: state.foreground }}>
            <img src={lightboxImage.src} alt={lightboxImage.alt} title={lightboxImage.title} style={{ width: "100%", borderRadius: Math.max(8, state.radius - 12) }} />
            <figcaption style={{ marginTop: 12 }}>
              <strong>{lightboxImage.title}</strong>
              <p style={{ margin: "4px 0 12px", color: state.muted }}>{lightboxImage.caption}</p>
              <button type="button" onClick={() => setLightboxIndex(null)} style={{ border: "1px solid " + state.border, borderRadius: 999, padding: "10px 14px", background: "transparent", color: state.foreground }}>
                Close lightbox
              </button>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
`;
}
