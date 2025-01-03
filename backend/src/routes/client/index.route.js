const authRoutes = require('./auth.route');
const oauthRoutes = require('./oauth.route')
const tokenRoutes = require('./token.route');
const postRoutes = require('./post.route');
const profileRoutes = require('./profile.route');

module.exports = app => {
  const version = '/api/v1';

  app.use(version + '/auth', authRoutes);
  app.use(version + '/oauth', oauthRoutes);
  app.use(version + '/token', tokenRoutes);
  app.use(version + '/forum', postRoutes);
  app.use(version + '/profile', profileRoutes);
};
