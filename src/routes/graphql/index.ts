import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLObjectType, GraphQLString, Source, graphql } from 'graphql';
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
      const MemberType = new GraphQLObjectType({
        name: 'MemberType',
        fields: () => ({
          id: { type: GraphQLString },
          discount: { type: GraphQLString },
          postsLimitPerMonth: { type: GraphQLString },
          profiles: { type: GraphQLString },
        }),
      });

      const PostType = new GraphQLObjectType({
        name: 'PostType',
        fields: () => ({
          // id: { type: UUIDType },
        }),
      });

      const ProfileType = new GraphQLObjectType({
        name: 'ProfileType',
        fields: () => ({
          // id: { type: UUIDType },
        }),
      });

      const SubscribersOnAuthorsType = new GraphQLObjectType({
        name: 'SubscribersOnAuthorsType',
        fields: () => ({
          // id: { type: UUIDType },
        }),
      });

      const UserType = new GraphQLObjectType({
        name: 'User',
        fields: () => ({
          id: { type: UUIDType },
        }),
      });

      const { query, variables } = req.body;

      const source = new Source(query);

      // return await graphql({ schema, source, variableValues: variables });
    },
  });
};

export default plugin;
