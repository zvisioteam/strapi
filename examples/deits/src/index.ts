import { LocalFileSourceProvider } from './providers/source-local-file';
import { LocalFileDestinationProvider } from './providers/destination-local-file';
import { TransferEngine } from './engine';

/**
 * Basic tests on the source file provider
 */
const trySourceFileProvider = async () => {
  try {
    console.log('Testing the source file provider');

    console.log('Creating the file provider instance...');
    const fileProvider = new LocalFileSourceProvider({ backupFilePath: 'out/backup.tar.gz' });
    console.log('Done ✔️');

    console.log('Bootstrap step...');
    fileProvider.bootstrap();
    console.log('Done ✔️');

    console.log('Fetching the source metadata...');
    const metadata = await fileProvider.getMetadata();
    console.log('Done ✔️');
    console.log(metadata);
  } catch (error) {
    console.error('Panic:', error.message);
  }
};

/**
 * Basic tests on the destination file provider
 */
const tryDestinationFileProvider = async () => {
  try {
    console.log('Testing the destination file provider');

    console.log('Creating the file provider instance...');
    const fileProvider = new LocalFileDestinationProvider({ backupFilePath: 'out/backup-out' });
    console.log('Done ✔️');

    console.log('Fetching the destination metadata...');
    const metadata = await fileProvider.getMetadata();
    console.log('Done ✔️');
    console.log(metadata);
  } catch (error) {
    console.error('Panic:', error.message);
  }
};

/**
 * Try the engine with the file providers
 */

const tryTransferEngineWithFileProviders = async () => {
  try {
    const sourceProvider = new LocalFileSourceProvider({ backupFilePath: 'out/backup.tar.gz' });
    const destinationProvider = new LocalFileDestinationProvider({
      backupFilePath: 'out/backup-out',
    });

    const engine = new TransferEngine(sourceProvider, destinationProvider, {
      strategy: 'restore',
      versionMatching: 'minor',
    });

    await engine.transfer();
  } catch (error) {
    console.error('Panic:', error);
  }
};

(async () => {
  // await trySourceFileProvider();
  // await tryDestinationFileProvider();
  await tryTransferEngineWithFileProviders();
})();
