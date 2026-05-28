import { notFound } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { ProductForm } from "@/components/products/product-form";
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

export default async function NewProductPage({ params }: PageProps) {
  const { storeId } = await params;
  const id = Number(storeId);
  const store = await getStoreByIdForMerchant(id);

  if (!store) {
    notFound();
  }

  return (
    <>
      <DashboardHeader title="Novo produto" description={store.name} />
      <main className="page-main">
        <div className="page-container animate-fade-in">
          <Card className="panel-card mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>Adicionar produto</CardTitle>
              <CardDescription>
                Nome, descrição, preço e estado de disponibilidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductForm storeId={id} submitLabel="Adicionar produto" />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
