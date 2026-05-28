import Link from "next/link";
import { notFound } from "next/navigation";
import { Package } from "lucide-react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { StoreForm } from "@/components/stores/store-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStoreByIdForMerchant } from "@/lib/supabase/db";

type PageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function EditStorePage({ params }: PageProps) {
  const { storeId } = await params;
  const store = await getStoreByIdForMerchant(Number(storeId));

  if (!store) {
    notFound();
  }

  return (
    <>
      <DashboardHeader
        title={store.name}
        description="Editar informação ou desativar loja"
        action={
          <Button variant="outline" asChild>
            <Link href={`/dashboard/stores/${store.id}/products`}>
              <Package className="h-4 w-4" />
              Produtos
            </Link>
          </Button>
        }
      />
      <main className="page-main">
        <div className="page-container animate-fade-in">
          <Card className="panel-card mx-auto max-w-3xl">
            <CardHeader>
              <CardTitle>Editar loja</CardTitle>
              <CardDescription>
                Desative a loja com o interruptor de estado para deixar de
                receber encomendas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StoreForm store={store} submitLabel="Atualizar loja" />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
