'use strict';

/**
 * Room.js controller
 *
 * @description: A set of functions called "actions" for managing `Room`.
 */

module.exports = {

  /**
   * Retrieve room records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    return strapi.services.room.fetchAll(ctx.query);
  },

  /**
   * Retrieve a room record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.room.fetch(ctx.params);
  },

  /**
   * Count room records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.room.count(ctx.query);
  },

  /**
   * Create a/an room record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.room.add(ctx.request.body);
  },

  /**
   * Update a/an room record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.room.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an room record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.room.remove(ctx.params);
  },

  /**
   * Add relation to a/an room record.
   *
   * @return {Object}
   */

  createRelation: async (ctx, next) => {
    return strapi.services.room.addRelation(ctx.params, ctx.request.body);
  },

  /**
   * Update relation to a/an room record.
   *
   * @return {Object}
   */

  updateRelation: async (ctx, next) => {
    return strapi.services.room.editRelation(ctx.params, ctx.request.body);
  },

  /**
   * Destroy relation to a/an room record.
   *
   * @return {Object}
   */

  destroyRelation: async (ctx, next) => {
    return strapi.services.room.removeRelation(ctx.params, ctx.request.body);
  }
};
