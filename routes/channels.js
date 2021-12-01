const express = require('express');
const router = express.Router();

function isLoggedIn(req, res, next) {
    const cookie = req.cookies;
    const credentials = cookie['login-credentials'];
}

router
    .get('/channels/@me', isLoggedIn, (req, res) => {

    })

    .get('/channels/:id', isLoggedIn, (req, res) => {

    })
module.exports = router;