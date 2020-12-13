export async function delay(mili: number) {
    return new Promise((resolve, _) => {
        console.debug('delaying for %d ms', mili)
        setTimeout(resolve, mili)
    })
}