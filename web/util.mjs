import path from 'path'
import fs from 'fs'

export function waitForFileExists(filePath, timeout = 15000) {
    return new Promise((resolve, reject) => {
        const dir = path.dirname(filePath)
        const basename = path.basename(filePath)

        const watcher = fs.watch(dir, (eventType, filename) => {
            if (eventType === 'rename' && filename === basename) {
                clearTimeout(timer)
                watcher.close()
                resolve()
            }
        })

        const timer = setTimeout(() => {
            watcher.close()
            reject(
                new Error(
                    ' [checkFileExists] File does not exist, and was not created during the timeout delay.'
                )
            )
        }, timeout)

        fs.access(filePath, fs.constants.R_OK, err => {
            if (!err) {
                clearTimeout(timer)
                watcher.close()
                resolve()
            }
        })
    })
}

export function renameFile(oldPath, newPath) {
    return new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, e => {
            if (e) reject(e)
            resolve()
        })
    })
}

export function getFilenameFromHeaders(headers) {
    const value = headers['content-disposition']
    if (!value) {
        return ''
    }

    const matches = /filename="(.*)"/.exec(value)
    if (matches.length < 1) {
        return ''
    }

    return matches[1]
}

export function addBasenamePrefix(filepath, prefix) {
    const dir = path.dirname(filepath)
    const basename = path.basename(filepath)
    return path.resolve(dir, prefix + basename)
}