import { promisify } from "node:util";
import { defineTool } from "./test.type.js";
import z from "zod";
import { execFile } from "node:child_process";

const run = promisify(execFile);

export const handler = async ({ command }: { command: string }) => {
  try {
    // execFile with an args array: no host shell involved, so no host-side injection
    const { stdout, stderr } = await run(
      "docker",
      [
        "run",
        "--rm",
        // "--read-only", // container filesystem is read-only
        "--network",
        "none", // no network
        "--user",
        "1000:1000", // unprivileged
        "--memory",
        "256m",
        "--cpus",
        "0.5",
        "--pids-limit",
        "64",
        "-v",
        `${process.cwd()}/data:/data:ro`, // only this dir, read-only
        "-w",
        "/data",
        "ubuntu:24.04",
        "timeout",
        "25",
        "bash",
        "-c",
        command, // kill runaway commands inside the container
      ],
      { timeout: 30_000, maxBuffer: 1_000_000 },
    );
    return (stdout + stderr).slice(0, 10_000);
  } catch (e: any) {
    return `Error: ${e.stderr || e.message}`.slice(0, 10_000);
  }
};

export const bashTool = defineTool({
  name: "bash",
  description:
    "Run a bash command in a Linux read-only sandbox. The user's files are at /data (read-only). Use Linux paths.",
  parameters: z.object({
    command: z.string(),
  }),
  handler,
});
