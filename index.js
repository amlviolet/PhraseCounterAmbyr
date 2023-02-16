const tP = require('./topPhrases');
const args = process.argv;
const stdin = process.stdin;



main()
async function main() {
    if (args.length < 3 && stdin.isTTY) {
        console.error('A file name was not provided');
        process.stdin.pause();
    } else if (args.length >= 3 && stdin.isTTY) {
        args.splice(0, 2);
        tP.getTopPhrases(args);
        process.stdin.pause();
    } else {
        //stdin
        tP.processStdinPhrases();
    }
}
