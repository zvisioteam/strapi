import fs from 'fs';
import path from 'path';
import { chain } from 'stream-chain';
import { stringer } from 'stream-json/jsonl/Stringer';

import { IDestinationProvider, ProviderType, Stream } from '../../types';

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
    const entitiesFileName = 'entities_0001.jsonl';

    const fullPath = path.join(this.options.backupFilePath, entitiesDir, entitiesFileName);

    return chain([
      // Transform the data back into JSONL strings
      stringer(),
      // Write the output in the out file
      fs.createWriteStream(fullPath),
    ]);
  }
}
