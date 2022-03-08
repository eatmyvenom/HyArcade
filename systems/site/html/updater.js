/* eslint-disable no-unused-vars */
let maxLength = 50;

/**
 * @param ext
 * @param clazzz
 */
function addstuff(ext, clazzz) {
  fetch(`https://eatmyvenom.me/share/${ext}`, {
    cache: "no-store",
  }).then(res => {
    res.text().then(txt => {
      const arr = txt.split("\n");
      const len = Math.min(arr.length, maxLength);
      const newArr = arr.slice(0, len);
      console.log(ext);
      if (`${ext}`.includes("pgA") || ext.includes("status")) {
        for (let i = 0; i < newArr.length; i += 1) {
          if (newArr[i].trim() != "") {
            const line = newArr[i].split(":");
            newArr[i] = `<a href='https://hyarcade.xyz/player?q=${line[0].replace(/\d{3}\)/g, "").trim()}'>${line[0]}</a>:${line[1]}`;
          }
        }
      }
      document.querySelector(clazzz).innerHTML = newArr.join("\n").trim();
    });
  });
}

/**
 *
 */
function main() {
  addstuff("pgd.txt", ".daily");
  addstuff("pg.txt", ".lb");
  addstuff("pgG.txt", ".guild");
  addstuff("pgGd.txt", ".guildday");
  addstuff("pgA.txt", ".accounts");
  addstuff("pgAd.txt", ".accountsday");
  addstuff("hynums.txt", ".counts");
}

/**
 * @param sel
 */
function toggleDisplay(sel) {
  const e = document.querySelector(sel);
  e.style.display = e.style.display === "none" ? "inline-block" : "none";
}

/**
 * @param sel
 */
function toggleBtn(sel) {
  const e = document.querySelector(sel);
  if (e.hasAttribute("off")) {
    e.removeAttribute("off");
  } else {
    e.setAttribute("off", "");
  }
}

/**
 *
 */
function toggleCombined() {
  toggleDisplay(".lbh");
  toggleDisplay(".lb");
  toggleDisplay(".dayh");
  toggleDisplay(".daily");
  toggleBtn(".lbb");
}

/**
 *
 */
function toggleGuilds() {
  toggleDisplay(".gldh");
  toggleDisplay(".guild");
  toggleDisplay(".glddh");
  toggleDisplay(".guildday");
  toggleBtn(".gldb");
}

/**
 *
 */
function toggleNormal() {
  toggleDisplay(".acch");
  toggleDisplay(".accounts");
  toggleDisplay(".accdh");
  toggleDisplay(".accountsday");
  toggleBtn(".accb");
}

/**
 * @param value
 */
function maxValChange(value) {
  maxLength = value;
}

main();
setInterval(main, "5000");
