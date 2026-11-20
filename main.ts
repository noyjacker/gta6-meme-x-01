// Entry program for the make.fun bounty "Post a GTA 6 meme on X"
// (competition gta6-meme-x-01).
//
// The entry itself is a post on X; this repository only hands the house the
// post's address. So the whole program does one thing: it copies POST.json
// from the repository directory into the output directory, byte for byte.
// Success is silent — nothing on stdout, nothing on stderr, exit code 0 —
// because the grader reads the copied file and looks the post up on X
// itself; anything this program printed would be noise.
//
// The program is deterministic on purpose: no network, no clock, and no
// file access outside the repository directory and the output directory,
// so two runs always leave the same bytes behind.

import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// Inside the grader's container the repository and the output folder sit at
// fixed mounts; anywhere else the same two places arrive through the
// environment, which is how the local run in the README points them at ".".
function sourceDir(): string {
  return process.env.MAKEFUN_BOT_DIR ?? "/bot";
}

function targetDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
}

const POST_FILE_NAME = "POST.json";

function deliverPostFile(): void {
  const from = join(sourceDir(), POST_FILE_NAME);
  const folder = targetDir();
  mkdirSync(folder, { recursive: true });
  copyFileSync(from, join(folder, POST_FILE_NAME));
}

try {
  deliverPostFile();
} catch (problem) {
  const reason = problem instanceof Error ? problem.message : String(problem);
  console.error(`POST.json was not delivered: ${reason}`);
  process.exit(1);
}
