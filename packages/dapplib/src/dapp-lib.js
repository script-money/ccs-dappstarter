'use strict';
const Blockchain = require('./blockchain');
const dappConfig = require('./dapp-config.json');
const ClipboardJS = require('clipboard');
const manifest = require('../manifest.json');
const t = require('@onflow/types');
const moment = require('moment')


module.exports = class DappLib {

  /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> CCS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

  /********** Flow Token **********/

  static async mintFlowTokens(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: "0xf8d6e0586b0a20c7",
      }
    },
      'flowtoken_mint_flow_token',
      {
        recipient: { value: data.recipient, type: t.Address },
        amount: { value: data.amount, type: t.UFix64 }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  static async getFlowBalance(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.get({
      config: config,
      roles: {
      }
    },
      'flowtoken_get_flow_balance',
      {
        account: { value: data.account, type: t.Address }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: 'Collectible Type',
      result: result.callData
    }
  }

  /********** Account **********/

  static async initializeAccount(data) {
    let config = DappLib.getConfig();
    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: data.account,
      }
    },
      'account_initialize_account'
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  static async isAccountIntialized(data) {
    let config = DappLib.getConfig();
    let result = await Blockchain.get({
      config: config,
      roles: {
      }
    },
      'account_is_account_initialized',
      {
        address: { value: data.address, type: t.Address }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_OBJECT,
      label: 'Intialize results',
      result: result.callData
    }
  }


  /********** Activity **********/

  static async closeActivity(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: data.account,
      }
    },
      'activity_close_activity',
      {
        activityId: { value: parseInt(data.activityId), type: t.UInt64 },
        bonus: { value: data.bonus, type: t.UFix64 },
        mintPositive: { value: data.mintPositive, type: t.Bool }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  static async createActivity(data) {
    let metadata = {}
    if (data.content !== '') {
      Object.assign(metadata, { content: data.content })
    }
    if (data.startDate !== '') {
      Object.assign(metadata, { startDate: moment(data.startDate) })
    }
    if (data.endDate !== '') {
      Object.assign(metadata, { endDate: moment(data.endDate) })
    }
    if (data.source !== '') {
      Object.assign(metadata, { source: data.source })
    }
    let types = []
    if (data.type_1 !== '') {
      types.push(data.type_1)
    }
    if (data.type_2 !== '') {
      types.push(data.type_2)
    }
    if (types.length != 0) {
      Object.assign(metadata, { categories: types })
    }
    console.log("metadata:", metadata)

    let config = DappLib.getConfig();
    let result = await Blockchain.post(
      {
        config: config,
        roles: {
          proposer: data.account,
        }
      },
      'activity_create_activity',
      {
        title: { value: data.title, type: t.String },
        metadata: {
          value: JSON.stringify(metadata), type: t.String
          // {"content":"xxx","startDate":1638316800000,"categories":["AIRDROP","TEST"]}
        }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  static async createAirdrop(data) {
    const metadata = {
      content: data.content,
      categories: ["Airdrop"]
    }

    let config = DappLib.getConfig();
    let result = await Blockchain.post(
      {
        config: config,
        roles: {
          proposer: data.account,
        }
      },
      'activity_create_airdrop',
      {
        title: { value: data.title, type: t.String },
        recievers: { value: [data.reciever_1, data.reciever_2], type: t.Array(t.Address) },
        bonus: { value: data.bonus, type: t.UFix64 },
        metadata: { value: JSON.stringify(metadata), type: t.String },
      }
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  static async vote(data) {
    let config = DappLib.getConfig();
    let result = await Blockchain.post(
      {
        config: config,
        roles: {
          proposer: data.account,
        }
      },
      'activity_vote',
      {
        activityId: { value: parseInt(data.activityId), type: t.UInt64 },
        isUpVote: { value: data.isUpVote, type: t.Bool }
      }
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  static async getActivityIds() {
    let config = DappLib.getConfig();
    let result = await Blockchain.get(
      {
        config: config,
        roles: {
        }
      },
      'activity_get_activity_ids',
    );

    return {
      type: DappLib.DAPP_RESULT_ARRAY,
      label: 'Activity ID array',
      result: result.callData
    }
  }

  static async getActivity(data) {
    let config = DappLib.getConfig();
    let result = await Blockchain.get(
      {
        config: config,
        roles: {
        }
      },
      'activity_get_activity',
      {
        id: { value: parseInt(data.id), type: t.UInt64 }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_OBJECT,
      label: 'Activity Item',
      result: result.callData
    }
  }

  static async getCreateConsumption() {
    let config = DappLib.getConfig();
    let result = await Blockchain.get(
      {
        config: config,
        roles: {
        }
      },
      'activity_get_create_consumption',
    );

    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: 'Activity Create Consumption',
      result: result.callData
    }
  }

  static async updateConsumption(data) {
    let config = DappLib.getConfig();
    let result = await Blockchain.post(
      {
        config: config,
        roles: {
          proposer: data.account,
        }
      },
      'activity_update_consumption',
      { newConsumption: { value: data.newConsumption, type: t.UFix64 } }
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  static async getRewardParams() {
    let config = DappLib.getConfig();
    let result = await Blockchain.get(
      {
        config: config,
        roles: {
        }
      },
      'activity_get_reward_params',
    );

    return {
      type: DappLib.DAPP_RESULT_OBJECT,
      label: 'Activity Get reward params',
      result: result.callData
    }
  }

  static async updateRewardParams(data) {
    console.log(data.maxRatio, typeof data.maxRatio, data.maxRatio === "");
    let config = DappLib.getConfig();
    let result = await Blockchain.post(
      {
        config: config,
        roles: {
          proposer: data.account,
        }
      },
      'activity_update_reward_params',
      {
        newRewardParams: {
          value: [
            { key: "maxRatio", value: data.maxRatio === "" ? "5.0" : data.maxRatio },
            { key: "minRatio", value: data.minRatio === "" ? "1.0" : data.minRatio },
            { key: "averageRatio", value: data.averageRatio === "" ? "1.5" : data.averageRatio },
            { key: "asymmetry", value: data.asymmetry === "" ? "2.0" : data.asymmetry }
          ],
          type: t.Dictionary({ key: t.String, value: t.UFix64 })
        },
      }
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }


  /********** Ballot **********/
  static async buyBallots(data) {
    let config = DappLib.getConfig();
    let result = await Blockchain.post(
      {
        config: config,
        roles: {
          proposer: data.account,
        }
      },
      'ballot_buy_ballots',
      {
        count: { value: parseInt(data.count), type: t.Int },
      }
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  static async setPrice(data) {
    let config = DappLib.getConfig();
    let result = await Blockchain.post(
      {
        config: config,
        roles: {
          proposer: data.account,
        }
      },
      'ballot_set_price',
      {
        price: { value: data.price, type: t.UFix64 },
      }
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  static async setupBallotAccount(data) {
    let config = DappLib.getConfig();
    let result = await Blockchain.post(
      {
        config: config,
        roles: {
          proposer: data.account,
        }
      },
      'ballot_setup_account'
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  static async getHoldings(data) {
    let config = DappLib.getConfig();
    let result = await Blockchain.get(
      {
        config: config,
        roles: {
        }
      },
      'ballot_get_holdings',
      { address: { value: data.address, type: t.Address } }
    );

    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: 'Ballot hold amount',
      result: result.callData
    }
  }

  static async getPrice() {
    let config = DappLib.getConfig();
    let result = await Blockchain.get(
      {
        config: config,
        roles: {
        }
      },
      'ballot_get_price'
    );

    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: 'Ballot price',
      result: result.callData
    }
  }

  static async getSoldAmount() {
    let config = DappLib.getConfig();
    let result = await Blockchain.get(
      {
        config: config,
        roles: {
        }
      },
      'ballot_get_sold_amount'
    );

    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: 'Ballot sold amount',
      result: result.callData
    }
  }

  /********** CCSToken **********/

  static async setupCCSTokenAccount(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: data.account,
      }
    },
      'ccstoken_setup_account'
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  static async mintTokensAndDistribute(data) {
    let valueArray = []
    if (data.token_1 !== '') {
      valueArray.push({ key: data.reciever_1, value: data.token_1 })
    }
    if (data.token_2 !== '') {
      valueArray.push({ key: data.reciever_2, value: data.token_2 })
    }
    if (data.token_3 !== '') {
      valueArray.push({ key: data.reciever_3, value: data.token_3 })
    }
    if (data.token_4 !== '') {
      valueArray.push({ key: data.reciever_4, value: data.token_4 })
    }

    let config = DappLib.getConfig();
    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: data.account,
      }
    },
      'ccstoken_mint_tokens_and_distribute',
      {
        addressAmountMap: {
          value: valueArray,
          type: t.Dictionary({ key: t.Address, value: t.UFix64 })
        },
      }
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  static async getCCSBalance(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.get({
      config: config,
      roles: {
      }
    },
      'ccstoken_get_ccs_balance',
      {
        account: { value: data.account, type: t.Address }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: 'Collectible Type',
      result: result.callData
    }
  }

  static async getCCSSupply(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.get({
      config: config,
      roles: {
      }
    },
      'ccstoken_get_ccs_supply'
    );

    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: 'Collectible Type',
      result: result.callData
    }
  }

  /********** Memorials **********/
  static async setupMemorialsAccount(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: data.account,
      }
    },
      'memorials_setup_account'
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  static async isAccountInitialized(data) {
    let config = DappLib.getConfig();
    let result = await Blockchain.get({
      config: config,
      roles: {
      }
    },
      'memorials_is_account_initialized',
      {
        address: { value: data.address, type: t.Address }
      }
    );
    return {
      type: DappLib.DAPP_RESULT_OBJECT,
      label: 'Is Account Initialized',
      result: result.callData
    }
  }

  static async getCollectionIds(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.get(
      {
        config: config,
        roles: {
        }
      },
      'memorials_get_collection_ids',
      {
        address: { value: data.address, type: t.Address }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_ARRAY,
      label: 'Memorials ids',
      result: result.callData
    }
  }

  static async getCollectionLength(data) {
    let config = DappLib.getConfig();

    let result = await Blockchain.get(
      {
        config: config,
        roles: {
        }
      },
      'memorials_get_collection_length',
      {
        address: { value: data.address, type: t.Address }
      }
    );
    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: 'Memorials length',
      result: result.callData
    }
  }

  static async getMemorial(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.get(
      {
        config: config,
        roles: {
        }
      },
      'memorials_get_memorial',
      {
        address: { value: data.address, type: t.Address },
        itemID: { value: parseInt(data.itemID), type: t.UInt64 }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_OBJECT,
      label: 'Memorial',
      result: result.callData
    }
  }

  static async getMemorialSupply() {

    let config = DappLib.getConfig();
    let result = await Blockchain.get(
      {
        config: config,
        roles: {
        }
      },
      'memorials_get_memorials_supply',
    );

    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: 'Memorial supply',
      result: result.callData
    }
  }

  static async getVotingPower(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.get(
      {
        config: config,
        roles: {
        }
      },
      'memorials_get_voting_power',
      { address: { value: data.address, type: t.Address } }
    );

    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: 'Voting Power',
      result: result.callData
    }
  }

  /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DAPP LIBRARY  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

  static get DAPP_STATE_CONTRACT() {
    return 'dappStateContract'
  }
  static get DAPP_CONTRACT() {
    return 'dappContract'
  }

  static get DAPP_STATE_CONTRACT_WS() {
    return 'dappStateContractWs'
  }
  static get DAPP_CONTRACT_WS() {
    return 'dappContractWs'
  }

  static get DAPP_RESULT_BIG_NUMBER() {
    return 'big-number'
  }

  static get DAPP_RESULT_ACCOUNT() {
    return 'account'
  }

  static get DAPP_RESULT_TX_HASH() {
    return 'tx-hash'
  }

  static get DAPP_RESULT_IPFS_HASH_ARRAY() {
    return 'ipfs-hash-array'
  }

  static get DAPP_RESULT_SIA_HASH_ARRAY() {
    return 'sia-hash-array'
  }

  static get DAPP_RESULT_ARRAY() {
    return 'array'
  }

  static get DAPP_RESULT_OBJECT() {
    return 'object'
  }

  static get DAPP_RESULT_STRING() {
    return 'string'
  }

  static get DAPP_RESULT_ERROR() {
    return 'error'
  }

  static async addEventHandler(contract, event, params, callback) {
    Blockchain.handleEvent({
      config: DappLib.getConfig(),
      contract: contract,
      params: params || {}
    },
      event,
      (error, result) => {
        if (error) {
          callback({
            event: event,
            type: DappLib.DAPP_RESULT_ERROR,
            label: 'Error Message',
            result: error
          });
        } else {
          callback({
            event: event,
            type: DappLib.DAPP_RESULT_OBJECT,
            label: 'Event ' + event,
            result: DappLib.getObjectNamedProperties(result)
          });
        }
      }
    );
  }

  static getTransactionHash(t) {
    if (!t) { return ''; }
    let value = '';
    if (typeof t === 'string') {
      value = t;
    } else if (typeof t === 'object') {
      if (t.hasOwnProperty('transactionHash')) {
        value = t.transactionHash;       // Ethereum                
      } else {
        value = JSON.stringify(t);
      }
    }
    return value;
  }

  static formatHint(hint) {
    if (hint) {
      return `<p class="mt-3 grey-text"><strong>Hint:</strong> ${hint}</p>`;
    } else {
      return '';
    }
  }

  static formatNumber(n) {
    var parts = n.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `<strong class="p-1 blue-grey-text number copy-target" style="font-size:1.1rem;" title="${n}">${parts.join(".")}</strong>`;
  }

  static formatAccount(a) {
    return `<strong class="green accent-1 p-1 blue-grey-text number copy-target" title="${a}">${DappLib.toCondensed(a, 6, 4)}</strong>${DappLib.addClippy(a)}`;
  }

  static formatTxHash(a) {
    let value = DappLib.getTransactionHash(a);
    return `<strong class="teal lighten-5 p-1 blue-grey-text number copy-target" title="${value}">${DappLib.toCondensed(value, 6, 4)}</strong>${DappLib.addClippy(value)}`;
  }

  static formatBoolean(a) {
    return (a ? 'YES' : 'NO');
  }

  static formatText(a, copyText) {
    if (!a) { return; }
    if (a.startsWith('<')) {
      return a;
    }
    return `<span class="copy-target" title="${copyText ? copyText : a}">${a}</span>${DappLib.addClippy(copyText ? copyText : a)}`;
  }

  static formatStrong(a) {
    return `<strong>${a}</strong>`;
  }

  static formatPlain(a) {
    return a;
  }

  static formatObject(a) {
    let data = [];
    let labels = ['Item', 'Value'];
    let keys = ['item', 'value'];
    let formatters = ['Strong', 'Text-20-5']; // 'Strong': Bold, 'Text-20-5': Compress a 20 character long string down to 5
    let reg = new RegExp('^\\d+$'); // only digits
    for (let key in a) {
      if (!reg.test(key)) {
        data.push({
          item: key.substr(0, 1).toUpperCase() + key.substr(1),
          value: a[key]
        });
      }
    }
    return DappLib.formatArray(data, formatters, labels, keys);
  }

  static formatArray(h, dataFormatters, dataLabels, dataKeys) {

    let output = '<table class="table table-striped">';

    if (dataLabels) {
      output += '<thead><tr>';
      for (let d = 0; d < dataLabels.length; d++) {
        output += `<th scope="col">${dataLabels[d]}</th>`;
      }
      output += '</tr></thead>';
    }
    output += '<tbody>';
    h.map((item) => {
      output += '<tr>';
      for (let d = 0; d < dataFormatters.length; d++) {
        let text = String(dataKeys && dataKeys[d] ? item[dataKeys[d]] : item);
        let copyText = dataKeys && dataKeys[d] ? item[dataKeys[d]] : item;
        if (text.startsWith('<')) {
          output += (d == 0 ? '<th scope="row">' : '<td>') + text + (d == 0 ? '</th>' : '</td>');
        } else {
          let formatter = 'format' + dataFormatters[d];
          if (formatter.startsWith('formatText')) {
            let formatterFrags = formatter.split('-');
            if (formatterFrags.length === 3) {
              text = DappLib.toCondensed(text, Number(formatterFrags[1]), Number(formatterFrags[2]));
            } else if (formatterFrags.length === 2) {
              text = DappLib.toCondensed(text, Number(formatterFrags[1]));
            }
            formatter = formatterFrags[0];
          }
          output += (d == 0 ? '<th scope="row">' : '<td>') + DappLib[formatter](text, copyText) + (d == 0 ? '</th>' : '</td>');
        }
      }
      output += '</tr>';
    })
    output += '</tbody></table>';
    return output;
  }

  static getFormattedResultNode(retVal, key) {

    let returnKey = 'result';
    if (key && (key !== null) && (key !== 'null') && (typeof (key) === 'string')) {
      returnKey = key;
    }
    let formatted = '';
    switch (retVal.type) {
      case DappLib.DAPP_RESULT_BIG_NUMBER:
        formatted = DappLib.formatNumber(retVal[returnKey].toString(10));
        break;
      case DappLib.DAPP_RESULT_TX_HASH:
        formatted = DappLib.formatTxHash(retVal[returnKey]);
        break;
      case DappLib.DAPP_RESULT_ACCOUNT:
        formatted = DappLib.formatAccount(retVal[returnKey]);
        break;
      case DappLib.DAPP_RESULT_BOOLEAN:
        formatted = DappLib.formatBoolean(retVal[returnKey]);
        break;
      case DappLib.DAPP_RESULT_IPFS_HASH_ARRAY:
        formatted = DappLib.formatArray(
          retVal[returnKey],
          ['TxHash', 'IpfsHash', 'Text-10-5'], //Formatter
          ['Transaction', 'IPFS URL', 'Doc Id'], //Label
          ['transactionHash', 'ipfsHash', 'docId'] //Values
        );
        break;
      case DappLib.DAPP_RESULT_SIA_HASH_ARRAY:
        formatted = DappLib.formatArray(
          retVal[returnKey],
          ['TxHash', 'SiaHash', 'Text-10-5'], //Formatter
          ['Transaction', 'Sia URL', 'Doc Id'], //Label
          ['transactionHash', 'docId', 'docId'] //Values
        );
        break;
      case DappLib.DAPP_RESULT_ARRAY:
        formatted = DappLib.formatArray(
          retVal[returnKey],
          retVal.formatter ? retVal.formatter : ['Text'],
          null,
          null
        );
        break;
      case DappLib.DAPP_RESULT_STRING:
        formatted = DappLib.formatPlain(
          retVal[returnKey]
        );
        break;
      case DappLib.DAPP_RESULT_OBJECT:
        formatted = DappLib.formatObject(retVal[returnKey]);
        break;
      default:
        formatted = retVal[returnKey];
        break;
    }

    let resultNode = document.createElement('div');
    resultNode.className = `note text-xs ${retVal.type === DappLib.DAPP_RESULT_ERROR ? 'bg-red-400' : 'bg-green-400'} m-3 p-3`;
    let closeMarkup = '<div class="float-right" onclick="this.parentNode.parentNode.removeChild(this.parentNode)" title="Dismiss" class="text-right mb-1 mr-2" style="cursor:pointer;">X</div>';
    resultNode.innerHTML = closeMarkup + `${retVal.type === DappLib.DAPP_RESULT_ERROR ? '☹️' : '👍️'} ` + (Array.isArray(retVal[returnKey]) ? 'Result' : retVal.label) + ': ' + formatted + DappLib.formatHint(retVal.hint);
    // Wire-up clipboard copy
    new ClipboardJS('.copy-target', {
      text: function (trigger) {
        return trigger.getAttribute('data-copy');
      }
    });

    return resultNode;
  }

  static getObjectNamedProperties(a) {
    let reg = new RegExp('^\\d+$'); // only digits
    let newObj = {};
    for (let key in a) {
      if (!reg.test(key)) {
        newObj[key] = a[key];
      }
    }
    return newObj;
  }

  static addClippy(data) {
    return `
        <svg data-copy="${data}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             viewBox="0 0 22.1 23.5" style="enable-background:new 0 0 22.1 23.5;cursor:pointer;" class="copy-target" width="19px" height="20.357px" xml:space="preserve">
        <style type="text/css">
            .st99{fill:#777777;stroke:none;stroke-linecap:round;stroke-linejoin:round;}
        </style>
        <path class="st99" d="M3.9,17.4h5.4v1.4H3.9V17.4z M10.7,9.2H3.9v1.4h6.8V9.2z M13.4,13.3v-2.7l-4.1,4.1l4.1,4.1V16h6.8v-2.7H13.4z
             M7.3,12H3.9v1.4h3.4V12z M3.9,16h3.4v-1.4H3.9V16z M16.1,17.4h1.4v2.7c0,0.4-0.1,0.7-0.4,1c-0.3,0.3-0.6,0.4-1,0.4H2.6
            c-0.7,0-1.4-0.6-1.4-1.4V5.2c0-0.7,0.6-1.4,1.4-1.4h4.1c0-1.5,1.2-2.7,2.7-2.7s2.7,1.2,2.7,2.7h4.1c0.7,0,1.4,0.6,1.4,1.4V12h-1.4
            V7.9H2.6v12.2h13.6V17.4z M3.9,6.5h10.9c0-0.7-0.6-1.4-1.4-1.4h-1.4c-0.7,0-1.4-0.6-1.4-1.4s-0.6-1.4-1.4-1.4S8,3.1,8,3.8
            S7.4,5.2,6.6,5.2H5.3C4.5,5.2,3.9,5.8,3.9,6.5z"/>
        </svg>
        `;
  }

  static getAccounts() {
    let accounts = dappConfig.accounts;
    return accounts;
  }

  static fromAscii(str, padding) {

    if (Array.isArray(str)) {
      return DappLib.arrayToHex(str);
    }

    if (str.startsWith('0x') || !padding) {
      return str;
    }

    if (str.length > padding) {
      str = str.substr(0, padding);
    }

    var hex = '0x';
    for (var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);
      var n = code.toString(16);
      hex += n.length < 2 ? '0' + n : n;
    }
    return hex + '0'.repeat(padding * 2 - hex.length + 2);
  };


  static toAscii(hex) {
    var str = '',
      i = 0,
      l = hex.length;
    if (hex.substring(0, 2) === '0x') {
      i = 2;
    }
    for (; i < l; i += 2) {
      var code = parseInt(hex.substr(i, 2), 16);
      if (code === 0) continue; // this is added
      str += String.fromCharCode(code);
    }
    return str;
  };

  static arrayToHex(bytes) {
    if (Array.isArray(bytes)) {
      return '0x' +
        Array.prototype.map.call(bytes, function (byte) {
          return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('')
    } else {
      return bytes;
    }
  }

  static hexToArray(hex) {
    if ((typeof hex === 'string') && (hex.beginsWith('0x'))) {
      let bytes = [];
      for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
      }
      return bytes;
    } else {
      return hex;
    }
  }

  static toCondensed(s, begin, end) {
    if (!s) { return; }
    if (s.length && s.length <= begin + end) {
      return s;
    } else {
      if (end) {
        return `${s.substr(0, begin)}...${s.substr(s.length - end, end)}`;
      } else {
        return `${s.substr(0, begin)}...`;
      }
    }
  }

  static getManifest() {
    return manifest;
  }

  // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  static getUniqueId() {
    return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  static getConfig() {
    return dappConfig;
  }

  // Return value of this function is used to dynamically re-define getConfig()
  // for use during testing. With this approach, even though getConfig() is static
  // it returns the correct contract addresses as its definition is re-written
  // before each test run. Look for the following line in test scripts to see it done:
  //  DappLib.getConfig = Function(`return ${ JSON.stringify(DappLib.getTestConfig(testDappStateContract, testDappContract, testAccounts))}`);
  static getTestConfig(testDappStateContract, testDappContract, testAccounts) {

    return Object.assign(
      {},
      dappConfig,
      {
        dappStateContractAddress: testDappStateContract.address,
        dappContractAddress: testDappContract.address,
        accounts: testAccounts,
        owner: testAccounts[0],
        admins: [
          testAccounts[1],
          testAccounts[2],
          testAccounts[3]
        ],
        users: [
          testAccounts[4],
          testAccounts[5],
          testAccounts[6],
          testAccounts[7],
          testAccounts[8]
        ]
        ///+test
      }
    );
  }

}