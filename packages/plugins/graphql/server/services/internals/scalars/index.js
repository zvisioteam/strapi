'use strict';

const { GraphQLDateTime, GraphQLLong, GraphQLJSON } = require('graphql-scalars');
// const { GraphQLUpload } = require('graphql-upload');
const { asNexusMethod, scalarType, Kind } = require('nexus');

const TimeScalar = require('./time');
const GraphQLDate = require('./date');

module.exports = () => ({
  JSON: asNexusMethod(GraphQLJSON, 'json'),
  DateTime: asNexusMethod(GraphQLDateTime, 'dateTime'),
  Time: asNexusMethod(TimeScalar, 'time'),
  Date: asNexusMethod(GraphQLDate, 'date'),
  Long: asNexusMethod(GraphQLLong, 'long'),
  async Upload() {
    const { default: GraphQLUpload } = await import('graphql-upload/GraphQLUpload.mjs');
    return asNexusMethod(GraphQLUpload, 'upload');
  },
});
