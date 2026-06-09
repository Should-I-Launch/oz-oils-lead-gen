import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "@/app";

describe("App", () => {
  it("renders without crashing", () => {
    // App uses ClerkGate which conditionally wraps with ClerkProvider
    // When VITE_CLERK_ENABLED is not set, it renders children directly
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });
});
