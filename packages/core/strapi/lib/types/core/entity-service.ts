import {
  Attribute,
  ComponentAttribute,
  DynamicZoneAttribute,
  GetAttribute,
  GetAttributes,
  GetAttributesKey,
  GetAttributesKeysByType,
  GetAttributeValue,
  MediaAttribute,
  RelationAttribute,
} from '@strapi/strapi';
import { GetArrayValues, KeysBy, SchemaUID } from '@strapi/strapi/lib/types/utils';

type StringAttributesKey<T extends SchemaUID> = Extract<GetAttributesKey<T>, string>;

// Entity Service

// Params

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

type Params<T extends SchemaUID> = SelectionParams<T> & FilteringParams<T> & PaginationParams;

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
  GetAttributesKeysByType<T, 'relation'>
>;

type NestedSort<T extends SchemaUID> = {
  // Need to infer the target (either for a relation, a component, a media (or a dynamiczone?? <= not sure we support sorting on dynamic zones))
  // Are nested sorts only allowed for relations?
  [key in ComplexSortKeys<T>]?: GetAttribute<T, key> extends infer A
    ? A extends RelationAttribute<infer _1, infer _2, infer G>
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

// NOTE: Code below was an attempt to generate literal union type for all comma-separated combination possible (foo | bar | bar,foo | foo,bar, etc...)
// Probably won't add type support for this even though it's valid. TBD

// type PopulateString<T extends SchemaUID> =  PopulateKeys<T> | `${Extract<PopulateKeys<T>, 'string'>},${Extract<PopulateKeys<T>, 'string'>}}` |  //| `${PopulateKeys<T>},p`;

// 'foo' | 'bar' | 'foobar'
// 'foo' | 'foo,bar' | 'foo,bar,foobar' | 'foo,foobar' | 'foo,foobar,bar' | 'bar' | 'bar,foo' | 'bar,foo,foobar' | 'bar,foobar' | 'bar,foobar,foo' | 'foobar' | 'foobar,foo' | 'foobar,foo,bar' | 'foobar,bar' | 'foobar,bar,foo'

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

// // type P<T extends string> = GetP<T> extends infer X ? X : never;

// const p: M<C> = ''

// type PopulateString<T extends SchemaUID> = PopulateKeys<T> extends infer P
//   ? P
//   : never;
// // | `${Extract<PopulateKeys<T>, 'string'>},${PopulateString<T>}` //| `${PopulateKeys<T>},p`;

type AttributeTarget<A extends Attribute> =
  // Relation
  A extends RelationAttribute<infer _, infer __, infer G>
    ? G
    : // Component
    A extends ComponentAttribute<infer G>
    ? G
    : // Media
    A extends MediaAttribute
    ? 'plugin::upload.file'
    : // Dynamic Zone
    A extends DynamicZoneAttribute<infer C>
    ? GetArrayValues<C>
    : never;

type PopulateObject<T extends SchemaUID> = {
  [key in PopulateKeys<T>]?: GetAttribute<T, key> extends infer A
    ? A extends Attribute
      ?
          | true
          | (Omit<Params<AttributeTarget<A>>, 'populate'> & {
              populate: true | Populate<AttributeTarget<A>>;
            })
      : never
    : never;
};

type Populate<T extends SchemaUID> =
  | PopulateAll
  | PopulateKeys<T>
  | PopulateKeys<T>[]
  | PopulateObject<T>;

const p: Params<'api::restaurant.restaurant'> = {
  fields: ['address', 'createdBy', 'description'],

  sort: 'stars:desc',

  filters: {
    priceRange: { $notIn: ['expensive', 'very_expensive'] },
  },

  populate: {
    createdBy: true,
    categories: {
      fields: ['name'],
      populate: {
        localizations: {
          populate: {
            createdBy: true,
          },
        },
        addresses: true,
      },
    },
  },
};

// type UnionToParm<U> = U extends any ? (k: U) => void : never;
// type UnionToSect<U> = UnionToParm<U> extends ((k: infer I) => void) ? I : never;
// type ExtractParm<F> = F extends { (a: infer A): void } ? A : never;

// type SpliceOne<Union> = Exclude<Union, ExtractOne<Union>>;
// type ExtractOne<Union> = ExtractParm<UnionToSect<UnionToParm<Union>>>;

// type ToTuple<Union> = ToTupleRec<Union, []>;
// type ToTupleRec<Union, Rslt extends any[]> =
//     SpliceOne<Union> extends never ? [ExtractOne<Union>, ...Rslt]
//     : ToTupleRec<SpliceOne<Union>, [ExtractOne<Union>, ...Rslt]>
// ;

// type Custom<T extends string> = `${T}e9`;

// type ElementOf<T> = T extends (infer E)[] ? E : T;

// type X<T extends SchemaUID, Union extends PopulateKeys<T> = PopulateKeys<T>, N extends ToTuple<Union> = ToTuple<Union>> = A<N>;

// type A<T extends unknown[]> = ElementOf<T> |

// type C = X<'api::restaurant.restaurant'>

/**
 * Filters
 */

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
> extends infer A
  ? A extends Attribute
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
    : never
  : never;

export type WhereParams<T extends SchemaUID> = {
  [K in GetAttributesKey<T>]?:
    | GetAttributeValueFromKey<T, K>
    | GetAttributeValueFromKey<T, K>[]
    | Operator<T, K>;
} & LogicalOperators<T>;
