import fs from "fs";
import { resolve } from "path";
import { execSync } from "child_process";

const root = resolve(__dirname, "..");

main();

async function main(): Promise<void> {
    process.stdout.write("Clear old files... ");
    if (fs.existsSync(resolve(root, "dist", "binary"))) {
        fs.rmSync(resolve(root, "dist", "binary"), { recursive: true });
    }
    console.log("Done");

    const lib = resolve(root, "dist", "lib");

    if (!fs.existsSync(lib)) {
        console.log("\nNo Lib Found, Running build:package");
        execSync("npm run build:package --silent", { stdio: "inherit" });
        console.log("Lib Built\n");
    }

    process.stdout.write("Compiling Binaries... ");

    const node_version = "16";
    const platforms = ["win", "macos", "linux"];

    if (process.arch === "x64") {
        execSync(`npx pkg . --targets ${platforms.map((p) => `node${node_version}-${p}-x64`).join(",")}`, { stdio: "inherit" });
    } else {
        execSync(`npx pkg . --targets ${platforms.map((p) => `node${node_version}-${p}-arm64`).join(",")}`, { stdio: "inherit" });
    }
    console.log("Done");
}
