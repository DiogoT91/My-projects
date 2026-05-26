import { UtensilsCrossed } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="auth-hero">
        <div className="auth-hero-pattern" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 shadow-lg backdrop-blur-sm">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">FoodDash</span>
        </div>
        <div className="relative space-y-4">
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Gerir as suas lojas num só lugar
          </h2>
          <p className="max-w-md text-base leading-relaxed text-primary-foreground/85">
            Crie lojas, atualize produtos e controle a disponibilidade. Cada
            merchant acede apenas aos seus dados.
          </p>
        </div>
        <p className="relative text-sm text-primary-foreground/60">
          Plataforma multi-loja de entrega de comida
        </p>
      </div>

      <div className="auth-panel">
        <div className="animate-fade-in w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
