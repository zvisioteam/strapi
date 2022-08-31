import {
  CollectionTypeSchema,
  StringAttribute,
  RequiredAttribute,
  SetMinMaxLength,
  JSONAttribute,
  DefaultTo,
  RelationAttribute,
  DateTimeAttribute,
  PrivateAttribute,
  EmailAttribute,
  UniqueAttribute,
  PasswordAttribute,
  BooleanAttribute,
  EnumerationAttribute,
  IntegerAttribute,
  DecimalAttribute,
  SetMinMax,
  ConfigurableAttribute,
  MediaAttribute,
  UIDAttribute,
  ComponentAttribute,
  SetPluginOptions,
  DateAttribute,
  SingleTypeSchema,
  TextAttribute,
  RichTextAttribute,
  BigIntegerAttribute,
  FloatAttribute,
  TimeAttribute,
  TimestampAttribute,
  DynamicZoneAttribute,
  ComponentSchema,
} from '@strapi/strapi';

export interface AdminPermission extends CollectionTypeSchema {
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    subject: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: JSONAttribute & DefaultTo<{}>;
    conditions: JSONAttribute & DefaultTo<[]>;
    role: RelationAttribute<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'admin::permission', 'oneToOne', 'admin::user'> & PrivateAttribute;
    updatedBy: RelationAttribute<'admin::permission', 'oneToOne', 'admin::user'> & PrivateAttribute;
  };
}

export interface AdminUser extends CollectionTypeSchema {
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    username: StringAttribute;
    email: EmailAttribute &
      RequiredAttribute &
      PrivateAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    password: PasswordAttribute &
      PrivateAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: StringAttribute & PrivateAttribute;
    registrationToken: StringAttribute & PrivateAttribute;
    isActive: BooleanAttribute & PrivateAttribute & DefaultTo<false>;
    roles: RelationAttribute<'admin::user', 'manyToMany', 'admin::role'> & PrivateAttribute;
    blocked: BooleanAttribute & PrivateAttribute & DefaultTo<false>;
    preferedLanguage: StringAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'admin::user', 'oneToOne', 'admin::user'> & PrivateAttribute;
    updatedBy: RelationAttribute<'admin::user', 'oneToOne', 'admin::user'> & PrivateAttribute;
  };
}

export interface AdminRole extends CollectionTypeSchema {
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    code: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    description: StringAttribute;
    users: RelationAttribute<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: RelationAttribute<'admin::role', 'oneToMany', 'admin::permission'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'admin::role', 'oneToOne', 'admin::user'> & PrivateAttribute;
    updatedBy: RelationAttribute<'admin::role', 'oneToOne', 'admin::user'> & PrivateAttribute;
  };
}

export interface AdminApiToken extends CollectionTypeSchema {
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    plop: StringAttribute;
    name: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    description: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }> &
      DefaultTo<''>;
    type: EnumerationAttribute<['read-only', 'full-access']> & DefaultTo<'read-only'>;
    accessKey: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'admin::api-token', 'oneToOne', 'admin::user'> & PrivateAttribute;
    updatedBy: RelationAttribute<'admin::api-token', 'oneToOne', 'admin::user'> & PrivateAttribute;
  };
}

