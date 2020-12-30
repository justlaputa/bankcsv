import { Transform } from 'stream';

export interface CsvDataTransformers {
    csvTransform: Transform
    billTransform: Transform
}

export { yahooCardParser } from './yahoo';
export { vpassCardParser } from './vpass';
