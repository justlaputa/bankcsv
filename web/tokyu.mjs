/** tokyu.mjs
 * login and download csv file from Tokyu Credit Card site
 * credentials are provided by environment variables
 * 
 * Username: TOKYU_USER
 * Password: TOKYU_PASS
 */
import path from 'path'
import {waitForFileExists, renameFile, getFilenameFromHeaders, addBasenamePrefix} from './util'

const LOGIN_URL = 'https://ssl.topcard.co.jp/member/'
const S_LOGIN_USER = 'input#userid'
const S_LOGIN_PASS = 'input#password'
const S_LOGIN_BTN = 'button[type="submit"]'

const DETAIL_PAGE_URL = 'https://www2.topcard.co.jp/memx/web_meisai/top/index.html'
const S_DOWNLOAD_CSV_BTN = '#vp-view-VC0502-003_RS0001_U051111_3'

const CSV_RESP_URL_PREFIX = 'https://www2.topcard.co.jp/memapi/jaxrs/dl/web_meisai/web_meisai_csv_exec/v1'

export default async (browser, downloadPath) => {
    console.log('start downloading from tokyu...')
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(10000)
    const client = await page.target().createCDPSession()
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath,
    })

    await login(page)
    await gotoDetailPage(page)
    let csvFilepath = ''

    try {
        csvFilepath = await downloadCSV(page, downloadPath)
    } catch(e) {
        console.log('download failed, try again')
        csvFilepath = await downloadCSV(page, downloadPath)
    }

    const newFilepath = addBasenamePrefix(csvFilepath, 'tokyu_')
    await renameFile(csvFilepath, newFilepath)
    console.log('file downloaded to %s', newFilepath)
}

async function login(page) {
    await page.goto(LOGIN_URL)
    await page.type(S_LOGIN_USER, process.env.TOKYU_USER)
    await page.type(S_LOGIN_PASS, process.env.TOKYU_PASS)
    await Promise.all([
        page.waitForNavigation({waitUntil: 'networkidle2'}),
        page.click(S_LOGIN_BTN)
    ])
}

async function gotoDetailPage(page) {
    await page.goto(DETAIL_PAGE_URL, {waitUntil: 'networkidle2'})
    await page.waitForSelector(S_DOWNLOAD_CSV_BTN)
}

async function downloadCSV(page, downloadDir) {
    await page.click(S_DOWNLOAD_CSV_BTN)

    const response = await page.waitForResponse(
        resp => resp.url().startsWith(CSV_RESP_URL_PREFIX),
        { timeout: 1000 }
    )
    const downloadFilename = getFilenameFromHeaders(response.headers())
    const filepath = path.resolve(downloadDir, downloadFilename)

    await waitForFileExists(filepath)
    return filepath
}