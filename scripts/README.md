# Font Sync Script

This script automatically synchronizes fonts between your `globals.css` file and `app/layout.tsx` when using TweakCN to change fonts.

## How it works

1. Reads `app/globals.css` and extracts font names from CSS variables (`--font-sans`, `--font-serif`, `--font-mono`)
2. Maps font display names to proper Google Fonts API names (e.g., "Roboto Mono" → "Roboto_Mono")
3. Updates the font imports in `app/layout.tsx` - handles cases where the same font is used for multiple CSS variables
4. Updates the font configuration variables with the correct Google Fonts function calls

## Usage

After using TweakCN to change fonts in your `globals.css`:

```bash
npm run sync-fonts
```

## Font Name Mapping

The script includes mappings for popular Google Fonts with their available weights:

- `Roboto Mono` → `Roboto_Mono` (weights: 100, 200, 300, 400, 500, 600, 700)
- `Inter` → `Inter` (weights: 100, 200, 300, 400, 500, 600, 700, 800, 900)
- `JetBrains Mono` → `JetBrains_Mono` (weights: 100, 200, 300, 400, 500, 600, 700, 800)
- `IBM Plex Sans` → `IBM_Plex_Sans` (weights: 100, 200, 300, 400, 500, 600, 700)
- And many more...

For fonts not in the mapping, it automatically converts spaces to underscores and capitalizes each word (e.g., "Open Sans" → "Open_Sans") and uses default weights (400, 500, 600, 700).

## System Fonts vs Google Fonts

The script intelligently handles both system fonts and Google Fonts:

- **Google Fonts** (like `Inter`, `Roboto Mono`, `JetBrains Mono`) are imported from `next/font/google` and configured with appropriate weights
- **System fonts** (like `serif`, `sans-serif`, `monospace`) are not imported but configured as simple variable objects since they're available by default in browsers

When the same Google Font is used for multiple CSS variables, the script imports it once and creates separate configurations for each usage.

## Example

If your `globals.css` contains:

```css
--font-sans: Geist Mono, ui-monospace, monospace;
--font-serif: serif;
--font-mono: JetBrains Mono, monospace;
```

Running `npm run sync-fonts` will update `app/layout.tsx` to:

```tsx
import {
  Geist_Mono as FontSans,
  JetBrains_Mono as FontMono,
} from 'next/font/google';

// Font configurations...
const fontSans = FontSans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
});

const fontSerif = {
  variable: '--font-serif',
};

const fontMono = FontMono({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-mono',
});
```
