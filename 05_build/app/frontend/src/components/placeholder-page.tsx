export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-muted-foreground">This page is under construction.</p>
      </div>
    </div>
  );
}
