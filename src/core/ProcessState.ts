import { Product, formatProducts } from "./ProductFormatter";

export class ProductService {
  private products: Product[] = [];

  addProduct(name: string, price: number): void {
    const productId = this.products.length + 1;

    const product: Product = {
      id: productId,
      name,
      price
    };

    this.products.push(product);
  }

  getProductLabels(): string[] {
    const currentProducts = this.products;
    const result = formatProducts(currentProducts);

    return result;
  }

  printProducts(): void {
    const labels = this.getProductLabels();

    for (const label of labels) {
      console.log(label);
    }
  }
}