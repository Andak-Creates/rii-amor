// Comprehensive fashion, luxury, and CSS color dictionary
const FASHION_COLORS: Record<string, string> = {
  // Earth & Nut Tones
  "hazelnut": "#A87B51",
  "hazel nut": "#A87B51",
  "hazelnuts": "#A87B51",
  "hazel": "#8E5E38",
  "mocha": "#967969",
  "espresso": "#362B28",
  "cappuccino": "#8B6D55",
  "chocolate": "#4A2E18",
  "dark chocolate": "#3B2219",
  "caramel": "#C68B59",
  "toffee": "#9E5E2A",
  "cinnamon": "#D2691E",
  "coffee": "#6F4E37",
  "cocoa": "#5C3A21",

  // Luxury Neutrals
  "cream": "#FFFDD0",
  "ivory": "#FFFFF0",
  "off white": "#FAF0E6",
  "eggshell": "#F0EAD6",
  "vanilla": "#F3E5AB",
  "champagne": "#F7E7CE",
  "champagne gold": "#F7E7CE",
  "sand": "#C2B280",
  "beige": "#F5F5DC",
  "nude": "#E3BC9A",
  "camel": "#C19A6B",
  "tan": "#D2B48C",
  "khaki": "#C3B091",
  "taupe": "#8B8589",
  "stone": "#9E978E",
  "biscuit": "#D9C3A5",
  "oatmeal": "#E3DAC9",

  // Greens
  "emerald": "#097969",
  "emerald green": "#097969",
  "olive": "#556B2F",
  "olive green": "#556B2F",
  "khaki green": "#556B2F",
  "sage": "#9CAF88",
  "sage green": "#9CAF88",
  "forest green": "#228B22",
  "forest": "#1E4D2B",
  "moss": "#8A9A5B",
  "moss green": "#8A9A5B",
  "pistachio": "#93C572",
  "mint": "#98FF98",
  "mint green": "#98FF98",
  "army green": "#4B5320",
  "pine": "#01796F",
  "jade": "#00A86B",

  // Reds, Wines & Corals
  "burgundy": "#800020",
  "wine": "#722F37",
  "bordeaux": "#5C061B",
  "maroon": "#800000",
  "ruby": "#E0115F",
  "crimson": "#DC143C",
  "scarlet": "#FF2400",
  "cherry": "#D2042D",
  "terracotta": "#E2725B",
  "terra cotta": "#E2725B",
  "rust": "#B7410E",
  "burnt orange": "#CC5500",
  "copper": "#B87333",
  "coral": "#FF7F50",
  "peach": "#FFE5B4",
  "salmon": "#FA8072",
  "brick": "#9C413D",

  // Pinks & Purples
  "blush": "#DE5D83",
  "blush pink": "#DE5D83",
  "rose": "#FF007F",
  "dusty rose": "#DCAE96",
  "rose gold": "#B76E79",
  "fuchsia": "#FF00FF",
  "magenta": "#FF0090",
  "plum": "#8E4585",
  "mauve": "#E0B0FF",
  "lavender": "#E6E6FA",
  "lilac": "#C8A2C8",
  "violet": "#8F00FF",
  "aubergine": "#3D0735",
  "berry": "#8A2A54",

  // Blues
  "navy": "#000080",
  "navy blue": "#000080",
  "midnight": "#191970",
  "midnight blue": "#191970",
  "royal blue": "#4169E1",
  "cobalt": "#0047AB",
  "cobalt blue": "#0047AB",
  "indigo": "#4B0082",
  "sky blue": "#87CEEB",
  "powder blue": "#B0E0E6",
  "baby blue": "#89CFF0",
  "teal": "#008080",
  "petrol": "#005F73",
  "denim": "#1560BD",
  "slate": "#708090",
  "slate blue": "#6A5ACD",

  // Yellows & Golds
  "gold": "#D4AF37",
  "metallic gold": "#D4AF37",
  "amber": "#FFBF00",
  "mustard": "#E1AD01",
  "mustard yellow": "#E1AD01",
  "ochre": "#CC7722",
  "lemon": "#FFF44F",
  "honey": "#EBA83A",
  "bronze": "#CD7F32",

  // Blacks, Greys & Whites
  "noir": "#111111",
  "black": "#000000",
  "jet black": "#0A0A0A",
  "pitch black": "#000000",
  "onyx": "#0F0F0F",
  "charcoal": "#36454F",
  "anthracite": "#293133",
  "grey": "#808080",
  "gray": "#808080",
  "silver": "#C0C0C0",
  "ash": "#B2BEB5",
  "pearl": "#EAE0C8",
  "white": "#FFFFFF",
  "pure white": "#FFFFFF",
};

/**
 * Resolves a natural language color name (e.g. "Hazel nut", "Burgundy", "Emerald")
 * into a matching 6-digit hex color string (#RRGGBB).
 * Returns null if no match is found.
 */
export function resolveColorNameToHex(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If user directly typed a valid 3- or 6-digit hex code
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(trimmed)) {
    if (trimmed.length === 4) {
      // expand #abc to #aabbcc
      return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`.toUpperCase();
    }
    return trimmed.toUpperCase();
  }

  // Normalize name
  const normalized = trimmed.toLowerCase().replace(/[-_]/g, " ").replace(/\s+/g, " ");

  // Direct dictionary lookup
  if (FASHION_COLORS[normalized]) {
    return FASHION_COLORS[normalized];
  }

  // Without spaces lookup (e.g. "hazelnut" for "hazel nut")
  const collapsed = normalized.replace(/\s+/g, "");
  if (FASHION_COLORS[collapsed]) {
    return FASHION_COLORS[collapsed];
  }

  // Partial / prefix matches (e.g., user is typing "hazel" or "burgun")
  for (const [key, hex] of Object.entries(FASHION_COLORS)) {
    if (key === normalized || key === collapsed) return hex;
    if (normalized.length >= 4 && (key.startsWith(normalized) || normalized.startsWith(key))) {
      return hex;
    }
  }

  return null;
}
