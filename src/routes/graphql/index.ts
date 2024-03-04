import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  Source,
  graphql,
} from 'graphql';
import { UUIDType } from './types/uuid.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },

    async handler(req) {
      const MemberIdType = new GraphQLEnumType({
        name: 'MemberIdType',
        values: {
          basic: {
            value: 'basic',
          },
          business: {
            value: 'business',
          },
        },
      });

      const MemberType = new GraphQLObjectType({
        name: 'MemberType',
        fields: () => ({
          id: { type: MemberIdType },
          discount: { type: GraphQLFloat },
          postsLimitPerMonth: { type: GraphQLInt },
          profiles: { type: new GraphQLList(new GraphQLNonNull(ProfileType)) },
        }),
      });

      const PostType = new GraphQLObjectType({
        name: 'PostType',
        fields: () => ({
          id: { type: UUIDType },
          title: { type: GraphQLString },
          content: { type: GraphQLString },
          author: { type: new GraphQLNonNull(UserType) },
          authorId: { type: UUIDType },
        }),
      });

      const ProfileType = new GraphQLObjectType({
        name: 'ProfileType',
        fields: () => ({
          id: { type: UUIDType },
          isMale: { type: GraphQLBoolean },
          yearOfBirth: { type: GraphQLInt },
          user: { type: new GraphQLNonNull(UserType) },
          userId: { type: UUIDType },
          memberType: { type: MemberType },
          memberTypeId: { type: MemberIdType },
        }),
      });

      const SubscribersOnAuthorsType = new GraphQLObjectType({
        name: 'SubscribersOnAuthorsType',
        fields: () => ({
          subscriber: { type: new GraphQLNonNull(UserType) },
          subscriberId: { type: UUIDType },
          author: { type: new GraphQLNonNull(UserType) },
          authorId: { type: UUIDType },
        }),
      });

      const UserType = new GraphQLObjectType({
        name: 'User',
        fields: () => ({
          id: { type: UUIDType },
          name: { type: GraphQLString },
          balance: { type: GraphQLFloat },
          profile: { type: new GraphQLNonNull(ProfileType) },
          posts: { type: new GraphQLList(new GraphQLNonNull(PostType)) },
          userSubscribedTo: {
            type: new GraphQLList(new GraphQLNonNull(SubscribersOnAuthorsType)),
          },
          subscribedToUser: {
            type: new GraphQLList(new GraphQLNonNull(SubscribersOnAuthorsType)),
          },
        }),
      });

      const { query, variables } = req.body;

      const source = new Source(query);

      // return await graphql({ schema, source, variableValues: variables });
    },
  });
};

export default plugin;
