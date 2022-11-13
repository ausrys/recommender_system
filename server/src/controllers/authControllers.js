const jwt = require('jsonwebtoken');
const {Users} = require("../models")
// Handle errors function 
const handleErrors = (err) => {
    let errors = {email: '', password: ''};
    switch(err) {
        case 'Toks el. pastas neegzistuoja':
            errors.email = 'Toks el. pastas neegzistuoja'
            break;
        case 'Neteisingas slaptazodis':
            errors.password = 'Neteisingas slaptazodis'
            break;
        case "Toks el. paštas jau užregistruotas":
            errors.email = "Toks el. paštas jau užregistruotas"
            break;
        case 'Slaptazodis per trumpas':
            errors.password = 'Slaptazodis per trumpas'
            break;
        case 'Elektroninio pasto formatas neteisingas':
            errors.email = 'Elektroninio pasto formatas neteisingas'
            break;

    }
    // if (err.message === 'Toks el. pastas neegzistuoja') {
    //     errors.email = 'Toks el. pastas neegzistuoja';
    // }
    // if (err.password === 'Neteisingas slaptazodis') {
    //     errors.password = 'Neteisingas slaptazodis';
    // }
    // // duplicate email error 
    // if (err.code === 11000) {
    //     errors.email = "Toks el. paštas jau užregistruotas";
    //     return errors;
    // }
    // // validation of errors
    // if (err.message.includes('user validation failed')) {
    //     Object.values(err.errors).forEach(({properties}) => {
    //         errors[properties.path] = properties.message;
    //     });
    // }
    return errors;
}
const maxAge = 3 * 24 * 60 *60;
const createToken = (id) => {
    return jwt.sign({id},process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    });
}
module.exports.signup_get = (req, res) => {
    res.render('signup');
}
module.exports.login_get = (req, res) => {
    res.render('login');
    
}
module.exports.signup_post = async (req, res) => {
    try {
        await Users.create({email : req.body.email, password : req.body.password});
        res.status(201).json({user: req.body.email});
    } catch (error) {
        console.log(error)
        res.status(400).json(error);
    }
        await Users.create({email : req.body.email, password : req.body.password});
        // const token = createToken(req.body.email);
        // res.cookie('jwt', token, {maxAge: maxAge * 1000, httpOnly: true });
        res.status(201).json({user: req.body.email});

        // const errors = handleErrors(error);
        // res.status(400).json(errors);
    

};
module.exports.login_post = async (req, res) => {
    const  {email, password} = req.body;
    try {
        await User.loginUser(email, password);
        const token = createToken(email);
    res.cookie('jwt', token, {maxAge: maxAge * 1000, httpOnly: true });
        res.status(200).json({user: email});
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({errors})
    }
}
module.exports.logout_get = (req, res) => {
    res.cookie('jwt' ,'', {
        maxAge:1
    });
    res.redirect('/forma');
}
module.exports.vietos_get = async (req, res) => {
    // const vietos = await User.find({email: res.locals.user.email});
    // const [placeinfo] = vietos;
    
    
    res.render('test');
}
// module.exports.vietos_post = async (req, res) => {

//     res.render('test');
//}
module.exports.vieta_get = async (req, res) => {
    let title = (req.query.place);
    let score = (req.query.ivertinimas);
    
    console.log(title, score);
    if (res.locals.user) {
        //console.log(res.locals.user)
        let place = {title: title, score: score };
      User.findOneAndUpdate(
      {email: res.locals.user.email, 'placeinfo.title': title }, 
       { 'placeinfo.score': score} ,
      function (error, success) {
       if (error) {
           console.log(error);
       } else {
           console.log(success);
       }
   });
      
  }
    res.render('vieta');
}
module.exports.home_get = async (req, res) => {
    const listOfUsers = await Users.findAll();
    res.json(listOfUsers)
}
module.exports.user = async (req, res) => {
    const id = req.params.id;
    const user = await Users.findByPk(id);
    res.json(user);
}