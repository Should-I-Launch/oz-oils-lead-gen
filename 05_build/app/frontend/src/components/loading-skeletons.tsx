import { Skeleton } from "@/components/ui/skeleton";

/**
 * Example loading skeleton for a card-based layout.
 * Use this pattern when data is loading via TanStack Query hooks.
 *
 * Usage:
 * ```tsx
 * function MyPage() {
 *   const { data, isLoading, error } = useMyData();
 *   if (isLoading) return <CardSkeleton />;
 *   if (error) return <ErrorMessage error={error} />;
 *   return <MyContent data={data} />;
 * }
 * ```
 */
export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items have no stable ID
        <div key={i} className="rounded-lg border p-6">
          <Skeleton className="mb-4 h-4 w-3/4" />
          <Skeleton className="mb-2 h-3 w-full" />
          <Skeleton className="mb-2 h-3 w-5/6" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

/**
 * Full-page loading skeleton with header and content area.
 */
export function PageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <CardSkeleton />
    </div>
  );
}
