import Link from "next/link";
import { Plus, Pencil, Package } from "lucide-react";
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
import { getStoresForMerchant, MOCK_MERCHANT_ID } from "@/lib/mock-data";

export default function StoresPage() {
  const stores = getStoresForMerchant(MOCK_MERCHANT_ID);

  return (
    <>
      <DashboardHeader
        title="Lojas"
        description="Ver, criar, editar e desativar lojas"
        action={
          <Button asChild>
            <Link href="/dashboard/stores/new">
              <Plus className="h-4 w-4" />
              Nova loja
            </Link>
          </Button>
        }
      />

      <main className="page-main">
        <div className="page-container animate-fade-in">
          <Card className="panel-card">
            <CardHeader>
              <CardTitle>As suas lojas</CardTitle>
              <CardDescription>
                Nome, morada, telefone, fuso horário e estado ativo/inativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stores.length === 0 ? (
                <div className="empty-state">
                  <p className="text-muted-foreground">
                    Nenhuma loja encontrada.
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/stores/new">Criar loja</Link>
                  </Button>
                </div>
              ) : (
                <div className="data-table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Cidade</th>
                        <th>Telefone</th>
                        <th>Estado</th>
                        <th className="text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stores.map((store) => (
                        <tr key={store.id}>
                          <td className="font-semibold">{store.name}</td>
                          <td>{store.city}</td>
                          <td className="text-muted-foreground">
                            {store.phoneNumber}
                          </td>
                          <td>
                            <Badge
                              variant={store.active ? "success" : "secondary"}
                            >
                              {store.active ? "Ativa" : "Inativa"}
                            </Badge>
                          </td>
                          <td className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link
                                  href={`/dashboard/stores/${store.id}/products`}
                                >
                                  <Package className="h-4 w-4" />
                                  Produtos
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/dashboard/stores/${store.id}`}>
                                  <Pencil className="h-4 w-4" />
                                  Editar
                                </Link>
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
