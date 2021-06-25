module.exports = {
    name: "getdataraw",
    description: "Get some raw data from an account based on the database",
    options: [
        {
            type: 3,
            name: "path",
            description: "The field name of the data you are looking for",
            required: true,
        },
        {
            type: 3,
            name: "player",
            description: "The player you want to see the data of",
            required: false,
        },
    ],
};