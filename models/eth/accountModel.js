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
  balance: {type: String, default: '0'},
  isActive: {type: Boolean, required: true, default: true},
  created: {type: Date, required: true, default: Date.now},
  erc20token : {type: mongoose.Schema.Types.Mixed, default: {}}
});

module.exports = (connection, prefix)=>
  connection.model(`${prefix}Account`, Account);
