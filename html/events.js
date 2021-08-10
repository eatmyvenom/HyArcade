const maxLength = 25;
let interval;

/**
 *
 */
async function load () {
  await refresh();
  clearInterval(interval);
  interval = setInterval(refresh, 25000);
}

/**
 *
 */
async function refresh () {
  const time = document.querySelector("time");
  let servertime = await fetch("https://hyarcade.xyz/resources/timeupdate", {
    cache: "no-store"
  });
  servertime = await servertime.text();
  const formatted = new Date(servertime);
  time.innerHTML = `Last database update : ${formatted.toLocaleTimeString()}`;
  let events = await fetch("https://hyarcade.xyz/resources/events.json", {
    cache: "no-store"
  });
  events = await events.text();
  await formatPage(events);
}

/**
 * @param events
 */
async function formatPage (events) {
  events = JSON.parse(events);
  console.log(events);
  const content = document.getElementById("evtWrapper");
  let newContent = "";
  for(const evt of events) {
    newContent += `${evt[1]}\n\n`;
  }
  content.innerHTML = newContent;
}

/**
 * @param number
 */
function formatNum (number) {
  const str = new Number(number);
  if(number == undefined) {
    return new Number(0).toLocaleString();
  } 
  return str.toLocaleString();
    
}

window.addEventListener("load", load);
