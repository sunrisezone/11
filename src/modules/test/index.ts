import { Module } from "../_module";

const test = new Module();

test.parameters = [
    {
        name: "test_parameter",
        required: false,
    },
];

test.run = async ({ page, params, outputs, logger }) => {
    await import("./video").then((m) => m.default(page, logger));
};

export default test;
