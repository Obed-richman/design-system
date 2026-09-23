#!/usr/bin/env python3
"""Refresh the Zego Design System artifact from this repository.

Two steps (see README.md in this folder for the whole procedure):

  python3 design-system-artifact/sync.py plan  --current <dir>
      Lists the images/SVGs that are new or changed since the last sync and
      must be uploaded to the artifact first (writes <out>/uploads.json).

  python3 design-system-artifact/sync.py build --current <dir> [--new-ids ids.txt]
      Writes only the artifact files that changed under <out>/project/, plus
      <out>/changed.json (paths to publish) and <out>/report.md.

<dir> holds the artifact's current files as read back from it (…/project/tokens.json,
…/project/sync-state.json, …/project/design-system.json, READMEs). It may be
empty for a first build.

Merge rules: code-derived files (tokens' values, previews, bundle, fonts) always
follow the repo. Prose (README.md, component READMEs, asset-group READMEs, the
cover, token usage notes) is regenerated only if nobody edited it on the page
since the last sync; edits made on the page win. Tokens and components that
exist in the artifact but no longer in the repo are kept and listed in the report.
Standard library only.
"""
import argparse, glob, hashlib, json, os, re, subprocess, sys
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
CONFIG = {
    'artifact': 'https://claude.ai/artifact/5ARYAe1p5SD3MsJ1H2wKNv',
    'title': 'Zego', 'namespace': 'ZegoDS', 'repo': 'Obed-richman/design-system',
}
ASSET_GROUPS = [('Logos', 'brand/', 'l'), ('Icons', 'icons/', 'xs'), ('Flags', 'assets/flags/', 's'),
                ('Partners', 'assets/partners/', 'm'), ('Rewards', 'assets/rewards/', 'm'),
                ('Illustrations', 'assets/loading/', 'l')]
LOGO_ORDER = ['zego-logo.svg', 'zego-logo-mark.svg', 'zego-standard.svg', 'zego-sense.svg',
              'zego-sense-mono.svg', 'zego-food-delivery.svg']
