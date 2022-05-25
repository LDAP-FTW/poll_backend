var express = require('express');
var router = express.Router();
var db = require('../db');

router.get("/", (req, res) => {
    db.ref('poll').get().then(snapshot => res.send(snapshot.val()))
})

router.get("/:key", (req, res) => {
    db.ref(`poll/${req.params.key}`).get().then(snapshot => res.send(snapshot.val()))
})

router.post("/", (req, res) => {
    db.ref('poll').push(req.body).then(ref => res.send(ref.key));
})

router.delete("/:key", (req, res) => {
    db.ref(`poll/${req.params.key}`).remove().then(ref => res.send(`${ref.key} got removed`));
})

module.exports = router;