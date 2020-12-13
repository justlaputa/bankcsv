import * as csv from 'csv-parser';
import { Transform, TransformCallback } from 'stream';
import { BillTransaction } from '../../domain';

export function yahooCardParser(): Transform[] {
    return [
        csv({
            headers: false,
            skipLines: 1
        }), 
        new YahooCSVTransform()
    ];
}

class YahooCSVTransform extends Transform {
    constructor(options?: any) {
        super(Object.assign({writableObjectMode: true, readableObjectMode: true}, options));
    }

    _transform(row: any, _encoding: string, callback: TransformCallback): void {
        if (!this.validRecord(row)) {
            callback();
        }

        const transaction = new BillTransaction(
            parseDate(row['0']),
            row['1'],
            parseAmount(row['6']),
            ''
        )
        this.push(transaction);
        callback();
    }

    private validRecord(row: any): boolean {
        return row != undefined &&
            row != null &&
            row['0'] != undefined &&
            row['1'] != undefined &&
            row['6'] != undefined        
    }
}

function parseDate(s: string): Date {
    let [year, month, day] = s.split('/');
    if (month.length == 1) {
        month = '0' + month;
    }
    if (day.length == 1) {
        day = '0' + day;
    }

    return new Date(`${year}-${month}-${day}T00:00:00Z`);
}

function parseAmount(s: string): number {
    let i = Number.parseInt(s, 10)
    if (Number.isNaN(i)) {
        return 0;
    }
    return i;
}
