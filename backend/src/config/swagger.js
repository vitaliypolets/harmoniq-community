import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.3',

  info: {
    title: 'Harmoniq API',
    version: '1.0.0',
    description: 'REST API documentation for Harmoniq backend',
  },

  servers: [
    {
      url: '/api',
      description: 'Current server',
    },
  ],

  tags: [
    {
      name: 'System',
      description: 'System endpoints',
    },
    {
      name: 'Auth',
      description: 'Authentication and session management',
    },
    {
      name: 'Users',
      description: 'Users and authors',
    },
    {
      name: 'Bookmarks',
      description: 'Saved articles',
    },
    {
      name: 'Articles',
      description: 'Articles management',
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },

      refreshTokenCookie: {
        type: 'apiKey',
        in: 'cookie',
        name: 'refreshToken',
      },

      sessionIdCookie: {
        type: 'apiKey',
        in: 'cookie',
        name: 'sessionId',
      },
    },

    schemas: {
      Error: {
        type: 'object',

        properties: {
          status: {
            type: 'integer',
            example: 400,
          },

          message: {
            type: 'string',
            example: 'Validation error',
          },

          details: {
            nullable: true,
          },
        },
      },

      PublicUser: {
        type: 'object',

        properties: {
          id: {
            type: 'string',
            example: '6881563901add19ee16fcff9',
          },

          name: {
            type: 'string',
            example: 'Test User',
          },

          email: {
            type: 'string',
            format: 'email',
            example: 'test@example.com',
          },

          avatarUrl: {
            type: 'string',
            nullable: true,
            example: 'https://res.cloudinary.com/example/avatar.jpg',
          },

          articlesAmount: {
            type: 'integer',
            example: 4,
          },

        },
      },

      Author: {
        type: 'object',

        properties: {
          id: {
            type: 'string',
          },

          name: {
            type: 'string',
          },

          avatarUrl: {
            type: 'string',
            nullable: true,
          },

          articlesAmount: {
            type: 'integer',
            example: 3,
          },
        },
      },

      Article: {
        type: 'object',

        properties: {
          id: {
            type: 'string',
            example: '6881563901add19ee16fcff9',
          },

          title: {
            type: 'string',
            example: 'How to find harmony',
          },

          description: {
            type: 'string',
            example: 'Short article description',
          },

          article: {
            type: 'string',
            example: 'Full article text',
          },

          imageUrl: {
            type: 'string',
            example: 'https://res.cloudinary.com/example/article.jpg',
          },

          publicationDate: {
            type: 'string',
            format: 'date',
            example: '2026-08-12',
          },

          authorId: {
            type: 'string',
          },

          viewsCount: {
            type: 'integer',
            example: 12,
          },

          category: {
            type: 'string',
            enum: ['popular', 'general'],
            example: 'general',
          },

          createdAt: {
            type: 'string',
            format: 'date-time',
          },

          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      Pagination: {
        type: 'object',

        properties: {
          page: {
            type: 'integer',
            example: 1,
          },

          perPage: {
            type: 'integer',
            example: 8,
          },

          total: {
            type: 'integer',
            example: 48,
          },

          hasNextPage: {
            type: 'boolean',
            example: true,
          },
        },
      },
    },
  },

  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',

        responses: {
          200: {
            description: 'API is running',

            content: {
              'application/json': {
                schema: {
                  type: 'object',

                  properties: {
                    data: {
                      type: 'object',

                      properties: {
                        status: {
                          type: 'string',
                          example: 'ok',
                        },
                      },
                    },

                    message: {
                      type: 'string',
                      example: 'Success',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',

        requestBody: {
          required: true,

          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',

                required: ['name', 'email', 'password'],

                properties: {
                  name: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 32,
                    example: 'Test User',
                  },

                  email: {
                    type: 'string',
                    format: 'email',
                    maxLength: 64,
                    example: 'test@example.com',
                  },

                  password: {
                    type: 'string',
                    minLength: 8,
                    maxLength: 64,
                    example: 'Password123',
                  },

                  avatar: {
                    type: 'string',
                    format: 'binary',
                    description: 'Optional avatar. JPEG, PNG or WebP. Max size 1 MB.',
                  },
                },
              },
            },
          },
        },

        responses: {
          201: {
            description: 'User successfully registered',
          },

          400: {
            description: 'Validation error',
          },

          409: {
            description: 'Email already in use',
          },
        },
      },
    },

    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',

        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: {
                type: 'object',

                required: ['email', 'password'],

                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    maxLength: 64,
                    example: 'test@example.com',
                  },

                  password: {
                    type: 'string',
                    minLength: 8,
                    maxLength: 64,
                    example: 'Password123',
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: 'Successful login. refreshToken and sessionId cookies are created.',

            content: {
              'application/json': {
                schema: {
                  type: 'object',

                  properties: {
                    data: {
                      type: 'object',

                      properties: {
                        user: {
                          $ref: '#/components/schemas/PublicUser',
                        },

                        accessToken: {
                          type: 'string',
                        },
                      },
                    },

                    message: {
                      type: 'string',
                      example: 'Successfully logged in!',
                    },
                  },
                },
              },
            },
          },

          400: {
            description: 'Validation error',
          },

          401: {
            description: 'Invalid email or password',
          },
        },
      },
    },

    '/auth/session': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh authentication session',

        security: [
          {
            refreshTokenCookie: [],
            sessionIdCookie: [],
          },
        ],

        responses: {
          200: {
            description: 'Session successfully refreshed',

            content: {
              'application/json': {
                schema: {
                  type: 'object',

                  properties: {
                    data: {
                      type: 'object',

                      properties: {
                        accessToken: {
                          type: 'string',
                        },
                      },
                    },

                    message: {
                      type: 'string',
                      example: 'Successfully refreshed a session!',
                    },
                  },
                },
              },
            },
          },

          401: {
            description: 'Refresh token missing, invalid or session expired',
          },

          404: {
            description: 'User not found',
          },
        },
      },

      delete: {
        tags: ['Auth'],
        summary: 'Logout and delete current session',

        responses: {
          204: {
            description: 'Session deleted and cookies cleared',
          },
        },
      },
    },

    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Get users list',

        parameters: [
          {
            in: 'query',
            name: 'page',

            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
          },

          {
            in: 'query',
            name: 'perPage',

            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 20,
            },
          },

          {
            in: 'query',
            name: 'sort',

            schema: {
              type: 'string',
              enum: ['articlesAmount', 'createdAt', 'name', 'popular'],
            },
          },

          {
            in: 'query',
            name: 'limit',

            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 50,
            },
          },
        ],

        responses: {
          200: {
            description: 'Users list returned successfully',
          },
        },
      },
    },

    '/users/{userId}': {
      get: {
        tags: ['Users'],
        summary: 'Get user details',

        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,

            schema: {
              type: 'string',
            },
          },
        ],

        responses: {
          200: {
            description: 'User information',
          },

          400: {
            description: 'Invalid user id',
          },

          404: {
            description: 'User not found',
          },
        },
      },
    },

    '/users/{userId}/articles': {
      get: {
        tags: ['Users'],
        summary: 'Get articles created by user',

        parameters: [
          {
            in: 'path',
            name: 'userId',
            required: true,

            schema: {
              type: 'string',
            },
          },

          {
            in: 'query',
            name: 'page',

            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
          },

          {
            in: 'query',
            name: 'perPage',

            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 8,
            },
          },
        ],

        responses: {
          200: {
            description: 'User articles',
          },

          400: {
            description: 'Invalid userId or pagination',
          },
        },
      },
    },

    '/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Get current user',

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          200: {
            description: 'Current user data',
          },

          401: {
            description: 'Unauthorized',
          },
        },
      },

      patch: {
        tags: ['Users'],
        summary: 'Update current user',

        security: [
          {
            bearerAuth: [],
          },
        ],

        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',

                properties: {
                  name: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 32,
                    example: 'Updated User',
                  },

                  avatar: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: 'User updated successfully',
          },

          400: {
            description: 'Validation error',
          },

          401: {
            description: 'Unauthorized',
          },
        },
      },
    },

    '/users/me/bookmarks': {
      get: {
        tags: ['Bookmarks'],
        summary: 'Get current user bookmarks',

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            in: 'query',
            name: 'page',

            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
          },

          {
            in: 'query',
            name: 'perPage',

            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 12,
            },
          },
        ],

        responses: {
          200: {
            description: 'Bookmarks list',
          },

          401: {
            description: 'Unauthorized',
          },
        },
      },

      post: {
        tags: ['Bookmarks'],
        summary: 'Add article to bookmarks',

        security: [
          {
            bearerAuth: [],
          },
        ],

        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: {
                type: 'object',

                required: ['articleId'],

                properties: {
                  articleId: {
                    type: 'string',
                    example: '6881563901add19ee16fcff9',
                  },
                },
              },
            },
          },
        },

        responses: {
          201: {
            description: 'Article bookmarked',
          },

          400: {
            description: 'Invalid bookmark data',
          },

          401: {
            description: 'Unauthorized',
          },
        },
      },
    },

    '/users/me/bookmarks/{articleId}': {
      delete: {
        tags: ['Bookmarks'],
        summary: 'Remove article from bookmarks',

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            in: 'path',
            name: 'articleId',
            required: true,

            schema: {
              type: 'string',
            },
          },
        ],

        responses: {
          200: {
            description: 'Bookmark successfully removed',
          },

          400: {
            description: 'Invalid articleId',
          },

          401: {
            description: 'Unauthorized',
          },
        },
      },
    },

    '/articles': {
      get: {
        tags: ['Articles'],
        summary: 'Get articles list',

        parameters: [
          {
            in: 'query',
            name: 'page',

            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
          },

          {
            in: 'query',
            name: 'perPage',

            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 8,
            },
          },

          {
            in: 'query',
            name: 'filter',

            schema: {
              type: 'string',
              enum: ['all', 'popular'],
              default: 'all',
            },
          },

          {
            in: 'query',
            name: 'authorId',

            schema: {
              type: 'string',
            },
          },

          {
            in: 'query',
            name: 'excludeId',

            schema: {
              type: 'string',
            },
          },

          {
            in: 'query',
            name: 'limit',

            schema: {
              type: 'integer',
              minimum: 1,
            },
          },
        ],

        responses: {
          200: {
            description: 'Articles list',
          },

          400: {
            description: 'Invalid page or authorId',
          },
        },
      },

      post: {
        tags: ['Articles'],
        summary: 'Create new article',

        security: [
          {
            bearerAuth: [],
          },
        ],

        requestBody: {
          required: true,

          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',

                required: ['title', 'article', 'publicationDate', 'image'],

                properties: {
                  title: {
                    type: 'string',
                    minLength: 3,
                    maxLength: 48,
                  },

                  article: {
                    type: 'string',
                    minLength: 100,
                    maxLength: 4000,
                  },

                  publicationDate: {
                    type: 'string',
                    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                    example: '2026-08-12',
                  },

                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Required article image. JPEG, PNG or WebP. Max size 1 MB.',
                  },
                },
              },
            },
          },
        },

        responses: {
          201: {
            description: 'Article successfully created',
          },

          400: {
            description: 'Validation error or image missing',
          },

          401: {
            description: 'Unauthorized',
          },
        },
      },
    },

    '/articles/{articleId}': {
      get: {
        tags: ['Articles'],
        summary: 'Get article details',

        parameters: [
          {
            in: 'path',
            name: 'articleId',
            required: true,

            schema: {
              type: 'string',
            },
          },
        ],

        responses: {
          200: {
            description: 'Article details',
          },

          400: {
            description: 'Invalid article ID',
          },

          404: {
            description: 'Article not found',
          },
        },
      },

      patch: {
        tags: ['Articles'],
        summary: 'Update article',

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            in: 'path',
            name: 'articleId',
            required: true,

            schema: {
              type: 'string',
            },
          },
        ],

        requestBody: {
          required: true,

          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',

                properties: {
                  title: {
                    type: 'string',
                    minLength: 3,
                    maxLength: 48,
                  },

                  article: {
                    type: 'string',
                    minLength: 100,
                    maxLength: 4000,
                  },

                  publicationDate: {
                    type: 'string',
                    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                  },

                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Optional article image. JPEG, PNG or WebP. Max size 1 MB.',
                  },

                },
              },
            },
          },
        },

        responses: {
          200: {
            description: 'Article successfully updated',
          },

          400: {
            description: 'Validation error',
          },

          401: {
            description: 'Unauthorized',
          },

          403: {
            description: 'Not allowed to update this article',
          },

          404: {
            description: 'Article not found',
          },
        },
      },

      delete: {
        tags: ['Articles'],
        summary: 'Delete article',

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            in: 'path',
            name: 'articleId',
            required: true,

            schema: {
              type: 'string',
            },
          },
        ],

        responses: {
          200: {
            description: 'Article successfully deleted',
          },

          401: {
            description: 'Unauthorized',
          },

          403: {
            description: 'Not allowed to delete this article',
          },

          404: {
            description: 'Article not found',
          },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);
