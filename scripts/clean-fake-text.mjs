// One-time script: wipes fake auto-generated text from all products in Supabase
// Run with: node scripts/clean-fake-text.mjs

const SUPABASE_URL = "https://sypxbucrlhyqxkxfartw.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5cHhidWNybGh5cXhreGZhcnR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDI2MTY0MywiZXhwIjoyMTA5ODM3NjQzfQ.flfMijx2nFfWB9mquzNVQTAtihQLLxrJc34s7QkpvXc";

const FAKE_DESC_PATTERNS = [
  "hand-tailored",
  "florentine animalier",
  "artisanal print placement",
  "sustainable italian finishing",
];

const FAKE_COMPOSITION_PATTERNS = [
  "italian silk charmeuse",
  "mother of pearl buttons",
  "100% italian silk charmeuse",
];

const FAKE_DETAIL_PATTERNS = [
  "hand-finished in florence",
  "archival animalier print placement",
  "100% italian sustainable tailoring",
];

function isFakeText(str, patterns) {
  if (!str) return false;
  const lower = str.toLowerCase();
  return patterns.some((p) => lower.includes(p));
}

async function run() {
  const headers = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  };

  // Fetch all products
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, { headers });
  if (!res.ok) {
    console.error("Failed to fetch products:", res.status, await res.text());
    process.exit(1);
  }

  const products = await res.json();
  console.log(`Fetched ${products.length} products`);

  for (const p of products) {
    const updates = {};

    // Clean description
    if (isFakeText(p.description, FAKE_DESC_PATTERNS)) {
      updates.description = "";
      console.log(`  Clearing description for: ${p.name}`);
    }

    // Clean composition
    if (isFakeText(p.composition, FAKE_COMPOSITION_PATTERNS)) {
      updates.composition = "";
      console.log(`  Clearing composition for: ${p.name}`);
    }

    // Clean details array
    const rawDetails = Array.isArray(p.details)
      ? p.details
      : typeof p.details === "string"
      ? JSON.parse(p.details || "[]")
      : [];

    const cleanDetails = rawDetails.filter(
      (d) => !isFakeText(d, FAKE_DETAIL_PATTERNS)
    );

    if (cleanDetails.length !== rawDetails.length) {
      updates.details = cleanDetails;
      console.log(`  Cleaned details for: ${p.name}`);
    }

    if (Object.keys(updates).length === 0) {
      console.log(`  ✓ Already clean: ${p.name}`);
      continue;
    }

    // Patch this product in Supabase
    const patchRes = await fetch(
      `${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(p.id)}`,
      {
        method: "PATCH",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify(updates),
      }
    );

    if (patchRes.ok) {
      console.log(`  ✅ Cleaned: ${p.name}`);
    } else {
      console.error(`  ❌ Failed to patch ${p.name}:`, patchRes.status, await patchRes.text());
    }
  }

  console.log("\nDone! All fake text removed from Supabase.");
}

run().catch(console.error);

