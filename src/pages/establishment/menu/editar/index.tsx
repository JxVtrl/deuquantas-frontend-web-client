import { ProductType } from "@/interfaces/product";
import {
  addProduct,
  deleteProduct,
  editProduct,
  getProducts,
} from "@/services/products";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Page: React.FC = () => {
  const [products, setProducts] = useState<
    { id: string; name: string; description: string; price: number }[]
  >([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const handleAdd = async () => {
    const newProduct: ProductType = {
      id:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      name: "Novo Produto",
      description: "Descrição",
      price: 10,
    };
    const addedProduct = await addProduct(newProduct);
    setProducts((prev) => [...prev, addedProduct]);
  };

  const handleEdit = async (id: string) => {
    const updatedProduct = await editProduct(id, { price: 20 });
    setProducts((prev) => prev.map((p) => (p.id === id ? updatedProduct : p)));
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <h1>Produtos</h1>
      <div>
        <Link href="/estabelecimento/cardapio">
          <button>Voltar</button>
        </Link>
        <button onClick={handleAdd}>Adicionar Produto</button>
      </div>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.price}€
            <button onClick={() => handleEdit(product.id)}>Editar</button>
            <button onClick={() => handleDelete(product.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
