/** vpass.js
 * login to SMBC vpass credit card site and download the latest CSV statement file
 * 
 * Username and password are given by environment varialbes:
 * username: VPASS_USER
 * password: VPASS_PASS
 */

import path from 'path'
import {waitForFileExists, renameFile, getFilenameFromHeaders, addBasenamePrefix} from './util'

const VPASS_LOGIN = 'https://www.smbc-card.com/mem/index.jsp'
const ANA_DETAIL_PAGE_URL = 'https://www.smbc-card.com/memx/web_meisai/top/index.html'
const TOP_DETAIL_PAGE_URL = 'https://www.smbc-card.com/memx/seikyu/index.html'
const USERNAME_SELECTOR = 'div.loginInfoBox input[name="userid"]'
const PASS_SELECTOR = 'div.loginInfoBox input[name="password"]'
const LOGIN_BTN_SELECTOR = 'div.loginInfoBox input[type="submit"]'
const DOWNLOAD_CSV_BTN_SELECTOR = '#vp-view-VC0502-003_RS0001_U051111_3'
const S_SECOND_DETAIL_PAGE_BTN = 'table#seikyuGrid>tbody>tr:nth-child(3)>td:nth-child(5)>span'

const CSV_RESP_URL_PREFIX = 'https://www.smbc-card.com/memapi/jaxrs/dl/web_meisai/web_meisai_csv_exec/v1'

export default async (browser, downloadPath) => {
    console.log('start downloading from vpass...')
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(10000)
    const client = await page.target().createCDPSession()
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath,
    })

    await page.goto(VPASS_LOGIN)
    await page.type(USERNAME_SELECTOR, process.env.VPASS_USER)
    await page.type(PASS_SELECTOR, process.env.VPASS_PASS)
    await Promise.all([
        page.waitForNavigation(),
        page.click(LOGIN_BTN_SELECTOR)
    ])

    //ANA
    await gotoAnaDetaiPage(page)
    const anaFilepath = await downloadCSV(page, downloadPath)
    const newAnaFilepath = addBasenamePrefix(anaFilepath, 'ana_')
    await renameFile(anaFilepath, newAnaFilepath)
    console.log('ana file downloaded to %s', newAnaFilepath)

    //Amazon
    await gotoAmazonDetailPage(page)
    const amzFilepath = await downloadCSV(page, downloadPath)
    const newAmzFilepath = addBasenamePrefix(amzFilepath, 'amz_')
    await renameFile(amzFilepath, newAmzFilepath)
    console.log('amazon file downloaded to %s', newAnaFilepath)
}

async function gotoAnaDetaiPage(page) {
    await page.goto(ANA_DETAIL_PAGE_URL, {waitUntil: 'networkidle2'})
    await page.waitForSelector(DOWNLOAD_CSV_BTN_SELECTOR)
}

async function gotoAmazonDetailPage(page) {
    await page.goto(TOP_DETAIL_PAGE_URL, {waitUntil: 'networkidle2'})
    console.debug('went to detail page finished')
    await page.waitForSelector(S_SECOND_DETAIL_PAGE_BTN)
    console.debug('detail button appeared, now click it')
    try {
        await Promise.all([
            page.waitForNavigation({waitUntil: 'networkidle2'}),
            page.click(S_SECOND_DETAIL_PAGE_BTN)
        ])
    } catch(e) {
        console.log('probabaly failed with waiting, click detail page again')
        await Promise.all([
            page.waitForNavigation({waitUntil: 'networkidle2'}),
            page.click(S_SECOND_DETAIL_PAGE_BTN)
        ])
    }
    await page.waitForSelector(DOWNLOAD_CSV_BTN_SELECTOR)
}

async function downloadCSV(page, downloadDir) {
    await page.click(DOWNLOAD_CSV_BTN_SELECTOR)

    const response = await page.waitForResponse(resp => resp.url().startsWith(CSV_RESP_URL_PREFIX))
    const downloadFilename = getFilenameFromHeaders(response.headers())
    const filepath = path.resolve(downloadDir, downloadFilename)

    await waitForFileExists(filepath)
    return filepath
}
