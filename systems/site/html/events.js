/* eslint-disable jsdoc/require-returns */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
const maxLength = 25;
let interval;

/**
 *
 */
async function load() {
  await refresh();
  clearInterval(interval);
  interval = setInterval(refresh, 250000);
}

/**
 *
 */
async function refresh() {
  let events = await fetch("https://hyarcade.xyz/resources/events.json", {
    cache: "no-store",
  });
  events = await events.text();
  await formatPage(events);
}

/**
 * @param events
 */
async function formatPage(events) {
  events = JSON.parse(events);
  console.log(events);
  const content = document.querySelector("#evtWrapper");
  let newContent = "";
  for (const evt of events) {
    newContent += `${evt[1]}\n\n`;
  }
  content.innerHTML = newContent;
}

/**
 * @param number
 */
function formatNum(number) {
  const str = Number(number);
  if (number == undefined) {
    return Number(0).toLocaleString();
  }
  return str.toLocaleString();
}

window.addEventListener("load", load);
