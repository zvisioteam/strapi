import '@strapi/strapi';
import {
  Attribute,
  ComponentAttribute,
  DynamicZoneAttribute,
  GetAttribute,
  GetAttributesKey,
  GetAttributesKeysByType,
  GetAttributeValue,
  MediaAttribute,
  RelationAttribute,
} from '@strapi/strapi';
import { GetArrayValues, SchemaUID } from '@strapi/strapi/lib/types/utils';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};

/**
 * Utils
 */

type StringAttributesKey<T extends SchemaUID> = Extract<GetAttributesKey<T>, string>;

type AttributeTarget<A extends Attribute> = A extends RelationAttribute<infer _, infer __, infer G>
  ? G
  : A extends ComponentAttribute<infer T, infer _R>
  ? T
  : A extends MediaAttribute
  ? 'plugin::upload.file'
  : A extends DynamicZoneAttribute<infer C>
  ? GetArrayValues<C>
  : never;

/**
 * Entity Service
 */

/**
 * Params
 */

// TODO: need to remove morph relations from sort, filters, etc...

type Params<T extends SchemaUID> = SelectionParams<T> & FilteringParams<T> & PaginationParams;

type FilteringParams<T extends SchemaUID> = {
  _q?: string;
  filters?: WhereParams<T>;
};

type SelectionParams<T extends SchemaUID> = {
  fields?: Fields<T>;
  populate?: Populate<T>;
  sort?: Sort<T>;
};

type PaginationParams = {
  page?: number;
  pageSize?: number;
  start?: number;
  limit?: number;
};

/**
 * Fields
 */

// Should we remove attributes that can be populated from there?
// Had some issues regarding select t0.relationAttribute last time
type Fields<T extends SchemaUID> = GetAttributesKey<T>[];

/**
 * Sort
 */

type SortOrder = 'asc' | 'desc';

type SortLiteral<T extends SchemaUID> = BasicSortKeys<T> | `${BasicSortKeys<T>}:${SortOrder}`;

type BasicSortKeys<T extends SchemaUID> =
  | 'id'
  | Exclude<StringAttributesKey<T>, ComplexSortKeys<T>>;

type ComplexSortKeys<T extends SchemaUID> = Extract<
  StringAttributesKey<T>,
  GetAttributesKeysByType<T, 'relation' | 'component' | 'media' | 'dynamiczone'>
>;

type NestedSort<T extends SchemaUID> = {
  // Are nested sorts only allowed for relations? (components, DZ, media, etc...)
  [key in ComplexSortKeys<T>]?: GetAttribute<T, key> extends infer A extends Attribute
    ? AttributeTarget<A> extends infer G extends SchemaUID
      ? NestedSort<G>
      : never
    : never;
} & {
  [key in BasicSortKeys<T>]?: SortOrder;
};

type Sort<T extends SchemaUID> =
  | SortLiteral<T>
  | NestedSort<T>
  | (SortLiteral<T> | NestedSort<T>)[];

/**
 * Populate
 */

type PopulateAll = '*';

type PopulateKeys<T extends SchemaUID> = GetAttributesKeysByType<
  T,
  'relation' | 'component' | 'media' | 'dynamiczone'
>;

type PopulateObject<T extends SchemaUID> = {
  [key in PopulateKeys<T>]?: GetAttribute<T, key> extends infer A
    ? A extends Attribute
      ?
          | true
          | (Omit<Params<AttributeTarget<A>>, 'populate'> & {
              populate?: true | Populate<AttributeTarget<A>>;
            })
      : never
    : never;
};

type Populate<T extends SchemaUID> =
  | PopulateAll
  | PopulateKeys<T>
  | PopulateKeys<T>[]
  | PopulateObject<T>;

/**
 *  Populate experiments
 */

// type PopulateString<T extends SchemaUID> =  PopulateKeys<T> | `${Extract<PopulateKeys<T>, 'string'>},${Extract<PopulateKeys<T>, 'string'>}}` |  //| `${PopulateKeys<T>},p`;

// 'foo' | 'bar' | 'foobar'
// 'foo' | 'foo,bar' | 'foo,bar,foobar' | 'foo,foobar' | 'foo,foobar,bar' | 'bar' | 'bar,foo' | 'bar,foo,foobar' | 'bar,foobar' | 'bar,foobar,foo' | 'foobar' | 'foobar,foo' | 'foobar,foo,bar' | 'foobar,bar' | 'foobar,bar,foo'

