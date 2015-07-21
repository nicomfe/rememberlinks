'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN: 'http://localhost:9000',
  SESSION_SECRET: "rememberlinksapp-secret",

  FACEBOOK_ID: '694359170670859',
  FACEBOOK_SECRET: 'bcbe091b9e52714a9beac5f647acc5cf',

  TWITTER_ID: 'gxhAql8jnPwBiolr08GB0fsyL',
  TWITTER_SECRET: 'UDCDjbWc2UbYQlkEjQ02UZEHQ4J5PYLivPRfK2NsdNMyVg737P',

  GOOGLE_ID: '82301787361-emhbtis7u4osk2bpcp0iosfk76j9aen9.apps.googleusercontent.com',
  GOOGLE_SECRET: 'QeheWKIhdLBLS_bXhqmfpRqr',

  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
