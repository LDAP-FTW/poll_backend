const { AceBase } = require('acebase');
const db = new AceBase('my_db'); // nodejs
var cron = require('node-cron');
// OR: const db = AceBase.WithIndexedDB('my_db'); // browser
db.ready(() => {
    // Do stuff
});

cron.schedule('0 0 * * *', () => {
    // Delete poll after expiration
    /* db.query('poll').get().then(snapArr => {
        const pollArray = snapArr.getValues()
        pollArray.map((poll, index) => {
            if (new Date(poll.expiration) < new Date()) {
                snapArr[index].ref.remove();
            }
        })
    }) */

    // Delete answers after expiration
    db.query('answer').get().then(snapArr => {
        const answerArray = snapArr.getValues()
        answerArray.map((answer, index) => {
            if (new Date(answer.expiration) < new Date()) {
                snapArr[index].ref.remove();
            }
        })
    })
});

module.exports = db;