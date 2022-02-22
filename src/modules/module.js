// THIS IS AN EXAMPLE OF A MODULE

// the module needs to declare the parameters it needs
exports.parameters = [
    {
        name: "module_needs_this_parameter",
        required: true,
    },
    {
        name: "optional_parameter",
        required: false,
    },
];

exports.run = async ({ page, outputs, params, logger }) => {
    // the module can access this browser page, if you need, you can use multiple pages by accessing the upstream context object
    page;

    // the module can access the output of the previous modules
    outputs;

    // the module can access the parameters it asked for
    params;

    // the module should use this logger to log messages
    logger;

    // the module can pass data to the next modules
    const something_that_can_be_access_by_other_modules = {
        function: () => {},
        object: {},
        string: "",
        number: 0,
        boolean: false,
    };

    return something_that_can_be_access_by_other_modules;
};