TYPES = {'svg': 'image/svg+xml', 'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'webp': 'image/webp', 'gif': 'image/gif'}

def sha(b):
    if isinstance(b, str): b = b.encode('utf-8')
    return hashlib.sha256(b).hexdigest()
def rd(p): return open(os.path.join(REPO, p), encoding='utf-8').read()
def git(*a):
    return subprocess.run(['git', '-C', REPO] + list(a), capture_output=True, text=True).stdout.strip()

# ====================================================================== assets
def asset_files():
    out = []
    for g, prefix, _ in ASSET_GROUPS:
        for f in sorted(glob.glob(os.path.join(REPO, prefix, '*'))):
            ext = f.rsplit('.', 1)[-1].lower()
            if os.path.isfile(f) and not os.path.islink(f) and ext in TYPES:
                out.append((g, prefix, os.path.relpath(f, REPO)))
    return out

# ====================================================================== tokens
def parse_tokens():
    tok = rd('tokens/tokens.css')
    tok = re.sub(r'/\*.*?\*/', lambda m: m.group(0) if '\n' not in m.group(0) else '', tok, flags=re.S)
    def blocks(css):
        out, i = [], 0
        pat = re.compile(r'(@media[^{]*|:root|\[data-theme="dark"\])\s*\{')
        while True:
            m = pat.search(css, i)
            if not m: break
            sel = m.group(1).strip(); start = m.end(); depth = 1; j = start
            while depth:
                depth += {'{': 1, '}': -1}.get(css[j], 0); j += 1
            body = css[start:j - 1]
            if sel.startswith('@media'):
                out += [(s2, sel, b2) for s2, _, b2 in blocks(body)]
            else:
                out.append((sel, None, body))
            i = j
        return out
    light, dark, media_over, comments, order = {}, {}, {}, {}, []
    for sel, media, body in blocks(tok):
        for m in re.finditer(r'--([A-Za-z0-9-]+)\s*:\s*([^;]+);[ \t]*(?:/\*\s*(.*?)\s*\*/)?', body):
            n, v, c = m.group(1), m.group(2).strip(), m.group(3) or ''
            if c: comments.setdefault(n, c)
            if media: media_over.setdefault(media, []).append((n, v))
            elif sel == ':root':
                if n not in light: order.append(n)
                light[n] = v
            else: dark[n] = v
    return light, dark, media_over, comments, order

FAMILY_NOTE = {
    'aqua': 'Aqua — the brand CTA hue', 'orange': 'Orange — warning hue', 'red': 'Red — error hue',
    'ecru': 'Ecru — warm brand neutral', 'grey': 'Grey — cool neutral', 'black': 'Black — ink and dark-mode surfaces',
    'blue': 'Blue — information hue', 'green': 'Green — success hue', 'navy': 'Navy — primary brand colour',
    'purple': 'Purple — brand accent and links', 'white': 'White', 'yellow': 'Yellow — brand 4 highlight',
    'pink': 'Pink', 'lime': 'Lime — driver-score "great" tier',
}
PREFIX = {
    'background': 'Page and section background', 'surface': 'Fill for cards, controls and panels',
    'border': 'Border and divider colour', 'brand': 'Brand colour', 'rating': 'Driver-score rating colour',
    'overlay': 'Scrim / wash colour', 'icon-glyph': 'Icon glyph colour', 'icon-link': 'Icon colour inside links',
    'text': 'Text colour',
}
MOD = {
    'primary': 'primary', 'secondary': 'secondary', 'tertiary': 'tertiary', 'inverse': 'inverse (opposite of the page)',
    'disabled': 'disabled state', 'hover': 'hover state', 'pressed': 'pressed state', 'focus': 'focus state',
    'active': 'active / selected state', 'success': 'success status', 'error': 'error status',
    'warning': 'warning status', 'information': 'information status', 'on-color': 'on coloured fills',
    'on-light': 'on light grounds', 'on-dark': 'on dark (navy) grounds', 'low': 'low emphasis (tint)',
    'medium': 'medium emphasis', 'high': 'high emphasis', 'link': 'links', 'page': 'app shell',
    'excellent': 'Excellent tier', 'great': 'Great tier', 'good': 'Good tier', 'improving': 'Improving tier', 'risk': 'At-risk tier',
}
OVR = {
    'background-primary': 'Default page background (warm ecru; black-80 in dark).',
    'background-secondary': 'Alternate cool-grey page background.',
    'background-tertiary': 'White page background for dense forms.',
    'background-page': 'App-shell background behind content (repo addition, not a Figma token).',
    'surface-primary': 'Cards, modals and inputs on any background.',
    'surface-active': 'Aqua fill for primary buttons and selected controls; pair with `text-primary-fixed`.',
    'surface-brand-3-high': 'Navy panels (headers, footers, rating strip); pair with `text-on-color`.',
    'brand-1-medium': 'Brand aqua — primary CTA colour.',
    'brand-3-high': 'Brand navy — the primary brand colour.',
    'brand-2-high': 'Brand purple.', 'brand-2-medium': 'Brand light purple.',
    'text-primary': 'Body copy and headings on `background-primary`, `surface-primary` and `surface-secondary`.',
    'text-on-color': 'Text on filled status and navy surfaces (white in light, black-80 in dark).',
    'text-link': 'Links on `surface-primary` and `background-primary`.',
    'border-focus': 'Focus ring colour (aqua 50 at 30%), drawn 4px wide via `shadow-focus`.',
}

def build_tokens(ref):
    light, dark, media_over, comments, order = parse_tokens()
    is_color = lambda v: bool(re.match(r'#[0-9A-Fa-f]{3,8}$', v)) or v.startswith('var(--colour') or v.startswith('rgb')
    alias = lambda v: ('{%s}' % re.match(r'var\(--([A-Za-z0-9-]+)\)$', v).group(1)) if re.match(r'var\(--([A-Za-z0-9-]+)\)$', v) else v.lower()
    def resolve(n, theme):
        v = (dark.get(n, light.get(n)) if theme == 'dark' else light.get(n))
        while v and v.startswith('var('):
            k = re.match(r'var\(--([^)]+)\)', v).group(1)
            v = light[k] if k.startswith('colour') or theme == 'light' else dark.get(k, light[k])
        return v
    def lum(h):
        h = h.lstrip('#')[:6]
        f = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
        r, g, b = [f(int(h[i:i + 2], 16) / 255) for i in (0, 2, 4)]
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    def cr(a, b):
        la, lb = lum(a), lum(b)
        return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)
    refs = {}
    for src in (light, dark):
        for n, v in src.items():
            m = re.match(r'var\(--(colour-[a-z0-9-]+)\)', v)
            if m and not n.startswith('colour'):
                refs.setdefault(m.group(1), set()).add(n)

    def prim_usage(n):
        parts = n.split('-')[1:]
        fam, step = parts[0], parts[1] if len(parts) > 1 else ''
        alpha = parts[2] if len(parts) > 2 else ''
        if fam == 'white':
            s = 'White' + (f' at {step}% alpha' if step else '') + '.'
        else:
            s = f'{FAMILY_NOTE.get(fam, fam.title())}, step {step} (10 lightest → 100 darkest)' + (f' at {alpha}% alpha.' if alpha else '.')
        r = sorted(refs.get(n, []))
        s += (' Primitive: used through ' + ', '.join('`%s`' % x for x in r[:6]) + ('…' if len(r) > 6 else '') + '.') if r \
            else ' Primitive: not referenced by a semantic token; do not use directly in components.'
        if comments.get(n): s += ' Source note: ' + comments[n]
        return s

    def sem_usage(n):
        if n in OVR:
            s = OVR[n]
        else:
            pre = next((p for p in sorted(PREFIX, key=len, reverse=True) if n.startswith(p + '-')), None)
            r = n[len(pre) + 1:] if pre else n
            words = []
            fixed = r.endswith('-fixed')
            if fixed: r = r[:-6]
            m = re.match(r'(brand-\d)(.*)', r)
            if m:
                words.append(m.group(1).replace('-', ' ')); r = m.group(2).lstrip('-')
            for k in sorted(MOD, key=len, reverse=True):
                if r == k or r.startswith(k + '-') or r.endswith('-' + k) or ('-' + k + '-') in r:
                    words.append(MOD[k]); r = re.sub(r'(^|-)' + re.escape(k) + r'($|-)', '-', r).strip('-')
            if r: words.append(r.replace('-', ' '))
            s = PREFIX.get(pre, 'Colour') + (' — ' + ', '.join(words) if words else '') + '.'
            if fixed: s += ' Fixed: keeps its light value in dark mode.'
        if comments.get(n) and 'Figma:' not in comments[n] and not comments[n].startswith('#'):
            s += ' Source note: ' + comments[n]
        if n.startswith('text-') and 'on-color' not in n and 'on-dark' not in n:
            gl, gd = resolve('surface-primary', 'light'), resolve('surface-primary', 'dark')
            cl = cr(resolve(n, 'light'), gl)
            cd = cl if 'fixed' in n else cr(resolve(n, 'dark'), gd)
            fails = [f'{t} {c:.1f}:1' for t, c in (('light', cl), ('dark', cd)) if c < 4.5]
            if fails and 'disabled' not in n:
                s += ' Contrast on `surface-primary`: ' + ', '.join(fails) + ' — below 4.5:1 for body text; kept exact from source, use at 24px+ / bold or pair with an icon.'
        return s

    color_tokens = []
    for n in [n for n in order if is_color(light[n])]:
        lv = alias(light[n])
        val = {'light': lv, 'dark': alias(dark[n])} if n in dark and dark[n] != light[n] else lv
        color_tokens.append({'name': n, 'value': val, 'usage': prim_usage(n) if n.startswith('colour-') else sem_usage(n)})

    desk = {}
    for med, lst in media_over.items():
        for n, v in lst: desk.setdefault(n, (med, v))
    def resp(n):
        if n in desk:
            med, v = desk[n]
            return f' Becomes {v} on {"desktop (≥768px)" if "min-width" in med else "mobile (≤767px)"}; that override ships in bundle.css.'
        return ''
    lits = lambda p: [(n, light[n]) for n in order if n.startswith(p)]
    simple = lambda p, fn: [{'name': n, 'value': v, 'usage': fn(n, v)} for n, v in lits(p)]
    GAP = {'gap-none': 'No gap.', 'gap-xx-small': 'Icon-to-label gaps, tight stacks.', 'gap-x-small': 'Gaps inside controls and chips.',
           'gap-small': 'Button vertical padding; row gaps in lists.', 'gap-medium': 'Card padding on mobile; form field gaps.',
           'gap-large': 'Button horizontal padding; card padding on desktop.', 'gap-x-large': 'Gaps between sections inside a card.',
           'gap-xx-large': 'Gaps between page sections.', 'gap-xxx-large': 'Large layout gaps.'}
    RAD = {'radius-none': 'Square corners.', 'radius-x-small': 'Small tags and inner chips.', 'radius-small': 'Inputs, number items, rounded buttons.',
           'radius-medium': 'Cards, alerts and panels.', 'radius-large': 'Large cards, modals, date picker.',
           'radius-x-large': 'Page content wrappers on desktop.', 'radius-round': 'Pills, FABs, discs, toggles.'}
    BW = {'border-none': 'No border.', 'border-s': 'Default hairline for inputs, dividers and cards.', 'border-m': 'Emphasised borders (selected tiles, number items).',
          'border-l': 'Heavy borders.', 'border-focused': 'Focus ring width (used by `shadow-focus`).', 'border-icon': 'Icon stroke / badge ring width.'}
    LS = {'letter-spacing-tight': 'Display and titles.', 'letter-spacing-snug': 'Title 4 Regular.',
          'letter-spacing-normal': 'Subtitles, body, metadata.', 'letter-spacing-wide': 'Number plates.'}
    spacing = [{'name': n, 'value': v, 'usage': GAP.get(n, 'Component gap.')} for n, v in lits('gap-')]
    spacing += [{'name': n, 'value': v, 'usage': 'Page-level vertical rhythm step.' + resp(n)} for n, v in lits('spacer-')]

    typo = rd('tokens/typography.css')
    USE_T = {'display': 'Hero statements on marketing pages.', 'title-1': 'Page titles on desktop.', 'title-2': 'Section titles.',
             'title-3': 'Page headings (desktop partner of Title 4+ on mobile).', 'title-4-plus': 'Mobile page headings.', 'title-4': 'Card and dialog titles.',
             'subtitle': 'Labels, list titles and emphasised UI text.', 'body': 'Running copy and descriptions.', 'metadata': 'Captions, timestamps, small print.',
             'plate': 'UK vehicle registrations only.'}
    styles = []
    for m in re.finditer(r'\.([a-z0-9-]+)\s*\{([^}]*)\}', typo.split('@media')[0]):
        name, body = m.group(1), m.group(2)
        g = lambda k: re.search(k + r'\s*:\s*var\(--([a-z0-9-]+)\)', body).group(1)
        st = {'name': name, 'fontSize': light[g('font-size')], 'lineHeight': light[g('line-height')],
              'fontWeight': int(light[g('font-weight')]), 'letterSpacing': light[g('letter-spacing')],
              'family': 'family-plate' if 'plate' in g('font-family') else 'family-base'}
        mob = desk.get(g('font-size'))
        tail = (f'Desktop size; {mob[1]}/{desk.get(g("line-height"), (0, light[g("line-height")]))[1]} below 768px.' if mob else 'Same size on every breakpoint.')
        k = next((k for k in sorted(USE_T, key=len, reverse=True) if name.startswith(k)), None)
        st['usage'] = (USE_T[k] + ' ' if k else '') + tail
        st['sample'] = 'ZZ24 EGO' if 'plate' in name else ('Insurance that fits the way you drive' if name[0] in 'dt' else 'Cover starts today and renews automatically.')
        styles.append(st)
    grp = lambda nm, pred, fam='family-base': {'name': nm, 'family': fam, 'styles': [s for s in styles if pred(s['name'])]}
    groups = [grp('Display', lambda s: s.startswith('display')), grp('Title', lambda s: s.startswith('title')),
              grp('Subtitle', lambda s: s.startswith('subtitle')), grp('Body', lambda s: s.startswith('body')),
              grp('Metadata', lambda s: s == 'metadata'), grp('Plate', lambda s: s == 'plate-number', 'family-plate')]
    known = {s['name'] for gr in groups for s in gr['styles']}
    extra = [s for s in styles if s['name'] not in known]
    if extra: groups.append({'name': 'Other', 'family': 'family-base', 'styles': extra})

    fonts = []
    for f in sorted(glob.glob(os.path.join(REPO, 'fonts', '*'))):
        b = os.path.basename(f)
        m = re.match(r'ModernEra-(\w+)\.woff2$', b)
        wmap = {'Regular': '400', 'Medium': '500', 'Bold': '700', 'Black': '900'}
        if m and m.group(1) in wmap:
            fonts.append({'family': 'Modern Era', 'file': f'fonts/{b}', 'weight': wmap[m.group(1)], 'style': 'normal'})
        elif b.startswith('UKNumberPlate') and b.endswith(('.ttf', '.woff2')):
            fonts.append({'family': 'UKNumberPlate', 'file': f'fonts/{b}', 'weight': '400', 'style': 'normal'})
    fonts.sort(key=lambda x: (x['family'] != 'Modern Era', int(x['weight'])))

    focus_w = light.get('border-focused', '4px')
    focus_c = resolve('border-focus', 'light').lower()
    tokens = {
        'name': CONFIG['title'], 'version': 1,
        'meta': {'source': 'github', 'repo': CONFIG['repo'], 'ref': ref,
                 'paths': {'tokens': ['tokens/tokens.css', 'tokens/typography.css'], 'fonts': ['fonts/'],
                           'assets': ['brand/', 'icons/', 'assets/'], 'docs': ['README.md', 'KNOWN-ISSUES.md', 'components/*/*.css (header comments)']},
                 'producer': 'design-system-artifact/sync.py',
                 'synced': datetime.now(timezone.utc).strftime('%Y-%m-%d')},
        'color': {'themes': [{'id': 'light', 'name': 'Light'}, {'id': 'dark', 'name': 'Dark'}], 'tokens': color_tokens},
        'type': {'fonts': fonts,
                 'families': {'family-base': '"Modern Era", sans-serif', 'family-plate': 'UKNumberPlate, monospace'},
                 'groups': groups},
        'spacing': {'note': 'gap-* space elements inside components; spacer-* set page rhythm and scale up at 768px.', 'tokens': spacing},
        'radius': {'tokens': [{'name': n, 'value': v, 'usage': RAD.get(n, 'Corner radius.')} for n, v in lits('radius-')]},
        'shadow': {'tokens': [
            {'name': 'shadow-dropdown', 'value': light['shadow-dropdown'], 'usage': 'Dropdowns, tooltips and floating cards.'},
            {'name': 'shadow-focus', 'value': f'0 0 0 {focus_w} {focus_c}', 'usage': 'Focus ring: 4px (`border-focused`) of `border-focus` (aqua 50 at 30%). Source writes it with var(); literal here.'}]},
        'borderWidth': {'tokens': [{'name': n, 'value': light[n], 'usage': BW.get(n, 'Border width.')} for n in order if re.match(r'border-(none|s|m|l|focused|icon)$', n)]},
        'iconSize': {'tokens': simple('icon-size-', lambda n, v: f'Icon box size {v}.')},
        'frame': {'note': 'Mobile values; desktop values ship in bundle.css.', 'tokens': simple('frame-', lambda n, v: 'Layout frame width (mobile).' + resp(n))},
        'number': {'tokens': simple('number-', lambda n, v: 'Raw size primitive; prefer gap-, spacer- or radius- tokens.')},
        'fontSize': {'tokens': simple('font-size-', lambda n, v: 'Font size primitive behind the matching type style.' + resp(n))},
        'lineHeight': {'tokens': simple('line-height-', lambda n, v: 'Line height primitive behind the matching type style.' + resp(n))},
        'fontWeight': {'tokens': simple('font-weight-', lambda n, v: 'Modern Era weight.')},
        'letterSpacing': {'tokens': simple('letter-spacing-', lambda n, v: LS.get(n, 'Letter spacing.'))},
    }
    placed = {t['name'] for k, v in tokens.items() if isinstance(v, dict) and 'tokens' in v for t in v['tokens']} | {'font-family-base', 'font-family-plate'}
    unplaced = [n for n in order if n not in placed]
    return tokens, media_over, unplaced

