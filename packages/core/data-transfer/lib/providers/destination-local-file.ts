import fs from 'fs';
import path from 'path';
import zip from 'zlib';
import { Writable } from 'stream';
import { chain } from 'stream-chain';
import { stringer } from 'stream-json/jsonl/Stringer';

import { IDestinationProvider, ProviderType, Stream } from '../../types';
import { encrypt } from '../encryption';

export interface ILocalFileDestinationProviderOptions {
  backupFilePath: string;

  // Encryption
  encrypted?: boolean;
  encryptionKey?: string;
}

export class LocalFileDestinationProvider implements IDestinationProvider {
  name: string = 'provider::destination.local-file';
  type: ProviderType = 'destination';
  options: ILocalFileDestinationProviderOptions;

  constructor(options: ILocalFileDestinationProviderOptions) {
    this.options = options;
  }

  bootstrap(): void | Promise<void> {
    const rootDir = this.options.backupFilePath;
    const dirExists = fs.existsSync(rootDir);

    if (dirExists) {
      fs.rmSync(rootDir, { force: true, recursive: true });
    }

    fs.mkdirSync(rootDir, { recursive: true });
    fs.mkdirSync(path.join(rootDir, 'entities'));
    fs.mkdirSync(path.join(rootDir, 'links'));
    fs.mkdirSync(path.join(rootDir, 'media'));
    fs.mkdirSync(path.join(rootDir, 'configuration'));
  }

  rollback(): void | Promise<void> {
    fs.rmSync(this.options.backupFilePath, { force: true, recursive: true });
  }

  getMetadata() {
    return null;
  }

  getEntitiesStream(): Stream {
    const entitiesDir = 'entities';
    const entitiesFileName = () => `entities_${k}.jsonl`;

    const fullPath = () => path.join(this.options.backupFilePath, entitiesDir, entitiesFileName());

    let size = 0;
    let k = 0;
    let writeStream = fs.createWriteStream(fullPath());

    const s = new Writable({
      objectMode: true,
      write(chunk, encoding, callback) {
        size += chunk.length;

        if (size > 2200000) {
          k += 1;
          size = 0;
          writeStream.end();
          writeStream.destroy();
          writeStream = fs.createWriteStream(fullPath());
          console.log('new write stream created');
        }

        writeStream.write(chunk, encoding, callback);
      },
    });

    const shouldEncrypt = true;

    // let chunkSize = 0;
    // let chunk = '';

    const streams: any[] = [
      stringer(),
      // (data) => {
      //   const strData = JSON.stringify(data) + '\n';
      //   chunkSize += strData.length;
      //   if (chunkSize > 1000000 || data === null) {
      //     chunkSize = 0;
      //     chunk = '';
      //     callback(null, chunk);
      //   }
      // },
    ];

    if (shouldEncrypt) {
      const encryptionStream = encrypt('hello').cipher();
      streams.push(encryptionStream);
    }

    streams.push(s);

    return chain(streams);
  }
}
