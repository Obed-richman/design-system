# Android (Jetpack Compose) Code Connect

Publishes the Compose snippet for the Button (and future components) to
Design-System-003. Uses the Code Connect **Gradle plugin** (`com.figma.code.connect`).

```
platforms/android/
├── settings.gradle.kts
├── build.gradle.kts                           # applies com.figma.code.connect + code-connect-lib
└── src/main/kotlin/com/zego/designsystem/
    └── Button.kt                              # ZegoButton composable + @FigmaConnect mapping → node 85-78500
```

> **Where this really belongs:** a Compose Code Connect file needs the Compose
> runtime to compile its `@Composable` example, so in practice you apply the
> plugin + `code-connect-lib` dependency **inside your existing Android Compose
> module** and drop `Button.kt` there. The files here are the exact plugin,
> dependency and annotation you add — kept in the repo so the Button POC is
> complete in one place.

## Prerequisites
- JDK + Gradle (the app's wrapper, `./gradlew`), Android SDK, a Compose module.
- Plugin set per the docs: `com.figma.code.connect` 1.2.9 · `code-connect-lib`
  1.1.3 · Kotlin 2.2.10 (or the current compatible set).
- A Figma token with **File content: Read** + **Code Connect: Write**.

## Publish
From the Gradle project that applies the plugin:

```bash
export FIGMA_ACCESS_TOKEN=…         # read -rs so it isn't echoed/stored

./gradlew tasks --all | grep -i codeconnect   # confirm the task names in your version
./gradlew parseCodeConnect                      # dry check — parses @FigmaConnect classes
./gradlew publishCodeConnect                    # pushes the Compose snippet to Figma
```

The plugin also exposes a `createCodeConnect` task to scaffold a mapping from a
Figma node URL. Open the Button in Figma Dev Mode and switch the platform
selector to **Android** to see the snippet.

## Adding another component
1. Add a Compose reference composable (or import the real one).
2. Add a `@FigmaConnect(url = "…")` class with `@FigmaProperty(FigmaType.…, "…")`
   fields (use `Figma.mapping(…)` for variant enums) and a `@Composable` example.
3. Run the publish task.

## Notes / to verify
- Confirm the exact Code Connect task names with `./gradlew tasks` — they've been
  seen as `parseCodeConnect` / `createCodeConnect`; the publish task name can vary
  by plugin version.
- Figma is consolidating on a single **template-file** format; the Compose plugin
  still works but check https://developers.figma.com/docs/code-connect/compose/
  before a big rollout.
