'use strict';

const { v4: uuid } = require('uuid');
const { defaultsDeep } = require('lodash/fp');

const defaults = {
  header: 'X-Request-Id',
  exposeHeader: 'true',
};

/**
 * @type {import('./').MiddlewareFactory}
 */
module.exports = (config) => {
  const { header, exposeHeader } = defaultsDeep(defaults, config);

  return async (ctx, next) => {
    const requestId = (header && ctx.get(header)) || uuid();

    ctx.id = requestId;
    ctx.state.requestId = requestId;

    if (exposeHeader) {
      ctx.set(header, requestId);
    }

    await next();
  };
};
