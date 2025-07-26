Admotion Brand Guidelines (brand.md)

Single source of truth for visual, verbal, and product UI standards. Keep this file in the repo root and update via PRs.

⸻

1. Brand Core

Name: Admotion
Tagline: AI video ads, on command.
One‑liner: Generate polished marketing videos from a prompt using AI and Remotion.

1.1 Brand Pillars
	•	Precision – output is clean, intentional, and technically robust.
	•	Velocity – fast experiences, snappy motion, minimal wait states.
	•	Clarity – simple UI, straight talk, zero fluff.
	•	Playful edge – subtle motion, micro-interactions, confident color pops.

1.2 Personality & Voice

Trait	Do	Don’t
Direct	“Drop your prompt, we’ll handle the rest.”	Overly formal corporate speak
Technical-savvy	Show how it works in plain English/code	Hype without substance
Friendly/confident	Short helpful copy, small easter eggs	Sarcasm, meme slang that dates fast
Modern startup vibe	Use concise sentences, section headings	Wall-of-text marketing jargon

Grammar/Style:
	•	Sentence case for UI labels and headings (except proper nouns).
	•	No em dashes; use periods or commas. (User preference)
	•	Oxford comma optional. Consistency > rules.
	•	Avoid marketing buzzword chains. Say what it does.

⸻

2. Visual System

2.1 Typography

Primary font: Geist (Mono and Sans available; prefer Sans for UI/body).

Font stack (web):

--font-sans: "Geist", system-ui, -apple-system, "Segoe UI", sans-serif;
--font-mono: "Geist Mono", ui-monospace, SFMono-Regular, monospace;

Weights used: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold).
Usage:
	•	H1/Hero: Geist 600–700
	•	H2/H3: Geist 500–600
	•	Body: Geist 400
	•	Code/UI tokens: Geist Mono 400

2.2 Color Palette

Accessible, high-contrast, modern. Test contrast ≥ 4.5:1 for body text.

Token	Use	HEX	Notes
--color-bg	App background	#0A0A0B	Near-black for cinematic feel
--color-surface	Cards/panels	#131316	Slight lift from bg
--color-primary	CTAs, key links	#3B82F6	Electric blue
--color-primary-hover	Hover/active	#2563EB	Darker blue
--color-accent	Highlights, graphs	#06B6D4	Cyan/mint edge
--color-accent-2	Secondary accents	#A855F7	Vibrant purple
--color-text	Primary text	#F5F5F6	Off-white
--color-text-dim	Secondary text	#B3B3B8	Muted grey
--color-border	Dividers/borders	#2A2A2E	Subtle lines
--color-success	Success states	#22C55E	Green
--color-warning	Warnings	#F59E0B	Amber
--color-danger	Errors	#EF4444	Red

Export CSS variables in /src/styles/tokens.css.

2.3 Spacing & Layout
	•	Grid: 8px base unit. Spacing in multiples of 4/8.
	•	Container max-widths: 1280px desktop, 768px tablet, fluid mobile.
	•	Corner radius: 12px default, 20px for large surfaces/hero cards, 9999px for pills.
	•	Shadow: Soft, high-blur, low-spread. Prefer layered transparency over heavy drop shadows.

2.4 Motion Principles
	•	Function first: motion should communicate state changes or hierarchy.
	•	Duration: 120–240ms for UI transitions, 400–800ms for larger scene/hero reveals.
	•	Easing: cubic-bezier(0.16, 1, 0.3, 1) (standard “ease-out back” feel).
	•	Stagger content to guide focus (30–60ms offsets).

2.5 Iconography & Illustration
	•	Icons: Geometric, minimal, 2px stroke, 24px grid. Use Lucide or custom in same style.
	•	Illustrations: Abstract 3D shapes, gradients, subtle noise. Avoid skeuomorphism.
	•	Logo mark: Geometric “play”/“spark” motif blended with a motion trail. Keep it simple enough for a favicon.

2.6 Imagery
	•	Prefer rendered abstract shapes, gradients, particle fields referencing motion/video.
	•	For marketing, show UI screenshots in device frames (MacBook/iPhone mockups) on dark backgrounds.
	•	Avoid stock photography of people unless case studies—then crop tight, grayscale tint or duotone.

⸻

3. Logo Usage

