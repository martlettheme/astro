# Automated npm releases

GitHub Actions publishes stable GitHub releases through npm trusted publishing (OIDC), using `.github/workflows/publish.yml`. It requires no npm token secret.

## One-time npm setup

Open [package settings](https://www.npmjs.com/package/@martlet/astro/access), then Trusted publishing, Add trusted publisher, GitHub Actions. Enter these exact values:

| Setting | Value |
| --- | --- |
| Organization/user | `martlettheme` |
| Repository | `astro` |
| Workflow filename | `publish.yml` |
| Environment | Leave blank |
| Allowed action | Enable direct `npm publish` |

The workflow must be merged before use. New trusted publisher connections must complete their first publish within two days; otherwise recreate the connection. Existing package maintainers configure this on npm. No npm account settings are changed by this PR.

## Release

1. Merge reviewed version and changelog changes to `main`.
2. Publish a stable GitHub release whose tag is exactly `v` plus `package.json`'s version.
3. The workflow runs the full verification suite, checks tag/version/repository identity and ancestry in `main`, builds from a fresh install, and publishes to npm. Failed checks prevent publication.

Release core 2.1.0 before Astro 1.1.0, then migrate the demonstration sites to registry versions. Prereleases do not publish through this stable-release workflow. Re-running a successful release fails rather than overwriting an existing npm version. Public repositories produce provenance attestations; private repositories publish with provenance disabled because npm does not support those attestations from private source repositories. Repository visibility is unchanged.

Reference: https://docs.npmjs.com/trusted-publishers/
