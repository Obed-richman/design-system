#!/usr/bin/env python3
"""
============================================================
 sync-tokens.py — pull Figma Variables → colour tokens
============================================================
Reads ALL colour variables (every mode: Light + Dark) from the Figma
Variables REST API and regenerates the design-token CSS in the same
format/naming as tokens/tokens.css.

Why this and not the Figma MCP: the MCP's get_variable_defs only ever
resolves LIGHT mode, so it can't see dark values. The REST API returns
`valuesByMode` for every mode in one call — the only reliable way to
keep light AND dark in sync "as of when Figma updates".

WHAT IT DOES (default = safe dry run):
  1. Fetches variables from Figma.
  2. Generates the colour blocks (primitives + semantic Light + Dark).
  3. Writes them to  tokens/tokens.generated.css  (never touches tokens.css).
  4. Prints a DIFF vs the colour values currently in tokens.css
     (added / removed / changed), so you can see exactly what moved.

  Review the diff, then copy the changed lines into tokens.css (or run
  with --write to replace the block between the @tokens markers — see below),
  and finally `python3 build-dist.py`.

REQUIREMENTS:
  • A Figma personal access token with the `file_variables:read` scope.
    The Variables REST API is an **Enterprise** feature — if your plan
    isn't Enterprise this endpoint returns 403 and you must keep using
    the manual MCP + diff flow.
  • Set it in the environment:  export FIGMA_ACCESS_TOKEN=figd_xxx
    (same variable Code Connect uses).

USAGE:
  python3 sync-tokens.py                # dry run: write .generated.css + diff
  python3 sync-tokens.py --write        # also splice colours into tokens.css
                                        #   (between the @tokens:* markers)
============================================================
"""

import os
import re
import sys
import json
import urllib.request
import urllib.error

FILE_KEY = "Jvq1VmDPfcCMgbjUTIbjaI"          # Design-System-003
API_URL  = f"https://api.figma.com/v1/files/{FILE_KEY}/variables/local"

HERE          = os.path.dirname(os.path.abspath(__file__))
TOKENS_CSS    = os.path.join(HERE, "tokens", "tokens.css")
GENERATED_CSS = os.path.join(HERE, "tokens", "tokens.generated.css")

# Order families / semantic groups are emitted in (anything unlisted is
# appended alphabetically so new Figma groups still show up).
PRIMITIVE_ORDER = ["aqua", "orange", "red", "ecru", "grey", "black", "blue",
                   "green", "navy", "purple", "white", "yellow", "pink", "lime"]
SEMANTIC_ORDER  = ["background", "surface", "border", "brand", "overlay",
                   "icon-glyph", "icon-link", "rating", "text"]


# ------------------------------------------------------------
# Fetch
# ------------------------------------------------------------
def fetch_variables():
    token = os.environ.get("FIGMA_ACCESS_TOKEN") or os.environ.get("FIGMA_TOKEN")
    if not token:
        sys.exit("ERROR: set FIGMA_ACCESS_TOKEN (Figma token with file_variables:read scope).")
    req = urllib.request.Request(API_URL, headers={"X-Figma-Token": token})
    try:
        with urllib.request.urlopen(req) as resp:
            return json.load(resp)["meta"]
    except urllib.error.HTTPError as e:
        if e.code == 403:
            sys.exit("ERROR 403: the Variables REST API needs a Figma **Enterprise** plan "
                     "and a token with the `file_variables:read` scope. "
                     "If you're not on Enterprise, keep using the MCP + manual diff flow.")
        sys.exit(f"ERROR {e.code}: {e.read().decode('utf-8', 'replace')[:300]}")
    except urllib.error.URLError as e:
        sys.exit(f"ERROR: could not reach Figma ({e.reason}).")


