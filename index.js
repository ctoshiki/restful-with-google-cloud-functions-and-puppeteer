const puppeteer = require('puppeteer');
require('dotenv').config();

async function getItems() {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();

  // login page
  await page.goto(process.env.LOGIN_URL);
  await page.type('input[name="login_email"]', process.env.LOGIN_ID);
  await page.type('input[name="login_pass"]', process.env.LOGIN_PASSWORD);
  await page.click('button[type=submit]');
  await page.waitFor(1000);

  // itemlist page
  await page.goto(process.env.ITEMLIST_URL);

  // select items <li></li>
  const itemList = await page.$$('#m_system ul li');

  // constract items
  let items = [];
  let title = "";
  let price = "";
  let url = "";
  
  for (const item of itemList) {
    const itemTitle = await item.$('.title');
    const itemPrice = await item.$('.price');
    const itemUrl = await item.$('a');

    title = (await (await itemTitle.getProperty('textContent')).jsonValue()).trim();
    price = (await (await itemPrice.getProperty('textContent')).jsonValue()).trim();
    url = await (await itemUrl.getProperty('href')).jsonValue();

    await items.push({title: title, price: price, url: url});
  }
  await browser.close();
  return { itemList: items };
}


exports.run = function(req, res) {
  getItems().then(result => {
    res.status(200).send(JSON.stringify(result));
  });
};
