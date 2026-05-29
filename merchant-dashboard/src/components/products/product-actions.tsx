"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";

type Product = {
  id: number;
};

export function ProductActions({ product, storeId }: { product: Product; storeId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Tem a certeza que pretende remover este produto?")) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(body?.error || "Erro ao remover produto.");
      }

      router.refresh();
    } catch (err: any) {
      alert(err?.message || "Erro ao remover produto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/dashboard/stores/${storeId}/products/${product.id}`}>
          <Pencil className="h-4 w-4" />
          Editar
        </Link>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="border-destructive/30 text-destructive hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
        onClick={handleDelete}
        disabled={loading}
      >
        <Trash2 className="h-4 w-4" /> {loading ? "Removendo..." : "Remover"}
      </Button>
    </div>
  );
}
