'use strict';

/**
 * Escape.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

// Strapi utilities.
const utils = require('strapi-bookshelf/lib/utils/');

module.exports = {

  /**
   * Promise to fetch all escapes.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('escape', params);
    // Select field to populate.
    const populate = Escape.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    return Escape.query(function(qb) {
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
   * Promise to fetch a/an escape.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Escape.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    return Escape.forge(_.pick(params, 'id')).fetch({
      withRelated: populate
    });
  },

  /**
   * Promise to count a/an escape.
   *
   * @return {Promise}
   */

  count: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('escape', params);

    return Escape.query(function(qb) {
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
   * Promise to add a/an escape.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Escape.associations.map(ast => ast.alias));
    const data = _.omit(values, Escape.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Escape.forge(data).save();

    // Create relational data and return the entry.
    return Escape.updateRelations({ id: entry.id , values: relations });
  },

  /**
   * Promise to edit a/an escape.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Escape.associations.map(ast => ast.alias));
    const data = _.omit(values, Escape.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = Escape.forge(params).save(data, { path: true });

    // Create relational data and return the entry.
    return Escape.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to remove a/an escape.
   *
   * @return {Promise}
   */

  remove: async (params) => {
    params.values = {};
    Escape.associations.map(association => {
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

    await Escape.updateRelations(params);

    return Escape.forge(params).destroy();
  }
};
