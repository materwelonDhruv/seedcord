<p align="center">
  <img src="../../assets/banner.png" alt="seedcord" width="100%" />
</p>

# @seedcord/tsconfig

Some very strict tsconfigs

## Presets

| name                      | target use case                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `@seedcord/tsconfig/base` | strict defaults for libraries and tooling (ESNext + bundler resolution, emit disabled) |
| `@seedcord/tsconfig/node` | runtime projects that need Node-friendly module resolution and ES2024 output           |

## Install

```bash
pnpm add -D @seedcord/tsconfig
```

## Usage

```jsonc
// tsconfig.json
{
    "extends": "@seedcord/tsconfig/base",
    "compilerOptions": {
        "outDir": "./dist",
        "rootDir": "./src"
    },
    "include": ["src"]
}
```

For Node services, extend the `node` preset instead:

```jsonc
{
    "extends": "@seedcord/tsconfig/node",
    "include": ["src", "tests"],
    "compilerOptions": {
        "outDir": "./dist"
    }
}
```

That's it—no build step required because the presets are plain JSON files.
