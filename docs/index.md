# What is this?
HyArcade is a nodejs system made to support multiple frontend for hypixel arcade games data. The current frontend used are Arcade bot for discord and https://hyarcade.xyz for the website.

## The website
The layout of the website is really easy to use. When you start it out you are on a hub page with links to pages for all arcade games. At the very bottom there is also a player page you can use to see a specific person's arcade stats.

There is also guild leaderboards for active arcade guilds that can be accessed using the small people icon at the top of any leaderboard page.

If you click on a players name on a leaderboard it will take you to see their individual stats page where you can see more info about them.

## The bot
A significant part of this code base is just for the bot, this is because unlike the website it has to be able to serve with minimal user interaction.

There are four bot modules that currently exist which all work independently of eachother.

### Arcade bot
This is what most people are talking about when they talk about the bot for HyArcade. This bot is your standard text based discord bot that uses the `%` prefix. Most of the commands available in this module are either for bot maintenance or for fun things that don't require alot of logic handling. Aside from commands this module does handling of role updates in servers it's configured for.

### Interactions module
Discord has been adding these features called interactions recently which allow for interesting ways to do thing on discord. In my system I perfer to handle this entirely separately from the text based usage of the bot. This module is the things like, button interactions, slash commands, and menus. This is alot more efficient code wise for me and I do alot to make sure people use this more than text commands.

### Micro module
This is just a smaller version of the interactions module meant to be used in communities further outside of arcade. It has most of the same functionality as the arcade bot with the main differences being that it is only for interactions and also uses none of the database. This module being only for interactions allows for the usage to be the exact same without the bot ever being in the server. This means that you can add this module to your server and without the bot joining the slash commands will become available. This is far better for security as it means I can not see in to your server using my bot. I take security very seriously and have provided this way of using the bot for those who do as well.

### Mini walls module
This is a module made for displaying only mini walls stats and leaderboards exclusively for the mini walls discord server.
