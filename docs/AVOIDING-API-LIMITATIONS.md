# Avoiding the hypixel api limitations

So recently I was working on this whole system. However I have issues with the speed at which the whole system updates. I decided to take the advice all over the whole Hypixel website where it said "if you need more requests per minute then open a support ticket." So I did just that, and after two months of nearly no communication they said no. However since I try to keep up to date data and that my service is taking user requests away from planke, it makes sense for me to have more requests.

## Using multiple keys

Hypixel states directly that you are not allowed to do this. As well this is easy to track and you should avoid doing this.

I have personally implemnted this a little bit in my code. Its for testing purposes so I do not need to wait on just api limit while testing what works. I make sure it is also random so that I don't just max requests on one key and go to the next.

```js
let key = config.key;
if (config.mode == "test") {
    key = config.hypixel.batchKeys[Math.floor(Math.random() * config.hypixel.batchKeys.length)];
}
```

While using this system I am able to avoid the limitation on my testing environment. However I avoid using this in the actual enviorment.

## Clusters

This is a far better system for using multiple keys while not being detected at least. My system uses this for seperating different tasks that are done that require many key usages.

The way this works is by having different keys and tasks per cluster. Then just put the whole system on that cluster and then run the tasks specific to that cluster.

Another advantage to this is that I have the ability to run these inside other small systems like github actions or repl.it and similar. I am currently running the main cluster on my server and the status cluster on my raspi at home.

## Other peoples services

Another alternative to using any requests is to go through another source to process requests. In this case that other source could be plancke.io. When I first started this project I actually only had a few shell scripts that basically did `curl -> grep -> sed` and I would just keep the formatting and what not. This is directly abusive of other peoples limitations and isn't easy to filter what data you need.

## Proxies

Proxies are quite self explanatory, simply do all of your code execution from one machine and then do your internet transactions through a different sever. In my case I believe a github actions instance with ssh doing a SOCKS proxy. SOCKS makes the sever location variable, which is advantagious if you are pursued for api abuse.

## Modding

This approach requires either a bit of trust or good security knowledge and extreme flexability. With this you can in theory make a mod that simply uses someone elses keys while they are in game. So you go through this process: `join server -> get new key -> use key -> disable on server disconnect`. With this you can have alot of people constantly pulling your data for you. However you need a cluster broker which tells each client what to do and can handle unexpected disconnects. I highly advise telling people if your mod does this!

