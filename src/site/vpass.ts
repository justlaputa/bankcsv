/**
 * SMBC Vpass credit card
 */
import  * as puppeteer  from 'puppeteer';
import { CardDownloader, DownloadResult } from ".";
import { delay } from '../async-util';
import path = require('path');

const VPASS_LOGIN = 'https://www.smbc-card.com/mem/index.jsp'

const ANA_DETAIL_PAGE_URL = 'https://www.smbc-card.com/memx/web_meisai/top/index.html'
const DETAIL_CARD_NAME = '#vp_alcor_view_Label_2'
const DETAIL_PAYMENT_DATE = '#vp_alcor_view_Label_9'
const DETAIL_PAYMENT_AMOUNT = '#vp_alcor_view_Label_11'

const TOP_DETAIL_PAGE_URL = 'https://www.smbc-card.com/memx/seikyu/index.html'
const USERNAME_SELECTOR = 'input[name="userid"]'
const PASS_SELECTOR = 'input[name="password"]'
const LOGIN_BTN_SELECTOR = '.loginSubmit > input[type="submit"]'
const DOWNLOAD_CSV_BTN_SELECTOR = '#vp-view-VC0502-003_RS0001_U051111_3'

const CSV_RESP_URL_PREFIX = 'https://www.smbc-card.com/memapi/jaxrs/dl/web_meisai/web_meisai_csv_exec/v1'

export class VpassDownloader implements CardDownloader {
    constructor() {}

    async login(browser: puppeteer.Browser): Promise<void> {
        console.log('login into vpass site...')
        const page = await browser.newPage()
        await page.goto(VPASS_LOGIN)

        console.log('please pull the capture and click login')
        await page.waitForNavigation()
    }

    async download(page: puppeteer.Page): Promise<string> {
        console.log('start downloading from vpass...')

        await this._login(page)

        //ANA
        await this._gotoAnaDetaiPage(page)
        const anaFilepath = await this._downloadCSV(page)
        console.log('ana file downloaded to %s', anaFilepath)

       return anaFilepath
    }

    async _login(page: puppeteer.Page) {
        console.log('login with credentials...')
        await page.goto(VPASS_LOGIN)
        await page.type(USERNAME_SELECTOR, process.env.VPASS_USER || '')
        await page.type(PASS_SELECTOR, process.env.VPASS_PASS || '')
        await page.evaluate((loginSelector) => {
            let element: HTMLElement = document.querySelector(loginSelector) as HTMLElement
            element.click()
        }, LOGIN_BTN_SELECTOR)
        
        await page.waitForNavigation()
        console.log('login success')
        await delay(500)
    }
    
    async _gotoAnaDetaiPage(page: puppeteer.Page): Promise<void> {
        console.debug('navigating to web report top page for default card')
        await page.goto(ANA_DETAIL_PAGE_URL)
        await delay(1000)

        console.debug('waiting for download button to appear')
        await page.waitForSelector(DOWNLOAD_CSV_BTN_SELECTOR)
    }
    
    async _downloadCSV(page: puppeteer.Page) {
        console.debug('clicking download csv button')
        await page.click(DOWNLOAD_CSV_BTN_SELECTOR)
    
        const response = await page.waitForResponse(resp => resp.url().startsWith(CSV_RESP_URL_PREFIX))
        const downloadFilename = await this._getFilenameFromHeaders(response.headers())
    
        await delay(5000)
        
        return downloadFilename
    }

    async _getFilenameFromHeaders(headers: any): Promise<string> {
        const value = headers['content-disposition']
        if (!value) {
            return ''
        }
    
        const matches = /filename="(.*)"/.exec(value)
        if (!matches || matches.length < 1) {
            return ''
        }
    
        return matches[1]
    }

    _addBasenamePrefix(filepath: string, prefix: string) {
        const dir = path.dirname(filepath)
        const basename = path.basename(filepath)
        return path.resolve(dir, prefix + basename)
    }
}
