const isUndefined = require('lodash.isUndefined');
const fs = require('fs');
const stdin = process.stdin;
const readline = require('readline');

const rl = readline.createInterface({
    input: stdin
});

function getTopPhrases(fileName) {
    if (!isUndefined(fileName)) {
        processFile(fileName).catch((err) => {
            console.error(err)
        });
    } else {
        console.error('File name not provided.')
    }
}

async function processStdinPhrases() {
    let fileTxtArr = [];

    rl.on('line', (line) => {
        if (line) {
            let arrChunk = [];
            const reg = /(?=\S*['’-])([a-zA-Z'’-]+)|\b([a-zA-z]+)\b/g
            arrChunk = line.toLowerCase().match(reg);
            if (arrChunk){
                fileTxtArr.push(...arrChunk);
            }
        }
    });
    rl.once('close', async () => {
        if (fileTxtArr.length === 0){
            console.error('No data was detected in the provide file(s)')
            return;
        }
        const phraseMap = new Map();
        await getPhraseCounts(fileTxtArr, phraseMap);
        printTopPhrases(phraseMap)
    });

}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function processFile(fileName) {
    let fileTxtArr = [];

    await asyncForEach(fileName, async (file) => {
        await readStream(file, fileTxtArr)

    });
    if (fileTxtArr.length === 0) {
        throw ('No data was detected in the provide file(s)')
    }
    const phraseMap = await buidWordMap(fileTxtArr);
    printTopPhrases(phraseMap)

}

async function readStream(fileName, fileTxtArr) {
    return new Promise(function (resolve, reject) {
        const readableStream = fs.createReadStream('./testFiles/' + fileName, 'utf8');

        readableStream.on('error', function (error) {
            reject(error.message)
        })

        readableStream.on('data', (chunk) => {
            if (chunk) {
                const reg = /(?=\S*['’-])([a-zA-Z'’-]+)|\b([a-zA-z]+)\b/g
                const arrChunk = chunk.toLowerCase().match(reg);
                fileTxtArr.push(arrChunk);
            }
        })

        readableStream.on('end', () => {
            resolve()
        })
    })
}

function printTopPhrases(filePhraseMap) {
    let topPhrases = sortPhrases(filePhraseMap);

    if (topPhrases.length > 100) {
        topPhrases.length = 100;
    }

    displayPhraseList(topPhrases)
}

function sortPhrases(phraseMap) {
    let phraseArrSorted = Array.from(phraseMap, ([threeWords, count]) => ({ threeWords, count }));
    phraseArrSorted.sort((a, b) => b.count - a.count);
    return phraseArrSorted;
}

async function buidWordMap(fileTxtArr) {
    //loops through file words to build phrases and their counts
    const phraseMap = new Map();
    await asyncForEach(fileTxtArr, async (fileTxt) => {
        await getPhraseCounts(fileTxt, phraseMap);
    });
    return phraseMap;
}

function displayPhraseList(topPhrases) {
    // shows top phrases for files provided
    console.log('Top 100 Phrases ')
    console.table(topPhrases)
}

function getPhraseCounts(phraseArr, phraseMap) {
    //iterate over string to build map of words and count
    for (x = 0; x < phraseArr.length; x++) {

        if (isUndefined(phraseArr[x + 2]))
            break;
        //get current word + next 3 words
        let phrase = phraseArr[x] + " " + phraseArr[x + 1] + " " + phraseArr[x + 2]

        if (phraseMap.has(phrase)) {
            const count = phraseMap.get(phrase)
            phraseMap.set(phrase, count + 1)
        } else {
            phraseMap.set(phrase, 1);
        }
    }
}

module.exports = { getTopPhrases, buidWordMap, processStdinPhrases };