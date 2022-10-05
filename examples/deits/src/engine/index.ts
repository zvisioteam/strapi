import { chain } from 'stream-chain';
import {
  IDestinationProvider,
  ISourceProvider,
  ITransferEngine,
  ITransferEngineOptions,
} from '../../types';

export class TransferEngine implements ITransferEngine {
  sourceProvider: ISourceProvider;
  destinationProvider: IDestinationProvider;
  options: ITransferEngineOptions;

  constructor(
    sourceProvider: ISourceProvider,
    destinationProvider: IDestinationProvider,
    options: ITransferEngineOptions
  ) {
    this.sourceProvider = sourceProvider;
    this.destinationProvider = destinationProvider;
    this.options = options;
  }

  private assertIntegrityStrapiVersion(sourceVersion?: string, destinationVersion?: string) {
    const strategy = this.options.versionMatching;

    if (!sourceVersion || !destinationVersion) {
      return;
    }

    if (strategy === 'ignore') {
      return;
    }

    if (strategy === 'exact' && sourceVersion === destinationVersion) {
      return;
    }

    const sourceTokens = sourceVersion.split('.');
    const destinationTokens = destinationVersion.split('.');

    const [major, minor, patch] = sourceTokens.map(
      (value, index) => value === destinationTokens[index]
    );

    if (
      (strategy === 'major' && major) ||
      (strategy === 'minor' && major && minor) ||
      (strategy === 'patch' && major && minor && patch)
    ) {
      return;
    }

    throw new Error(
      `Strapi versions doesn't match (${strategy} check): ${sourceVersion} does not match with ${destinationVersion} `
    );
  }

  async boostrap(): Promise<void> {
    await Promise.all([
      // bootstrap source provider
      this.sourceProvider?.bootstrap(),
      // bootstrap destination provider
      this.destinationProvider?.bootstrap(),
    ]);
  }

  async close(): Promise<void> {
    await Promise.all([
      // close source provider
      this.sourceProvider?.close(),
      // close destination provider
      this.destinationProvider?.close(),
    ]);
  }

  async integrityCheck(): Promise<boolean> {
    const sourceMetadata = await this.sourceProvider.getMetadata();
    const destinationMetadata = await this.destinationProvider.getMetadata();

    try {
      // Version check
      this.assertIntegrityStrapiVersion(
        sourceMetadata?.strapi?.version,
        destinationMetadata?.strapi?.version
      );

      return true;
    } catch (error) {
      console.error('Integrity checks failed:', error.message);
      return false;
    }
  }

  async transfer(): Promise<void> {
    try {
      await this.boostrap();

      const isValidTransfer = await this.integrityCheck();

      if (!isValidTransfer) {
        throw new Error(
          `Unable to transfer the data between ${this.sourceProvider.name} and ${this.destinationProvider.name}.\nPlease refer to the log above for more information.`
        );
      }

      await this.transferEntities();
      // await this.transferLinks();
      // await this.transferMedia();
      // await this.transferConfiguration();

      await this.close();
    } catch (e) {
      // Rollback the destination provider if an exception is thrown during the transfer
      // Note: This will be configurable in the future
      await this.destinationProvider?.rollback(e);
    }
  }

  async transferEntities(): Promise<void> {
    if (!this.sourceProvider.streamEntities || !this.destinationProvider.getEntitiesStream) {
      return;
    }

    const inStream = this.sourceProvider.streamEntities();
    const outStream = this.destinationProvider.getEntitiesStream();

    return new Promise((resolve) => {
      chain(
        // We might want to use a json-chain's Chain here since they allow transforms
        // streams as regular functions (that allows object as parameter & return type)
        [inStream, outStream]
        // Once everything have been transferred & the streams
        // have been closed, resolve the promise gracefully
      )
        // Once everything has been transferred
        .on('end', () => {
          console.log('All the entities have been transferred');
          resolve();
        });
    });
  }

  async transferLinks(): Promise<void> {
    throw new Error('Not implemented');
  }

  async transferMedia(): Promise<void> {
    throw new Error('Not implemented');
  }

  async transferConfiguration(): Promise<void> {
    throw new Error('Not implemented');
  }
}
