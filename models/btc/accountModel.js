/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Egor Zuev <zyev.egor@gmail.com>
 */

const mongoose = require('mongoose');

/** @model accountModel
 *  @description account model - represents an bitcoin account
 */
const Account = new mongoose.Schema({
  address: {type: String, unique: true, required: true},
  balances: {
    confirmations0: {type: Number, default: 0, required: true},
    confirmations3: {type: Number, default: 0, required: true},
    confirmations6: {type: Number, default: 0, required: true}
  },
  isActive: {type: Boolean, required: true, default: true},
  lastBlockCheck: {type: Number, default: 0, required: true},
  created: {type: Date, required: true, default: Date.now}
});

module.exports = (connection, prefix)=>
  connection.model(`${prefix}Account`, Account);
