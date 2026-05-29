"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Store } from "@/lib/types";

const TIMEZONES = [
  "Europe/Lisbon",
  "Europe/London",
  "Europe/Madrid",
  "Europe/Paris",
  "America/New_York",
  "America/Sao_Paulo",
];

type StoreFormProps = {
  store?: Store;
  submitLabel?: string;
};

export function StoreForm({
  store,
  submitLabel = "Guardar loja",
}: StoreFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!store?.id;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = (form.get("name") as string)?.trim();
    const street = (form.get("street") as string)?.trim();
    const city = (form.get("city") as string)?.trim();
    const state = (form.get("state") as string)?.trim();
    const zipCode = (form.get("zipCode") as string)?.trim();
    const phoneNumber = (form.get("phoneNumber") as string)?.trim();
    const timezone = (form.get("timezone") as string)?.trim();
    const active = form.get("active") === "on";

    const phoneRegex = /^\+?[0-9\s-]{7,20}$/;
    const zipRegex = /^[0-9]{4}-?[0-9]{3}$/;

    if (!name || name.length < 3) {
      setError("O nome da loja deve ter pelo menos 3 caracteres.");
      setLoading(false);
      return;
    }

    if (!street) {
      setError("Insira a rua da loja.");
      setLoading(false);
      return;
    }

    if (!city) {
      setError("Insira a cidade da loja.");
      setLoading(false);
      return;
    }

    if (!state) {
      setError("Insira o distrito/estado da loja.");
      setLoading(false);
      return;
    }

    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      setError("Insira um número de telefone válido.");
      setLoading(false);
      return;
    }

    if (zipCode && !zipRegex.test(zipCode)) {
      setError("Insira um código postal com o formato 1000-100.");
      setLoading(false);
      return;
    }

    if (!timezone) {
      setError("Selecione um fuso horário.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        isEdit ? `/api/stores/${store?.id}` : "/api/stores",
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            street,
            city,
            state,
            zipCode,
            phoneNumber,
            timezone,
            active,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao gravar loja");
      }

      router.push("/dashboard/stores");
    } catch (err) {
      setError((err as Error).message || "Erro ao gravar loja.");
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
      <div className="form-section">
        <p className="form-section-title">Informação geral</p>
        <div className="form-grid">
          <div className="form-field-full">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={store?.name}
              placeholder="Ex: Pizza do Bairro"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <p className="form-section-title">Morada</p>
        <div className="form-grid">
          <div className="form-field-full">
            <Label htmlFor="street">Rua</Label>
            <Input
              id="street"
              name="street"
              defaultValue={store?.street}
              placeholder="Rua, número"
              required
            />
          </div>

          <div className="form-field">
            <Label htmlFor="city">Cidade</Label>
            <Input id="city" name="city" defaultValue={store?.city} required />
          </div>

          <div className="form-field">
            <Label htmlFor="state">Distrito / Estado</Label>
            <Input id="state" name="state" defaultValue={store?.state} required />
          </div>

          <div className="form-field">
            <Label htmlFor="zipCode">Código postal</Label>
            <Input
              id="zipCode"
              name="zipCode"
              defaultValue={store?.zipCode}
              placeholder="1000-001"
              pattern="[0-9]{4}-?[0-9]{3}"
              title="Formato 1000-100"
            />
          </div>

          <div className="form-field">
            <Label htmlFor="phoneNumber">Telefone</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              defaultValue={store?.phoneNumber}
              placeholder="+351 912 345 678"
              required
              pattern="\+?[0-9\s-]{7,20}"
              title="Insira um telefone válido com dígitos e opcionalmente +, espaços ou hífens"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <p className="form-section-title">Configuração</p>
        <div className="form-grid">
          <div className="form-field-full">
            <Label>Fuso horário</Label>
            <Select
              name="timezone"
              defaultValue={store?.timezone ?? "Europe/Lisbon"}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar fuso horário" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="form-toggle-row">
            <div className="space-y-0.5">
              <Label htmlFor="active">Estado da loja</Label>
              <p className="text-sm text-muted-foreground">
                Lojas inativas não recebem encomendas
              </p>
            </div>
            <Switch
              id="active"
              name="active"
              defaultChecked={store?.active ?? true}
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <Button type="submit">{submitLabel}</Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard/stores">Cancelar</Link>
        </Button>
      </div>
    </form>
  );
}
