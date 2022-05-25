var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var db = require('../db');
var { authenticate } = require('ldap-authentication');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', async (req, res) => {

  let authenticated;
  try {
    authenticated = await authenticate({
      ldapOpts: { url: 'ldap://ldap.apelma.de' },
      adminDn: `uid=root,cn=users,dc=ldap,dc=apelma,dc=de`,
      adminPassword: 'kS6nXV5z4x7nemV',
      userPassword: req.body.password,
      userSearchBase: 'dc=ldap,dc=apelma,dc=de',
      usernameAttribute: 'uid',
      username: req.body.username,
      starttls: false
    })
  } catch(err) {
    console.error(err.name, err);
  }
  
  if (authenticated){
    res.status(200).json({ token: jwt.sign({user: 'admin'}, 's3tk3nd'), expiresIn: '100000', authUserState: {user: 'admin'} })
  } else {
    res.status(400).send('Wrong username or password')
  }
})

module.exports = router;
