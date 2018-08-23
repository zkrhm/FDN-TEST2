import {isDebugging} from './testingInit'
const puppeteer = require('puppeteer')
const npm = require('npm')

/**
 *  CAUTION!!!
these test requires the service to be run. the test wont work if service not running.
*/

const APP = 'http://localhost:3001/'
let page
let browser
const width = 1920;
const height = 1080;

let getJsonPayload = () =>  {
    return JSON.parse(document.querySelector("pre").innerText)
}

beforeAll(async ()=>{

    browser = await puppeteer.launch(isDebugging().puppeteer)
    page = await browser.newPage()
    await page.setViewport({width,height})

    process.env.USER_ACCESS_TOKEN = null
})

afterAll(async ()=>{
    browser.close()
})

describe("api visiting",()=>{
    test("if visiting root path will be redirected to /v1/api path",async()=>{
        await page.goto(APP)
        // await page.waitForNavigation({waitUntil: 'networkidle0'})
        let content = await page.evaluate(getJsonPayload)
        expect(content.payload.length).toBeGreaterThan(0)
    })

    test("if mode 'pivot' parameter get carried with redirection", async()=>{
        await page.goto(`${APP}?mode=pivot`)
        let content = await page.evaluate(getJsonPayload)
        let obj = content.payload[0]
        expect(Object.keys(obj)).toEqual(['fullname','email','barang_0','barang_1',
            'barang_2','barang_3','barang_4','barang_5','barang_6','barang_7','barang_8','barang_9','key'])
    })
} )