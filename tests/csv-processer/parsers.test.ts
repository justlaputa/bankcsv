import { createReadStream } from 'fs';
import * as path from 'path';
import { yahooCardParser } from '../../src/csv-processer/parsers'
import { BillTransaction } from '../../src/domain'

describe('csv parsers', () => {
    const yahooCsvFilepath = path.resolve(__dirname, 'yahoo_yj_20200527.csv');
    
    it('should parse yahoo card csv', done => {
        const expected: BillTransaction[] = [
            new BillTransaction(new Date('2020-03-31T00:00:00Z'), 'ヤフージャパン', 508, ''),
            new BillTransaction(new Date('2020-04-01T00:00:00Z'), 'GOOGLE ASIA PACIFIC利用国SGP', 42, ''),
            new BillTransaction(new Date('2020-04-03T00:00:00Z'), 'ﾍﾟｲﾍﾟｲ ﾁｬｰｼﾞ', 5000, ''),
            new BillTransaction(new Date('2020-04-06T00:00:00Z'), 'ﾍﾟｲﾍﾟｲ ﾁｬｰｼﾞ', 5000, ''),
        ]
        const totalTransactionCount = expected.length;

        const file = createReadStream(yahooCsvFilepath);
        let p = yahooCardParser();
        let index = 0;
        file.pipe(p[0]).pipe(p[1])
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
    })
})