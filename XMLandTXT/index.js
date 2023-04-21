import xml2js from 'xml2js';
// import * as fs from "fs";
import {readFile} from 'node:fs/promises';
import {decodeMobileCode} from "../utils/decodeMobileCode.js";

const parser = new xml2js.Parser();

export function parseXML(file) {
    fs.readFile('order.xml', function (err, data) {
        parser.parseString(data, function (err, result) {
            console.log('Done');
        });
    });
}

export async function parseTXT(file) {
    const contentFile = await readFile(file, { encoding: 'utf8' })
    const formatData = contentFile.toString().split('\n');
    return formatData.map((el) => {
        return decodeMobileCode(el.replace('\r', ''));
    });
}

parseTXT('test.txt');