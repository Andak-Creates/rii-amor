import fs from "fs";
import path from "path";
import { Product } from "@/data/products";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "products.json");

export function getStoredProducts(): Product[] {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      fs.writeFileSync(
        DATA_FILE_PATH,
        JSON.stringify([], null, 2),
        "utf-8"
      );
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (error) {
    console.error("Error reading stored products:", error);
    return [];
  }
}

export function saveStoredProducts(products: Product[]): boolean {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      DATA_FILE_PATH,
      JSON.stringify(products, null, 2),
      "utf-8"
    );
    return true;
  } catch (error) {
    console.error("Error saving stored products:", error);
    return false;
  }
}

