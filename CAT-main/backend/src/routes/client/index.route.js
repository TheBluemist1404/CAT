const express = require('express');
const authRoutes = require('./auth.route');
const tokenRoutes = require('./token.route');

module.exports = app => {
  const version = '/api/v1';

  app.use(version + '/auth', authRoutes);
  app.use(version + '/token', tokenRoutes);
};
