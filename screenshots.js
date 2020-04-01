const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

const outpath = './screenshots'
const websites = './sites.txt' // 1 url by line
const width = 800
const height = 600

let browser

const url2filename = function (url) {
  return url.replace(/[^a-z0-9]/gi, '_').toLowerCase()
}

const screenshot = async function (url) {
  const page = await browser.newPage()
  await page.goto(url).catch((err) => {
    console.error('goto error:', err)
  })
  await page.screenshot({ path: path.join(outpath, url2filename(url) + '.jpg') }).catch((err) => {
    console.error('screenshot error:', err)
  })
}

const file2array = (filename) => {
  return fs.readFileSync(filename).toString().split('\n')
}

const main = async () => {
  if (!fs.existsSync(outpath)) {
    fs.mkdirSync(outpath)
  }

  browser = await puppeteer.launch({
    defaultViewport: { width, height }
  })

  const urls = file2array(websites)
  for (let i = 0; i < urls.length; i++) {
    let url = urls[i].trim()
    if (!url) { continue } // skip blank lines
    if (!/^http/.test(url)) {
      url = 'http://' + url
    }
    console.log('"' + url + '"')
    await screenshot(url)
  }

  await browser.close()
}

main()