# ====================================================================== components
GROUPS = {
    'Actions': 'button segment toggle tab tab-bar pagination',
    'Forms': 'input search checkbox radio radio-list choice-selector conditional-selector optional-input acknowledge text-icon-item number-item date-picker discount-code vehicle-registration address-lookup filter-select dropdown-item dropdown-list payment-details payment-set plate',
    'Feedback': 'alert global-alert warning spinner bounce status-label status-dot tooltip notice-toggle modal side-modal overlay',
    'Navigation': 'top-nav sales-nav mobile-nav bottom-nav side-nav header-controls onboarding-steps onboarding-header top-progress track-item stepper control-set',
    'Cards': 'callout-card action-tile display-tile tile-list highlight-card detail-card info-field thumbnail icon-plus marketing-banner rewards-tile progress-card policy-card-large policy-dash-card accordion',
    'Lists and tables': 'display-row list-item row-list bullet-points divider data-table table-row table-item',
    'Pricing and cover': 'price-card price-comparison comparison-tile tier-card tier-section extra-cover addons-section product-card total-cost',
    'Driver score': 'driver-rating driver-ratings-card rating-badge rating-strip factor-indicator factor-control counter-ring progress-track',
    'Brand and trust': 'trustpilot trustpilot-lockup trustpilot-reviews aggregator-partners partner-logo footer-sales driving-licence',
}
GROUP_OF = {c: g for g, cs in GROUPS.items() for c in cs.split()}
SUMMARY = {
    'alert': 'An inline message that reports neutral, information, positive, warning or negative news in context, with an optional title, description, link and dismiss.',
    'button': 'The action control, in primary, secondary and tertiary hierarchy and pill, rounded, FAB or text style.',
    'checkbox': 'A square control for independent on/off choices, in large (20px) and small (16px) sizes.',
    'input': 'The text input: label, field, hint and error message, with valid, error and disabled states.',
    'radio': 'A single-choice control, drawn as a filled dot or as a check circle.',
    'toggle': 'An on/off switch, as an OS-style pill track or a thin web rail.',
    'action-tile': 'A tappable tile pairing an Icon+ badge with a short label on a white elevated card.',
    'bounce': 'A pulsing dot animation, used alone or as a staggered three-dot loader.',
    'callout-card': 'A compact add-on card: an Icon+ badge, an optional status label, a title and description, and an optional More details link.',
    'conditional-selector': 'A question whose answer reveals an additional input field only when a specific option is chosen.',
    'factor-control': 'A telematics factor row: a labelled icon (with optional help icon) above a Factor Indicator bar.',
    'payment-details': 'The card payment form: payment-method selector, card inputs, country and postcode, disclosures and consent.',
    'payment-set': 'A row of accepted payment brand marks that reassures users about the available payment options.',
    'policy-card-large': 'A large policy card with registration, cover type, a lifecycle status band and Documents / Policy details actions.',
    'policy-dash-card': 'A compact dashboard policy card: registration, overflow menu, a status dot with label and contextual actions.',
    'progress-card': 'A card with an amount block (tag, title, support) over a stepper of done and remaining step icons.',
    'spinner': 'A rotating loading wheel with a tapered arc, rendered dark on light and white on dark.',
    'status-dot': 'A small coloured dot that signals status beside a label or within a row.',
    'thumbnail': 'A tinted feature thumbnail holding a swappable Icon+-style badge, with a disabled state.',
    'list-item': 'A flexible list row: leading icon or checkbox, title and description, trailing text and trailing controls.',
    'address-lookup': 'A UK address captured in three moves: postcode search, a dropdown of matches, then a populated or editable address.',
    'driver-ratings-card': "A card showing a driver's rating badge over a Driver Rating bar, with optional actions and in-progress states.",
    'price-card': 'A selectable tile for choosing between two ways of paying: product badge, radio, title and a tinted panel of figures with optional tags.',
    'bullet-points': 'A vertical list of tick bullet rows, such as a list of product benefits, with optional title, support lines and info icons.',
    'driving-licence': 'A stylised UK driving-licence card used as an illustration, for example to show where the licence number sits.',
    'onboarding-steps': 'A horizontal progress stepper (Quote → Details → Review → Payment) with a purple fill showing progress.',
    'bottom-nav': 'A mobile bottom navigation bar: each item is a 24px icon above a 12px bold label, with a filled icon for the active item.',
    'control-set': 'A toolbar row placed above a data table or list: a filter set (search, date range, Filter Select, Clear all) or a tabs row.',
    'radio-list': 'A stacked list of mutually-exclusive options: each row is a label and a trailing radio, separated by dividers.',
    'tab-bar': 'A full-width tab bar that lays out 2–5 equal-width Tab Items over a baseline track.',
    'icon-plus': 'A rounded, tinted square that holds ANY icon from the set (/icons).',
    'header-controls': 'The controls at the top of an internal-tool page: a header bar (search, notifications, profile), a title bar (Back, title, breadcrumb, actions) and a tabs Control Set.',
}

