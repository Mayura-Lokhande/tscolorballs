export interface Product {
  id: number;
  name: string;
  price: number;
}

export function formatProducts(products: Product[]): string[] {
  const formattedProducts: string[] = [];

  for (const product of products) {
    const productName = product.name.trim();
    const productPrice = product.price.toFixed(2);
    const displayText = `${productName} - $${productPrice}`;

    formattedProducts.push(displayText);
  }

  return formattedProducts;
}