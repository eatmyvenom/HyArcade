const { writeJson } = require("fs-extra");
const Logger = require("hyarcade-logger");
const { Database } = require("hyarcade-requests");

/**
 * @param obj
 * @returns {object}
 */
function convertObject(obj) {
  const res = { type: "object", properties: {} };

  if (typeof obj == "string") {
    return { type: "string" };
  }

  if (Array.isArray(obj) && obj.length > 0) {
    return { type: "array", items: convertObject(obj[0]) };
  }

  for (const field in obj) {
    if (Array.isArray(obj[field] && obj.length > 0)) {
      res.properties[field] = { type: "array", items: convertObject(obj[field][0]) };
    } else if (typeof obj[field] == "object") {
      res.properties[field] = convertObject(obj[field]);
    } else {
      res.properties[field] = {
        type: typeof obj[field],
      };
    }
  }

  return res;
}

/**
 * @param obj
 * @param description
 * @param parameters
 * @param internal
 * @returns {object}
 */
async function getPath(obj, description, parameters, internal = false) {
  const schema = convertObject(obj);

  const response = {
    summary: description,
    parameters,
    responses: {
      200: {
        description,
        content: { "application/json": { schema } },
      },
      404: { $ref: "#/components/responses/MissingPage" },
    },
  };

  if (internal) {
    response.security = [{ "Database Pass": [] }];
  }

  return response;
}

/**
 *
 */
async function main() {
  const swagger = { openapi: "3.0.3" };

  swagger.info = {
    title: "Hyarcade API",
    description: `# Introduction
      This is backend api for all Hyarcade systems
      [Hyarcade](https://hyarcade.xyz/) - [GitHub Repo](https://github.com/eatmyvenom/hyarcade)
## Limits
      Any IP address has a default rate limit of 120 requests per minute.

## Response Format
All responses in JSON format.
      # Authentication
      <!-- ReDoc-Inject: <security-definitions> -->`,
    version: "v1",
    contact: {
      name: "EatMyVenom",
      url: "https://vnmm.dev",
      email: "v.nmm@outlook.net",
    },
  };

  swagger.servers = [{ url: "https://api.hyarcade.xyz" }];

  const securitySchemes = {
    "Api Key": {
      type: "apiKey",
      in: "header",
      name: "key",
      description: "Not needed in most use cases, the rate limits are 120/minute per IP. If you want to use more than that contact eatmyvenom.",
    },
    "Database Pass": {
      type: "Override",
      in: "header",
      name: "authorization",
      description: "A key to use internal systems and override rate limits, meant for any companion systems like Arcade Bot.",
    },
  };

  const responses = {
    RateLimited: {
      description: "A request limit has been reached, usually this is due to the limit on the key being reached but can also be triggered by a global throttle.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                example: false,
              },
              reason: {
                type: "string",
                example: "RATELIMIT",
              },
              timeout: {
                type: "number",
                example: 30000,
              },
            },
          },
        },
      },
    },
    MissingPage: {
      description: "The data requested does not exist.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                example: false,
              },
              cause: {
                type: "string",
                example: "Data not found",
              },
            },
          },
        },
      },
    },
  };

  swagger.components = { securitySchemes, responses };

  swagger.paths = {
    "/account": {
      get: await getPath(await Database.account("vnmm", undefined, true), "Account", [
        {
          in: "query",
          name: "uuid",
          schema: {
            type: "string",
          },
          required: false,
        },
        {
          in: "query",
          name: "ign",
          schema: {
            type: "string",
          },
          required: false,
        },
        {
          in: "query",
          name: "discid",
          schema: {
            type: "string",
          },
          required: false,
        },
      ]),
      post: await getPath({ success: true }, "Upload Account"),
    },
    "/leaderboard": {
      get: await getPath(await Database.getLeaderboard("wins", "partyGames", "monthly", false, false, 10), "Leaderboard", [
        {
          in: "query",
          name: "category",
          schema: {
            type: "string",
          },
          required: false,
        },
        {
          in: "query",
          name: "path",
          schema: {
            type: "string",
          },
          required: true,
        },
        {
          in: "query",
          name: "time",
          schema: {
            type: "string",
          },
          required: false,
        },
        {
          in: "query",
          name: "max",
          schema: {
            type: "integer",
          },
          required: false,
        },
        {
          in: "query",
          name: "filter",
          schema: {
            type: "string",
          },
          required: false,
        },
      ]),
    },
    "/database": {
      get: await getPath({}, "Database collection", [
        {
          in: "query",
          name: "path",
          schema: {
            type: "string",
          },
          required: true,
        },
      ]),
    },
    "/miniwalls": {
      get: await getPath(await Database.getMWLeaderboard("wins"), "Mini Walls Leaderboard", [
        {
          in: "query",
          name: "stat",
          schema: {
            type: "string",
          },
          required: false,
        },
        {
          in: "query",
          name: "time",
          schema: {
            type: "string",
          },
          required: false,
        },
      ]),
    },
    "/info": { get: await getPath(await Database.info(), "Info") },
    "/ping": { get: await getPath({ response: "pong" }, "Ping") },
    "/status": {
      get: await getPath(await Database.status("vnmm"), "Status", [
        {
          in: "query",
          name: "uuid",
          schema: {
            type: "string",
          },
          required: false,
        },
        {
          in: "query",
          name: "ign",
          schema: {
            type: "string",
          },
          required: false,
        },
        {
          in: "query",
          name: "discid",
          schema: {
            type: "string",
          },
          required: false,
        },
      ]),
    },
    "/gamecounts": { get: await getPath(Database.gameCounts(), "Game Counts") },
    "/guild": {
      get: await getPath(await Database.guild("53bd67d7ed503e868873eceb"), "Guild", [
        {
          in: "query",
          name: "uuid",
          schema: {
            type: "string",
          },
          required: false,
        },
        {
          in: "query",
          name: "member",
          schema: {
            type: "string",
          },
          required: false,
        },
      ]),
    },
    "/disc": {
      get: await getPath(
        { success: true },
        "Discord Meta",
        [
          {
            in: "query",
            name: "uuid",
            schema: {
              type: "string",
            },
            required: false,
          },
          {
            in: "query",
            name: "id",
            schema: {
              type: "string",
            },
            required: false,
          },
          {
            in: "query",
            name: "action",
            schema: {
              type: "string",
            },
            required: false,
          },
        ],
        true,
      ),
    },
    "/hacker": {
      get: await getPath(
        { success: true },
        "Hacker Meta",
        [
          {
            in: "query",
            name: "action",
            schema: {
              type: "string",
            },
            required: false,
          },
          {
            in: "query",
            name: "uuid",
            schema: {
              type: "string",
            },
            required: false,
          },
        ],
        true,
      ),
    },
    "/banned": {
      get: await getPath(
        { success: true },
        "Banned Meta",
        [
          {
            in: "query",
            name: "action",
            schema: {
              type: "string",
            },
            required: false,
          },
          {
            in: "query",
            name: "uuid",
            schema: {
              type: "string",
            },
            required: false,
          },
        ],
        true,
      ),
    },
    "/internal": { post: await getPath({ success: true }, "Internal usage", undefined, true) },
  };

  await writeJson("systems/redoc/swagger-new.json", swagger, { spaces: 2 });
}

main()
  .then(() => {})
  .catch(error => Logger.err(error));
