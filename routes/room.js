const express = require('express');
const controller = require('../controllers/room')

const router = express.Router();

const passport = require('passport');

const MIDDLEWARE = passport.authenticate('jwt', {session: false});

router.post('/create', controller.create)

router.post('/join', controller.join)

router.post('/has-room', controller.hasRoom)


router.post('/leave', controller.leave)


module.exports = router;