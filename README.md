# Martlet for Astro

`@martlet/astro` provides reusable Astro layouts and components. The framework-independent [`@martlet/theme`](https://github.com/martlettheme/npm) package owns the design definitions and font roles, extracted from jameshoward.us. Astro adds composition, never a competing palette.

## Install

```sh
npm install @martlet/theme @martlet/astro
```

The GitHub organization is `martlettheme`; the npm scope is `martlet`.

## Use

```astro
---
import { Layout, Container, SectionHeading, Card, Button } from '@martlet/astro';
---
<Layout title="Your website" description="Your own description.">
  <Container>
    <h1>Your own identity</h1>
    <SectionHeading title="An example" />
    <Card><p>Your content.</p><Button href="/about/">About</Button></Card>
  </Container>
</Layout>
```

`Layout` loads core colors, foundation variables, typography, optional component styles, and local fonts. Set `mode="dark"` for Dark (default: Light). It provides head, header, footer, and body-end slots; it supplies no favicon, branding, analytics, navigation, or consent behavior. Use `mainId`, `mainTabindex`, `lang`, `class`, and `bodyClass` to adapt the shell. Metadata text uses Astro's normal escaping.

Components also have direct exports such as `@martlet/astro/Container.astro`. For an existing document shell, import `@martlet/astro/styles.css`, set `data-martlet="light"` or `dark`, and add `class="martlet"` around the styled content. The framework-independent core offers narrower imports if you do not want fonts or element styling.

`Container` supports content, reading, and archive widths. `SectionHeading` supports h2/h3, alignment, eyebrow, description, class hooks, and a divider slot. `Card` is an article wrapper. `Button` accepts native anchor/button attributes and defaults buttons to `type="button"`.

## Starter

Copy `starter/` to a new project. It contains a neutral example with no personal identity or tracking. The starter is initial project scaffolding; package updates supply the shared functionality afterward.

## Compatibility and maintenance

Astro 5–7 is the supported peer range. Both current consumers exercise the package (Astro 5.18.2 and 7.3.2). See [the extraction and migration playbook](docs/playbook.md) for release ordering, provenance, and validation. Publish only after both consuming sites pass their checks; CI never publishes automatically.

## Layout system

Version 1.1 adds `Stack`, `Cluster`, `Grid`, `Sidebar`, `Split`, `Section`, `PageHeader`, `SiteHeader`, `SiteFooter`, `ArticleLayout`, `LandingLayout`, and `DocumentationLayout`. These consume `@martlet/theme@^2.1.0`; visual defaults and structural CSS live in the core. See [layout contracts, source observations, and examples](docs/layouts.md). Existing components and Layout behavior remain available.

## Releases

Stable GitHub releases can publish automatically through npm trusted publishing. See [release setup](docs/releasing.md) for the one-time package authorization and release order.
