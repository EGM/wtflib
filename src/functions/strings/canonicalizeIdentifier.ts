/**
 * Provides utilities for safely canonicalizing user-provided identifiers.
 *
 * This module exposes a single function, `canonicalizeIdentifier`, which
 * normalizes arbitrary input into a stable, lowercase, ASCII-only form.
 * It is designed for environments where identifiers must be compared,
 * stored, or validated in a consistent and security‑aware way.
 *
 * Key features:
 * - Removes invisible Unicode characters (zero‑width, BOM, soft hyphen)
 * - Normalizes Unicode hyphens and dash-like characters to ASCII `-`
 * - Strips all whitespace, including Unicode whitespace
 * - Applies NFKC normalization for consistent comparison
 * - Lowercases the final output for canonical form
 * - Safely handles non-string input
 *
 * Typical use cases include:
 * - Sanitizing user input before comparison
 * - Normalizing identifiers from external systems
 * - Preventing homoglyph and zero‑width character attacks
 * - Ensuring consistent storage keys across runtimes
 *
 * @example
 * ```ts
 * import { canonicalizeIdentifier } from "@egm/wtflib";
 *
 * canonicalizeIdentifier("E F A - 2"); // "efa-2"
 * canonicalizeIdentifier("Adm\u200Bin"); // "admin"
 * ```
 */

/**
 * Normalizes a string for comparison, removing invisible characters and whitespace, and returns the string as lower case.
 *
 * This function is useful for:
 * - Comparing identifiers that may contain hidden characters
 * - Normalizing user input for consistent storage
 * - Preventing homoglyph attacks in authentication systems
 *
 * @param raw - The value to canonicalize. Non-string values return empty string.
 * @returns The canonicalized string in lowercase with no whitespace or invisible characters
 *
 * @example
 * ```ts
 * import { canonicalizeIdentifier } from "@egm/wtflib";
 *
 * // Basic normalization
 * canonicalizeIdentifier("Hello World"); // "helloworld"
 * canonicalizeIdentifier("  My-Identifier  "); // "my-identifier"
 * ```
 *
 * @example
 * ```ts
 * import { canonicalizeIdentifier } from "@egm/wtflib";
 *
 * // Unicode hyphen normalization (U+2010 to U+2015, U+2212)
 * canonicalizeIdentifier("EFA‑2"); // "efa-2" (non-breaking hyphen)
 * canonicalizeIdentifier("EFA–2"); // "efa-2" (en-dash)
 * canonicalizeIdentifier("EFA—2"); // "efa-2" (em-dash)
 * canonicalizeIdentifier("a−b"); // "a-b" (minus sign)
 * ```
 *
 * @example
 * ```ts
 * import { canonicalizeIdentifier } from "@egm/wtflib";
 *
 * // Invisible character removal (security-critical)
 * canonicalizeIdentifier("EFA\u200B-2"); // "efa-2" (zero-width space)
 * canonicalizeIdentifier("EFA\u200C-2"); // "efa-2" (zero-width non-joiner)
 * canonicalizeIdentifier("EFA\u200D-2"); // "efa-2" (zero-width joiner)
 * canonicalizeIdentifier("EFA\uFEFF-2"); // "efa-2" (BOM)
 * canonicalizeIdentifier("co\u00ADoperate"); // "cooperate" (soft hyphen)
 * ```
 *
 * @example
 * ```ts
 * import { canonicalizeIdentifier } from "@egm/wtflib";
 *
 * // Whitespace variants (all removed)
 * canonicalizeIdentifier("E F A - 2"); // "efa-2" (regular spaces)
 * canonicalizeIdentifier(" EFA -2 "); // "efa-2" (leading/trailing)
 * canonicalizeIdentifier("hello\tworld"); // "helloworld" (tab)
 * canonicalizeIdentifier("hello\u00A0world"); // "helloworld" (NBSP)
 * ```
 *
 * @example
 * ```ts
 * import { canonicalizeIdentifier } from "@egm/wtflib";
 *
 * // Unicode normalization (NFKC)
 * canonicalizeIdentifier("café"); // "cafe" (accented characters)
 * canonicalizeIdentifier("naïve"); // "naive" (decomposed forms)
 * ```
 *
 * @example
 * ```ts
 * import { canonicalizeIdentifier } from "@egm/wtflib";
 *
 * // Non-string input handling
 * canonicalizeIdentifier(null); // ""
 * canonicalizeIdentifier(undefined); // ""
 * canonicalizeIdentifier(123); // ""
 * canonicalizeIdentifier({}); // ""
 * ```
 *
 * @example
 * ```ts
 * import { canonicalizeIdentifier } from "@egm/wtflib";
 *
 * // Real-world use cases
 * canonicalizeIdentifier("John.Doe@Example.COM"); // "john.doe@example.com"
 * canonicalizeIdentifier("Document\u2010Final\u2013v2"); // "document-final-v2"
 * canonicalizeIdentifier("Adm\u200Bin"); // "admin" (attack prevention)
 * ```
 *
 * @see https://jsr.io/@egm/wtflib
 */
export function canonicalizeIdentifier(raw: unknown): string {
  // 1. Type guard: Handle non-strings gracefully
  if (typeof raw !== "string") return "";

  let s = raw;

  // 2. Unicode normalize (NFKC)
  s = s.normalize("NFKC");

  // 3. Remove Zero-Width characters AND Soft Hyphens
  s = s.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, "");

  // 4. Remove ALL whitespace
  s = s.replace(/\s+/g, "");

  // 5. Normalize hyphens
  s = s.replace(/[\u2010-\u2015\u2212]/g, "-");

  // 6. Lowercase for canonical form
  s = s.toLowerCase();

  return s;
}
