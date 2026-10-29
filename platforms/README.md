# Native Code Connect — iOS (SwiftUI) & Android (Jetpack Compose)

This folder adds **SwiftUI** and **Jetpack Compose** Code Connect alongside the
existing **Web (HTML)** Code Connect, so a single Figma component in
Design-System-003 offers a snippet for all three platforms. In Figma Dev Mode a
**Web / iOS / Android** switcher appears on the component automatically — Figma
groups the mappings by language; there's no extra "linking" step.

**Button** is wired up end-to-end as the proof of concept. All three map to the
same node:
`https://www.figma.com/design/Jvq1VmDPfcCMgbjUTIbjaI/Design-System-003?node-id=85-78500`

| Platform | Mapping file | Toolchain | Publish |
|---|---|---|---|
| Web (HTML) | `components/button/button.figma.ts` | `@figma/code-connect` (npm) | `npm run figma:publish` (repo root) |
| iOS (SwiftUI) | `platforms/ios/Sources/ZegoDesignSystem/Button.figma.swift` | Code Connect Swift Package (SPM) | `figma connect publish` in `platforms/ios` |
| Android (Compose) | `platforms/android/src/main/kotlin/com/zego/designsystem/Button.kt` | Code Connect Gradle plugin | a Gradle Code Connect task |

Each publish uses the same kind of Figma **personal access token** (scopes:
*File content: Read* + *Code Connect: Write*), via the `FIGMA_ACCESS_TOKEN`
environment variable or `--token`.

## How it fits together

- The three toolchains are independent and run from different places — Node for
  web, an Xcode/Swift toolchain for iOS, a JVM/Gradle toolchain for Android. You
  don't need all three to publish any one of them.
- The `ZegoButton` views in `ios/` and `android/` are **minimal reference
  components** — just enough structure for Code Connect to map Figma props to
  real code. Swap in your actual component library types when these live in the
  real iOS/Android repos (which is the intended long-term home; keeping them here
  is fine for the POC and to prove the 3-language setup).
- Prop mapping mirrors the web `button.figma.ts`: Figma's **Hierarchy**,
  **Style** and **State** variant properties map to Swift/Kotlin enums.

## Automated publishing (GitHub Actions)

Two workflows publish on push to `main` (and can be run manually from the Actions
tab):

- `.github/workflows/code-connect-web.yml` — runs `npm run figma:publish` when a
  `components/**/*.figma.ts` or `figma.config.json` changes (Ubuntu).
- `.github/workflows/code-connect-ios.yml` — runs `npm run figma:publish:ios` when
  anything under `platforms/ios/` changes (macOS, for the Swift toolchain).

**One-time setup:** add a repository secret named **`FIGMA_ACCESS_TOKEN`** (scopes
*File content: Read* + *Code Connect: Write*) under **Settings → Secrets and
variables → Actions**. Without it the jobs fail with "Couldn't find a Figma
access token".

Android isn't automated here — it needs a Compose Gradle project; add a job in the
Android repo's CI once the mapping lives there.

## ⚠ Verify against current Figma docs before first publish

Figma is consolidating Code Connect onto a single **template-file** format and
has said the framework-specific parsers (what SwiftUI/Compose use today) "will no
longer receive updates." The structure in these files is current, but confirm the
**exact publish command / Gradle task name and config keys** against the live
docs when you run it, since they shift between versions:

- SwiftUI: https://developers.figma.com/docs/code-connect/swiftui/
- Compose: https://developers.figma.com/docs/code-connect/compose/
- CLI reference: https://developers.figma.com/docs/code-connect/cli-reference/
- Templates migration (the future direction): https://developers.figma.com/docs/code-connect/templates-migration-guide/

See `platforms/ios/README.md` and `platforms/android/README.md` for the
per-platform steps.
