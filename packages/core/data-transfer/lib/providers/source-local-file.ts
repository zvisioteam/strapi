import fs from 'fs';
import { get } from 'lodash/fp';
import Chain, { chain } from 'stream-chain';
import { pipeline } from 'stream';
import { parser } from 'stream-json/jsonl/Parser';
import { createGunzip } from 'zlib';
import tar from 'tar';

import type { IMetadata, ISourceProvider, ProviderType, Stream, StreamItem } from '../../types';
import { parseJSONFile } from '../utils';
import { decrypt } from '../encryption';

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
    const readStream = fs.createReadStream(path);
    const streams: StreamItem[] = [readStream];

    if (decompress) {
      const gz = createGunzip();

      streams.push(gz);
    }

    return chain(streams);
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
    return null;
    const archiveStream = this.getFileStream(this.options.backupFilePath);

    return parseJSONFile<IMetadata>(archiveStream, METADATA_FILE_PATH);
  }

  streamEntities() {
    const inStream = this.getFileStream(this.options.backupFilePath);

    // Temporary solution in order to use an empty chain (passthrough) as an outstream
    const outStream = chain([(data) => data]);

    pipeline(
      [
        inStream,
        new tar.Parse({
          filter(path, entry) {
            if (entry.type !== 'File') {
              return false;
            }

            const parts = path.split('/');

            if (parts.length !== 2) {
              return false;
            }

            const [directory] = parts;

            return directory === 'entities';
          },

          onentry(entry) {
            const entitiesTransforms = [
              // Decryption
              decrypt('Hello World!').decipher(),
              // Decompression
              // createGunzip(),
              // JSONL parsing
              parser(),
              // Only keep the value property from the parsed data
              get('value'),
            ];

            entry
              // Pipe transforms
              .pipe(chain(entitiesTransforms))
              // Pipe the out stream to the whole pipeline
              // DO NOT send the 'end' event when this entry has finished
              // emitting data, so that it doesn't close the out stream
              .pipe(outStream, { end: false });
          },
        }),
      ],
      async () => {
        // Manually send the end event to the out stream
        // once every entry has finished streaming its content
        outStream.end();
      }
    );

    return outStream;
  }
}