export interface PluginUploadFile extends CollectionTypeSchema {
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute & RequiredAttribute;
    alternativeText: StringAttribute;
    caption: StringAttribute;
    width: IntegerAttribute;
    height: IntegerAttribute;
    formats: JSONAttribute;
    hash: StringAttribute & RequiredAttribute;
    ext: StringAttribute;
    mime: StringAttribute & RequiredAttribute;
    size: DecimalAttribute & RequiredAttribute;
    url: StringAttribute & RequiredAttribute;
    previewUrl: StringAttribute;
    provider: StringAttribute & RequiredAttribute;
    provider_metadata: JSONAttribute;
    related: RelationAttribute<'plugin::upload.file', 'morphToMany'>;
    folder: RelationAttribute<'plugin::upload.file', 'manyToOne', 'plugin::upload.folder'> &
      PrivateAttribute;
    folderPath: StringAttribute &
      RequiredAttribute &
      PrivateAttribute &
      SetMinMax<{
        min: 1;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'plugin::upload.file', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'plugin::upload.file', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface PluginUploadFolder extends CollectionTypeSchema {
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    pathId: IntegerAttribute & RequiredAttribute & UniqueAttribute;
    parent: RelationAttribute<'plugin::upload.folder', 'manyToOne', 'plugin::upload.folder'>;
    children: RelationAttribute<'plugin::upload.folder', 'oneToMany', 'plugin::upload.folder'>;
    files: RelationAttribute<'plugin::upload.folder', 'oneToMany', 'plugin::upload.file'>;
    path: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'plugin::upload.folder', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'plugin::upload.folder', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface PluginMypluginTest extends CollectionTypeSchema {
  info: {
    displayName: 'Test';
    singularName: 'test';
    pluralName: 'tests';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    type: StringAttribute & RequiredAttribute & UniqueAttribute & ConfigurableAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'plugin::myplugin.test', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'plugin::myplugin.test', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface PluginI18NLocale extends CollectionTypeSchema {
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      SetMinMax<{
        min: 1;
        max: 50;
      }>;
    code: StringAttribute & UniqueAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'plugin::i18n.locale', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'plugin::i18n.locale', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsPermission extends CollectionTypeSchema {
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute & RequiredAttribute;
    role: RelationAttribute<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsRole extends CollectionTypeSchema {
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 3;
      }>;
    description: StringAttribute;
    type: StringAttribute & UniqueAttribute;
    permissions: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'plugin::users-permissions.role', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'plugin::users-permissions.role', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsUser extends CollectionTypeSchema {
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    username: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 3;
      }>;
    email: EmailAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: StringAttribute;
    password: PasswordAttribute &
      PrivateAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: StringAttribute & PrivateAttribute;
    confirmationToken: StringAttribute & PrivateAttribute;
    confirmed: BooleanAttribute & DefaultTo<false>;
    blocked: BooleanAttribute & DefaultTo<false>;
    role: RelationAttribute<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    picture: MediaAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'plugin::users-permissions.user', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'plugin::users-permissions.user', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiAddressAddress extends CollectionTypeSchema {
  info: {
    displayName: 'Address';
    singularName: 'address';
    pluralName: 'addresses';
    description: '';
    name: 'Address';
  };
  options: {
    draftAndPublish: false;
    comment: '';
  };
  attributes: {
    postal_code: StringAttribute &
      SetMinMaxLength<{
        maxLength: 2;
      }>;
    categories: RelationAttribute<'api::address.address', 'manyToMany', 'api::category.category'>;
    cover: MediaAttribute;
    images: MediaAttribute;
    city: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        maxLength: 200;
      }>;
    json: JSONAttribute;
    slug: UIDAttribute;
    notrepeat_req: ComponentAttribute<'blog.test-como'> & RequiredAttribute;
    repeat_req: ComponentAttribute<'blog.test-como', true> & RequiredAttribute;
    repeat_req_min: ComponentAttribute<'blog.test-como', true> &
      SetMinMax<{
        min: 2;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::address.address', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::address.address', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiCategoryCategory extends CollectionTypeSchema {
  info: {
    displayName: 'Category';
    singularName: 'category';
    pluralName: 'categories';
    description: '';
    name: 'Category';
  };
  options: {
    draftAndPublish: true;
    comment: '';
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    name: StringAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    addresses: RelationAttribute<'api::category.category', 'manyToMany', 'api::address.address'>;
    temps: RelationAttribute<'api::category.category', 'manyToMany', 'api::temp.temp'>;
    datetime: DateTimeAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    date: DateAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::category.category', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::category.category', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    localizations: RelationAttribute<
      'api::category.category',
      'oneToMany',
      'api::category.category'
    >;
    locale: StringAttribute;
  };
}

export interface ApiCountryCountry extends CollectionTypeSchema {
  info: {
    displayName: 'Country';
    singularName: 'country';
    pluralName: 'countries';
    description: '';
    name: 'Country';
  };
  options: {
    draftAndPublish: false;
    comment: '';
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      SetMinMaxLength<{
        minLength: 3;
      }>;
    code: StringAttribute &
      UniqueAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      SetMinMaxLength<{
        minLength: 2;
        maxLength: 3;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::country.country', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::country.country', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    localizations: RelationAttribute<'api::country.country', 'oneToMany', 'api::country.country'>;
    locale: StringAttribute;
  };
}

export interface ApiHomepageHomepage extends SingleTypeSchema {
  info: {
    displayName: 'Homepage';
    singularName: 'homepage';
    pluralName: 'homepages';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    title: StringAttribute &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    slug: UIDAttribute<'api::homepage.homepage', 'title'> &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    single: MediaAttribute;
    multiple: MediaAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::homepage.homepage', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::homepage.homepage', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    localizations: RelationAttribute<
      'api::homepage.homepage',
      'oneToMany',
      'api::homepage.homepage'
    >;
    locale: StringAttribute;
  };
}

export interface ApiKitchensinkKitchensink extends CollectionTypeSchema {
  info: {
    displayName: 'Kitchen Sink';
    singularName: 'kitchensink';
    pluralName: 'kitchensinks';
    description: '';
    name: 'Kitchen Sink';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    short_text: StringAttribute;
    long_text: TextAttribute;
    rich_text: RichTextAttribute;
    integer: IntegerAttribute;
    biginteger: BigIntegerAttribute;
    decimal: DecimalAttribute;
    float: FloatAttribute;
    date: DateAttribute;
    datetime: DateTimeAttribute;
    time: TimeAttribute;
    timestamp: TimestampAttribute;
    boolean: BooleanAttribute;
    email: EmailAttribute;
    password: PasswordAttribute;
    enumeration: EnumerationAttribute<['A', 'B', 'C', 'D', 'E']>;
    single_media: MediaAttribute;
    multiple_media: MediaAttribute;
    json: JSONAttribute;
    single_compo: ComponentAttribute<'basic.simple'>;
    repeatable_compo: ComponentAttribute<'basic.simple', true>;
    dynamiczone: DynamicZoneAttribute<['basic.simple']>;
    one_way_tag: RelationAttribute<'api::kitchensink.kitchensink', 'oneToOne', 'api::tag.tag'>;
    one_to_one_tag: RelationAttribute<'api::kitchensink.kitchensink', 'oneToOne', 'api::tag.tag'> &
      PrivateAttribute;
    one_to_many_tags: RelationAttribute<
      'api::kitchensink.kitchensink',
      'oneToMany',
      'api::tag.tag'
    >;
    many_to_one_tag: RelationAttribute<'api::kitchensink.kitchensink', 'manyToOne', 'api::tag.tag'>;
    many_to_many_tags: RelationAttribute<
      'api::kitchensink.kitchensink',
      'manyToMany',
      'api::tag.tag'
    >;
    many_way_tags: RelationAttribute<'api::kitchensink.kitchensink', 'oneToMany', 'api::tag.tag'>;
    morph_to_one: RelationAttribute<'api::kitchensink.kitchensink', 'morphToOne'>;
    morph_to_many: RelationAttribute<'api::kitchensink.kitchensink', 'morphToMany'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::kitchensink.kitchensink', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::kitchensink.kitchensink', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiLikeLike extends CollectionTypeSchema {
  info: {
    displayName: 'Like';
    singularName: 'like';
    pluralName: 'likes';
    description: '';
  };
  options: {
    draftAndPublish: false;
    comment: '';
  };
  attributes: {
    author: RelationAttribute<'api::like.like', 'oneToOne', 'plugin::users-permissions.user'>;
    review: RelationAttribute<'api::like.like', 'manyToOne', 'api::review.review'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::like.like', 'oneToOne', 'admin::user'> & PrivateAttribute;
    updatedBy: RelationAttribute<'api::like.like', 'oneToOne', 'admin::user'> & PrivateAttribute;
  };
}

export interface ApiMenuMenu extends CollectionTypeSchema {
  info: {
    description: '';
    displayName: 'Menu';
    singularName: 'menu';
    pluralName: 'menus';
  };
  options: {
    draftAndPublish: false;
    comment: '';
  };
  attributes: {
    description: TextAttribute;
    menusections: RelationAttribute<'api::menu.menu', 'oneToMany', 'api::menusection.menusection'>;
    restaurant: RelationAttribute<'api::menu.menu', 'oneToOne', 'api::restaurant.restaurant'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::menu.menu', 'oneToOne', 'admin::user'> & PrivateAttribute;
    updatedBy: RelationAttribute<'api::menu.menu', 'oneToOne', 'admin::user'> & PrivateAttribute;
  };
}

export interface ApiMenusectionMenusection extends CollectionTypeSchema {
  info: {
    displayName: 'Menu Section';
    singularName: 'menusection';
    pluralName: 'menusections';
    description: '';
  };
  options: {
    draftAndPublish: false;
    comment: '';
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    dishes: ComponentAttribute<'default.dish', true> & RequiredAttribute;
    menu: RelationAttribute<'api::menusection.menusection', 'manyToOne', 'api::menu.menu'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::menusection.menusection', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::menusection.menusection', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiRestaurantRestaurant extends CollectionTypeSchema {
  info: {
    displayName: 'Restaurant';
    singularName: 'restaurant';
    pluralName: 'restaurants';
    description: '';
    name: 'Restaurant';
  };
  options: {
    draftAndPublish: true;
    populateCreatorFields: true;
    comment: '';
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      SetMinMaxLength<{
        minLength: 5;
        maxLength: 50;
      }>;
    slug: UIDAttribute<'api::restaurant.restaurant', 'name'>;
    priceRange: EnumerationAttribute<
      ['very_cheap', 'cheap', 'average', 'expensive', 'very_expensive']
    > &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    closingPeriod: ComponentAttribute<'default.closingperiod'> &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    contactEmail: EmailAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    stars: IntegerAttribute &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      SetMinMax<{
        min: 0;
        max: 3;
      }>;
    averagePrice: FloatAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      SetMinMax<{
        min: 0;
        max: 35.12;
      }>;
    address: RelationAttribute<'api::restaurant.restaurant', 'oneToOne', 'api::address.address'>;
    cover: MediaAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    timestamp: TimestampAttribute;
    images: MediaAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    shortDescription: TextAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    since: DateAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    categories: RelationAttribute<
      'api::restaurant.restaurant',
      'oneToMany',
      'api::category.category'
    >;
    description: RichTextAttribute &
      RequiredAttribute &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      SetMinMaxLength<{
        minLength: 10;
      }>;
    services: ComponentAttribute<'default.restaurantservice', true> &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      SetMinMax<{
        max: 1;
      }>;
    menu: RelationAttribute<'api::restaurant.restaurant', 'oneToOne', 'api::menu.menu'>;
    openingTimes: ComponentAttribute<'default.openingtimes', true> &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      SetMinMax<{
        min: 1;
        max: 10;
      }>;
    dz: DynamicZoneAttribute<
      ['default.openingtimes', 'default.restaurantservice', 'default.closingperiod', 'default.dish']
    > &
      SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::restaurant.restaurant', 'oneToOne', 'admin::user'>;
    updatedBy: RelationAttribute<'api::restaurant.restaurant', 'oneToOne', 'admin::user'>;
    localizations: RelationAttribute<
      'api::restaurant.restaurant',
      'oneToMany',
      'api::restaurant.restaurant'
    >;
    locale: StringAttribute;
  };
}

export interface ApiReviewReview extends CollectionTypeSchema {
  info: {
    displayName: 'Review';
    singularName: 'review';
    pluralName: 'reviews';
    description: '';
  };
  options: {
    draftAndPublish: false;
    comment: '';
  };
  attributes: {
    comment: TextAttribute & RequiredAttribute;
    rating: IntegerAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
        max: 5;
      }>;
    likes: RelationAttribute<'api::review.review', 'oneToMany', 'api::like.like'>;
    author: RelationAttribute<'api::review.review', 'oneToOne', 'plugin::users-permissions.user'>;
    restaurant: RelationAttribute<'api::review.review', 'oneToOne', 'api::restaurant.restaurant'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::review.review', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::review.review', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiTagTag extends CollectionTypeSchema {
  info: {
    displayName: 'Tag';
    singularName: 'tag';
    pluralName: 'tags';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: StringAttribute;
    many_to_one_kitchensink: RelationAttribute<
      'api::tag.tag',
      'manyToOne',
      'api::kitchensink.kitchensink'
    >;
    one_to_many_kitchensinks: RelationAttribute<
      'api::tag.tag',
      'oneToMany',
      'api::kitchensink.kitchensink'
    >;
    many_to_many_kitchensinks: RelationAttribute<
      'api::tag.tag',
      'manyToMany',
      'api::kitchensink.kitchensink'
    >;
    one_to_one_kitchensink: RelationAttribute<
      'api::tag.tag',
      'oneToOne',
      'api::kitchensink.kitchensink'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::tag.tag', 'oneToOne', 'admin::user'> & PrivateAttribute;
    updatedBy: RelationAttribute<'api::tag.tag', 'oneToOne', 'admin::user'> & PrivateAttribute;
  };
}

export interface ApiTempTemp extends CollectionTypeSchema {
  info: {
    singularName: 'temp';
    pluralName: 'temps';
    displayName: 'temp';
    name: 'temp';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: StringAttribute;
    category: RelationAttribute<'api::temp.temp', 'oneToOne', 'api::category.category'>;
    categories: RelationAttribute<'api::temp.temp', 'manyToMany', 'api::category.category'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::temp.temp', 'oneToOne', 'admin::user'> & PrivateAttribute;
    updatedBy: RelationAttribute<'api::temp.temp', 'oneToOne', 'admin::user'> & PrivateAttribute;
  };
}

export interface BasicSimple extends ComponentSchema {
  info: {
    displayName: 'simple';
    icon: 'ambulance';
    description: '';
  };
  attributes: {
    name: StringAttribute & RequiredAttribute;
    test: StringAttribute;
  };
}

export interface BlogTestComo extends ComponentSchema {
  info: {
    displayName: 'test comp';
    icon: 'air-freshener';
    description: '';
  };
  attributes: {
    name: StringAttribute & DefaultTo<'toto'>;
  };
}

export interface DefaultApple extends ComponentSchema {
  info: {
    displayName: 'apple';
    icon: 'apple-alt';
    description: '';
  };
  attributes: {
    name: StringAttribute & RequiredAttribute;
  };
}

export interface DefaultCar extends ComponentSchema {
  info: {
    displayName: 'car';
    icon: 'align-right';
  };
  attributes: {
    name: StringAttribute;
  };
}

export interface DefaultClosingperiod extends ComponentSchema {
  info: {
    displayName: 'closingperiod';
    description: '';
    icon: 'angry';
  };
  attributes: {
    label: StringAttribute & DefaultTo<'toto'>;
    start_date: DateAttribute & RequiredAttribute;
    end_date: DateAttribute & RequiredAttribute;
    media: MediaAttribute;
    dish: ComponentAttribute<'default.dish', true> &
      RequiredAttribute &
      SetMinMax<{
        min: 2;
      }>;
  };
}

export interface DefaultDish extends ComponentSchema {
  info: {
    displayName: 'dish';
    description: '';
    icon: 'address-book';
  };
  attributes: {
    name: StringAttribute & DefaultTo<'My super dish'>;
    description: TextAttribute;
    price: FloatAttribute;
    picture: MediaAttribute;
    very_long_description: RichTextAttribute;
    categories: RelationAttribute<'default.dish', 'oneToOne', 'api::category.category'>;
  };
}

export interface DefaultOpeningtimes extends ComponentSchema {
  info: {
    displayName: 'openingtimes';
    description: '';
    icon: 'calendar';
  };
  attributes: {
    label: StringAttribute & RequiredAttribute & DefaultTo<'something'>;
    time: StringAttribute;
    dishrep: ComponentAttribute<'default.dish', true>;
  };
}

export interface DefaultRestaurantservice extends ComponentSchema {
  info: {
    displayName: 'restaurantservice';
    description: '';
    icon: 'cannabis';
  };
  attributes: {
    name: StringAttribute & RequiredAttribute & DefaultTo<'something'>;
    media: MediaAttribute;
    is_available: BooleanAttribute & RequiredAttribute & DefaultTo<true>;
  };
}

export interface DefaultTemp extends ComponentSchema {
  info: {
    displayName: 'temp';
    icon: 'adjust';
    description: '';
  };
  attributes: {
    name: StringAttribute & RequiredAttribute;
    url: StringAttribute;
  };
}

declare global {
  namespace Strapi {
    interface Schemas {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::myplugin.test': PluginMypluginTest;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::address.address': ApiAddressAddress;
      'api::category.category': ApiCategoryCategory;
      'api::country.country': ApiCountryCountry;
      'api::homepage.homepage': ApiHomepageHomepage;
      'api::kitchensink.kitchensink': ApiKitchensinkKitchensink;
      'api::like.like': ApiLikeLike;
      'api::menu.menu': ApiMenuMenu;
      'api::menusection.menusection': ApiMenusectionMenusection;
      'api::restaurant.restaurant': ApiRestaurantRestaurant;
      'api::review.review': ApiReviewReview;
      'api::tag.tag': ApiTagTag;
      'api::temp.temp': ApiTempTemp;
      'basic.simple': BasicSimple;
      'blog.test-como': BlogTestComo;
      'default.apple': DefaultApple;
      'default.car': DefaultCar;
      'default.closingperiod': DefaultClosingperiod;
      'default.dish': DefaultDish;
      'default.openingtimes': DefaultOpeningtimes;
      'default.restaurantservice': DefaultRestaurantservice;
      'default.temp': DefaultTemp;
    }
  }
}
