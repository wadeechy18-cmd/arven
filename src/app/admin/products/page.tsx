import Link from "next/link";
import Image from "@/components/ui/image";

import { getAllProductsForAdmin } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-gray-500">{products.length} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3">
                    {p.images[0] && (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-gray-100">
                        <Image src={p.images[0].url} alt="" fill className="object-cover" sizes="40px" />
                      </div>
                    )}
                    <span className="font-medium text-gray-900">{p.name}</span>
                  </Link>
                </td>
                <td className="px-5 py-3 text-gray-500">{p.category.name}</td>
                <td className="px-5 py-3">{formatPrice(p.price)}</td>
                <td className="px-5 py-3">
                  <span className={p.stock === 0 ? "font-medium text-red-600" : "text-gray-700"}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-1">
                    {p.featured && (
                      <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[11px] text-amber-700">Featured</span>
                    )}
                    {p.isBestSeller && (
                      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] text-emerald-700">Best Seller</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
