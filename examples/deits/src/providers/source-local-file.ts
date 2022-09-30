import fs from 'fs';
import Chain, { chain } from 'stream-chain';
import { createGunzip } from 'zlib';
import tar from 'tar';

import { IMetadata, ISourceProvider, ProviderType, StreamItem } from '../../types';
import { pipeline } from 'stream';

const METADATA_FILE_PATH = 'metadata.json';

export interface ILocalFileSourceProviderOptions {
  backupFilePath: string;

  // Encryption
  encrypted?: boolean;
  encryptionKey?: string;
}

export class LocalFileSourceProvider implements ISourceProvider {
  name: string = 'provider::source.local-file';
  type: ProviderType = 'source';
  options: ILocalFileSourceProviderOptions;

  constructor(options: ILocalFileSourceProviderOptions) {
    this.options = options;
  }

  private getFileStream(path: string, decompress: boolean = true): Chain {
    const streams: StreamItem[] = [fs.createReadStream(path)];

    if (decompress) {
      streams.push(createGunzip());
    }

    return chain(streams);
  }

  private async parseJSONFile<T extends {} = unknown>(filepath: string) {
    const backupPath = this.options.backupFilePath;

    return new Promise<T>((resolve, reject) => {
      pipeline(
        [
          this.getFileStream(backupPath),
          // Custom backup archive parsing
          new tar.Parse({
            /**
             * Filter the parsed entries to only keep the one that matches the given filepath
             */
            filter(path, entry) {
              return path === filepath && entry.type === 'File';
            },

            /**
             * Whenever an entry passes the filter method, process it
             */
            async onentry(entry) {
              // Collect all the content of the entry file
              const content = await entry.collect();
              // Parse from buffer to string to JSON
              const parsedContent = JSON.parse(content.toString());

              // Resolve the Promise with the parsed content
              resolve(parsedContent);

              // Cleanup (close the stream associated to the entry)
              entry.destroy();
            },
          }),
        ],
        () => {
          // If the promise hasn't been resolved and we've parsed all
          // the archive entries, then the file doesn't exist
          reject(`${filepath} not found in ${backupPath}`);
        }
      );
    });
  }

  bootstrap() {
    const path = this.options.backupFilePath;
    const isValidBackupPath = fs.existsSync(path);

    // Check if the provided path exists
    if (!isValidBackupPath) {
      throw new Error(
        `Invalid backup file path provided. "${path}" does not exist on your filesystem.`
      );
    }
  }

  async getMetadata() {
    return this.parseJSONFile<IMetadata>(METADATA_FILE_PATH);
  }
}
