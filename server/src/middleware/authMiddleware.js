const jwt = require('jsonwebtoken');
// protect route
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.redirect('login')
            }
            else {
                console.log(decodedToken)
                next();
            }
        })
    }
    else {
        res.redirect('/login')
    }
}
// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else {
                res.locals.user = decodedToken.email
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}
module.exports =  {checkUser, requireAuth};