// type C = PopulateKeys<'api::restaurant.restaurant'>;

// type M<T extends C> = GetP<T> extends infer P ? P : never;
// type O<T extends C> = T extends never ? never : T | `${T},${O<Exclude<C, M<T>>>}`;

// const p: O<C> = ''

// type GetP<T extends C> = T extends `${infer P},${infer U}`
//   ? U extends C
//     ?  P | GetP<U>
//     : P
//   : T extends C
//     ? T
//     : never;

// type P<T extends string> = GetP<T> extends infer X ? X : never;

// const p: M<C> = ''

// type PopulateString<T extends SchemaUID> = PopulateKeys<T> extends infer P ? P : never;
// | `${Extract<PopulateKeys<T>, 'string'>},${PopulateString<T>}` //| `${PopulateKeys<T>},p`;

// type D = 'address' | 'dz';

// => ['dz', 'categories']
// 'address' | address,dz | address,categories

// type UnionToParm<U> = U extends any ? (k: U) => void : never;
// type UnionToSect<U> = UnionToParm<U> extends (k: infer I) => void ? I : never;
// type ExtractParm<F> = F extends { (a: infer A): void } ? A : never;

// type SpliceOne<Union> = Exclude<Union, ExtractOne<Union>>;
// type ExtractOne<Union> = ExtractParm<UnionToSect<UnionToParm<Union>>>;

// type ToTuple<Union> = ToTupleRec<Union, []>;
// type ToTupleRec<Union, Rslt extends any[]> = SpliceOne<Union> extends never
//   ? [ExtractOne<Union>, ...Rslt]
//   : ToTupleRec<SpliceOne<Union>, [ExtractOne<Union>, ...Rslt]>;

// type Custom<T extends string> = `${T}e9`;

// type ElementOf<T> = T extends (infer E)[] ? E : T;

// type X<T extends SchemaUID, Union extends PopulateKeys<T> = PopulateKeys<T>, N extends ToTuple<Union> = ToTuple<Union>> = A<N>;

// type A<T extends unknown[]> = ElementOf<T>

// type Z = X<'api::restaurant.restaurant'>

/**
 * Filters
 */

// TODO: Taken from actual code, to check & update

type LogicalOperators<T extends SchemaUID> = {
  $and?: WhereParams<T>[];
  $or?: WhereParams<T>[];
  $not?: WhereParams<T>;
};

type GetAttributeValueFromKey<T extends SchemaUID, K extends GetAttributesKey<T>> = GetAttribute<
  T,
  K
> extends infer A
  ? A extends Attribute
    ? GetAttributeValue<A>
    : never
  : never;

type Operator<T extends SchemaUID, K extends GetAttributesKey<T>> = GetAttribute<
  T,
  K
> extends infer A extends Attribute
  ? GetAttributeValue<A> extends infer V
    ? {
        $eq?: V | Array<V>;
        $ne?: V | Array<V>;
        $in?: V[];
        $notIn?: V[];
        $lt?: V;
        $lte?: V;
        $gt?: V;
        $gte?: V;
        $between?: [V, V];
        $contains?: V;
        $notContains?: V;
        $containsi?: V;
        $notContainsi?: V;
        $startsWith?: V;
        $endsWith?: V;
        $null?: boolean;
        $notNull?: boolean;
        $not?: WhereParams<T> | Operator<T, K>;
      }
    : never
  : never;

export type WhereParams<T extends SchemaUID> = {
  [K in GetAttributesKey<T>]?:
    | GetAttributeValueFromKey<T, K>
    | GetAttributeValueFromKey<T, K>[]
    | Operator<T, K>;
} & LogicalOperators<T>;

/**
 * Example
 */

const params: Params<'api::address.address'> = {
  fields: ['city', 'cover', 'categories'],

  sort: [{ categories: { name: 'asc' } }, 'city:asc'],

  filters: {
    postal_code: {
      $between: ['55', '69'],
    },
  },

  populate: {
    categories: {
      fields: ['name'],
      limit: 5,
    },
  },

  _q: 'smth',

  start: 5,
  limit: 10,
  // or
  page: 2,
  pageSize: 5,
};
