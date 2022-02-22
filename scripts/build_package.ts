import fs from "fs";
import { resolve } from "path";
import { execSync } from "child_process";

const root = resolve(__dirname, "..");

main();

async function main(): Promise<void> {
    process.stdout.write("Clear old files... ");
    if (fs.existsSync(resolve(root, "dist", "lib"))) {
        fs.rmSync(resolve(root, "dist", "lib"), { recursive: true });
    }
    console.log("Done");

    process.stdout.write("Compiling Core... ");
    execSync(`npx tsup --silent --target esnext --minify ${resolve(root, "src", "core")} --out-dir ${resolve(root, "dist", "lib", "core")}`, {
        stdio: "inherit",
    });
    console.log("Done");

    process.stdout.write("Compiling Modules... ");
    execSync(
        `npx tsup --silent --target esnext --minify --loader ".md=text" ${resolve(root, "src", "modules")} --out-dir ${resolve(
            root,
            "dist",
            "lib",
            "modules",
        )}`,
        { stdio: "inherit" },
    );
    console.log("Done");
}
