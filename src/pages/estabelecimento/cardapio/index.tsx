import { useEffect, useState } from "react";
import { getProducts } from "@/services/products";
import { ProductType } from "@/interfaces/product";
import Link from "next/link";

export default function Page() {
  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Estabelecimento X</h1>
      <h2>Seu Cardápio</h2>
      <div>
        <Link href="/estabelecimento/cardapio/editar">
          <button>Editar Cardápio</button>
        </Link>
      </div>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
