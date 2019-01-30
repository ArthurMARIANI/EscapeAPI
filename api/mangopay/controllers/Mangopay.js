'use strict';

module.exports = {

  createMangoUser: async (ctx) => {
    return strapi.services.mangopay.createMangoUser(ctx.query);
  },
  createMangoBankAccount: async (ctx)  => {
    return strapi.services.mangopay.createMangoBankAccount(ctx.query);
  },
  createMangoWallet: async (ctx) => {
    return strapi.services.mangopay.createMangoWallet(ctx.query);
  },
  createMangoCard: async (ctx) => {
    return strapi.services.mangopay.createMangoCard(ctx.query);
  },
  processMangoPayIn: async (ctx) => {
    return strapi.services.mangopay.finprocessMangoPayInd(ctx.query);
  },
  processMangoRefund: async (ctx) => {
    return strapi.services.mangopay.processMangoRefund(ctx.query);
  },
};