def title(n): return 'Icon+' if n == 'icon-plus' else n.replace('-', ' ').title()
def folder(n): return 'IconPlus' if n == 'icon-plus' else n.replace('-', ' ').title().replace(' ', '')

def header(n):
    s = rd(f'components/{n}/{n}.css')
    m = re.match(r'\s*/\*(.*?)\*/', s, re.S)
    out = []
    for l in [re.sub(r'^\s*\*\s?', '', l).rstrip() for l in (m.group(1) if m else '').split('\n')]:
        t = l.strip()
        if not t and not out: continue
        if t and set(t) <= set('=-'): continue
        if re.match(r'^[A-Z0-9 +/&()-]+COMPONENT', t) or re.match(r'^[A-Z][A-Z0-9 +/&()-]+$', t) and not out: continue
        if t.startswith('Figma source') or t.startswith('https://www.figma.com'): continue
        out.append(l)
    while out and not out[-1].strip(): out.pop()
    return '\n'.join(out)

def summary_of(n, hdr):
    if n in SUMMARY: return SUMMARY[n]
    flat = ' '.join(l.strip() for l in hdr.split('\n') if l.strip())
    m = re.match(r'(.+?[.!?])(\s|$)', flat)
    s = (m.group(1) if m else flat)[:300]
    s = re.sub(r'^[A-Z][A-Z0-9 +/-]*(\([^)]*\))?\s*(COMPONENT)?\s*(?=[A-Z][a-z])', '', s)
    s = re.sub(r'^(\([^)]*\))\s*COMPONENT\s*', '', s)
    return s or f'The {title(n)} component.'

