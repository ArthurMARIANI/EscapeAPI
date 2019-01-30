'use strict';

/**
 * Escape.js controller
 *
 * @description: A set of functions called "actions" for managing `Escape`.
 */

module.exports = {

  /**
   * Retrieve escape records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    return strapi.services.escape.fetchAll(ctx.query);
  },

  /**
   * Retrieve a escape record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.escape.fetch(ctx.params);
  },

  /**
   * Count escape records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.escape.count(ctx.query);
  },

  /**
   * Create a/an escape record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.escape.add(ctx.request.body);
  },

  /**
   * Update a/an escape record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.escape.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an escape record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.escape.remove(ctx.params);
  },

  /**
   * Add relation to a/an escape record.
   *
   * @return {Object}
   */

  createRelation: async (ctx, next) => {
    return strapi.services.escape.addRelation(ctx.params, ctx.request.body);
  },

  /**
   * Update relation to a/an escape record.
   *
   * @return {Object}
   */

  updateRelation: async (ctx, next) => {
    return strapi.services.escape.editRelation(ctx.params, ctx.request.body);
  },

  /**
   * Destroy relation to a/an escape record.
   *
   * @return {Object}
   */

  destroyRelation: async (ctx, next) => {
    return strapi.services.escape.removeRelation(ctx.params, ctx.request.body);
  }
};
