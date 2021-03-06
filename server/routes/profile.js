var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const config = require('../config/database');
var secret = config.secret;

var User = require('../models/user');


router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, secret, function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Nie masz uprawnień. Potrzebna autoryzacja',
                message: 'Zaloguj się ponownie',
                error: err,
            });
        }
        next();
    })
});


router.get('/', (req, res) => {
    var decoded = jwt.decode(req.query.token);
    var duid = decoded.user._id;
    User.findById({_id: duid}, function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'Wystąpił nieoczekiwany błąd',
                error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: user
        });
    });
})

module.exports = router;