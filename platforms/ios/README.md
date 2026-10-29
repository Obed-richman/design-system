# iOS (SwiftUI) Code Connect

Publishes the SwiftUI snippet for the Button (and future components) to
Design-System-003. Uses the Code Connect **Swift Package** (declared in
`Package.swift`) and the unified `figma connect` CLI with `parser: "swift"`
(`figma.config.json`).

```
platforms/ios/
├── Package.swift                              # SPM + figma/code-connect dependency
├── figma.config.json                          # { codeConnect: { parser: "swift" } }
└── Sources/ZegoDesignSystem/
    ├── Button.swift                           # minimal SwiftUI ZegoButton (reference)
    └── Button.figma.swift                     # the Code Connect mapping → node 85-78500
```

## Prerequisites
- Xcode / a Swift toolchain (`swift --version`).
- The Code Connect CLI available as `figma` (`npm i -g @figma/code-connect`, or
  `npx figma …`). The CLI drives the Swift parser.
- A Figma token with **File content: Read** + **Code Connect: Write**.

## Publish
From `platforms/ios/`:

```bash
# resolve the Swift package once
swift package resolve

export FIGMA_ACCESS_TOKEN=…         # read -rs so it isn't echoed/stored
figma connect parse                 # dry check — prints the parsed mapping
figma connect publish               # pushes the SwiftUI snippet to Figma
```

Open the Button in Figma Dev Mode and switch the platform selector to **iOS** to
see the snippet.

## Adding another component
1. Add a SwiftUI reference view in `Sources/ZegoDesignSystem/` (or import the real
   one from the app).
2. Add a `*.figma.swift` next to it: a `struct … : FigmaConnect` with
   `let figmaNodeUrl`, the `@FigmaEnum`/`@FigmaString`/`@FigmaBoolean` prop
   wrappers, and a `var body: some View`.
3. `figma connect publish`.

## Notes / to verify
- If the publish can't resolve `ZegoButton`, add the Swift resolution keys the
  current docs specify to `figma.config.json` (e.g. `importPaths` / `paths` /
  `xcodeprojPath`) — these have changed across versions.
- Figma is moving to a single **template-file** format; the Swift parser still
  works but check https://developers.figma.com/docs/code-connect/swiftui/ for the
  latest before a big rollout.
