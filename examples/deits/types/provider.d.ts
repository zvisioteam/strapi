import { IMetadata } from './common-entities';
import { StreamItem } from './utils';

type ProviderType = 'source' | 'destination';

interface IProvider {
  type: ProviderType;
  name: string;

  bootstrap?(): Promise<void> | void;
  close?(): Promise<void> | void;
  getMetadata(): IMetadata | Promise<IMetadata>;
}

export interface ISourceProvider extends IProvider {
  // Getters for the source's transfer streams
  streamEntities?(): StreamItem;
  streamLinks?(): StreamItem;
  streamMedia?(): StreamItem;
  streamConfiguration?(): StreamItem;
}

export interface IDestinationProvider extends IProvider {
  /**
   * Optional rollback implementation
   */
  rollback?(): void | Promise<void>;

  // Getters for the destination's transfer streams
  getEntitiesStream?(): StreamItem;
  getLinksStream?(): StreamItem;
  getMediaStream?(): StreamItem;
  getConfigurationStream?(): StreamItem;
}
