import fs from "fs";
import { resolve } from "path";
import { execSync } from "child_process";

const root = resolve(__dirname, "..");

main();

async function main(): Promise<void> {
    process.stdout.write("Clear old files... ");
    if (fs.existsSync(resolve(root, "dist", "action"))) {
        fs.rmSync(resolve(root, "dist", "action"), { recursive: true });
    }
    console.log("Done");

    const lib = resolve(root, "dist", "lib");

    if (!fs.existsSync(lib)) {
        console.log("\nNo Lib Found, Running build:package");
        execSync("npm run build:package --silent", { stdio: "inherit" });
        console.log("Lib Built\n");
    }

    process.stdout.write("Copying Lib... ");
    copy_dir(resolve(root, "dist", "lib"), resolve(root, "dist", "action", "lib"));
    console.log("Done");

    process.stdout.write("Copying Configs... ");
    fs.copyFileSync(resolve(root, "package.json"), resolve(root, "dist", "action", "package.json"));
    fs.copyFileSync(resolve(root, "package-lock.json"), resolve(root, "dist", "action", "package-lock.json"));
    fs.copyFileSync(resolve(root, "action.yml"), resolve(root, "dist", "action", "action.yml"));
    console.log("Done");

    process.stdout.write("Compiling action.ts... ");
    execSync(
        `npx tsup --silent --target esnext --minify --loader ".md=text" ${resolve(root, "src", "action", "action.ts")} --out-dir ${resolve(
            root,
            "dist",
            "action",
        )}`,
        { stdio: "inherit" },
    );
    console.log("Done");
}

function copy_dir(src_dir: string, dest_dir: string): void {
    if (!fs.existsSync(src_dir)) {
        console.error(`${src_dir} does not exist`);
        return;
    }

    if (!fs.existsSync(dest_dir)) {
        fs.mkdirSync(dest_dir, { recursive: true });
    }

    const files = fs.readdirSync(src_dir);
    for (const file of files) {
        const src_file = resolve(src_dir, file);
        const dest_file = resolve(dest_dir, file);

        if (fs.statSync(src_file).isDirectory()) {
            copy_dir(src_file, dest_file);
        } else {
            fs.copyFileSync(src_file, dest_file);
        }
    }
}
