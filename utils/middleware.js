const db = require('quick.db');

function verifyCredentials(req, res, next) {
    const cookies = req.cookies;
    const credentials = JSON.parse(cookies["login-credentials"]);
    const fetched = await db.fetch(`user.${credentials.id}`);
    
    if (credentials.username = fetched.username && credentials.password == fetched.password) {
        return true;
    } else {
        res.clearCookie('login-credentials');
        res.redirect('/portal.html');
        return false;
    }
}