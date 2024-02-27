require('dotenv').config()
const path = require('path')
const routes = require('./src/routes')

const lti = require('ltijs').Provider

// Setup
lti.setup(process.env.LTI_KEY,
  {
    url: 'mongodb://' + process.env.DB_HOST + '/' + process.env.DB_NAME + '?authSource=admin',
    connection: { user: process.env.DB_USER, pass: process.env.DB_PASS }
  }, {
    staticPath: path.join(__dirname, './public'), // Path to static files
    cookies: {
      secure: false, // Set secure to true if the testing platform is in a different domain and https is being used
      sameSite: '' // Set sameSite to 'None' if the testing platform is in a different domain and https is being used
    },
    devMode: true // Set DevMode to true if the testing platform is in a different domain and https is not being used
  })

// When receiving successful LTI launch redirects to app
lti.onConnect(async (token, req, res) => {
  return res.sendFile(path.join(__dirname, './public/index.html'))
})

// When receiving deep linking request redirects to deep screen
lti.onDeepLinking(async (token, req, res) => {
  return lti.redirect(res, '/deeplink', { newResource: true })
})

// Setting up routes
lti.app.use(routes)

// Setup function
const setup = async () => {
  await lti.deploy({ port: process.env.PORT })

  /**
   * Register platform
   */
  /* await lti.registerPlatform({
    url: 'http://localhost/moodle',
    name: 'Platform',
    clientId: 'CLIENTID',
    authenticationEndpoint: 'http://localhost/moodle/mod/lti/auth.php',
    accesstokenEndpoint: 'http://localhost/moodle/mod/lti/token.php',
    authConfig: { method: 'JWK_SET', key: 'http://localhost/moodle/mod/lti/certs.php' }
  }) */
   await lti.registerPlatform({
    url: 'https://blackboard.com',
    name: 'Platform',
    clientId: 'e6ee71b5-519d-40c0-bb36-e481afe6585d',
    authenticationEndpoint: 'https://developer.anthology.com/api/v1/gateway/oidcauth',
    accesstokenEndpoint: 'https://developer.anthology.com/api/v1/gateway/oauth2/jwttoken',
    authConfig: { method: 'JWK_SET', key: 'https://developer.anthology.com/api/v1/management/applications/e6ee71b5-519d-40c0-bb36-e481afe6585d/jwks.json' }
  }) 
  await lti.registerPlatform({
    url: 'https://blackboard.com',
    name: 'Platform',
    clientId: '4b21d66e-0b1e-4467-8d78-9ad39d0dd5bc',
    authenticationEndpoint: 'https://developer.anthology.com/api/v1/gateway/oidcauth',
    accesstokenEndpoint: 'https://developer.anthology.com/api/v1/gateway/oauth2/jwttoken',
    authConfig: { method: 'JWK_SET', key: 'https://developer.anthology.com/api/v1/management/applications/4b21d66e-0b1e-4467-8d78-9ad39d0dd5bc/jwks.json' }
  })
  await lti.deletePlatform('https://nouvelontest.desire2learn.com','37daa47d-3733-481e-9378-d07524583a7d');
  await lti.registerPlatform({
    url: 'https://nouvelontest.desire2learn.com',
    name: 'Platform',
    clientId: '37daa47d-3733-481e-9378-d07524583a7d',
    authenticationEndpoint: 'https://nouvelontest.desire2learn.com/d2l/lti/authenticate',
    accesstokenEndpoint: 'https://auth.brightspace.com/core/connect/token',
    authConfig: { method: 'JWK_SET', key: 'https://nouvelontest.desire2learn.com/d2l/.well-known/jwks' }
  })
}

setup()
