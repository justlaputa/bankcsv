import puppeteer from 'puppeteer'
import smbc from './smbc'
import vpass from './vpass'
import tokyu from './tokyu'

export default async function downloadAll(downloadDir, userDataDir) {
    const browser = await puppeteer.launch({
        headless: true,
        userDataDir: userDataDir,
    })

    await smbc(browser, downloadDir)
    await vpass(browser, downloadDir)
    await tokyu(browser, downloadDir)
    await browser.close()
}