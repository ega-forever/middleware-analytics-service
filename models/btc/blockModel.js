/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 * @author Egor Zuev <zyev.egor@gmail.com>
 */

/**
 * Mongoose model. Represents a block in bitcoin
 * @module models/blockModel
 * @returns {Object} Mongoose model
 */

const mongoose = require('mongoose');

const Block = new mongoose.Schema({
  _id: {type: String},
  number: {type: Number, unique: true, index: true},
  timestamp: {type: Number, required: true},
  bits: {type: Number, required: true},
  merkleRoot: {type: String, required: true},
  created: {type: Date, required: true, default: Date.now}
}, {_id: false});

module.exports = (connection, prefix) =>
  connection.model(`${prefix}Block`, Block);
