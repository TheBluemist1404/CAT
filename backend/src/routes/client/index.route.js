const authRoutes = require('./auth.route');
const oauthRoutes = require('./oauth.route')
const tokenRoutes = require('./token.route');
const postRoutes = require('./post.route');
const profileRoutes = require('./profile.route');
const codeRoutes = require('./code.route')
const projectRoutes = require('./project.route');
const followerRoutes = require('./follower.route');
module.exports = app => {
  const version = '/api/v1';

  app.use(version + '/auth', authRoutes);
  app.use(version + '/oauth', oauthRoutes);
  app.use(version + '/token', tokenRoutes);
  app.use(version + '/forum', postRoutes);
  app.use(version + '/profile', profileRoutes);
  app.use(version + '/code', codeRoutes);
  app.use(version + '/projects', projectRoutes);
  app.use(version+ '/users', followerRoutes);
};
