import Link from "next/link";
import { Plus, Store, Package, TrendingUp } from "lucide-react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getStoresForMerchant,
  getProductsForStore,
  MOCK_MERCHANT_ID,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const stores = getStoresForMerchant(MOCK_MERCHANT_ID);
  const activeStores = stores.filter((s) => s.active).length;
  const totalProducts = stores.reduce(
    (acc, s) => acc + getProductsForStore(s.id).length,
    0
  );

  const stats = [
    {
      label: "Total de lojas",
      value: stores.length,
      icon: Store,
    },
    {
      label: "Lojas ativas",
      value: activeStores,
      icon: TrendingUp,
    },
    {
      label: "Produtos no catálogo",
      value: totalProducts,
      icon: Package,
    },
  ];

  return (
    <>
      <DashboardHeader
        title="Visão geral"
        description="Resumo das suas lojas e produtos"
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
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="stat-card">
                <div className="stat-card-inner">
                  <div className="flex items-start justify-between">
                    <p className="stat-label">{stat.label}</p>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <stat.icon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="stat-value">{stat.value}</p>
                </div>
              </Card>
            ))}
          </div>

          <Card className="panel-card">
            <CardHeader>
              <CardTitle>Lojas recentes</CardTitle>
              <CardDescription>
                Apenas lojas associadas à sua conta merchant
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stores.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <Store className="h-6 w-6" />
                  </div>
                  <p className="text-muted-foreground">
                    Ainda não tem lojas. Crie a primeira.
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/stores/new">Criar loja</Link>
                  </Button>
                </div>
              ) : (
                <ul>
                  {stores.map((store) => (
                    <li key={store.id} className="list-row">
                      <div>
                        <p className="font-semibold">{store.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {store.city}, {store.state}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={store.active ? "success" : "secondary"}>
                          {store.active ? "Ativa" : "Inativa"}
                        </Badge>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/stores/${store.id}`}>
                            Gerir
                          </Link>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
