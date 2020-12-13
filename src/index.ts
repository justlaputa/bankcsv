/**
 * entry
 */

import { Browser } from './browser'
import { Vpass } from './site'

async function main() {
  let browser: null | Browser = null

  const vpass = new Vpass()
  
  try {
    let headless = !(process.argv.length > 2 && 
      (process.argv[2] === 'login' || process.argv[2] === '--debug'))
    console.debug(process.argv)
    

    if (process.argv.length > 2 && process.argv[2] === 'login') {
      browser = await Browser.build(headless)

      await browser.pass(vpass.login)
      return
    }

    console.log('headless', headless)

    browser = await Browser.build(headless)

    const csvFilepath = await browser.process(vpass)
    console.log('file save to %s', csvFilepath)

  } catch (e) {
    console.error(e)
  } finally {
    if (browser != null) {
      await browser.close()
    }
  }
  
}

main().then(
  () => {console.log('done')},
  (e) => {console.log('failed', e)}
)