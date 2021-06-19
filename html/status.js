async function load() {
    let status = await fetch("https://hyarcade.xyz/resources/serverStatus.json", { cache: "no-store" });
    status = await status.json();
    let main = document.querySelector("main");
    let mw = (status.mw) ? "Online" : "Inactive";
    let arc = (status.arc) ? "Online" : "Inactive";
    let interact = (status.slash) ? "Online" : "Inactive";
    let db = (status.database) ? "Operational" : "Corrupted";
    main.innerHTML = `Hypixel status : ${status.Hypixel}\n`;
    main.innerHTML += `Mojang session servers : ${status.MSession}\n`;
    main.innerHTML += `Mojang account servers : ${status.MAcc}\n`;
    main.innerHTML += `Mojang auth servers: ${status.MAuth}\n`;
    main.innerHTML += `Mini walls bot : ${mw}\n`;
    main.innerHTML += `Arcade bot : ${arc}\n`;
    main.innerHTML += `Interactions : ${interact}\n`;
    main.innerHTML += `Database : ${db}`;
}

window.addEventListener("load", load);