def figma_props(n):
    f = os.path.join(REPO, 'components', n, n + '.figma.ts')
    if not os.path.exists(f): return []
    s = open(f).read(); rows = []
    for m in re.finditer(r'figma\.enum\("([^"]+)",\s*\{(.*?)\}\)', s, re.S):
        for k, v in re.findall(r'"?([A-Za-z0-9 +=/.-]+)"?\s*:\s*"([^"]*)"', m.group(2)):
            rows.append((m.group(1), k.strip(), v))
    for m in re.finditer(r'figma\.boolean\("([^"]+)"(?:,\s*\{(.*?)\})?\)', s, re.S):
        rows.append((m.group(1), 'true / false', 'toggle' if not m.group(2) else re.sub(r'\s+', ' ', m.group(2)).strip()[:80]))
    return rows

def component_readme(n):
    d = os.path.join(REPO, 'components', n)
    has_js = os.path.exists(os.path.join(d, n + '.js'))
    hdr = header(n) if os.path.exists(os.path.join(d, n + '.css')) else ''
    md = [f'# {title(n)}', '', summary_of(n, hdr), '', '## Using it', '',
          'Markup is plain HTML with BEM classes; copy the structure from the preview. Styles ship in `components/bundle.css`'
          + (' and behaviour in `components/bundle.js` (self-initialising, delegated listeners — no init call).' if has_js else '; it needs no JavaScript.'),
          'You supply the text, icons (inline SVG from the Icons group, which inherit `currentColor`) and any values. Dark mode follows a `data-theme="dark"` ancestor.', '']
    props = figma_props(n)
    if props:
        md += ['## Variants', '', 'Figma property → class to add (empty = the default, no class).', '',
               '| Figma property | Value | Class |', '| --- | --- | --- |']
        md += [f'| {p} | {k} | {("`" + v + "`") if v and v != "toggle" else ("—" if not v else v)} |' for p, k, v in props]
        md += ['']
    if hdr:
        md += ['## Notes from the source', '', '```text', hdr.replace('```', "'''"), '```', '']
    return '\n'.join(md)

def component_preview(n, blob):
    d = os.path.join(REPO, 'components', n)
    src = next((p for p in (os.path.join(d, n + '-demo.html'), os.path.join(d, n + '.html')) if os.path.exists(p)), None)
    if not src: return None
    h = open(src, encoding='utf-8').read()
    head_styles = re.findall(r'<style[^>]*>(.*?)</style>', h.split('<body')[0], re.S | re.I)
    bm = re.search(r'<body[^>]*>(.*)</body>', h, re.S | re.I)
    body = bm.group(1) if bm else h
    scripts = re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', body, re.S | re.I)
    body = re.sub(r'<script\b.*?</script>', '', body, flags=re.S | re.I)
    body = re.sub(r'<button class="btn btn--secondary btn--fab">←</button>', '', body)
    body = re.sub(r'<a class="btn[^"]*back-btn"[^>]*>.*?</a>', '', body, flags=re.S)
    body = re.sub(r'<h1\b[^>]*>.*?</h1>', '', body, count=1, flags=re.S | re.I)
    body = re.sub(r'<p class="subtitle">.*?</p>', '', body, count=1, flags=re.S | re.I)
    body = re.sub(r'<link\b[^>]*>', '', body)
    body = re.sub(r'<header class="header">.*?</header>', '', body, flags=re.S)
    style = '\n'.join(head_styles)
    def fix_body(m):
        b = m.group(1)
        b = re.sub(r'background(-color)?\s*:\s*#[0-9a-fA-F]{3,6}', 'background: var(--background-page)', b)
        b = re.sub(r'(?<![-\w])color\s*:\s*#[0-9a-fA-F]{3,6}', 'color: var(--text-primary)', b)
        b = re.sub(r'font-family\s*:\s*[^;]+', 'font-family: var(--font-family-base)', b)
        return 'body {' + b + '}'
    style = re.sub(r'body\s*\{([^}]*)\}', fix_body, style)
    style = re.sub(r'(h1|h2|\.subtitle|\.label|\.section-label|\.variant-label)\s*\{([^}]*)\}',
                   lambda m: m.group(1) + ' {' + re.sub(r'(?<![-\w])color\s*:\s*#[0-9a-fA-F]{3,6}', 'color: var(--text-pressed)', m.group(2)) + '}', style)
    rep = lambda s: re.sub(r'((?:\.\./)+)((?:assets|icons|brand)/[A-Za-z0-9_./-]+)', lambda m: blob.get(m.group(2), m.group(0)), s)
    style, body = rep(style), rep(body)
    height = max(160, min(1600, 60 + body.count('\n') * 6))
    doc = (f'<!-- @dsCard group="{GROUP_OF.get(n, "Other")}" height={height} -->\n'
           f'<style>\n{style}\n</style>\n<div class="ds-preview">\n{body.strip()}\n</div>\n')
    js = '\n'.join(scripts)
    if js.strip():
        doc += '<script>\n' + js.replace('</script', '<\\/script') + '\n</script>\n'
    return doc

