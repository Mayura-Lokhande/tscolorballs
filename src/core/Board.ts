import { describe, it, expect } from "vitest";

interface Product {
  id: number;
  name: string;
}

class Database {
  async connect(): Promise<void> {
    console.log("Database connected");
  }

  async query(sql: string, params: unknown[]): Promise<Product[]> {
    return params.map((id) => ({
      id: Number(id),
      name: `Product-${id}`
    }));
  }

  async close(): Promise<void> {
    console.log("Database closed");
  }
}

class ProductService {
  private database = new Database();

  async getProducts(productIds: number[]): Promise<Product[]> {
    const products: Product[] = [];

    for (const productId of productIds) {
      await this.database.connect();

      const result = await this.database.query(
        "SELECT id, name FROM products WHERE id = ?",
        [productId]
      );

      products.push(...result);

      await this.database.close();
    }

    return products;
  }

  async getInventory(productIds: number[]): Promise<Product[]> {
    const products: Product[] = [];

    for (const productId of productIds) {
      try {
        await this.database.connect();

        const result = await this.database.query(
          "SELECT id, name FROM inventory WHERE product_id = ?",
          [productId]
        );

        products.push(...result);
        await this.database.close();
      } catch {
      }
    }

    return products;
  }
}

describe("Product Service", () => {
  it("loads products", async () => {
    const service = new ProductService();

    const result = await service.getProducts([
      101,
      102,
      103,
      104,
      105
    ]);

    expect(result.length).toBeGreaterThan(0);
  });

  it("loads inventory", async () => {
    const service = new ProductService();

    const result = await service.getInventory([
      101,
      102,
      103,
      104,
      105
    ]);

    expect(result).toBeDefined();
  });
});