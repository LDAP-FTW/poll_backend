var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/:pollID', (req, res) => {
    db.ref(`poll/${req.params.pollID}`).get().then(snapshot => {
        const poll = snapshot.val()
        
        db.query('answer').filter('poll', '==', req.params.pollID).get().then(snapArr => {
            var answers = snapArr.getValues()
            answers = answers.map(answer => answer.answers)
            answers = answers.flat(1)

            var response = []

            for (var question of poll.questions) {
                var json = {
                    "question": question,
                    "answerCount": 0,
                    "answers": {
                        "1": 0,
                        "2": 0,
                        "3": 0,
                        "4": 0,
                        "5": 0
                    }
                }
                var qAnswers = answers.filter(answer => answer.question.text == question.text)
                json.answerCount = qAnswers.length;
                for (var qAnswer of qAnswers) {
                    json.answers[qAnswer.answer] = json.answers[qAnswer.answer] + 1
                }
                response.push(json);
            }
            res.status(200).json({poll, response});
        })
    })
})

module.exports = router;