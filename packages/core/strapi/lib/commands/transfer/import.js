'use strict';

const {
  LocalFileSourceProvider,
  LocalStrapiDestinationProvider,
  TransferEngine,
} = require('@strapi/data-transfer');

module.exports = async () => {
  const engine = new TransferEngine(
    // From file
    new LocalFileSourceProvider({ backupFilePath: './backup.tar.gz' }),
    // To file
    new LocalStrapiDestinationProvider({
      getStrapiInstance() {
        return require('../../Strapi')().load();
      },
    })
  );

  await engine.transfer();
};
