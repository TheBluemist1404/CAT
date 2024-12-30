const authRoutes = require('./auth.route');
const tokenRoutes = require('./token.route');
const postRoutes = require('./post.route');

module.exports = app => {
  const version = '/api/v1';

  app.use(version + '/auth', authRoutes);
  app.use(version + '/token', tokenRoutes);
  app.use(version + '/forum', postRoutes);
};
