# Data Fetching Convention

This project uses [TanStack Query](https://tanstack.com/query) for server-state management.

## Architecture

```
src/
├── lib/api/          # API call functions (plain async functions)
│   ├── client.ts     # Base fetch wrapper with auth token injection
│   ├── query-client.ts  # QueryClient instance + defaults
│   └── health.ts     # Example: health endpoint calls
└── hooks/            # TanStack Query hooks (useQuery/useMutation wrappers)
    └── use-health.ts # Example: useHealth hook
```

## How It Works

1. **API functions** in `src/lib/api/` are plain async functions that call the backend using `apiFetch`. They handle URL construction, auth headers, and error parsing. Each function is typed with its response shape.

2. **Hooks** in `src/hooks/` wrap API functions with `useQuery` or `useMutation`. Components consume these hooks — never call API functions directly from components.

3. **QueryClientProvider** wraps the app in `src/app.tsx`, making the cache available everywhere.

## Adding a New API Call

```typescript
// 1. Define types and fetch function in src/lib/api/users.ts
import { apiFetch } from "@/lib/api/client";

export type User = {
  id: string;
  email: string;
  name: string;
};

export function fetchCurrentUser(): Promise<User> {
  return apiFetch<User>("/admin/me");
}

// 2. Create a hook in src/hooks/use-current-user.ts
import { useQuery } from "@tanstack/react-query";
import { type User, fetchCurrentUser } from "@/lib/api/users";

export function useCurrentUser() {
  return useQuery<User, Error>({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
  });
}

// 3. Use in a component
function ProfileCard() {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;

  return <div>{user.name}</div>;
}
```

## Error Handling

`apiFetch` throws an `ApiError` with `status`, `statusText`, and parsed `body`. TanStack Query catches this and exposes it via the `error` field in hook results.

## Defaults

Configured in `src/lib/api/query-client.ts`:
- `staleTime`: 1 minute (data considered fresh for 60s)
- `retry`: 1 (one retry on failure)
- `refetchOnWindowFocus`: disabled