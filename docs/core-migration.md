# Core dependency migration preview

This private candidate changes the peer and CSS imports from `@martlet/theme` to the separate, unpublished `@martlet/core` identity. Its `2.0.0` version is a proposed breaking-version boundary, not a published or reserved release. Old `@martlet/astro@1.2.2` and `@martlet/theme` remain unchanged; installing `/core` does not satisfy a `/theme` peer.

The review-only verification workflow builds the core source at `f4c18540e643388c71da2308607cc8f944b32391` and packs it locally. Verify its tarball hash against the separately reviewed core candidate before using it. The starter manifest names `/core` for the future; until a new package is approved and available it must be installed from the actual local tarball. No trusted-publisher, production or release workflow change is made here. Review the existing `docs/` as historical `/theme` guidance unless explicitly migrated; old links and immutable provenance must not be rewritten.

Do not publish this private candidate. Publication, selecting an actual version, downstream adoption and deployment need separate approvals after the new core package and its publisher identity are verified.
