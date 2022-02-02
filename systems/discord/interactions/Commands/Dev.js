module.exports = {
  name: "dev",
  description: "Arcade bot developer tools",
  options: [
    {
      type: 1,
      name: "link",
      description: "Link someone",
      options: [
        {
          name: "ign",
          type: "STRING",
          description: "persons in game name",
          required: true,
        },
        {
          name: "id",
          type: "STRING",
          description: "players uuid",
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "setpresence",
      description: "set the presence of arcade bot",
      options: [
        {
          name: "input",
          type: "STRING",
          description: "presence",
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "hackerlist",
      description: "edit hackerlist",
      options: [
        {
          name: "operation",
          type: "STRING",
          description: "what u wanna do",
          required: true,
        },
        {
          name: "uuid",
          type: "STRING",
          description: "who u wanna edit",
          required: false,
        },
      ],
    },
    {
      type: 1,
      name: "blacklist",
      description: "edit blacklist",
      options: [
        {
          name: "operation",
          type: "STRING",
          description: "what u wanna do",
          required: true,
        },
        {
          name: "id",
          type: "STRING",
          description: "who u wanna edit",
          required: false,
        },
      ],
    },
    {
      type: 1,
      name: "echo",
      description: "say something",
      options: [
        {
          name: "channel",
          type: "STRING",
          description: "where to send",
          required: true,
        },
        {
          name: "text",
          type: "STRING",
          description: "what to say",
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: "reload",
      description: "reload commands",
    },
  ],
};
