import fs from 'fs'
import path from 'path'
import split from 'split'
import iconv from 'iconv-lite'
import json2csv from 'json2csv'

const fsPromises = fs.promises

export async function process(csvDir) {
    let result = []
    //filename should be like ANAGold_VISA_201901.csv
    try {
        const files = await fsPromises.readdir(csvDir)
        for (let file of files) {
            const fileinfo = matchFilename(file)
            if (fileinfo === null) {
                console.log('file: %s does not match name pattern, skip it', file)
                continue
            } 

            console.log('processing csv file: %s, with info: %j', file, fileinfo)
            const data = await processCSV(path.resolve(csvDir, file), fileinfo)
            result = result.concat(data)
        }
    } catch (e) {
        console.log('failed to process csv files')
        throw e
    }

    return toCSV(result)
}

function matchFilename(filename) {
    const filenamePattern = /([^_]+)_([^_]+)_(20[0-9]{4})\.csv$/
    const match = filenamePattern.exec(filename)
    if (match === null) {
        return null
    }

    return {
        cardName: match[1],
        issuer: match[2],
        clearedDate: match[3]
    }
}

function processCSV(filepath, fileinfo) {
    return new Promise((resolve, reject) => {
        const result = []
        fs.createReadStream(filepath)
            .pipe(iconv.decodeStream('shift_jis'))
            .pipe(split())
            .on('data', line => {
                const transactionLinePattern = /^[0-9]{4}/
                if (transactionLinePattern.test(line)) {
                    const fields = line.split(',')
                    const transaction = {
                        cardName: fileinfo.cardName,
                        issuer: fileinfo.issuer,
                        clearedDate: fileinfo.clearedDate,
                        date: fields[0],
                        merchant: fields[1],
                        amount: fields[2],
                        hpTotal: fields[fields.length - 4],
                        hpTerm: fields[fields.length - 3],
                        paidAmount: fields[fields.length - 2],
                        note: fields[fields.length - 1],
                    }

                    result.push(transaction)
                }
            }).on('error', e => {
                reject(e)
            }).on('end', () => {
                resolve(result)
            })
    })
}

//load csv file, convert to utf8
function loadCSV(filepath) {
    return null
}

function toCSV(data) {
    return json2csv.parse(data, {
        fields: [
            'cardName',
            'issuer',
            'clearedDate',
            'date',
            'merchant',
            'amount',
            'hpTotal',
            'hpTerm',
            'paidAmount',
            'note'
        ]
    })
}