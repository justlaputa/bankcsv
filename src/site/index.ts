/**
 * shared types for site module
 */

import { Page } from 'puppeteer'

export class DownloadResult {
    cardName: string
    csvFilepath: string
    paymentDate: string
    paymentAmount: number
    confirmed: boolean

    constructor() {
        this.cardName = 'unknown'
        this.csvFilepath = 'unknown'
        this.paymentDate = 'unknown'
        this.paymentAmount = 0
        this.confirmed = false
    }
}

export interface CardDownloader {
    download(page: Page): Promise<string>;
}

export { VpassDownloader as Vpass } from './vpass'