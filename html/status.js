async function load() {
    let status = await fetch("https://hyarcade.xyz/resources/serverStatus.json", { cache: "no-store" });
    status = await status.json();
    let div = document.querySelector("div");
    let mw = (status.mw) ? "Online" : "Inactive";
    let arc = (status.arc) ? "Online" : "Inactive";
    let interact = (status.slash) ? "Online" : "Inactive";
    let db = (status.database) ? "Operational" : "Corrupted";
    div.innerHTML = `Hypixel status : ${status.Hypixel}\n`;
    div.innerHTML += `Mojang session servers : ${status.MSession}\n`;
    div.innerHTML += `Mojang account servers : ${status.MAcc}\n`;
    div.innerHTML += `Mojang auth servers: ${status.MAuth}\n`;
    div.innerHTML += `Mini walls bot : ${mw}\n`;
    div.innerHTML += `Arcade bot : ${arc}\n`;
    div.innerHTML += `Interactions : ${interact}\n`;
    div.innerHTML += `Database : ${db}`;
}

window.addEventListener("load", load);