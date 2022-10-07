import { chain, Duplex, PassThrough } from 'stream-chain';
import type { IMetadata, ISourceProvider, ProviderType, Stream, StreamItem } from '../../types';

export interface ILocalFileStrapiProviderOptions {
  createStrapiInstance(): Promise<Strapi.Strapi>;
}

const getPopulateAttributesFromContentType = (contentType) => {
  const { attributes } = contentType;

  const fieldsToPopulate = Object.keys(attributes).filter((key) =>
    ['component', 'dynamiczone'].includes(attributes[key].type)
  );

  return fieldsToPopulate;
};

export class LocalStrapiSourceProvider implements ISourceProvider {
  name: string = 'provider::source.local-strapi';
  type: ProviderType = 'source';
  options: ILocalFileStrapiProviderOptions;
  strapi?: Strapi.Strapi;

  constructor(options: ILocalFileStrapiProviderOptions) {
    this.options = options;
  }

  async bootstrap() {
    this.strapi = await this.options.createStrapiInstance();
  }

  async close() {
    console.log('closing strapi');
    await this.strapi?.destroy();
  }

  getMetadata() {
    return null;
  }

  async streamEntities(): Promise<Stream> {
    // iterate over each content types
    // create a QB stream on them
    // pipe those streams to the out stream

    if (!this.strapi) {
      throw new Error('Not able to stream entities. Strapi instance not found');
    }

    // const contentTypes = Object.values<any>(this.strapi.contentTypes);
    const contentTypes = [this.strapi.contentTypes['api::address.address']];

    for (const contentType of contentTypes) {
      const attributesToPopulate = getPopulateAttributesFromContentType(contentType);

      const inStream = await strapi.entityService.stream(contentType.uid, {
        populate: attributesToPopulate,
      });

      const pipeline = chain([
        inStream,
        (data) => {
          console.log('Backing up', data);
          const { id, ...entity } = data;
          return {
            type: 'api::country.country',
            id,
            data: entity,
          };
        },
      ]);

      return pipeline;
    }
  }
}
