import * as csv from 'csv-parser';
import { Transform, TransformCallback } from "stream";
import { CsvDataTransformers } from '.';
import { BillTransaction } from "../../domain";
import * as util from './util'

export function tokyuCardParser(): CsvDataTransformers {
    return {
        csvTransform: csv({
            headers: false,
            skipLines: 1
        }),
        billTransform: new TokyuCSVTransform()
    };
}

class TokyuCSVTransform extends Transform {
    constructor(options?: any) {
        super(Object.assign({writableObjectMode: true, readableObjectMode: true}, options));
    }

    _transform(row: any, _encoding: string, callback: TransformCallback): void {
        if (!this.validRecord(row)) {
            callback();
            return
        }

        const transaction = new BillTransaction(
            util.parseDate(row['0']),
            row['1'],
            util.parseAmount(row['6']),
            ''
        )
        this.push(transaction);
        callback();
    }

    private validRecord(row: any): boolean {
        return row != undefined &&
            row != null &&
            row['0'] != undefined &&
            row['0'].length != 0 &&
            row['1'] != undefined &&
            row['6'] != undefined
    }
}