"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createCategory, deleteCategory } from "@/lib/admin-actions";

export function CategoryForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await createCategory({ name, description: description || undefined });
      setName("");
      setDescription("");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-6">
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
          Category Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
          Description
        </label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add Category"}
      </button>
    </form>
  );
}

export function DeleteCategoryButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this category? Products in it will need reassigning first.")) return;
        startTransition(async () => {
          await deleteCategory(id);
          router.refresh();
        });
      }}
      className="text-xs font-medium text-red-600 hover:underline"
    >
      Delete
    </button>
  );
}
