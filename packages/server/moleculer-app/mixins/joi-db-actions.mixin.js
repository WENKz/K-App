const Joi = require('@hapi/joi');
const { MoleculerClientError } = require('moleculer').Errors;
const { JOI_ID, JOI_STRING_OR_STRING_ARRAY } = require('../../utils');

module.exports = function joiDbActions(joiModel, name) {
  const findEntity = async (ctx) => {
    const entity = await ctx.service.getById(ctx.params.id, true);
    if (!entity) {
      throw new MoleculerClientError('Entity not found!', 404, 'ERR_ENTITY_NOT_FOUND');
    }

    ctx.locals.entity = entity;
  };

  return {
    hooks: {
      before: {
        get: [findEntity],
        update: [findEntity],
        remove: [findEntity],
      },
    },
    actions: {
      find: {
        rest: 'GET /find',
        permissions: [
          `${name}.read`,
        ],
        params: () => Joi.object({
          populate: JOI_STRING_OR_STRING_ARRAY,
          fields: JOI_STRING_OR_STRING_ARRAY,
          limit: Joi.number().integer().min(0),
          offset: Joi.number().integer().min(0),
          sort: Joi.string(),
          search: Joi.string(),
          searchField: JOI_STRING_OR_STRING_ARRAY,
          // Remove query as it may be a security issue if published
          query: Joi.object().forbidden(),
        }),
      },
      count: {
        rest: 'GET /count',
        permissions: [
          `${name}.read`,
        ],
        params: () => Joi.object({
          search: Joi.string(),
          searchFields: JOI_STRING_OR_STRING_ARRAY,
          // Remove query as it may be a security issue if published
          query: Joi.object().forbidden(),
        }),
      },
      list: {
        rest: 'GET /',
        permissions: [
          `${name}.read`,
        ],
        params: () => Joi.object({
          populate: JOI_STRING_OR_STRING_ARRAY,
          fields: JOI_STRING_OR_STRING_ARRAY,
          page: Joi.number().integer().min(1),
          pageSize: Joi.number().integer().min(0),
          sort: Joi.string(),
          search: Joi.string(),
          searchField: JOI_STRING_OR_STRING_ARRAY,
          // Remove query as it may be a security issue if published
          query: Joi.object().forbidden(),
        }),
      },
      create: {
        rest: 'POST /',
        permissions: [
          `${name}.create`,
        ],
        params: () => joiModel,
      },
      insert: {
        rest: 'POST /insert',
        permissions: [
          `${name}.create`,
        ],
        params: () => Joi.object({
          entities: Joi.array().items(joiModel),
          entity: joiModel,
        }).without('entities', 'entity'),
      },
      get: {
        rest: 'GET /:id',
        permissions: [
          `${name}.read`,
          '$owner',
        ],
        params: () => Joi.object({
          id: JOI_ID.required(),
          populate: JOI_STRING_OR_STRING_ARRAY,
          fields: JOI_STRING_OR_STRING_ARRAY,
          mapping: Joi.bool(),
        }),
      },
      update: {
        rest: 'PUT /:id',
        permissions: [
          `${name}.write`,
          '$owner',
        ],
        params: () => joiModel.append({
          id: JOI_ID.required(),
        }),
      },
      remove: {
        rest: 'DELETE /:id',
        permissions: [
          `${name}.delete`,
          '$owner',
        ],
        params: () => Joi.object({
          id: JOI_ID.required(),
        }),
      },
    },
  };
};
