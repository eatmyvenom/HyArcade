module.exports = {
    name: "addaccount",
    description: "Add any account(s) to the database",
    options: [
        {
            type: 3,
            name: "accounts",
            description: "IGNs or UUIDs of the accounts you want added to the database",
            required: true,
        },
    ],
};
