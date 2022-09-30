import { LocalFileSourceProvider } from './providers/source-local-file';

/**
 * Basic tests on the source file provider
 */
const trySourceFileProvider = async () => {
  try {
    console.log('Testing the source file provider');

    console.log('Creating the file provider instance...');
    const fileProvider = new LocalFileSourceProvider({ backupFilePath: 'out/ackup.tar.gz' });
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

(async () => {
  await trySourceFileProvider();
})();
