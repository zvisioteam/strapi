'use strict';

const { chain } = require('stream-chain');
const { stringer } = require('stream-json/jsonl/Stringer');
const stream = require('stream');
const fs = require('fs');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Resolve the components & dynamic zones attributes so that we can populate them
    const { attributes } = strapi.contentTypes['api::address.address'];
    const fieldsToPopulate = Object.keys(attributes).filter((key) =>
      ['component', 'dynamiczone'].includes(attributes[key].type)
    );

    chain([
      // streaming all the countries
      await strapi.entityService.stream('api::address.address', { populate: fieldsToPopulate }),
      // transform stream to log & transform
      (data) => {
        console.log('Backing up', data);

        const { id, ...entity } = data;

        return {
          type: 'api::country.country',
          id,
          data: entity,
        };
      },
      // this would be bound to the destination provider stream (using the engine) instead of a file like this one
      stringer(),
      fs.createWriteStream('../out.jsonl'),
    ]).on('end', () => {
      process.exit();
    });
  },

  /**
   * An asynchronous destroy function that runs before
   * your application gets shut down.
   *
   * This gives you an opportunity to gracefully stop services you run.
   */
  destroy({ strapi }) {},
};
