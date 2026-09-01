# dsh-super-pm

A standard DeepSeek Harness plugin that packages the [Super PM](https://github.com/Lohaslee/super-pm) product-thinking skill.

It turns the original skill into a self-contained DSH bundle. Installing this package makes `super-pm` available from the package's own `skills/` directory while preserving DSH's normal project and user skill roots.

## Install in DSH

Install from a local checkout:

```bash
dsh plugin --profile web add /absolute/path/to/dsh-super-pm
```

Install from GitHub after publishing:

```bash
dsh plugin --profile web add github:Lohaslee/dsh-super-pm
```

Or install the published npm package:

```bash
dsh plugin --profile web add dsh-super-pm
```

Restart `dsh web` after changing the server-side profile composition. Then invoke the skill with `/super-pm` or describe a product decision in a supported product context.

## What is included

- `skills/super-pm/SKILL.md`: the model-facing workflow and behavior rules
- `skills/super-pm/references/`: English and Simplified Chinese product lenses, routing, validation, decision memory, and PRD templates
- `skills/super-pm/scripts/`: source validation helpers from the upstream skill
- `cordis.patch.yml`: mounts the package-local skill root through an isolated `skill-filesystem` provider
- `lib/index.js`: package metadata and resource entry point

The plugin intentionally does not add speculative runtime tools or a custom GUI. The Skill remains responsible for product reasoning; the plugin makes its distribution and activation reproducible.

## Development

```bash
npm install
npm run check
npm run pack:check
```

`npm run check` validates the JavaScript entry point, package metadata, Skill frontmatter, and bundled resource layout.

## Repository layout

```text
.
├── cordis.patch.yml
├── lib/index.js
├── package.json
├── scripts/validate.mjs
└── skills/super-pm/
```

## Release checklist

1. Run `npm run check`.
2. Run `npm run pack:check` and confirm `skills/`, `lib/`, and `cordis.patch.yml` are included.
3. Update `CHANGELOG.md` and the package version.
4. Push the repository to GitHub and create a version tag.
5. Install the tagged package into a clean DSH profile and verify that `/super-pm` appears in the skill catalog.

## License

MIT. The bundled Skill retains the upstream repository's license and attribution context. See [LICENSE](LICENSE).
