"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { Product } from "@/lib/types";

type ProductFormProps = {
  storeId: number;
  product?: Product;
  submitLabel?: string;
};

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProductForm({
  storeId,
  product,
  submitLabel = "Guardar produto",
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!product?.id;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const description = form.get("description") as string;
    const price = Number(form.get("price"));
    const available = form.get("available") === "on";

    try {
      const response = await fetch(
        isEdit ? `/api/products/${product?.id}` : "/api/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            storeId,
            name,
            description,
            price,
            available,
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Erro ao gravar produto");
      }

      router.push(`/dashboard/stores/${storeId}/products`);
    } catch (err) {
      setError((err as Error).message || "Erro ao gravar produto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form-root" onSubmit={handleSubmit}>
      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <input type="hidden" name="storeId" value={storeId} />

      <div className="form-section">
        <p className="form-section-title">Detalhes do produto</p>
        <div className="form-grid">
          <div className="form-field-full">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={product?.name}
              placeholder="Ex: Pizza Margherita"
              required
            />
          </div>

          <div className="form-field-full">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product?.description}
              placeholder="Ingredientes, tamanho, etc."
              rows={4}
            />
          </div>

          <div className="form-field">
            <Label htmlFor="price">Preço (€) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product?.price}
              placeholder="9.50"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <p className="form-section-title">Disponibilidade</p>
        <div className="form-toggle-row">
          <div className="space-y-0.5">
            <Label htmlFor="available">Disponível</Label>
            <p className="text-sm text-muted-foreground">
              Produtos indisponíveis não aparecem no menu
            </p>
          </div>
          <Switch
            id="available"
            name="available"
            defaultChecked={product?.available ?? true}
          />
        </div>
      </div>

      <div className="form-actions">
        <Button type="submit">{submitLabel}</Button>
        <Button type="button" variant="outline" asChild>
          <Link href={`/dashboard/stores/${storeId}/products`}>
            Cancelar
          </Link>
        </Button>
      </div>
    </form>
  );
}
