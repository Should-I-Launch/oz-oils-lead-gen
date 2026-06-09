import { cn } from "@/lib/utils";

export function UserDashboardView() {
  return (
    <main
      className={cn(
        "flex min-h-svh items-center justify-center bg-background px-6 py-16",
        "bg-[radial-gradient(60%_40%_at_50%_0%,--theme(--color-foreground/.08),transparent)]",
      )}
    >
      <section className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Dashboard
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-foreground md:text-7xl">
          Hello User
        </h1>
      </section>
    </main>
  );
}