def bundles(media_over, blob):
    typo = rd('tokens/typography.css')
    parts = ['/* Zego design system — component stylesheet, built from %s by design-system-artifact/sync.py.\n'
             '   Loaded after tokens.css. Holds what tokens.json cannot: responsive token overrides,\n'
             '   the typography classes with their mobile steps, and every component\'s CSS. */\n' % CONFIG['repo'],
             'body { font-family: var(--font-family-base); }\n[hidden] { display: none !important; }\n']
    for med, lst in media_over.items():
        parts.append(f'{med} {{\n  :root {{\n' + ''.join(f'    --{n}: {v};\n' for n, v in lst) + '  }\n}\n')
    parts.append('\n/* ==== tokens/typography.css ==== */\n' + re.sub(r'^\s*@import[^;]*;\s*$', '', typo, flags=re.M))
    for f in sorted(glob.glob(os.path.join(REPO, 'components', '*', '*.css'))):
        css = re.sub(r'^\s*@import[^;]*;\s*$', '', open(f, encoding='utf-8').read(), flags=re.M)
        css = re.sub(r"url\(['\"]?\.\./\.\./((?:assets|icons|brand)/[^'\")]+)['\"]?\)", lambda m: "url('%s')" % blob.get(m.group(1), m.group(0)), css)
        parts.append('\n/* ==== %s ==== */\n' % os.path.relpath(f, REPO) + css)
    css = '\n'.join(parts)
    if '</style' in css.lower(): sys.exit('bundle.css would contain </style — refusing')
    js = ['/* Zego design system — component behaviour, built from %s by design-system-artifact/sync.py.\n'
          '   Each block is a self-initialising IIFE using delegated document listeners. */\n'
          'window.ZegoDS = window.ZegoDS || { source: "%s", behaviours: [] };\n' % (CONFIG['repo'], CONFIG['repo'])]
    for f in sorted(glob.glob(os.path.join(REPO, 'components', '*', '*.js'))):
        js.append(f'\n/* ==== {os.path.relpath(f, REPO)} ==== */\nwindow.ZegoDS.behaviours.push("{os.path.basename(f)[:-3]}");\n' + open(f, encoding='utf-8').read())
    js = '\n'.join(js).replace('</script', '<\\/script').replace('<!--', '<\\!--')
    if re.search(r'\beval\s*\(|new Function', js): sys.exit('bundle.js would contain eval/new Function — refusing')
    return css, js

GROUP_README = {
 'Logos': """# Logos

- `zego-logo.svg` — the Zego wordmark. Single ink (`currentColor`): as an `<img>` it paints black; inline it to set `text-primary` on light grounds or white (`text-on-color-fixed`) on `brand-3-high` navy. Used in the top nav, sales nav and footers.
- `zego-logo-mark.svg` — the square Z mark, single ink. For favicons, avatars and tight spaces.
- `zego-standard.svg`, `zego-sense.svg` — product lockups in Navy 90 (`#00166C`) and Purple 50 (`#A458FF`). Place on light grounds only; never recolour.
- `zego-sense-mono.svg`, `zego-food-delivery.svg` — single-ink product lockups (`currentColor`), for navy or photographic grounds.

Keep clear space of at least the height of the Z around every mark. Never stretch, outline or redraw.
""",
 'Icons': """# Icons

The Zego icon set: 159 filled glyphs on a 24px grid, each `fill="currentColor"`. Inline the SVG so it takes `icon-glyph-*` colours; as an `<img>` it paints black. Size with the `icon-size-*` tokens (16 inside buttons, 24 default, 48 in an Icon+ badge).

Pairs signal state: `*-outline` for inactive, `*-filled` for active (bottom nav, points). Insurance-specific glyphs (`fully-comprehensive`, `third-party-only`, `tpo`, `ncd`, `excess-protection`, `legal-expenses`, `breakdown`, `business-van`, `private-hire`, `food-delivery`, `telematics`, `driver-score`) name Zego products; use them for those products only. `ncd.svg` is a protection shield also used for general cover.
""",
 'Flags': """# Flags

Full-colour country flags for the Vehicle Registration country badge and the Driving Licence illustration (`uk.svg`, `licence-eu.svg`). Render as `<img>` at their natural aspect ratio; never tint.
""",
 'Partners': """# Partners

Placeholder white wordmarks for the Aggregator Partners strip (Compare the Market, GoCompare, Confused.com, QuoteZone, MoneySuperMarket, InsureMy4Less, DriveScore). They are typographic stand-ins, not the official logos: replace each with the partner's official white/monochrome SVG, keeping the filename. White ink: show only on `brand-3-high` navy.
""",
 'Rewards': """# Rewards

Gift-card faces (Amazon, Just Eat, Starbucks, Tesco) for the Product Card rewards banner and the Zego Sense rewards stack. Third-party brand assets exported at ~5× the 82px they are drawn at. Show at their own colours with `radius-small` corners.
""",
 'Illustrations': """# Illustrations

`standard-cover.png` — the everyday-driving cards on the fetching-quote screen (Standard variant), exported at 3× (296×346 at 1×). Its `#F2EDE9` backdrop (`surface-primary-medium`, light) is baked in, so it shows as a beige block in dark mode. Use it on light grounds only until a transparent export exists. Decorative: `alt=""`.
""",
}

COVER = """<!-- @dsCard height=288 -->
<style>
  html, body { margin: 0; }
  .cover { position: relative; width: 960px; height: 288px; overflow: hidden; background: var(--background-primary); }
  .cover svg { position: absolute; inset: 0; }
  .navy   { fill: var(--brand-3-high); }
  .aqua   { fill: var(--brand-1-medium); }
  .purple { fill: var(--brand-2-medium); }
  .yellow { fill: var(--brand-4-medium); }
  .tint   { fill: var(--surface-primary-high); }
  .bar    { fill: var(--brand-1-medium); }
  [data-theme="dark"] .navy { fill: var(--brand-3-medium); }
  [data-theme="dark"] .bar  { fill: var(--brand-1-low); }
  .name { position: absolute; left: 48px; bottom: 76px; margin: 0; max-width: 440px;
          font-family: var(--font-family-base); font-weight: 700; font-size: 120px; line-height: .92;
          letter-spacing: -0.02em; color: var(--text-primary); }
  .tag { position: absolute; left: 50px; bottom: 40px; margin: 0; max-width: 440px;
         font-family: var(--font-family-base); font-size: 14px; line-height: 20px; color: var(--text-pressed); }
</style>
<div class="cover">
  <svg width="960" height="288" viewBox="0 0 960 288" aria-hidden="true">
    <!--
      blocks: brand-3-high navy slab 208x288 (radius-large) · brand-1-medium aqua pill 256x136 · brand-2-medium purple disc r64 · brand-4-medium yellow pill 96 wide · surface-primary-high ecru tint 112x112 (radius-medium)
      arrangement: one tall navy slab bleeding off the top with satellites — aqua pill off the top-right, yellow pill off the bottom-right, purple disc between
      pattern: pills (row "soft, friendly, large radii") — Zego's pill buttons, radius-round FABs and 16/24px card corners; four aqua bars stacked on the navy slab at gap-small pitch
      scales: bars 16 tall (spacer-16) at 28 pitch, radius-round; tiles radius-large 24 and radius-medium 16; everything right of x=480
    -->
    <rect class="tint"   x="496" y="176" width="112" height="112" rx="16"/>
    <rect class="navy"   x="544" y="-24" width="208" height="264" rx="24"/>
    <rect class="bar"    x="576" y="56"  width="144" height="16" rx="8"/>
    <rect class="bar"    x="576" y="84"  width="96"  height="16" rx="8"/>
    <rect class="bar"    x="576" y="112" width="144" height="16" rx="8"/>
    <rect class="bar"    x="576" y="140" width="64"  height="16" rx="8"/>
    <rect class="aqua"   x="768" y="-40" width="256" height="136" rx="68"/>
    <circle class="purple" cx="824" cy="176" r="64"/>
    <rect class="yellow" x="896" y="160" width="96" height="176" rx="48"/>
  </svg>
  <h1 class="name">Zego</h1>
  <p class="tag">Tokens, type and components for Zego's insurance products.</p>
</div>
"""

