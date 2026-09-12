import { createClient } from "@/lib/supabase/server";
import { CategoryForm, DeleteCategoryButton } from "@/components/admin/category-form";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, products(count)")
    .order("position", { ascending: true });

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">Categories</h1>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Slug</th>
              <th className="px-5 py-3 font-medium">Products</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories?.map((c) => (
              <tr key={c.id}>
                <td className="px-5 py-3 font-medium text-gray-900">{c.name}</td>
                <td className="px-5 py-3 text-gray-500">{c.slug}</td>
                <td className="px-5 py-3 text-gray-500">{c.products[0]?.count ?? 0}</td>
                <td className="px-5 py-3 text-right">
                  <DeleteCategoryButton id={c.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="max-w-md">
        <h2 className="mb-3 text-sm font-semibold">Add Category</h2>
        <CategoryForm />
      </div>
    </div>
  );
}
