import { describe, expect, it } from "bun:test";
import { canonicalizeIdentifier } from "../../src/index.ts";

describe("canonicalizeIdentifier", () => {
  it("removes all whitespace", () => {
    expect(canonicalizeIdentifier("E F A - 2")).toBe("efa-2");
    expect(canonicalizeIdentifier(" EFA -2 ")).toBe("efa-2");
  });

  it("normalizes unicode hyphens", () => {
    // U+2011 Non-breaking hyphen
    expect(canonicalizeIdentifier("EFA‑2")).toBe("efa-2");
    // U+2013 En-dash
    expect(canonicalizeIdentifier("EFA–2")).toBe("efa-2");
    // U+2014 Em-dash
    expect(canonicalizeIdentifier("EFA—2")).toBe("efa-2");
  });

  it("lowercases the result", () => {
    expect(canonicalizeIdentifier("EFA-2")).toBe("efa-2");
  });

  it("handles invisible unicode characters", () => {
    // Zero-width space
    expect(canonicalizeIdentifier("EFA\u200B-2")).toBe("efa-2");
  });

  it("handles non-string input safely", () => {
    expect(canonicalizeIdentifier(null)).toBe("");
    expect(canonicalizeIdentifier(undefined)).toBe("");
    expect(canonicalizeIdentifier(123)).toBe("");
    expect(canonicalizeIdentifier({})).toBe("");
  });
});