# ====================================================================== main
def load_current(cur):
    def j(p, default):
        f = os.path.join(cur, p)
        return json.load(open(f, encoding='utf-8')) if cur and os.path.exists(f) else default
    def t(p):
        f = os.path.join(cur, p)
        return open(f, encoding='utf-8').read() if cur and os.path.exists(f) else None
    return j, t

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('mode', choices=['plan', 'build'])
    ap.add_argument('--current', default='', help='folder holding the artifact\'s current project/ files (the project folder itself)')
    ap.add_argument('--new-ids', default='', help='lines "<repo path> <blob id>" for assets uploaded after plan')
    ap.add_argument('--out', default=os.path.join(REPO, '.ds-sync-out'))
    ap.add_argument('--by', default='Obed Richman')
    ap.add_argument('--via', default='')
    ap.add_argument('--branch', default='', help='branch label for the ref (default: the checked-out branch)')
    a = ap.parse_args()
    cur = os.path.abspath(a.current) if a.current else ''
    J, T = load_current(cur)
    state = J('sync-state.json', {'v': 1, 'assets': {}, 'generated': {}, 'usage': {}})
    prev_ref = state.get('ref')
    os.makedirs(a.out, exist_ok=True)

    # ---- assets: which need uploading?
    assets = asset_files()
    pending, blob_ids = [], {}
    for g, prefix, path in assets:
        h = sha(open(os.path.join(REPO, path), 'rb').read())
        rec = state['assets'].get(path)
        if rec and rec.get('sha256') == h:
            blob_ids[path] = rec['blob']
        else:
            pending.append({'path': path, 'abs': os.path.join(REPO, path), 'sha256': h})
    if a.new_ids:
        for line in open(a.new_ids):
            if line.strip():
                p, bid = line.split()
                if not re.match(r'^[0-9a-f]{32}$', bid): sys.exit(f'bad blob id for {p}')
                blob_ids[p] = bid
                h = next((x['sha256'] for x in pending if x['path'] == p), None)
                if h: state['assets'][p] = {'sha256': h, 'blob': bid}
        pending = [x for x in pending if x['path'] not in blob_ids]
    json.dump(pending, open(os.path.join(a.out, 'uploads.json'), 'w'), indent=1)
    if a.mode == 'plan':
        print(f'{len(pending)} asset(s) to upload; list in {a.out}/uploads.json')
        return
    if pending:
        sys.exit(f'{len(pending)} asset(s) still need uploading (see uploads.json); upload them and pass --new-ids')
    blob = {p: '/_blob/' + b for p, b in blob_ids.items()}

    head = git('rev-parse', '--short=7', 'HEAD') or 'unknown'
    branch = a.branch or git('rev-parse', '--abbrev-ref', 'HEAD') or 'main'
    ref = f'{branch}@{head}'
    now = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    files, report = {}, []          # path under project/ -> text or ('bin', abs path)
    kept_edits = []

    def editable(path, generated):
        """prose: regenerate unless the page edited it since the last sync."""
        current = T(path)
        last = state['generated'].get(path)
        if current is not None and last and sha(current) != last:
            kept_edits.append(path)
            return
        state['generated'][path] = sha(generated)
        if current != generated:
            files[path] = generated
    def derived(path, generated):
        if T(path) != generated:
            files[path] = generated
        state['generated'][path] = sha(generated)

    # ---- tokens (merge)
    tokens, media_over, unplaced = build_tokens(ref)
    cur_tokens = J('tokens.json', None)
    removed_tokens, changed_tokens, added_tokens = [], [], []
    if cur_tokens:
        cur_by = {}
        for fam, v in cur_tokens.items():
            if isinstance(v, dict) and isinstance(v.get('tokens'), list):
                for t in v['tokens']: cur_by[t['name']] = (fam, t)
        new_names = set()
        for fam, v in tokens.items():
            if not (isinstance(v, dict) and 'tokens' in v): continue
            for t in v['tokens']:
                new_names.add(t['name'])
                key = 'usage:' + t['name']
                if t['name'] in cur_by:
                    ct = cur_by[t['name']][1]
                    if ct.get('value') != t['value']: changed_tokens.append(t['name'])
                    last = state['usage'].get(key)
                    if last and sha(ct.get('usage', '')) != last:
                        t['usage'] = ct.get('usage', '')      # edited on the page: keep
                        state['usage'][key] = last
                        continue
                else:
                    added_tokens.append(t['name'])
                state['usage'][key] = sha(t['usage'])
        for name, (fam, t) in cur_by.items():
            if name not in new_names:
                removed_tokens.append(name)
                tokens.setdefault(fam, {'tokens': []}).setdefault('tokens', []).append(t)   # keep; ask before removing
        for k, v in cur_tokens.items():          # families / keys added on the page
            if k not in tokens: tokens[k] = v
        if isinstance(cur_tokens.get('type'), dict):
            for gr in tokens['type']['groups']:
                for st in gr['styles']:
                    old = next((s for g2 in cur_tokens['type'].get('groups', []) for s in g2.get('styles', []) if s.get('name') == st['name']), None)
                    key = 'style:' + st['name']
                    last = state['usage'].get(key)
                    if old and last and sha(old.get('usage', '')) != last:
                        st['usage'] = old['usage']; state['usage'][key] = last
                    else:
                        state['usage'][key] = sha(st['usage'])
    else:
        for fam, v in tokens.items():
            if isinstance(v, dict) and 'tokens' in v:
                for t in v['tokens']: state['usage']['usage:' + t['name']] = sha(t['usage'])
        for gr in tokens['type']['groups']:
            for st in gr['styles']: state['usage']['style:' + st['name']] = sha(st['usage'])
    tok_text = json.dumps(tokens, indent=1, ensure_ascii=False)
    old_tok = T('tokens.json')
    strip_meta = lambda s: re.sub(r'"(synced|ref)": "[^"]*"', '', s or '')
    if old_tok is None or strip_meta(old_tok) != strip_meta(tok_text):
        files['tokens.json'] = tok_text

    # ---- fonts (binary, by digest)
    for fnt in tokens['type']['fonts']:
        p = os.path.join(REPO, fnt['file'])
        h = sha(open(p, 'rb').read())
        if state['generated'].get(fnt['file']) != h:
            files[fnt['file']] = ('bin', p); state['generated'][fnt['file']] = h

    # ---- prose
    editable('README.md', open(os.path.join(HERE, 'brand-book.md'), encoding='utf-8').read())
    for g, txt in GROUP_README.items():
        editable(f'assets/{g}/README.md', txt)
    editable('components/Cover/preview.html', COVER)

    # ---- components
    names = sorted(os.path.basename(d[:-1]) for d in glob.glob(os.path.join(REPO, 'components', '*/')))
    for n in names:
        if n not in GROUP_OF: report.append(f'- New component `{n}` has no group yet; filed under "Other". Add it to GROUPS in sync.py.')
        editable(f'components/{folder(n)}/README.md', component_readme(n))
        pv = component_preview(n, blob)
        if pv: derived(f'components/{folder(n)}/preview.html', pv)
    css, js = bundles(media_over, blob)
    derived('components/bundle.css', css)
    derived('components/bundle.js', js)
    known_folders = {folder(n) for n in names} | {'Cover'}
    gone = sorted({p.split('/')[1] for p in state['generated'] if p.startswith('components/') and p.count('/') == 2} - known_folders)

    # ---- index (merge into the current one)
    idx = J('design-system.json', None)
    if idx is None:
        idx = {'v': 3, 'layout': 'files', 'createdOnFiles': {'v': 1, 'at': now}, 'title': CONFIG['title'],
               'namespace': CONFIG['namespace'], 'libraries': [], 'sections': {}, 'groups': [],
               'assetGroups': {}, 'blobs': {}, 'docs': {'readme': 'project/README.md', 'sections': []}}
    idx_before = json.dumps(idx, sort_keys=True)
    for g, prefix, tile in ASSET_GROUPS:
        entry = idx['assetGroups'].setdefault(g, {'name': g, 'tile': tile, 'order': [], 'files': {}})
        entry.setdefault('files', {}); entry.setdefault('order', [])
        for gg, pf, path in assets:
            if gg != g: continue
            name = path[len(prefix):]
            key = re.sub(r'[^A-Za-z0-9_./-]', lambda m: '~%02x' % ord(m.group(0)), name)
            entry['files'][key] = {'name': name, 'blob': blob_ids[path], 'size': os.path.getsize(os.path.join(REPO, path)),
                                   'type': TYPES[name.rsplit('.', 1)[-1].lower()]}
            if name not in entry['order']: entry['order'].append(name)
        if g == 'Logos':
            entry['order'] = [x for x in LOGO_ORDER if x in entry['order']] + [x for x in entry['order'] if x not in LOGO_ORDER]
        if g not in idx['groups']: idx['groups'].append(g)
    idx['title'] = idx.get('title') or CONFIG['title']
    idx['namespace'] = idx.get('namespace') or CONFIG['namespace']
    content_changed = bool(files) or json.dumps(idx, sort_keys=True) != idx_before

    # ---- report
    lines = [f'# Sync report — {CONFIG["repo"]} {ref}', '']
    lines.append(f'- Previous sync: {state.get("ref", "none")}')
    lines.append(f'- Files to publish: {len(files)}')
    if changed_tokens: lines.append(f'- Token values changed ({len(changed_tokens)}): ' + ', '.join(f'`{x}`' for x in changed_tokens[:40]))
    if added_tokens and cur_tokens: lines.append(f'- Tokens added ({len(added_tokens)}): ' + ', '.join(f'`{x}`' for x in added_tokens[:40]))
    if removed_tokens: lines.append(f'- Tokens no longer in the repo, KEPT until someone confirms removal ({len(removed_tokens)}): ' + ', '.join(f'`{x}`' for x in removed_tokens))
    if gone: lines.append('- Components no longer in the repo, KEPT: ' + ', '.join(gone))
    if kept_edits: lines.append('- Edited on the page since the last sync, left as edited: ' + ', '.join(f'`{x}`' for x in kept_edits))
    if unplaced: lines.append('- Source variables not placed in tokens.json: ' + ', '.join(f'`{x}`' for x in unplaced))
    lines += [''] + report
    open(os.path.join(a.out, 'report.md'), 'w').write('\n'.join(lines) + '\n')

    # ---- write outputs
    state.update({'v': 1, 'ref': ref, 'syncedAt': now, 'producer': 'design-system-artifact/sync.py'})
    if content_changed or prev_ref != ref:
        idx['lastChange'] = {'by': a.by, 'at': now, 'via': a.via or f'GitHub · {CONFIG["repo"]}@{head}',
                             'note': (f're-synced to {head}: {len(changed_tokens)} token values changed, {len(added_tokens) if cur_tokens else 0} added, {len(files)} files'
                                      if cur_tokens else f'Built from the repository at {head}')[:280]}
        files['sync-state.json'] = json.dumps(state, indent=1, sort_keys=True)
        files['design-system.json'] = json.dumps(idx, indent=1)
    proj = os.path.join(a.out, 'project')
    changed = []
    for p, v in sorted(files.items()):
        f = os.path.join(proj, p); os.makedirs(os.path.dirname(f), exist_ok=True)
        if isinstance(v, tuple):
            open(f, 'wb').write(open(v[1], 'rb').read())
        else:
            open(f, 'w', encoding='utf-8').write(v)
        changed.append('project/' + p)
    json.dump(changed, open(os.path.join(a.out, 'changed.json'), 'w'), indent=1)
    print(open(os.path.join(a.out, 'report.md')).read())
    print(f'{len(changed)} file(s) under {proj}; list in {a.out}/changed.json (publish project/design-system.json last)')

if __name__ == '__main__':
    main()
