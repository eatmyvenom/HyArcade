# Message component id specification

This is how to format the id of any message component for command interactions. This so far only includes buttons and menus but can be pushed to right click menus once they are released by discord.

## Format
`[command type]:[arg1]:[arg2]`

* `Delimiter` - " **:** " is used to seperate the command name and arguments. Any name or argument cannot contain this character, it was specifically chosen due to its scarcity within the hyarcade codebase.

* `Command type` - a shortend version or name of the inital command run which the component is attached to.

* `argX` - Any argument to be passed to the parser to vary the resulting output. This should be the shortest and most descriptive string possible to avoid hitting the ID character limit.

## Examples

* Leaderboard example - `lb:20:mw` - This is obviously very short and still unique to any other possible leaderboard command.

* Stats example - `s:92a5199614ac4bd181d1f3c951fb719f:pg` - Even though the UUID is very long its acceptable since it ensures there is no potential difference between what was initially displayed and the button result.
