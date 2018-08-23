
import {isDebugging} from './testingInit'
const puppeteer = require('puppeteer')
const striptags = require('striptags')

/**
 *  CAUTION!!!
these test requires the service to be run. the test wont work if service not running.
*/

const APP = 'http://localhost:3000/'
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

describe("interaction test", ()=>{
    test('landing on page and sees normal table header & "not pivot" switch', async()=>{
        await page.goto(APP)
        // await page.waitFor('.ant-table-thead')
        const selector = await page.$('.ant-table-thead');
        const html = await page.evaluate(body => body.innerHTML, selector);

        expect(html).toBe('<tr><th class="ant-table-column-has-filters"><span>ID<div class="ant-table-column-sorter"><span class="ant-table-column-sorter-up off" title="↑"><i class="anticon anticon-caret-up"></i></span><span class="ant-table-column-sorter-down off" title="↓"><i class="anticon anticon-caret-down"></i></span></div></span></th><th class="ant-table-column-has-filters"><span>Full Name<div class="ant-table-column-sorter"><span class="ant-table-column-sorter-up off" title="↑"><i class="anticon anticon-caret-up"></i></span><span class="ant-table-column-sorter-down off" title="↓"><i class="anticon anticon-caret-down"></i></span></div></span></th><th class=""><span>Email</span></th><th class="ant-table-column-has-filters"><span>Item<div class="ant-table-column-sorter"><span class="ant-table-column-sorter-up off" title="↑"><i class="anticon anticon-caret-up"></i></span><span class="ant-table-column-sorter-down off" title="↓"><i class="anticon anticon-caret-down"></i></span></div></span></th><th class="" style="text-align: right;"><span>Quantity</span></th><th class="" style="text-align: right;"><span>Total Price</span></th></tr>')

        const switchSelector = await page.$('#__next > div > div > div > div.ant-layout-header > span > span')
        const label = await page.evaluate(body => body.innerHTML, switchSelector);
        expect(label).toBe('Pivot Off')
    })

    test('click on ID column header and sees row re-sorted', async()=>{
        let selector = await page.$('#__next > div > div > div > div.ant-layout-content > div > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(1)')
        const idBefore = await page.evaluate(res=>{
            return parseInt(res.innerText)
        }, selector)
        expect(idBefore).toEqual(1)

        const sorter = await page.$('#__next > div > div > div > div.ant-layout-content > div > div > div > div > div > div > table > thead > tr > th:nth-child(1) > span > div > span.ant-table-column-sorter-down.off')
        await page.evaluate(res => res.click(), sorter)

        await page.waitFor(2000)
        selector = await page.$('#__next > div > div > div > div.ant-layout-content > div > div > div > div > div > div > table > tbody > tr:nth-child(1) > td.ant-table-column-has-filters.ant-table-column-sort')
        const idAfter = await page.evaluate(res=>{return parseInt(res.innerText)}, selector)
        expect(idAfter).toEqual(100)
    })

    test('click on pivot switch and sees correct table header', async()=>{
        let theSwitch = await page.$('.ant-switch')
        await page.evaluate(res => res.click(), theSwitch)

        const selector = await page.$('.ant-table-thead');
        const header = await page.evaluate(body => body.outerHTML, selector);

        expect(striptags(header,[],' ').trim().split('    ').map(x=>x.trim()).filter(x=>x.length > 0).length).toEqual(12)
    })
})