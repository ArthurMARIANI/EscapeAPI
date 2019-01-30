'use strict';

/**
 * Room.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

// Strapi utilities.
const utils = require('strapi-bookshelf/lib/utils/');

module.exports = {

  /**
   * Promise to fetch all rooms.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('room', params);
    // Select field to populate.
    const populate = Room.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    return Room.query(function(qb) {
      _.forEach(filters.where, (where, key) => {
        if (_.isArray(where.value)) {
          for (const value in where.value) {
            qb[value ? 'where' : 'orWhere'](key, where.symbol, where.value[value])
          }
        } else {
          qb.where(key, where.symbol, where.value);
        }
      });

      if (filters.sort) {
        qb.orderBy(filters.sort.key, filters.sort.order);
      }

      qb.offset(filters.start);
      qb.limit(filters.limit);
    }).fetchAll({
      withRelated: populate
    });
  },

  /**
   * Promise to fetch a/an room.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Room.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    return Room.forge(_.pick(params, 'id')).fetch({
      withRelated: populate
    });
  },

  /**
   * Promise to count a/an room.
   *
   * @return {Promise}
   */

  count: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('room', params);

    return Room.query(function(qb) {
      _.forEach(filters.where, (where, key) => {
        if (_.isArray(where.value)) {
          for (const value in where.value) {
            qb[value ? 'where' : 'orWhere'](key, where.symbol, where.value[value])
          }
        } else {
          qb.where(key, where.symbol, where.value);
        }
      });
    }).count();
  },

  /**
   * Promise to add a/an room.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Room.associations.map(ast => ast.alias));
    const data = _.omit(values, Room.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Room.forge(data).save();

    // Create relational data and return the entry.
    return Room.updateRelations({ id: entry.id , values: relations });
  },

  /**
   * Promise to edit a/an room.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Room.associations.map(ast => ast.alias));
    const data = _.omit(values, Room.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = Room.forge(params).save(data, { path: true });

    // Create relational data and return the entry.
    return Room.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to remove a/an room.
   *
   * @return {Promise}
   */

  remove: async (params) => {
    params.values = {};
    Room.associations.map(association => {
      switch (association.nature) {
        case 'oneWay':
        case 'oneToOne':
        case 'manyToOne':
        case 'oneToManyMorph':
          params.values[association.alias] = null;
          break;
        case 'oneToMany':
        case 'manyToMany':
        case 'manyToManyMorph':
          params.values[association.alias] = [];
          break;
        default:
      }
    });

    await Room.updateRelations(params);

    return Room.forge(params).destroy();
  }
};
