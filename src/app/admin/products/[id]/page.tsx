import { notFound } from "next/navigation";

import { getCategories, getProductById } from "@/lib/data";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([getProductById(params.id), getCategories()]);

  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Edit Product</h1>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
