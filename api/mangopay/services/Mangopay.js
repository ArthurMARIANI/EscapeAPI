var mangopay = require('mangopay2-nodejs-sdk');
var request = require('request');

'use strict';

var api = new mangopay({
  clientId: 'escapeteamup',
  clientPassword: '1r4TmX1jonJBRAuXcdyyqPfvQ1KK7Kscb1OH7iubSkhCfxnYtZ',
});

module.exports = {

  createMangoUser: async (params) => {
    const StrapiUser = await strapi.plugins['users-permissions'].services.user.fetch(params);
    const myUser = new api.models.UserNatural({
      FirstName: StrapiUser.first_name,
      LastName: StrapiUser.last_name,
      Birthday: StrapiUser.birthday.getTime() / 100,
      Nationality: StrapiUser.nationality,
      CountryOfResidence: StrapiUser.country,
      Email: StrapiUser.email,
      Address: new api.models.Address({
        AddressLine1: StrapiUser.address,
        City: StrapiUser.city,
        Region: StrapiUser.region,
        PostalCode: StrapiUser.postcode,
        Country: StrapiUser.country,
      }),
    });
    const MongoUser = await api.Users.create(myUser);
    StrapiUser.mongoPay_user_id = MongoUser.Id;

    const bodyanduser = {
      type: 'IBAN',
      IBAN: 'FR7630004000031234567890143',
      StrapiUser: StrapiUser,
      MongoUser: MongoUser,
    };

    strapi.services.mangopay.createMangoBankAccount(bodyanduser);
  },

  createMangoBankAccount: async (params) => {
    // const StrapiUser = await strapi.plugins['users-permissions'].services.user.fetch(params);
    const StrapiUser = params.StrapiUser;
    const MongoUser = params.MongoUser;
    const bankAccount = new api.models.BankAccount({
      OwnerAddress: new api.models.Address({
        AddressLine1: StrapiUser.address,
        City: StrapiUser.city,
        Region: StrapiUser.region,
        PostalCode: StrapiUser.postcode,
        Country: StrapiUser.country,
      }),
      OwnerName: StrapiUser.first_name + StrapiUser.last_name,
      Type: params.type,
      IBAN: params.IBAN,
    });
    console.log(MongoUser);
    StrapiUser.mongoPay_bankAccount_id = await api.Users.createBankAccount(params.MongoUser.Id, bankAccount).id;

    const bodyanduser = {
      MongoUser: MongoUser,
      StrapiUser: StrapiUser,
    };
    strapi.services.mangopay.createMangoWallet(bodyanduser);
  },

  createMangoWallet: async (params) => {
    // const StrapiUser = await strapi.plugins['users-permissions'].services.user.fetch(params);
    const StrapiUser = params.StrapiUser;

    const wallet = new api.models.ClientWallet({
      Owners: [params.MongoUser.Id],
      Description: 'EscapeTeamUp_' + StrapiUser.username + '_account',
      Currency: 'EUR',
    });
    StrapiUser.mongoPay_wallet_id = await api.Wallets.create(wallet).id;

    const bodyanduser = {
      StrapiUser: StrapiUser,
      cardData : {
        'cardNumber': '44970100000000154',
        'cardExpirationDate': '1020',
        'cardCvx': '123',
        'Currency': 'EUR',
        'CardType': 'CB_VISA_MASTERCARD'
      },
    };
    console.log(await strapi.services.mangopay.createMangoCard(bodyanduser));
  },

  createMangoCard: async (params) => {
    // const StrapiUser = await strapi.plugins['users-permissions'].services.user.fetch(params);
    const StrapiUser = params.StrapiUser;
    const card = new api.models.CardRegistration({
      UserId: params.StrapiUser.mongoPay_user_id,
      Currency: params.cardData.Currency,
    });
    await api.CardRegistrations.create(card);

    const cardRegistrationData = await api.CardRegistrations.create({
      UserId: StrapiUser.mongoPay_user_id,
      Currency: params.cardData.Currency,
      CardType: params.cardData.CardType,
    });

    var options = {
      url: cardRegistrationData.CardRegistrationURL,
      form: {
        data: cardRegistrationData.PreregistrationData,
        accessKeyRef: cardRegistrationData.AccessKey,
        cardNumber: params.cardData.cardNumber,
        cardExpirationDate: params.cardData.cardExpirationDate,
        cardCvx: params.cardData.cardCvx
      }
    };

    await request.post(options, function (err, httpResponse, body) {
      cardRegistrationData.RegistrationData = body;
      return api.CardRegistrations.update(cardRegistrationData);
    });


    const bodyanduser = {
      StrapiUser: StrapiUser,
      paiementForm: {
        'SecureModeReturnURL': 'http://www.my-site.com/returnURL',
        'ExecutionType': 'DIRECT',
        'PaymentType': 'CARD',
        'Currency': 'EUR',
        'Amount': 15,
      },
    };

    strapi.services.mangopay.processMangoPayIn(bodyanduser);
  },

  processMangoPayIn: async (params) => {
    console.log(params.StrapiUser);
    const PaiementData = {
      AuthorId: params.StrapiUser.mongoPay_user_id,
      CreditedWalletId: params.StrapiUser.mongoPay_wallet_id,
      DebitedFunds: {
        'Currency': 'EUR',
        'Amount': 12
      },
      'Fees': {
        'Currency': 'EUR',
        'Amount': 0
      },
      SecureModeReturnURL: 'http://www.my-site.com/returnURL',
      CardId: params.StrapiUser.mongoPay_card_id,
      PaymentType: 'CARD',
      ExecutionType: 'DIRECT',
    };
    api.PayIns.create(PaiementData);
  },

  processMangoRefund: async (params) => {
    const refund = new api.models.Refund({
      Tag: 'Refund EscapeTeamUp_' + new Date().toISOString().slice(0, 10),
      AuthorId: params.clientId,
    });
    const MongoRefund = await api.PayIns.createRefund(params.payInId, refund);
    console.log(MongoRefund);
  }
};
