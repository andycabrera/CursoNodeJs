require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('./config/passport');
const session = require('express-session');
const jwt = require('jsonwebtoken');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bicicletasRouter = require('./routes/bicicletas');
var usuariosRouter = require('./routes/usuarios');
var tokenRouter = require('./routes/token');

var authAPIRouter = require('./routes/api/auth');
var bicicletasAPIRouter = require('./routes/api/bicicletas');
var usuariosAPIRouter = require('./routes/api/usuarios');

const store = new session.MemoryStore;

var app = express();

app.set('secretKey', 'jwt_pwd_!!223344');

app.use(session({
  cookie: {maxAge: 240 * 60 * 60 * 1000},
  store: store,
  saveUninitialized: true,
  resave: 'true',
  secret: 'red_bicid_!!!!!****!"!"!!"!"123123'
}));


var mongoose = require('mongoose');
const Usuario = require('./models/usuario');
const Token = require('./models/token');
const { token } = require('morgan');
const { Recoverable } = require('repl');
const { decode } = require('punycode');

// var mongoDB = 'mongodb://localhost/red_bicicletas';
var mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true ,useUnifiedTopology: true ,useFindAndModify: false});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', function(req,res){
  res.render('session/login');
});

app.post('/login', function(req,res,next){
  passport.authenticate('local',function(err, user, info){
    if(err) return next(err);
    if(!user) return res.render('session/login', {info});
    req.logIn(user, function(err){
      if (err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);

});

app.get('logout', function(req, res){
  req.logOut();
  res.redirect('/');
});

app.get('/forgotPassword', function(req, res){
  res.render('session/forgotPassword');
});

app.post('/forgotPassword', function(req, res){
  Usuario.findOne({email:req.body.email}, function(err, user){
    if(err) return next(err);
    if(!user) return res.render('session/forgotPassword', {info: {message: 'No existe un usuario con este email'}});
    
    user.resetPassword(function(err){
      if(err) return next(err);
      console.log('session/forgotPasswordMessage');
    });

    res.render('session/forgotPasswordMessage');
  });
});

app.get('/resetPassword/:token', function(req, res, next){
  Token.findOne({token: req.params.token }, function(err, token){
    if(!token) return res.status(400).send({ type:'not-verified', msg: 'No existe un token'});

    Usuario.findById(token._userId, function(err, usuario){
      if(!usuario) return res.status(400).send({msg: 'No existe un usuario asociado al token'});  
      res.render('session/resetPassword',{errors: {}, usuario: usuario});
    });
  });
});

app.post('/resetPassword', function(req, res){
  if(req.body.password != req.body.confirm_password){
    res.render('session/resetPassword', {errors: {confirm_password: {message: 'No coinciden las contraseñas'}}});
    return;
  }
  Usuario.findOne({email: req.body.email}, function(err, user){
    user.password = req.body.password;
    user.save(function(err){
    if(err){
      res.render('session/resetPassword', {errors: err.errors, usuario: new usuario()});
    }else{
      res.redirect('/login');
    }});
  });
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/bicicletas', loggedIn, bicicletasRouter);

app.use('/usuarios', usuariosRouter);
app.use('/token', tokenRouter);

app.use('/api/auth', authAPIRouter);
app.use('/api/bicicletas',validarUsuario, bicicletasAPIRouter);
app.use('/api/usuarios', usuariosAPIRouter);

app.use('./privacy_policy', function(req, res){
  res.sendFile('public/policy_privacy.html');
});

app.use('./googleb3b57f3f1c60b53f.html', function(req, res){
  res.sendFile('public/googleb3b57f3f1c60b53f.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function loggedIn(req, res, next){
  if(req.user){
    next();
  }else{
    console.log('user sin loguearse');
    res.redirect('/login');
  }
}

function validarUsuario(req, res, next){
  jwt.verify(req.headers['x-acces-token'], req.app.get('secretKey'), function(err, decoded ){
    if(err){
      res.json({status:"error", message: err.message, data:null});
    }else{

      req.body.userId = decoded.id;

      console.log('jwt verify '+ decoded);

      next();
    }
  });
}

module.exports = app;