3.1 Variants
	•	Primary lockup: Icon + wordmark horizontal.
	•	Icon only: Favicon, avatars, small badges.
	•	Monochrome versions: White on dark, black on light. Keep contrast.

3.2 Clear Space & Sizing
	•	Clear space: height of the “A” around all sides.
	•	Minimum sizes: 24px for icon, 120px width for lockup.

3.3 Do/Don’t
	•	✅ Scale proportionally, maintain color palette, use approved backgrounds.
	•	❌ Stretch, add shadows/glows not specified, recolor arbitrarily, rotate, or add drop shadows to logotype.

⸻

4. Product UI Guidelines

4.1 Components
	•	Buttons:
	•	Primary: Solid --color-primary, text --color-bg.
	•	Secondary: Outline --color-border, hover --color-surface.
	•	Destructive: --color-danger.
	•	Inputs: 1px border --color-border, focus ring --color-primary 2px.
	•	Cards/Panels: --color-surface, 12px radius, subtle shadow.
	•	Toasts: Bottom-right on desktop, full-width sliding on mobile.

4.2 States
	•	Hover: elevate surface OR shift background 2–4% lighter.
	•	Focus: 2px solid or outline using primary color; always accessible.
	•	Disabled: 40% opacity, pointer-events: none.

4.3 Data Viz
	•	Use accent colors for lines/bars, avoid rainbow palettes.
	•	Label directly when possible. If using legends, place near chart.
	•	Animations: 200–300ms fade/slide, no infinite looping.

4.4 Accessibility
	•	Color contrast: ≥ 4.5:1 body text, ≥ 3:1 large headlines.
	•	Focus outlines visible against dark bg.
	•	Provide alt text for imagery; transcripts for generated videos if exposed in UI.
	•	Respect reduced motion preferences (prefers-reduced-motion).

⸻

5. Content & Copy Standards

5.1 Headline Patterns
	•	What it does: “AI video ads, on command.”
	•	How it helps: “Turn a prompt into a polished 30‑second spot.”
	•	Proof/Specifics: “Built with Remotion + Claude. Templates that never break.”

5.2 Microcopy
	•	Be human: “Something went wrong. Try again?”
	•	Confirm success crisply: “Rendered! Downloading…”
	•	Avoid passive voice. Prefer verbs.

5.3 Error Messages

Structure: What happened → Why (if helpful) → Next step.

Example:

Render failed after 120s. Lambda timed out. Re-try or render locally.


⸻

6. Code & File Conventions (Design Tokens Included)

6.1 File Naming
	•	Components: PascalCase.tsx
	•	Hooks/utils: useThing.ts, formatDate.ts
	•	Assets: logo-primary.svg, icon-play.svg
	•	Tokens: /src/styles/tokens.css (CSS vars) + tokens.ts (TS exports)

6.2 CSS/Tailwind
	•	Use Tailwind for rapid UI; design tokens mapped to Tailwind config.
	•	Custom utilities in tailwind.config.ts (spacing, colors).
	•	Avoid inline styles for reusable components.

6.3 Motion in Code
	•	Prefer Framer Motion for React UI transitions (not in Remotion comps).
	•	Use Remotion springs/interpolations for video scenes.

⸻

7. Asset Production & Export

Asset	Format	Size	Notes
Logo Icon	SVG + PNG	1024, 512, 128, 32	Transparent bg
Wordmark	SVG	scalable	No stroke outlines
Social share image	PNG/JPG	1200×630	Open Graph/Twitter
Favicon	ICO + 32px PNG	multi-size	Generated via RealFaviconGenerator

Store in /public/brand/ and export from Figma with pixel-hinting off.

⸻

8. Review & Governance
	•	All brand changes via PR with “Brand Review” label.
	•	Design owner approves visual changes; PM approves copy changes.
	•	Version this file; include changelog below.

Changelog
	•	v1.0.0 (2025-07-26): Initial guidelines created.

⸻

9. Quick Checklist
	•	Using Geist everywhere?
	•	Colors from tokens? Contrast checked?
	•	Motion durations within spec? Respect reduced motion?
	•	Copy short, clear, technically accurate?
	•	Logo/icon sized and spaced correctly?

⸻

Need to add or question something? Open an issue titled brand: … or ping in #design.