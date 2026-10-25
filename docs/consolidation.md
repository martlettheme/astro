# Martlet consolidation

Core 2.2.1 and Astro 1.2.1 are **experimental packages distributed under npm’s `next` tag**. Existing theme colors, typography defaults, component defaults, and Astro slots are retained. Use exact registry versions or the `next` dist-tags; verify the registry before installing.

The core owns [grammar](https://github.com/martlettheme/npm/blob/work/foundations-spec/docs/grammar.md), [source decisions](https://github.com/martlettheme/npm/blob/work/foundations-spec/docs/source-decisions.md), [foundation requirements](https://github.com/martlettheme/npm/blob/work/foundations-spec/docs/foundations.md), `language.json`, and framework-independent pattern CSS. Astro owns rendering and slots. React owns its events, controlled state and focus APIs. Documentation and agent references must identify the exact guidance revision. Publication does not establish grammar stability.

## Opt into source roles

Import `@martlet/theme/source-profile.css` after the regular core styles. Apply `martlet-source-profile` to an existing `.martlet` container (or pass it through Astro `bodyClass`) within `data-martlet="light"` or `"dark"`. This restores audited reading roles and removes the unsupported page-header accent in that scope. New field/group/region relationships remain experimental. Nested opposite appearances must start their own source-profile scope.

`full.css` includes additive `patterns.css`; color-only imports still load no pattern styling. Existing palette JSON is unchanged apart from version metadata. No personal identity, analytics, legal policy, imagery, automatic global stripe, or navigation orientation is imposed.

## Content and footer anatomy

Use TableOfContents with `items` containing `href`, `label`, and optional `depth: 2 | 3`; the default depth is 2. A depth-3 item requires a preceding depth-2 parent. Native nested lists retain parent/child semantics. `variant="index"` belongs in ArticleLayout's `contents` slot. `variant="inline"` is an in-body alternative. Localize `label` explicitly.

ArticleLayout retains its existing `sidebar` slot and end-side supporting region. Its new `contents` slot precedes the body; supporting material still follows the body. DocumentationLayout's existing `navigation` slot is unchanged. A TOC does not make every page require a left rail.

SiteFooter defaults to the existing plain rendering. `variant="grouped"` accepts `groups: {label, links: {href, label}[]}[]`, plus `identity` and `base` slots. Existing `links`, `navigationLabel`, class and default slot remain supported in either variant. The host supplies its own mark, ownership, contact, translated group names and destinations. Martlet places groups first and identity/base after them, following its publishing footer.

## Navigation and interaction boundaries

Both languages permit top, side and focused frames. Astro SiteHeader remains a wrapping link header; no dropdown, menu controller or React state API is claimed. Martlet uses the audited source header and document-index hierarchy; source index labels use darker existing gold on cream for contrast.

Preserve native semantics, focus visibility, retained input, actionable validation, save retry, draft protection and undo where appropriate. These behavioral obligations cross frameworks; their React implementations do not become Astro props. Full dark mode and new app controls remain extensions. Figure, footnote, maths, archive/card variants and richer data workflows remain gaps.

## Grammar coverage

[Grammar 0.3 support and framework boundaries](grammar-support.md) describes the new form/results contracts and their native HTML versus React availability.

## Experimental distribution

The GitHub pre-release publishes the verified package under npm’s `next` dist-tag. The existing `latest` tag stays unchanged. An experimental publication does not establish grammar stability or manual assistive-technology conformance. Promote a release only through a separate reviewed release decision.
