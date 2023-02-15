const tP = require('./topPhrases');
const args = process.argv;
const stdin = process.stdin;


 if (args.length < 3 && stdin.isTTY) {
    console.error('A file name was not provide')
 }else if(args.length >= 3 && stdin.isTTY){
    args.splice(0,2)
    tP.getTopPhrases(args);
} else {
    //stdin
    tP.processStdinPhrases();
}
