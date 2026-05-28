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
import {
  getProductById,
  getStoreByIdForMerchant,
} from "@/lib/supabase/db";

type PageProps = {
  params: Promise<{ storeId: string; productId: string }>;
};

export default async function EditProductPage({ params }: PageProps) {
  const { storeId, productId } = await params;
  const storeIdNum = Number(storeId);
  const store = await getStoreByIdForMerchant(storeIdNum);

  if (!store) {
    notFound();
  }

  const product = await getProductById(storeIdNum, Number(productId));

  if (!product) {
    notFound();
  }

  return (
    <>
      <DashboardHeader
        title={product.name}
        description={`Editar produto — ${store.name}`}
      />
      <main className="page-main">
        <div className="page-container animate-fade-in">
          <Card className="panel-card mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>Editar produto</CardTitle>
              <CardDescription>
                Atualize os dados ou altere a disponibilidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductForm
                storeId={storeIdNum}
                product={product}
                submitLabel="Atualizar produto"
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