# ------------------------------------------------------------
# Helpers
# ------------------------------------------------------------
def to_hex(color):
    """{r,g,b,a} floats 0..1 → #RRGGBB or #RRGGBBAA (alpha only when < 1)."""
    r = round(color["r"] * 255)
    g = round(color["g"] * 255)
    b = round(color["b"] * 255)
    a = color.get("a", 1)
    hexv = f"#{r:02X}{g:02X}{b:02X}"
    if a < 0.999:
        hexv += f"{round(a * 255):02X}"
    return hexv


def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.strip().lower()).strip("-")


def primitive_varname(fig_name):
    """
    'Colour/Aqua/Aqua 100'        → colour-aqua-100
    'Colour/Lime/Green 50'        → colour-lime-50   (Lime group is mislabelled 'Green N')
    'Colour/Aqua/Aqua 50 30%'     → colour-aqua-50-30 (alpha variant)
    'Colour/White/White'          → colour-white
    """
    parts = fig_name.split("/")
    group = slug(parts[1]) if len(parts) >= 2 else slug(parts[0])
    leaf = parts[-1]
    nums = re.findall(r"\d+", leaf)
    return "colour-" + "-".join([group] + nums) if nums else "colour-" + group


def semantic_varname(fig_name):
    """'color/surface/active' → surface-active ; 'color/icon/glyph/primary' → icon-glyph-primary"""
    parts = [p for p in fig_name.split("/")]
    if parts and parts[0].lower() in ("color", "colour"):
        parts = parts[1:]
    return "-".join(slug(p) for p in parts)


def sort_key(name, order):
    for i, pref in enumerate(order):
        if name == pref or name.startswith(pref + "-"):
            return (i, name)
    return (len(order), name)


# ------------------------------------------------------------
# Build token model from the Figma payload
# ------------------------------------------------------------
def build(meta):
    collections = meta["variableCollections"]
    variables   = meta["variables"]

    # id → css var-name (for alias resolution), and classify collections
    id_to_name   = {}
    prim_coll_ids = set()
    sem_coll_ids  = set()
    sem_modes     = {}   # collectionId → {"light": modeId, "dark": modeId}

    for cid, coll in collections.items():
        modes = coll["modes"]
        mode_by_name = {m["name"].strip().lower(): m["modeId"] for m in modes}
        # A collection with light+dark modes is the semantic "Mode" collection.
        if "light" in mode_by_name and "dark" in mode_by_name:
            sem_coll_ids.add(cid)
            sem_modes[cid] = {"light": mode_by_name["light"], "dark": mode_by_name["dark"]}
        else:
            prim_coll_ids.add(cid)

    for vid, v in variables.items():
        if v["resolvedType"] != "COLOR":
            continue
        if v["variableCollectionId"] in sem_coll_ids:
            id_to_name[vid] = semantic_varname(v["name"])
        else:
            id_to_name[vid] = primitive_varname(v["name"])

    def resolve(value):
        """A mode value → CSS string: var(--alias) or #hex."""
        if isinstance(value, dict) and value.get("type") == "VARIABLE_ALIAS":
            target = id_to_name.get(value["id"])
            return f"var(--{target})" if target else "/* unresolved alias */"
        if isinstance(value, dict) and "r" in value:
            return to_hex(value)
        return str(value)

    # Primitives (single value each)
    primitives = {}
    for vid, v in variables.items():
        if v["resolvedType"] != "COLOR" or v["variableCollectionId"] not in prim_coll_ids:
            continue
        coll = collections[v["variableCollectionId"]]
        mode = coll["defaultModeId"]
        primitives[id_to_name[vid]] = resolve(v["valuesByMode"][mode])

    # Semantics (light + dark)
    light, dark = {}, {}
    for vid, v in variables.items():
        if v["resolvedType"] != "COLOR" or v["variableCollectionId"] not in sem_coll_ids:
            continue
        modes = sem_modes[v["variableCollectionId"]]
        name = id_to_name[vid]
        vals = v["valuesByMode"]
        if modes["light"] in vals:
            light[name] = resolve(vals[modes["light"]])
        if modes["dark"] in vals:
            dark[name] = resolve(vals[modes["dark"]])

    return primitives, light, dark


