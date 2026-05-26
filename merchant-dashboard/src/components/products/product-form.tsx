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

export function ProductForm({
  storeId,
  product,
  submitLabel = "Guardar produto",
}: ProductFormProps) {
  return (
    <form
      className="form-root"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
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
