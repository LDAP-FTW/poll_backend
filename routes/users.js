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
  let authenticated = await authenticate({
    ldapOpts: { url: 'ldap://10.26.10.200' },
    userDn: 'uid=gauss,dc=example,dc=com',
    userPassword: `${req.body.password}`,
    userSearchBase: 'dc=example,dc=com',
    usernameAttribute: 'uid',
    username: `${req.body.username}`,
  })
  if (authenticated){
    res.status(200).json({ token: jwt.sign({user: 'admin'}, 's3tk3nd'), expiresIn: '100000', authUserState: {user: 'admin'} })
  } else {
    res.status(400).send('Wrong username or password')
  }
})

module.exports = router;
