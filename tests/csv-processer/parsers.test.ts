import { createReadStream } from 'fs';
import * as path from 'path';
import { vpassCardParser, yahooCardParser } from '../../src/csv-processer/parsers'
import { BillTransaction } from '../../src/domain'

describe('csv parsers', () => {
    const yahooCsvFilepath = path.resolve(__dirname, 'yahoo_yj_20200527.csv');
    const vpassLinepayCsvFilepath = path.resolve(__dirname, 'vpass_linepay_20201228.csv');
    
    it('should parse yahoo card csv', done => {
        const expected: BillTransaction[] = [
            new BillTransaction(new Date('2020-03-31T00:00:00Z'), 'ヤフージャパン', 508, ''),
            new BillTransaction(new Date('2020-04-01T00:00:00Z'), 'GOOGLE', 42, ''),
        ]
        const totalTransactionCount = expected.length;

        const file = createReadStream(yahooCsvFilepath);
        let p = yahooCardParser();
        let index = 0;
        file.pipe(p.csvTransform).pipe(p.billTransform)
            .on('data', (data) => {
                console.log('data:', data);
                expect(index).toBeLessThan(totalTransactionCount);
                expect(data).toEqual(expected[index]);
                index++;
            })
            .on('finish', () => {
                expect(index).toEqual(totalTransactionCount);
                done();
            })
    });

    it('should parse vpass linepay card csv', done => {
        const expected: BillTransaction[] = [
            new BillTransaction(new Date('2020-10-31T00:00:00Z'), '東急ストア', 5392, ''),
            new BillTransaction(new Date('2020-11-28T00:00:00Z'), 'ＬＩＮＥ　Ｐａｙ　加盟店', 2679, ''),
        ]
        const totalTransactionCount = expected.length;

        const file = createReadStream(vpassLinepayCsvFilepath);
        let p = vpassCardParser();
        let index = 0;
        file.pipe(p.csvTransform).pipe(p.billTransform)
            .on('data', (data) => {
                console.log('data:', data);
                expect(index).toBeLessThan(totalTransactionCount);
                expect(data).toEqual(expected[index]);
                index++;
            })
            .on('finish', () => {
                expect(index).toEqual(totalTransactionCount);
                done();
            });
    });
})