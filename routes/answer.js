var express = require('express');
var router = express.Router();
var db = require('../db');

router.get("/", (req, res) => {
    db.ref("answer").get().then(snapshot => res.send(snapshot.val()))
})

router.get("/:key", (req, res) => {
    db.ref(`answer/${req.params.key}`).get().then(snapshot => res.send(snapshot.val()))
})

router.post("/", async (req, res) => {
    // check if user answered the poll before; remove answer if true
    const query = db.query(`answer`).filter("poll", "==", req.body.poll).filter("user", "==", req.body.user);
    if (await query.exists()) {
        await query.remove()
    }
    // Calculate date in two weeks
    db.ref(`poll/${req.body.poll}`).get().then(snap => {
        var expirationDate = snap.val().expiration
        var date = new Date(expirationDate)
        date.setDate(date.getDate() + 14)
        // upload the new answer
        db.ref(`answer`).push({...req.body, "expiration": date.toString()}).then(ref => res.send(ref.key));
    })
})

router.delete("/:answer", (req, res) => {
    db.ref(`answer/${req.params.answer}`).remove().then(ref => res.send(`${ref.key} got removed`));
})

module.exports = router;