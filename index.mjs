/**
 * main function
 */

import path from 'path'
import puppeteer from 'puppeteer'
import dotenv from 'dotenv'
import smbc from './smbc'
import vpass from './vpass'
import tokyu from './tokyu'

dotenv.config()

const defaultUserDataDir = path.resolve(path.dirname(''), 'userdata')
const DOWNLOAD_PATH = path.resolve(path.dirname(''), 'downloads')

async function main() {
    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: defaultUserDataDir,
    })

    await smbc(browser, DOWNLOAD_PATH)
    await vpass(browser, DOWNLOAD_PATH)
    await tokyu(browser, DOWNLOAD_PATH)
    await browser.close()
}

main().then(
    () => {console.log('done')},
    (e) => {console.log('failed', e)}
)