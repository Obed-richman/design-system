# fonts/

Drop your `.woff2` font files here. The `@font-face` declarations in
`tokens/tokens.css` already point to this folder, so once the files are
present they will load automatically.

## Expected files

| File | Family | Weight |
|---|---|---|
| `ModernEra-Regular.woff2` | Modern Era | 400 |
| `ModernEra-Medium.woff2` | Modern Era | 500 |
| `ModernEra-Bold.woff2` | Modern Era | 700 |
| `UKNumberPlate-Regular.woff2` | UKNumberPlate | 400 |

## Where to get them

- **Modern Era** — licensed from [Mass-Driver](https://mass-driver.com/typefaces/modern-era)
- **UKNumberPlate** — licensed from your font provider

## Notes

- Only `.woff2` is needed (best compression, supported by all modern browsers).
- Font files are git-ignored by default — add them to `.gitignore` if they
  are not already excluded, to avoid committing large binaries.
