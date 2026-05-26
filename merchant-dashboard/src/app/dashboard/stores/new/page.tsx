import { DashboardHeader } from "@/components/layout/dashboard-header";
import { StoreForm } from "@/components/stores/store-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewStorePage() {
  return (
    <>
      <DashboardHeader
        title="Nova loja"
        description="Preencha os dados da loja"
      />
      <main className="page-main">
        <div className="page-container animate-fade-in">
          <Card className="panel-card mx-auto max-w-3xl">
            <CardHeader>
              <CardTitle>Informação da loja</CardTitle>
              <CardDescription>
                Campos: nome, morada, telefone, fuso horário e estado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StoreForm submitLabel="Criar loja" />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
