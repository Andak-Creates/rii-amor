import fs from "fs";
import path from "path";
import { Product, PRODUCTS as DEFAULT_PRODUCTS } from "@/data/products";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "products.json");

export function getStoredProducts(): Product[] {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      // Initialize with default products
      fs.writeFileSync(
        DATA_FILE_PATH,
        JSON.stringify(DEFAULT_PRODUCTS, null, 2),
        "utf-8"
      );
      return DEFAULT_PRODUCTS;
    }
    const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_PRODUCTS;
  } catch (error) {
    console.error("Error reading stored products:", error);
    return DEFAULT_PRODUCTS;
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

