'use strict';

const path = require('path');
const _ = require('lodash');
const dotenv = require('dotenv');
const execa = require('execa');
const { isTypeScriptProject } = require('../../packages/utils/typescript');
const strapi = require('../../packages/core/strapi/lib');
const { createUtils } = require('./utils');

const superAdminCredentials = {
  email: 'admin@strapi.io',
  firstname: 'admin',
  lastname: 'admin',
  password: 'Password123',
};

const superAdminLoginInfo = _.pick(superAdminCredentials, ['email', 'password']);

const TEST_APP_URL = path.resolve(__dirname, '../../testApp');

const createStrapiInstance = async ({
  ensureSuperAdmin = true,
  logLevel = 'fatal',
  bypassAuth = true,
} = {}) => {
  const appDir = TEST_APP_URL;

  // Read the .env file as it could have been updated
  dotenv.config({ path: process.env.ENV_PATH });

  const isTSProject = await isTypeScriptProject(appDir);
  const distDir = isTSProject ? appDir : path.resolve(appDir, 'dist');

  await execa('yarn', ['build']);

  const options = { appDir, distDir };
  const instance = strapi(options);

  if (bypassAuth) {
    instance.container.get('auth').register('content-api', {
      name: 'test-auth',
      authenticate() {
        return { authenticated: true };
      },
      verify() {
        return;
      },
    });
  }

  await instance.load();

  instance.log.level = logLevel;

  instance.server.mount();

  const utils = createUtils(instance);

  if (ensureSuperAdmin) {
    await utils.createUserIfNotExists(superAdminCredentials);
  }

  console.log(instance.dirs);

  return instance;
};

module.exports = {
  createStrapiInstance,
  superAdmin: {
    loginInfo: superAdminLoginInfo,
    credentials: superAdminCredentials,
  },
};
