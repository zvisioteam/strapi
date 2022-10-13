import { ContentTypeSchema } from '@strapi/strapi';
import { chain } from 'stream-chain';
import { Readable, Duplex, PassThrough } from 'stream';
import type { IBasicLink, ISourceProvider, ProviderType, Stream } from '../../types';

export interface ILocalFileStrapiProviderOptions {
  createStrapiInstance(): Promise<Strapi.Strapi>;
}

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
    if (!this.strapi) {
      throw new Error('Not able to stream entities. Strapi instance not found');
    }

    const transformStream = new PassThrough({
      objectMode: true,
      transform(data, _encoding, callback) {
        const { entity, contentType } = data;
        const { id, ...attributes } = entity;

        callback(null, {
          type: contentType.uid,
          id,
          data: attributes,
        });
      },
    });

    const entitiesStream = await createMultiContentTypesStream(this.strapi);

    return chain([
      // Entities
      entitiesStream,
      // Transform to transfer format
      transformStream,
    ]);
  }

  async streamLinks(): Promise<Stream> {
    if (!this.strapi) {
      throw new Error('Not able to stream links. Strapi instance not found');
    }

    const self = this;

    // const links = Object.values(this.strapi.contentTypes)
    //   .map((contentType: any) => {
    //     const isLink = (attribute: any) => ['relation', 'media'].includes(attribute.type);

    //     return Object.entries<any>(contentType.attributes).reduce((acc, [key, value]) => {
    //       if (isLink(value) && !value.mappedBy) {
    //         acc.push({
    //           type: contentType.uid,
    //           attribute: {
    //             key,
    //             value,
    //           },
    //         });
    //       }

    //       return acc;
    //     }, []);
    //   })
    //   .flat();
    /**
     * "collectionName": "strapi_users_roles"
     * "useJoinTable": false,
     * type
     * relation
     * inversedBy/mappedBy
     */
    // console.log(JSON.stringify(links, null, 2));

    const getStream = (ct, filters) => {
      return this.strapi.entityService.stream(ct.uid, filters);
    };

    const getLinks = (contentTypes: any[]) => {
      const s1 = Duplex.from(function* () {
        for (const contentType of contentTypes) {
          const relationalAttributes = Object.entries<any>(contentType.attributes).filter(
            ([_name, value]) => {
              return value.type === 'media' || (value.type === 'relation' && !value.mappedBy);
            }
          );

          yield {
            contentType,
            relationalAttributes,
          };
        }
      });

      const s2 = Duplex.from(async function* (generator: AsyncGenerator) {
        let it;

        while ((it = await generator.next())) {
          const { contentType, relationalAttributes } = it.value;
          console.log('-->', contentType.uid);
          console.log(
            '   ',
            relationalAttributes.map(([name]) => name)
          );

          console.log(self.strapi);

          const s3 = await self.strapi.entityService.stream(contentType.uid, {
            populate: relationalAttributes.map(([name]) => name),
          });

          for await (const entity of s3) {
            for (const [attributeName] of relationalAttributes) {
              const value = entity[attributeName];

              yield {
                contentType,
                entity,
                value,
              };
            }
          }
        }
      });

      return chain([
        s1,
        // (data) => {
        //   console.log(data);
        //   return data;
        // },
        s2,
      ]);
    };

    return getLinks(Object.values(this.strapi.contentTypes));

    /**
     * if resolve links tables name + export them => allow to export broken links (all)
     * if populate then parse => really easy, do not export unused relations
     */

    // const method = async (uid: string, attributeName: string, attribute: any) => {
    //   if (attribute.type === 'relation') {
    //     // Inline relations
    //     if (attribute.useJoinTable === false) {
    //       return chain([
    //         // Get each entity (id + populated relation'id )
    //         await this.strapi.entityService.stream(uid, {
    //           fields: ['id'],
    //           populate: { [attributeName]: { fields: ['id'] } },
    //         }),
    //         (entity) => {
    //           return {
    //             kind: uid === attribute.target ? 'relation.circular' : 'relation.basic',

    //             left: {
    //               type: uid,
    //               ref: entity.id,
    //             },

    //             right: {
    //               type: attribute.target,
    //               // We cannot have an array for the populated field
    //               ref: entity[attributeName].id,
    //             },
    //           };
    //         },
    //       ]);
    //     }

    //     // ct + all associated attributes links

    //     const ctAttributes = [];

    //     return chain([
    //       await this.strapi.entityService.stream(uid, { fields: ['id'], populate: {} }),
    //       Duplex.from(function* (entity) {
    //         for (const attribute of ctAttributes) {
    //           yield {
    //             type: uid,
    //             attribute: attribute.value,
    //             ket: attribute.key,
    //             value: entity[attribute.key],
    //           };
    //         }
    //       }),
    //       (entity) => {
    //         return {};
    //       },
    //     ]);
    //   }

    //   // Media relations (morph)
    //   if (attribute.type === 'media') {
    //     // Do smth
    //   }
    // };

    /**
     * for each type {
     *   stream each entity + populate all its links
     *
     * }
     */
  }
}

const createMultiContentTypesStream = async (strapi: Strapi.Strapi) => {
  const contentTypes: any[] = Object.values(strapi.contentTypes);

  const getNextContentTypeStream = async (): Promise<[Readable | null, any]> => {
    const contentType = contentTypes.pop();

    if (!contentType) {
      return [null, null];
    }

    const stream = await getContentTypeStream(strapi, contentType);

    return [stream, contentType];
  };

  async function* entitiesGenerator() {
    let [stream, contentType]: [Readable | null, any] = await getNextContentTypeStream();

    while (stream && contentType) {
      for await (const entity of stream) {
        yield { entity, contentType };
      }

      stream.destroy();

      [stream, contentType] = await getNextContentTypeStream();
    }
  }

  return Duplex.from(entitiesGenerator);
};

const getPopulateAttributesFromContentType = (contentType) => {
  const { attributes } = contentType;

  const fieldsToPopulate = Object.keys(attributes).filter((key) =>
    ['component', 'dynamiczone'].includes(attributes[key].type)
  );

  return fieldsToPopulate;
};

const getContentTypeStream = async (strapi: Strapi.Strapi, contentType: any) => {
  const populateAttributes = getPopulateAttributesFromContentType(contentType);

  return strapi.entityService.stream(contentType.uid, { populate: populateAttributes });
};
