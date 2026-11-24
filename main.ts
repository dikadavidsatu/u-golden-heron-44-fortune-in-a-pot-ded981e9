// Fortune in a Pot
// make.fun entry — writes a single original houseplant fortune to /output/entry.txt.
//
// The fortune: the morning sun lingering on the plant's leaves, and the
// keeper proudly telling guests the plant planned it that way. A prediction
// with the cadence of a fortune, specific to the plant on the windowsill —
// sun, leaves, keeper, guests — kind, and funny without a pun. It was
// trimmed from a 122-character draft to 113 so it sits comfortably inside
// the 120-character gate with no padding for its own sake.
//
// The output file is left world-readable (0644): the grader collects
// /output as a different user, so a restrictive mode would fail the run.
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export const FORTUNE =
  "Soon the morning sun will linger on your leaves longer, and your keeper will tell guests you planned it that way.";

export const MAX_CHARS = 120;
export const OUTPUT_PATH = "/output/entry.txt";

/** The competition gate: 1-120 characters of UTF-8 text, not only whitespace. */
export function isValidEntry(text: string): boolean {
  if (typeof text !== "string") return false;
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) return false;
  if (text.trim().length === 0) return false;
  if (text.includes("\n") || text.includes("\r")) return false;
  return true;
}

function main(): void {
  if (!isValidEntry(FORTUNE)) {
    throw new Error(
      `Fortune fails the gate: ${[...FORTUNE].length} chars (limit ${MAX_CHARS})`,
    );
  }
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, FORTUNE, "utf8");
  chmodSync(OUTPUT_PATH, 0o644);
  // Read it back and re-check the gate on exactly what was written,
  // so a partial write or encoding slip fails loudly instead of
  // silently shipping an invalid entry.
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== FORTUNE || !isValidEntry(written)) {
    throw new Error("Read-back check failed: /output/entry.txt is not the fortune");
  }
  console.log(`Wrote ${[...FORTUNE].length} chars to ${OUTPUT_PATH}`);
  console.log(FORTUNE);
}

main();