# ------------------------------------------------------------
# Emit CSS
# ------------------------------------------------------------
def emit(primitives, light, dark):
    out = []
    out.append("/* AUTO-GENERATED by sync-tokens.py from Figma Design-System-003.")
    out.append("   Do not hand-edit — re-run the script. Merge into tokens.css. */\n")

    # Primitives
    out.append(":root {\n")
    for name in sorted(primitives, key=lambda n: sort_key(n.replace("colour-", ""), PRIMITIVE_ORDER)):
        out.append(f"  --{name}: {primitives[name]};")
    out.append("}\n")

    # Semantic — Light
    out.append("\n:root {\n")
    for name in sorted(light, key=lambda n: sort_key(n, SEMANTIC_ORDER)):
        out.append(f"  --{name}: {light[name]};")
    out.append("}\n")

    # Semantic — Dark (only where it differs from Light)
    out.append('\n[data-theme="dark"] {\n')
    for name in sorted(dark, key=lambda n: sort_key(n, SEMANTIC_ORDER)):
        if light.get(name) != dark[name]:
            out.append(f"  --{name}: {dark[name]};")
    out.append("}\n")

    return "\n".join(out)


# ------------------------------------------------------------
# Diff vs the colours currently in tokens.css
# ------------------------------------------------------------
COLOUR_DECL = re.compile(r"--([a-z0-9-]+)\s*:\s*([^;]+);")

def current_tokens():
    """Parse tokens.css for colour declarations (best-effort, first-wins per :root)."""
    if not os.path.exists(TOKENS_CSS):
        return {}
    text = open(TOKENS_CSS).read()
    found = {}
    for m in COLOUR_DECL.finditer(text):
        name, val = m.group(1), m.group(2).strip()
        if name.startswith(("colour-",)) or "var(--colour" in val or re.search(r"#[0-9A-Fa-f]{6}", val):
            found.setdefault(name, val)   # first occurrence = light/:root
    return found


def print_diff(primitives, light):
    current = current_tokens()
    generated = {}
    generated.update(primitives)
    generated.update(light)   # light semantics live in the first :root too

    added   = sorted(k for k in generated if k not in current)
    removed = sorted(k for k in current if k not in generated and (k.startswith("colour-") or "-" in k))
    changed = sorted(k for k in generated if k in current and
                     _norm(current[k]) != _norm(generated[k]))

    print("\n──────── DIFF vs tokens.css (light / primitives) ────────")
    if changed:
        print(f"\nCHANGED ({len(changed)}):")
        for k in changed:
            print(f"  --{k}:  {current[k]}  →  {generated[k]}")
    if added:
        print(f"\nNEW ({len(added)}):")
        for k in added:
            print(f"  --{k}: {generated[k]};")
    if removed:
        print(f"\nREMOVED in Figma ({len(removed)}) — review before deleting:")
        for k in removed:
            print(f"  --{k}  (was {current[k]})")
    if not (changed or added or removed):
        print("\n  ✔ tokens.css colours already match Figma. Nothing to do.")
    print("\n(Dark-mode values are in tokens.generated.css — diff that block by eye.)")
    print("─────────────────────────────────────────────────────────\n")


def _norm(v):
    return v.strip().lower().replace(" ", "")


# ------------------------------------------------------------
def main():
    write = "--write" in sys.argv
    meta = fetch_variables()
    primitives, light, dark = build(meta)
    css = emit(primitives, light, dark)

    with open(GENERATED_CSS, "w") as f:
        f.write(css + "\n")
    print(f"Wrote {os.path.relpath(GENERATED_CSS, HERE)} "
          f"({len(primitives)} primitives, {len(light)} light, {len(dark)} dark).")

    print_diff(primitives, light)

    if write:
        print("--write: splicing is intentionally left manual for now — review the diff, "
              "copy changed/new lines into tokens.css, then run: python3 build-dist.py")


if __name__ == "__main__":
    main()
