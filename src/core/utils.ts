async function sleep(ms: number) {
    new Promise((resolve) => setTimeout(resolve, ms));
}

export { sleep };
