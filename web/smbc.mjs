/** smbc.js
 * login to SMBC direct bank site and download the latest CSV statement file
 * 
 * Username and password are given by environment varialbes:
 * branch code: SMBC_BRANCH_CODE
 * account code: SMBC_ACCOUNT_CODE
 * password: SMBC_PASS
 */

import fs from 'fs'
import {waitForFileExists} from './util'

const SMBC_LOGIN = 'https://direct.smbc.co.jp/aib/aibgsjsw5001.jsp'
const BRANCH_SELECTOR = '#formWrap.loginBlock input[name="S_BRANCH_CD"]'
const ACCOUNT_SELECTOR = '#formWrap.loginBlock input[name="S_ACCNT_NO"]'
const PASS_SELECTOR = '#formWrap.loginBlock input[name="PASSWORD"]'
const LOGIN_BTN_SELECTOR = '#login>input[name="bLogon.y"]'
const DETAIL_BTN_SELECTOR = '#cmn02main .topBlock p.detailsBtn'
const DOWNLOAD_CSV_BTN_SELECTOR = 'li.meisai-c02>a#DownloadCSV'

export default async (browser, downloadPath) => {
    console.log('start downloading from smbc...')
    const page = await browser.newPage()
    const client = await page.target().createCDPSession()
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath,
    })

    await page.goto(SMBC_LOGIN)
    await page.type(BRANCH_SELECTOR, process.env.SMBC_BRANCH_CODE)
    await page.type(ACCOUNT_SELECTOR, process.env.SMBC_ACCOUNT_CODE)
    await page.type(PASS_SELECTOR, process.env.SMBC_PASS)
    await page.click(LOGIN_BTN_SELECTOR)
    await page.waitForNavigation()
    await page.click(DETAIL_BTN_SELECTOR)
    await page.waitForSelector(DOWNLOAD_CSV_BTN_SELECTOR)
    await page.click(DOWNLOAD_CSV_BTN_SELECTOR)

    const filepath = `${downloadPath}/meisai.csv`
    console.log('downloaded, wait for file to exist')
    await waitForFileExists(filepath)
    
    const newPath = `${downloadPath}/smbc.csv`
    await new Promise((resolve, reject) => {
        fs.rename(filepath, newPath, e => {
            if (e) reject(e)
            resolve()
        })
    })

    console.log('file downloaded to %s', newPath)
}