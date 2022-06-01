var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var db = require('../db');
var { authenticate } = require('ldap-authentication');
var bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  let user = db.query('user').filter('username', '==', username);
  
  if(!await user.exists()) {
    // Prüfe, ob der User im LDAP-Server verzeichnet ist
    let authenticated = false;
    try {
      authenticated = await authenticate({
        ldapOpts: { url: 'ldap://10.26.10.200' },
        userDn: `uid=${username},cn=users,dc=ldap,dc=fbs,dc=de`,
        userPassword: password,
        username,
        userSearchBase: 'dc=ldap,dc=fbs,dc=de',
        usernameAttribute: 'uid',
        starttls: false
      });
    } catch(err) {
      console.error(err.name);
    }

    if(authenticated) {
      // Lege den User in der DB an
      user = await db.ref('user').push({
        username,
        password: await bcrypt.hash(password, 13),
        email: authenticated.mail
      });
    } else {
      res.status(400).send('Wrong username or password');
      return;
    }
  }

  // Melde den User an
  const userData = (await user.get())[0];
  const userVal = userData.val();

  if(!await bcrypt.compare(password, userVal.password)) {
    res.status(400).send('Wrong username or password');
    return;
  }

  res.status(200).json({
    token: jwt.sign(userVal, 's3tk3nd'),
    expiresIn: '100000',
    authUserState: {
      user: userVal
    }
  });
});

router.post('/register', async (req, res) => {
  db.ref('user').push({
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, 13),
    email: req.body.email
  }).then(ref => res.send(ref.key));  
})

module.exports = router;
