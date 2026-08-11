import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("joins multiple class names together", () => {
    expect(cn("p-2", "text-sm")).toBe("p-2 text-sm");
  });

  it("drops falsy values", () => {
    expect(cn("p-2", false, undefined, "text-sm")).toBe("p-2 text-sm");
  });

  it("lets a later conflicting Tailwind class win", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
