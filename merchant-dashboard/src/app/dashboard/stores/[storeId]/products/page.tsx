import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Pencil, Trash2, ArrowLeft, Package } from "lucide-react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getProductsForStore,
  getStoreByIdForMerchant,
} from "@/lib/supabase/db";

type PageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function StoreProductsPage({ params }: PageProps) {
  const { storeId } = await params;
  const id = Number(storeId);
  const store = await getStoreByIdForMerchant(id);

  if (!store) {
    notFound();
  }

  const products = await getProductsForStore(id);

  return (
    <>
      <DashboardHeader
        title={`Produtos — ${store.name}`}
        description="Ver, adicionar, atualizar e remover produtos desta loja"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/stores/${id}`}>
                <ArrowLeft className="h-4 w-4" />
                Loja
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/stores/${id}/products/new`}>
                <Plus className="h-4 w-4" />
                Novo produto
              </Link>
            </Button>
          </div>
        }
      />

      <main className="page-main">
        <div className="page-container animate-fade-in">
          <Card className="panel-card">
            <CardHeader>
              <CardTitle>Catálogo de produtos</CardTitle>
              <CardDescription>
                Nome, descrição, preço e disponibilidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <Package className="h-6 w-6" />
                  </div>
                  <p className="text-muted-foreground">
                    Esta loja ainda não tem produtos.
                  </p>
                  <Button asChild>
                    <Link href={`/dashboard/stores/${id}/products/new`}>
                      Adicionar produto
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="data-table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Preço</th>
                        <th>Disponível</th>
                        <th className="text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="font-semibold">{product.name}</td>
                          <td className="max-w-xs truncate text-muted-foreground">
                            {product.description}
                          </td>
                          <td className="font-medium tabular-nums">
                            {product.price.toFixed(2)} €
                          </td>
                          <td>
                            <Badge
                              variant={
                                product.available ? "success" : "secondary"
                              }
                            >
                              {product.available ? "Sim" : "Não"}
                            </Badge>
                          </td>
                          <td className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link
                                  href={`/dashboard/stores/${id}/products/${product.id}`}
                                >
                                  <Pencil className="h-4 w-4" />
                                  Editar
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-destructive/30 text-destructive hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                Remover
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
