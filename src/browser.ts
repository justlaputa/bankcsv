/**
 * common wrapper for browser functions
 */
import * as puppeteer from 'puppeteer'

import { CardDownloader } from "./site";
import { pathToFileURL } from 'url';
import path = require('path');

type PassThroughFunction = (browser: puppeteer.Browser) => Promise<void>

export class Browser {
    private browser: puppeteer.Browser

    constructor(browser: puppeteer.Browser) {
        this.browser = browser
    };

    static async build(headless = true) {
        const browser = await puppeteer.launch({
            headless: headless,
            userDataDir: './userdata',
        })

        return new Browser(browser)
    }

    async process(downloader: CardDownloader): Promise<string> {
        const [page, downloadDir] = await this._createDownloadPage();

        const filename = await downloader.download(page);

        return path.resolve(downloadDir, filename)
    }

    async _createDownloadPage(): Promise<[puppeteer.Page, string]> {
        const downloadDir = path.resolve(path.dirname(''), 'downloads')
        const page = await this.browser.newPage()
        page.setDefaultNavigationTimeout(60000)
        const client = await page.target().createCDPSession()
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadDir,
        })

        return [page, downloadDir]
    }

    async pass(func: PassThroughFunction): Promise<void> {
        await func(this.browser)
    }

    async close() {
        await this.browser.close()
    }
}