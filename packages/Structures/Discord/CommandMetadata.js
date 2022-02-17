class CommandMetadata {
  name = "";
  uses = 0;
  slashUses = 0;
  componentUses = 0;
  rateLimits = 0;

  constructor(name) {
    this.name = name;
  }
}

module.exports = CommandMetadata;
