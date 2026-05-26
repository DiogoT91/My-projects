import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-muted/40 to-background p-6">
      <div className="empty-state max-w-md">
        <div className="empty-state-icon">
          <FileQuestion className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold">Página não encontrada</h1>
        <p className="text-muted-foreground">
          O recurso que procura não existe ou não tem acesso.
        </p>
        <Button asChild>
          <Link href="/dashboard">Voltar ao painel</Link>
        </Button>
      </div>
    </div>
  );
}
