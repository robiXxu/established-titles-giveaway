const puppeteer = require('puppeteer');
const randomNames = require('./randomNames.json');
const { v4 } = require('uuid');

const url = 'https://establishedtitles.com/?giveaway';

const rndIndex = () => Math.floor(Math.random() * randomNames.length);
const pickRandomName = () => randomNames[rndIndex()];
const rndHash = () => v4().split('-')[0];
const generateEmail = () => `${pickRandomName()}.${pickRandomName()}${rndHash()}@gmail.com`

const run = async () => {
  const browser = await puppeteer.launch({
    args: [
      '-incognito'
    ],
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(url);

  await page.waitForSelector('#wlo-email-input');
  const inputElement = await page.$('#wlo-email-input');
  await inputElement.focus();

  const newEmail = generateEmail();

  await page.keyboard.type(newEmail);

  const buttonElement = await page.$('.wlo-btn-wlo-pulse');
  await buttonElement.click();

  await page.waitForSelector('#title > span');
  const titleValue = await page.evaluate(() => document.querySelector('#title > span').textContent);

  console.log(`${newEmail} won ${titleValue}`);

  if(titleValue !== 'Free Lord/Lady Title Pack') {
    // kill browser
    browser.close();
    // execute again
    run()
  } else {
    // print code | save
    // didn't got the code yet
  }
};

run();