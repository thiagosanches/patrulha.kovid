const puppeteer = require('puppeteer');
const fs = require('fs');

let alreadyPosted = [];
const isDraft = process.argv[2] === "true" ? true : false;
const username = process.argv[3];
const password = process.argv[4];

const emojis = [
  "👀",
  "💋",
  "😷",
  "🤗",
  "😎",
  "😚",
  "🤨",
  "😊"
]

const phrases = [
  "Oie, lembrem-se: Evitem aglomerações e usem máscaras!",
  "Olá!!! só um lembrete: Vamos usar máscaras sempre que possível e evitar aglomerações!!! Tudo isso vai passar se todos colaborarem.",
  "Oi, só um recadinho!!! Vamos usar máscaras e evitar aglomerações!!! Tudo isso vai passar se todos colaborarem.",
  "Olá, passando só para deixar um lembrete: Vamos usar máscaras e evitar aglomerações!!!",
  "Oie vamos usar máscaras e evitar aglomerações!!! Ótimo 2021!",
]

const totalEmojis = emojis.length;
const totalPhrases = phrases.length;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

try {
  alreadyPosted = require('./alreadyPosted')
  console.log("Getting previous data:", alreadyPosted)
}
catch (e) {
  console.log("Error:", e.message);
}

(async () => {

  const browser = await puppeteer.launch(
    {
      headless: false,
      args: [
        '--disable-gpu',
      ]
    }
  );

  const page = await browser.newPage();
  await page.goto('https://www.instagram.com');
  await page.waitForTimeout(1000);
  await page.type("input[name=username]", username, { delay: 3 });
  await page.type("input[name=password]", password, { delay: 3 });
  await page.click("button[type=submit]")
  await page.waitForTimeout(3000);
  await page.goto("https://www.instagram.com/explore/locations/213949389/campinas-sao-paulo/");
  await page.waitForTimeout(1000);

  const elementHandles = await page.$$('a');
  const propertyJsHandles = await Promise.all(
    elementHandles.map(handle => handle.getProperty('href'))
  );

  const hrefs2 = await Promise.all(
    propertyJsHandles.map(handle => handle.jsonValue())
  );

  const regex = "\/p\/.*\/";

  for (let index = 0; index < hrefs2.length; index++) {
    let url = hrefs2[index];
    let match = url.match(regex);
    if (match && !alreadyPosted.find(i => i === match[0])) {
      try {
        console.log('Working on:', url);
        await page.click(`a[href=\"${match[0]}\"]`);
        await page.waitForTimeout(900);
        await page.type("[placeholder=\"Add a comment…\"]", `${phrases[getRandomInt(0, totalPhrases)]}${emojis[getRandomInt(0, totalEmojis)]}`, { delay: 15 });
        await page.waitForTimeout(500);

        if (!isDraft)
          await page.click("button[type=submit]");

        await page.waitForTimeout(30000);
        await page.mouse.move(3, 3);
        await page.mouse.down();
        await page.mouse.up();
        alreadyPosted.push(match[0]);
        fs.writeFileSync("alreadyPosted.json", JSON.stringify(alreadyPosted), 'utf-8');
      }
      catch (e) {
        console.log('Error', e.message);
      }
    }
    else {
      console.log("Already posted on:", url);
    }
  }
  await browser.close();
})();
