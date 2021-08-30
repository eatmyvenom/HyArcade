# Arcade wins
So you may have noticed that the arcade wins stat isn't accurate. Well this is actually impossible to get accurately from the hypixel API. Here is why.

### The achievement
Hypixel API has all tiered achievements availiable for each player with the amounts, even after they have completed the top tier it still counts up. Unfortunately there is an issue where some games do not count correctly. To my knowledge football is the most affected one by this issue. So while looking at the achievement amount there is significantly less wins than listed in game for football mains. I do believe other games are affected however I have not tested which are.

### Combined wins
For almost every game in arcade, there is an accurate wins stat availiable. However there is one game not listed in this, Capture the wool. For no good reason there is literally no *stats* in the API for capture the wool, the only way to read this info is via achievements, this means that combining the win counts from all the arcade games will never have capture the wool wins counted. For alot of people this means that there will be missing wins.

### The solution
Well there isn't one. I choose to display the achievement count as opposed to the combined count purely because it is the most rounded one and easiest to use. In some places I have both options displayed. Unfortunately the ways to get wins listed above are the only ways to get arcade wins from the API.