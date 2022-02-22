import { execSync } from "child_process";

prepare();

main();

function prepare(): void {
    try {
        process.stdout.write("Installing NPM Dependencies... ");
        execSync("npm install", { cwd: __dirname });
        console.log("Done");
    } catch (err) {}
    try {
        process.stdout.write("Installing Playwright Dependencies... ");
        execSync("npx playwright install", { cwd: __dirname });
        console.log("Done");
    } catch (err) {}
    try {
        process.stdout.write("Installing Browser Dependencies... ");
        execSync("npx playwright install-deps", { cwd: __dirname });
        console.log("Done");
    } catch (err) {}

    console.log("\n");
}

async function main(): Promise<void> {
    const core = require("@actions/core");
    try {
        const { BahamutAutomation } = require("./lib/core");

        const modules = core.getInput("modules");
        const parameters = { ...JSON.parse(core.getInput("parameters") || "{}") };
        const secrets = { ...JSON.parse(core.getInput("secrets") || "{}") };
        const browser = { type: "webkit", ...JSON.parse(core.getInput("browser") || "{}") }; // issue #32 workaround

        const automation = new BahamutAutomation({
            modules: modules.split(",").map((x: string) => x.trim()),
            params: { ...parameters, ...secrets },
            browser,
        });

        const result = await automation.run();

        if (result) {
            console.log(result);
            process.exit(0);
        }
    } catch (error) {
        core.setFailed(error.message);
        process.exit(1);
    }
}
