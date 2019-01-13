/**
 * main function
 */

import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

import downloadAll from './web'
import processAll from './process'

dotenv.config()

const defaultUserDataDir = path.resolve(path.dirname(''), 'userdata')
const DOWNLOAD_PATH = path.resolve(path.dirname(''), 'downloads')

async function main() {
    await downloadAll(DOWNLOAD_PATH, defaultUserDataDir)
    const data = await processAll(DOWNLOAD_PATH)
    await fs.promises.writeFile('processed.csv', data)
}

main().then(
    () => {console.log('done')},
    (e) => {console.log('failed', e)}
)
