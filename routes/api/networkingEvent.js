var express = require('express')
    , router = express.Router()
    , user = require('../../models/user');

/**
 *  GET: register
 * */
router.get('/', function (req, res, next) {
    res.render('networkingEvent');
});

router.get('/all', function (req, res, next) {

    user.find({'username':req.user.username}, function (err, user) {
        if (err) {
            res.status(400).send(err.message);
        }
        else {
            res.json(user[0].networkingEvents);
        }
    })
});

/**
 * POST: register
 */
router.post('/', function (req, res, next) {

        user.findOneAndUpdate({'username':req.user.username},{$push: {'networkingEvents': req.body}}, function (err) {

            if (err) {
                console.log(err);
            }
            else {
                res.sendStatus(200);
            }
        })

});

module.exports = router;