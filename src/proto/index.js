/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const ConfigMessage = $root.ConfigMessage = (() => {

    /**
     * Properties of a ConfigMessage.
     * @exports IConfigMessage
     * @interface IConfigMessage
     * @property {string} name ConfigMessage name
     * @property {string|null} [product1] ConfigMessage product1
     * @property {number|null} [price1] ConfigMessage price1
     * @property {string|null} [product2] ConfigMessage product2
     * @property {number|null} [price2] ConfigMessage price2
     * @property {string|null} [product3] ConfigMessage product3
     * @property {number|null} [price3] ConfigMessage price3
     * @property {string|null} [product4] ConfigMessage product4
     * @property {number|null} [price4] ConfigMessage price4
     * @property {string|null} [product5] ConfigMessage product5
     * @property {number|null} [price5] ConfigMessage price5
     * @property {string|null} [product6] ConfigMessage product6
     * @property {number|null} [price6] ConfigMessage price6
     * @property {string|null} [product7] ConfigMessage product7
     * @property {number|null} [price7] ConfigMessage price7
     * @property {string|null} [product8] ConfigMessage product8
     * @property {number|null} [price8] ConfigMessage price8
     * @property {string|null} [product9] ConfigMessage product9
     * @property {number|null} [price9] ConfigMessage price9
     * @property {number} checksum ConfigMessage checksum
     * @property {number} listId ConfigMessage listId
     */

    /**
     * Constructs a new ConfigMessage.
     * @exports ConfigMessage
     * @classdesc Represents a ConfigMessage.
     * @implements IConfigMessage
     * @constructor
     * @param {IConfigMessage=} [properties] Properties to set
     */
    function ConfigMessage(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ConfigMessage name.
     * @member {string} name
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.name = "";

    /**
     * ConfigMessage product1.
     * @member {string} product1
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.product1 = "";

    /**
     * ConfigMessage price1.
     * @member {number} price1
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.price1 = 0;

    /**
     * ConfigMessage product2.
     * @member {string} product2
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.product2 = "";

    /**
     * ConfigMessage price2.
     * @member {number} price2
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.price2 = 0;

    /**
     * ConfigMessage product3.
     * @member {string} product3
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.product3 = "";

    /**
     * ConfigMessage price3.
     * @member {number} price3
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.price3 = 0;

    /**
     * ConfigMessage product4.
     * @member {string} product4
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.product4 = "";

    /**
     * ConfigMessage price4.
     * @member {number} price4
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.price4 = 0;

    /**
     * ConfigMessage product5.
     * @member {string} product5
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.product5 = "";

    /**
     * ConfigMessage price5.
     * @member {number} price5
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.price5 = 0;

    /**
     * ConfigMessage product6.
     * @member {string} product6
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.product6 = "";

    /**
     * ConfigMessage price6.
     * @member {number} price6
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.price6 = 0;

    /**
     * ConfigMessage product7.
     * @member {string} product7
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.product7 = "";

    /**
     * ConfigMessage price7.
     * @member {number} price7
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.price7 = 0;

    /**
     * ConfigMessage product8.
     * @member {string} product8
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.product8 = "";

    /**
     * ConfigMessage price8.
     * @member {number} price8
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.price8 = 0;

    /**
     * ConfigMessage product9.
     * @member {string} product9
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.product9 = "";

    /**
     * ConfigMessage price9.
     * @member {number} price9
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.price9 = 0;

    /**
     * ConfigMessage checksum.
     * @member {number} checksum
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.checksum = 0;

    /**
     * ConfigMessage listId.
     * @member {number} listId
     * @memberof ConfigMessage
     * @instance
     */
    ConfigMessage.prototype.listId = 0;

    /**
     * Creates a new ConfigMessage instance using the specified properties.
     * @function create
     * @memberof ConfigMessage
     * @static
     * @param {IConfigMessage=} [properties] Properties to set
     * @returns {ConfigMessage} ConfigMessage instance
     */
    ConfigMessage.create = function create(properties) {
        return new ConfigMessage(properties);
    };

    /**
     * Encodes the specified ConfigMessage message. Does not implicitly {@link ConfigMessage.verify|verify} messages.
     * @function encode
     * @memberof ConfigMessage
     * @static
     * @param {IConfigMessage} message ConfigMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ConfigMessage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
        if (message.product1 != null && Object.hasOwnProperty.call(message, "product1"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.product1);
        if (message.price1 != null && Object.hasOwnProperty.call(message, "price1"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.price1);
        if (message.product2 != null && Object.hasOwnProperty.call(message, "product2"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.product2);
        if (message.price2 != null && Object.hasOwnProperty.call(message, "price2"))
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.price2);
        if (message.product3 != null && Object.hasOwnProperty.call(message, "product3"))
            writer.uint32(/* id 6, wireType 2 =*/50).string(message.product3);
        if (message.price3 != null && Object.hasOwnProperty.call(message, "price3"))
            writer.uint32(/* id 7, wireType 0 =*/56).int32(message.price3);
        if (message.product4 != null && Object.hasOwnProperty.call(message, "product4"))
            writer.uint32(/* id 8, wireType 2 =*/66).string(message.product4);
        if (message.price4 != null && Object.hasOwnProperty.call(message, "price4"))
            writer.uint32(/* id 9, wireType 0 =*/72).int32(message.price4);
        if (message.product5 != null && Object.hasOwnProperty.call(message, "product5"))
            writer.uint32(/* id 10, wireType 2 =*/82).string(message.product5);
        if (message.price5 != null && Object.hasOwnProperty.call(message, "price5"))
            writer.uint32(/* id 11, wireType 0 =*/88).int32(message.price5);
        if (message.product6 != null && Object.hasOwnProperty.call(message, "product6"))
            writer.uint32(/* id 12, wireType 2 =*/98).string(message.product6);
        if (message.price6 != null && Object.hasOwnProperty.call(message, "price6"))
            writer.uint32(/* id 13, wireType 0 =*/104).int32(message.price6);
        if (message.product7 != null && Object.hasOwnProperty.call(message, "product7"))
            writer.uint32(/* id 14, wireType 2 =*/114).string(message.product7);
        if (message.price7 != null && Object.hasOwnProperty.call(message, "price7"))
            writer.uint32(/* id 15, wireType 0 =*/120).int32(message.price7);
        if (message.product8 != null && Object.hasOwnProperty.call(message, "product8"))
            writer.uint32(/* id 16, wireType 2 =*/130).string(message.product8);
        if (message.price8 != null && Object.hasOwnProperty.call(message, "price8"))
            writer.uint32(/* id 17, wireType 0 =*/136).int32(message.price8);
        if (message.product9 != null && Object.hasOwnProperty.call(message, "product9"))
            writer.uint32(/* id 18, wireType 2 =*/146).string(message.product9);
        if (message.price9 != null && Object.hasOwnProperty.call(message, "price9"))
            writer.uint32(/* id 19, wireType 0 =*/152).int32(message.price9);
        writer.uint32(/* id 20, wireType 0 =*/160).int32(message.checksum);
        writer.uint32(/* id 21, wireType 0 =*/168).int32(message.listId);
        return writer;
    };

    /**
     * Encodes the specified ConfigMessage message, length delimited. Does not implicitly {@link ConfigMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ConfigMessage
     * @static
     * @param {IConfigMessage} message ConfigMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ConfigMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ConfigMessage message from the specified reader or buffer.
     * @function decode
     * @memberof ConfigMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ConfigMessage} ConfigMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ConfigMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ConfigMessage();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.name = reader.string();
                break;
            case 2:
                message.product1 = reader.string();
                break;
            case 3:
                message.price1 = reader.int32();
                break;
            case 4:
                message.product2 = reader.string();
                break;
            case 5:
                message.price2 = reader.int32();
                break;
            case 6:
                message.product3 = reader.string();
                break;
            case 7:
                message.price3 = reader.int32();
                break;
            case 8:
                message.product4 = reader.string();
                break;
            case 9:
                message.price4 = reader.int32();
                break;
            case 10:
                message.product5 = reader.string();
                break;
            case 11:
                message.price5 = reader.int32();
                break;
            case 12:
                message.product6 = reader.string();
                break;
            case 13:
                message.price6 = reader.int32();
                break;
            case 14:
                message.product7 = reader.string();
                break;
            case 15:
                message.price7 = reader.int32();
                break;
            case 16:
                message.product8 = reader.string();
                break;
            case 17:
                message.price8 = reader.int32();
                break;
            case 18:
                message.product9 = reader.string();
                break;
            case 19:
                message.price9 = reader.int32();
                break;
            case 20:
                message.checksum = reader.int32();
                break;
            case 21:
                message.listId = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("name"))
            throw $util.ProtocolError("missing required 'name'", { instance: message });
        if (!message.hasOwnProperty("checksum"))
            throw $util.ProtocolError("missing required 'checksum'", { instance: message });
        if (!message.hasOwnProperty("listId"))
            throw $util.ProtocolError("missing required 'listId'", { instance: message });
        return message;
    };

    /**
     * Decodes a ConfigMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ConfigMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ConfigMessage} ConfigMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ConfigMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ConfigMessage message.
     * @function verify
     * @memberof ConfigMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ConfigMessage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.name))
            return "name: string expected";
        if (message.product1 != null && message.hasOwnProperty("product1"))
            if (!$util.isString(message.product1))
                return "product1: string expected";
        if (message.price1 != null && message.hasOwnProperty("price1"))
            if (!$util.isInteger(message.price1))
                return "price1: integer expected";
        if (message.product2 != null && message.hasOwnProperty("product2"))
            if (!$util.isString(message.product2))
                return "product2: string expected";
        if (message.price2 != null && message.hasOwnProperty("price2"))
            if (!$util.isInteger(message.price2))
                return "price2: integer expected";
        if (message.product3 != null && message.hasOwnProperty("product3"))
            if (!$util.isString(message.product3))
                return "product3: string expected";
        if (message.price3 != null && message.hasOwnProperty("price3"))
            if (!$util.isInteger(message.price3))
                return "price3: integer expected";
        if (message.product4 != null && message.hasOwnProperty("product4"))
            if (!$util.isString(message.product4))
                return "product4: string expected";
        if (message.price4 != null && message.hasOwnProperty("price4"))
            if (!$util.isInteger(message.price4))
                return "price4: integer expected";
        if (message.product5 != null && message.hasOwnProperty("product5"))
            if (!$util.isString(message.product5))
                return "product5: string expected";
        if (message.price5 != null && message.hasOwnProperty("price5"))
            if (!$util.isInteger(message.price5))
                return "price5: integer expected";
        if (message.product6 != null && message.hasOwnProperty("product6"))
            if (!$util.isString(message.product6))
                return "product6: string expected";
        if (message.price6 != null && message.hasOwnProperty("price6"))
            if (!$util.isInteger(message.price6))
                return "price6: integer expected";
        if (message.product7 != null && message.hasOwnProperty("product7"))
            if (!$util.isString(message.product7))
                return "product7: string expected";
        if (message.price7 != null && message.hasOwnProperty("price7"))
            if (!$util.isInteger(message.price7))
                return "price7: integer expected";
        if (message.product8 != null && message.hasOwnProperty("product8"))
            if (!$util.isString(message.product8))
                return "product8: string expected";
        if (message.price8 != null && message.hasOwnProperty("price8"))
            if (!$util.isInteger(message.price8))
                return "price8: integer expected";
        if (message.product9 != null && message.hasOwnProperty("product9"))
            if (!$util.isString(message.product9))
                return "product9: string expected";
        if (message.price9 != null && message.hasOwnProperty("price9"))
            if (!$util.isInteger(message.price9))
                return "price9: integer expected";
        if (!$util.isInteger(message.checksum))
            return "checksum: integer expected";
        if (!$util.isInteger(message.listId))
            return "listId: integer expected";
        return null;
    };

    /**
     * Creates a ConfigMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ConfigMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ConfigMessage} ConfigMessage
     */
    ConfigMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.ConfigMessage)
            return object;
        let message = new $root.ConfigMessage();
        if (object.name != null)
            message.name = String(object.name);
        if (object.product1 != null)
            message.product1 = String(object.product1);
        if (object.price1 != null)
            message.price1 = object.price1 | 0;
        if (object.product2 != null)
            message.product2 = String(object.product2);
        if (object.price2 != null)
            message.price2 = object.price2 | 0;
        if (object.product3 != null)
            message.product3 = String(object.product3);
        if (object.price3 != null)
            message.price3 = object.price3 | 0;
        if (object.product4 != null)
            message.product4 = String(object.product4);
        if (object.price4 != null)
            message.price4 = object.price4 | 0;
        if (object.product5 != null)
            message.product5 = String(object.product5);
        if (object.price5 != null)
            message.price5 = object.price5 | 0;
        if (object.product6 != null)
            message.product6 = String(object.product6);
        if (object.price6 != null)
            message.price6 = object.price6 | 0;
        if (object.product7 != null)
            message.product7 = String(object.product7);
        if (object.price7 != null)
            message.price7 = object.price7 | 0;
        if (object.product8 != null)
            message.product8 = String(object.product8);
        if (object.price8 != null)
            message.price8 = object.price8 | 0;
        if (object.product9 != null)
            message.product9 = String(object.product9);
        if (object.price9 != null)
            message.price9 = object.price9 | 0;
        if (object.checksum != null)
            message.checksum = object.checksum | 0;
        if (object.listId != null)
            message.listId = object.listId | 0;
        return message;
    };

    /**
     * Creates a plain object from a ConfigMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ConfigMessage
     * @static
     * @param {ConfigMessage} message ConfigMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ConfigMessage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.name = "";
            object.product1 = "";
            object.price1 = 0;
            object.product2 = "";
            object.price2 = 0;
            object.product3 = "";
            object.price3 = 0;
            object.product4 = "";
            object.price4 = 0;
            object.product5 = "";
            object.price5 = 0;
            object.product6 = "";
            object.price6 = 0;
            object.product7 = "";
            object.price7 = 0;
            object.product8 = "";
            object.price8 = 0;
            object.product9 = "";
            object.price9 = 0;
            object.checksum = 0;
            object.listId = 0;
        }
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.product1 != null && message.hasOwnProperty("product1"))
            object.product1 = message.product1;
        if (message.price1 != null && message.hasOwnProperty("price1"))
            object.price1 = message.price1;
        if (message.product2 != null && message.hasOwnProperty("product2"))
            object.product2 = message.product2;
        if (message.price2 != null && message.hasOwnProperty("price2"))
            object.price2 = message.price2;
        if (message.product3 != null && message.hasOwnProperty("product3"))
            object.product3 = message.product3;
        if (message.price3 != null && message.hasOwnProperty("price3"))
            object.price3 = message.price3;
        if (message.product4 != null && message.hasOwnProperty("product4"))
            object.product4 = message.product4;
        if (message.price4 != null && message.hasOwnProperty("price4"))
            object.price4 = message.price4;
        if (message.product5 != null && message.hasOwnProperty("product5"))
            object.product5 = message.product5;
        if (message.price5 != null && message.hasOwnProperty("price5"))
            object.price5 = message.price5;
        if (message.product6 != null && message.hasOwnProperty("product6"))
            object.product6 = message.product6;
        if (message.price6 != null && message.hasOwnProperty("price6"))
            object.price6 = message.price6;
        if (message.product7 != null && message.hasOwnProperty("product7"))
            object.product7 = message.product7;
        if (message.price7 != null && message.hasOwnProperty("price7"))
            object.price7 = message.price7;
        if (message.product8 != null && message.hasOwnProperty("product8"))
            object.product8 = message.product8;
        if (message.price8 != null && message.hasOwnProperty("price8"))
            object.price8 = message.price8;
        if (message.product9 != null && message.hasOwnProperty("product9"))
            object.product9 = message.product9;
        if (message.price9 != null && message.hasOwnProperty("price9"))
            object.price9 = message.price9;
        if (message.checksum != null && message.hasOwnProperty("checksum"))
            object.checksum = message.checksum;
        if (message.listId != null && message.hasOwnProperty("listId"))
            object.listId = message.listId;
        return object;
    };

    /**
     * Converts this ConfigMessage to JSON.
     * @function toJSON
     * @memberof ConfigMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ConfigMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ConfigMessage;
})();

export const TransactionMessage = $root.TransactionMessage = (() => {

    /**
     * Properties of a TransactionMessage.
     * @exports ITransactionMessage
     * @interface ITransactionMessage
     * @property {string} id TransactionMessage id
     * @property {string} deviceId TransactionMessage deviceId
     * @property {TransactionMessage.Mode} mode TransactionMessage mode
     * @property {number} deviceTime TransactionMessage deviceTime
     * @property {string|null} [card] TransactionMessage card
     * @property {number} deposit TransactionMessage deposit
     * @property {number} total TransactionMessage total
     * @property {Array.<TransactionMessage.ICartItemMessage>|null} [cartItems] TransactionMessage cartItems
     * @property {TransactionMessage.Payment} payment TransactionMessage payment
     * @property {number|null} [listId] TransactionMessage listId
     */

    /**
     * Constructs a new TransactionMessage.
     * @exports TransactionMessage
     * @classdesc Represents a TransactionMessage.
     * @implements ITransactionMessage
     * @constructor
     * @param {ITransactionMessage=} [properties] Properties to set
     */
    function TransactionMessage(properties) {
        this.cartItems = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * TransactionMessage id.
     * @member {string} id
     * @memberof TransactionMessage
     * @instance
     */
    TransactionMessage.prototype.id = "";

    /**
     * TransactionMessage deviceId.
     * @member {string} deviceId
     * @memberof TransactionMessage
     * @instance
     */
    TransactionMessage.prototype.deviceId = "";

    /**
     * TransactionMessage mode.
     * @member {TransactionMessage.Mode} mode
     * @memberof TransactionMessage
     * @instance
     */
    TransactionMessage.prototype.mode = 0;

    /**
     * TransactionMessage deviceTime.
     * @member {number} deviceTime
     * @memberof TransactionMessage
     * @instance
     */
    TransactionMessage.prototype.deviceTime = 0;

    /**
     * TransactionMessage card.
     * @member {string} card
     * @memberof TransactionMessage
     * @instance
     */
    TransactionMessage.prototype.card = "";

    /**
     * TransactionMessage deposit.
     * @member {number} deposit
     * @memberof TransactionMessage
     * @instance
     */
    TransactionMessage.prototype.deposit = 0;

    /**
     * TransactionMessage total.
     * @member {number} total
     * @memberof TransactionMessage
     * @instance
     */
    TransactionMessage.prototype.total = 0;

    /**
     * TransactionMessage cartItems.
     * @member {Array.<TransactionMessage.ICartItemMessage>} cartItems
     * @memberof TransactionMessage
     * @instance
     */
    TransactionMessage.prototype.cartItems = $util.emptyArray;

    /**
     * TransactionMessage payment.
     * @member {TransactionMessage.Payment} payment
     * @memberof TransactionMessage
     * @instance
     */
    TransactionMessage.prototype.payment = 0;

    /**
     * TransactionMessage listId.
     * @member {number} listId
     * @memberof TransactionMessage
     * @instance
     */
    TransactionMessage.prototype.listId = 0;

    /**
     * Creates a new TransactionMessage instance using the specified properties.
     * @function create
     * @memberof TransactionMessage
     * @static
     * @param {ITransactionMessage=} [properties] Properties to set
     * @returns {TransactionMessage} TransactionMessage instance
     */
    TransactionMessage.create = function create(properties) {
        return new TransactionMessage(properties);
    };

    /**
     * Encodes the specified TransactionMessage message. Does not implicitly {@link TransactionMessage.verify|verify} messages.
     * @function encode
     * @memberof TransactionMessage
     * @static
     * @param {ITransactionMessage} message TransactionMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TransactionMessage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.deviceId);
        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.mode);
        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.deviceTime);
        if (message.card != null && Object.hasOwnProperty.call(message, "card"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.card);
        writer.uint32(/* id 6, wireType 0 =*/48).sint32(message.deposit);
        writer.uint32(/* id 7, wireType 0 =*/56).sint32(message.total);
        if (message.cartItems != null && message.cartItems.length)
            for (let i = 0; i < message.cartItems.length; ++i)
                $root.TransactionMessage.CartItemMessage.encode(message.cartItems[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
        writer.uint32(/* id 9, wireType 0 =*/72).int32(message.payment);
        if (message.listId != null && Object.hasOwnProperty.call(message, "listId"))
            writer.uint32(/* id 10, wireType 0 =*/80).int32(message.listId);
        return writer;
    };

    /**
     * Encodes the specified TransactionMessage message, length delimited. Does not implicitly {@link TransactionMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof TransactionMessage
     * @static
     * @param {ITransactionMessage} message TransactionMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TransactionMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a TransactionMessage message from the specified reader or buffer.
     * @function decode
     * @memberof TransactionMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {TransactionMessage} TransactionMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TransactionMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.TransactionMessage();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = reader.string();
                break;
            case 2:
                message.deviceId = reader.string();
                break;
            case 3:
                message.mode = reader.int32();
                break;
            case 4:
                message.deviceTime = reader.int32();
                break;
            case 5:
                message.card = reader.string();
                break;
            case 6:
                message.deposit = reader.sint32();
                break;
            case 7:
                message.total = reader.sint32();
                break;
            case 8:
                if (!(message.cartItems && message.cartItems.length))
                    message.cartItems = [];
                message.cartItems.push($root.TransactionMessage.CartItemMessage.decode(reader, reader.uint32()));
                break;
            case 9:
                message.payment = reader.int32();
                break;
            case 10:
                message.listId = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("id"))
            throw $util.ProtocolError("missing required 'id'", { instance: message });
        if (!message.hasOwnProperty("deviceId"))
            throw $util.ProtocolError("missing required 'deviceId'", { instance: message });
        if (!message.hasOwnProperty("mode"))
            throw $util.ProtocolError("missing required 'mode'", { instance: message });
        if (!message.hasOwnProperty("deviceTime"))
            throw $util.ProtocolError("missing required 'deviceTime'", { instance: message });
        if (!message.hasOwnProperty("deposit"))
            throw $util.ProtocolError("missing required 'deposit'", { instance: message });
        if (!message.hasOwnProperty("total"))
            throw $util.ProtocolError("missing required 'total'", { instance: message });
        if (!message.hasOwnProperty("payment"))
            throw $util.ProtocolError("missing required 'payment'", { instance: message });
        return message;
    };

    /**
     * Decodes a TransactionMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof TransactionMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {TransactionMessage} TransactionMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TransactionMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a TransactionMessage message.
     * @function verify
     * @memberof TransactionMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    TransactionMessage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.id))
            return "id: string expected";
        if (!$util.isString(message.deviceId))
            return "deviceId: string expected";
        switch (message.mode) {
        default:
            return "mode: enum value expected";
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
            break;
        }
        if (!$util.isInteger(message.deviceTime))
            return "deviceTime: integer expected";
        if (message.card != null && message.hasOwnProperty("card"))
            if (!$util.isString(message.card))
                return "card: string expected";
        if (!$util.isInteger(message.deposit))
            return "deposit: integer expected";
        if (!$util.isInteger(message.total))
            return "total: integer expected";
        if (message.cartItems != null && message.hasOwnProperty("cartItems")) {
            if (!Array.isArray(message.cartItems))
                return "cartItems: array expected";
            for (let i = 0; i < message.cartItems.length; ++i) {
                let error = $root.TransactionMessage.CartItemMessage.verify(message.cartItems[i]);
                if (error)
                    return "cartItems." + error;
            }
        }
        switch (message.payment) {
        default:
            return "payment: enum value expected";
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            break;
        }
        if (message.listId != null && message.hasOwnProperty("listId"))
            if (!$util.isInteger(message.listId))
                return "listId: integer expected";
        return null;
    };

    /**
     * Creates a TransactionMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof TransactionMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {TransactionMessage} TransactionMessage
     */
    TransactionMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.TransactionMessage)
            return object;
        let message = new $root.TransactionMessage();
        if (object.id != null)
            message.id = String(object.id);
        if (object.deviceId != null)
            message.deviceId = String(object.deviceId);
        switch (object.mode) {
        case "TIME_ENTRY":
        case 0:
            message.mode = 0;
            break;
        case "TOP_UP":
        case 1:
            message.mode = 1;
            break;
        case "CHARGE":
        case 2:
            message.mode = 2;
            break;
        case "CASHOUT":
        case 3:
            message.mode = 3;
            break;
        case "INIT_CARD":
        case 4:
            message.mode = 4;
            break;
        }
        if (object.deviceTime != null)
            message.deviceTime = object.deviceTime | 0;
        if (object.card != null)
            message.card = String(object.card);
        if (object.deposit != null)
            message.deposit = object.deposit | 0;
        if (object.total != null)
            message.total = object.total | 0;
        if (object.cartItems) {
            if (!Array.isArray(object.cartItems))
                throw TypeError(".TransactionMessage.cartItems: array expected");
            message.cartItems = [];
            for (let i = 0; i < object.cartItems.length; ++i) {
                if (typeof object.cartItems[i] !== "object")
                    throw TypeError(".TransactionMessage.cartItems: object expected");
                message.cartItems[i] = $root.TransactionMessage.CartItemMessage.fromObject(object.cartItems[i]);
            }
        }
        switch (object.payment) {
        case "CASH":
        case 0:
            message.payment = 0;
            break;
        case "BON":
        case 1:
            message.payment = 1;
            break;
        case "SUM_UP":
        case 2:
            message.payment = 2;
            break;
        case "VOUCHER":
        case 3:
            message.payment = 3;
            break;
        case "FREE_CREW":
        case 4:
            message.payment = 4;
            break;
        case "FREE_BAND":
        case 5:
            message.payment = 5;
            break;
        }
        if (object.listId != null)
            message.listId = object.listId | 0;
        return message;
    };

    /**
     * Creates a plain object from a TransactionMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof TransactionMessage
     * @static
     * @param {TransactionMessage} message TransactionMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    TransactionMessage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.cartItems = [];
        if (options.defaults) {
            object.id = "";
            object.deviceId = "";
            object.mode = options.enums === String ? "TIME_ENTRY" : 0;
            object.deviceTime = 0;
            object.card = "";
            object.deposit = 0;
            object.total = 0;
            object.payment = options.enums === String ? "CASH" : 0;
            object.listId = 0;
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.deviceId != null && message.hasOwnProperty("deviceId"))
            object.deviceId = message.deviceId;
        if (message.mode != null && message.hasOwnProperty("mode"))
            object.mode = options.enums === String ? $root.TransactionMessage.Mode[message.mode] : message.mode;
        if (message.deviceTime != null && message.hasOwnProperty("deviceTime"))
            object.deviceTime = message.deviceTime;
        if (message.card != null && message.hasOwnProperty("card"))
            object.card = message.card;
        if (message.deposit != null && message.hasOwnProperty("deposit"))
            object.deposit = message.deposit;
        if (message.total != null && message.hasOwnProperty("total"))
            object.total = message.total;
        if (message.cartItems && message.cartItems.length) {
            object.cartItems = [];
            for (let j = 0; j < message.cartItems.length; ++j)
                object.cartItems[j] = $root.TransactionMessage.CartItemMessage.toObject(message.cartItems[j], options);
        }
        if (message.payment != null && message.hasOwnProperty("payment"))
            object.payment = options.enums === String ? $root.TransactionMessage.Payment[message.payment] : message.payment;
        if (message.listId != null && message.hasOwnProperty("listId"))
            object.listId = message.listId;
        return object;
    };

    /**
     * Converts this TransactionMessage to JSON.
     * @function toJSON
     * @memberof TransactionMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    TransactionMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Mode enum.
     * @name TransactionMessage.Mode
     * @enum {number}
     * @property {number} TIME_ENTRY=0 TIME_ENTRY value
     * @property {number} TOP_UP=1 TOP_UP value
     * @property {number} CHARGE=2 CHARGE value
     * @property {number} CASHOUT=3 CASHOUT value
     * @property {number} INIT_CARD=4 INIT_CARD value
     */
    TransactionMessage.Mode = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "TIME_ENTRY"] = 0;
        values[valuesById[1] = "TOP_UP"] = 1;
        values[valuesById[2] = "CHARGE"] = 2;
        values[valuesById[3] = "CASHOUT"] = 3;
        values[valuesById[4] = "INIT_CARD"] = 4;
        return values;
    })();

    TransactionMessage.CartItemMessage = (function() {

        /**
         * Properties of a CartItemMessage.
         * @memberof TransactionMessage
         * @interface ICartItemMessage
         * @property {number} price CartItemMessage price
         * @property {string} product CartItemMessage product
         */

        /**
         * Constructs a new CartItemMessage.
         * @memberof TransactionMessage
         * @classdesc Represents a CartItemMessage.
         * @implements ICartItemMessage
         * @constructor
         * @param {TransactionMessage.ICartItemMessage=} [properties] Properties to set
         */
        function CartItemMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CartItemMessage price.
         * @member {number} price
         * @memberof TransactionMessage.CartItemMessage
         * @instance
         */
        CartItemMessage.prototype.price = 0;

        /**
         * CartItemMessage product.
         * @member {string} product
         * @memberof TransactionMessage.CartItemMessage
         * @instance
         */
        CartItemMessage.prototype.product = "";

        /**
         * Creates a new CartItemMessage instance using the specified properties.
         * @function create
         * @memberof TransactionMessage.CartItemMessage
         * @static
         * @param {TransactionMessage.ICartItemMessage=} [properties] Properties to set
         * @returns {TransactionMessage.CartItemMessage} CartItemMessage instance
         */
        CartItemMessage.create = function create(properties) {
            return new CartItemMessage(properties);
        };

        /**
         * Encodes the specified CartItemMessage message. Does not implicitly {@link TransactionMessage.CartItemMessage.verify|verify} messages.
         * @function encode
         * @memberof TransactionMessage.CartItemMessage
         * @static
         * @param {TransactionMessage.ICartItemMessage} message CartItemMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CartItemMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.price);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.product);
            return writer;
        };

        /**
         * Encodes the specified CartItemMessage message, length delimited. Does not implicitly {@link TransactionMessage.CartItemMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof TransactionMessage.CartItemMessage
         * @static
         * @param {TransactionMessage.ICartItemMessage} message CartItemMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CartItemMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CartItemMessage message from the specified reader or buffer.
         * @function decode
         * @memberof TransactionMessage.CartItemMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {TransactionMessage.CartItemMessage} CartItemMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CartItemMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.TransactionMessage.CartItemMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.price = reader.int32();
                    break;
                case 2:
                    message.product = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("price"))
                throw $util.ProtocolError("missing required 'price'", { instance: message });
            if (!message.hasOwnProperty("product"))
                throw $util.ProtocolError("missing required 'product'", { instance: message });
            return message;
        };

        /**
         * Decodes a CartItemMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof TransactionMessage.CartItemMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {TransactionMessage.CartItemMessage} CartItemMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CartItemMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CartItemMessage message.
         * @function verify
         * @memberof TransactionMessage.CartItemMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CartItemMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.price))
                return "price: integer expected";
            if (!$util.isString(message.product))
                return "product: string expected";
            return null;
        };

        /**
         * Creates a CartItemMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof TransactionMessage.CartItemMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {TransactionMessage.CartItemMessage} CartItemMessage
         */
        CartItemMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.TransactionMessage.CartItemMessage)
                return object;
            let message = new $root.TransactionMessage.CartItemMessage();
            if (object.price != null)
                message.price = object.price | 0;
            if (object.product != null)
                message.product = String(object.product);
            return message;
        };

        /**
         * Creates a plain object from a CartItemMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof TransactionMessage.CartItemMessage
         * @static
         * @param {TransactionMessage.CartItemMessage} message CartItemMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CartItemMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.price = 0;
                object.product = "";
            }
            if (message.price != null && message.hasOwnProperty("price"))
                object.price = message.price;
            if (message.product != null && message.hasOwnProperty("product"))
                object.product = message.product;
            return object;
        };

        /**
         * Converts this CartItemMessage to JSON.
         * @function toJSON
         * @memberof TransactionMessage.CartItemMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CartItemMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CartItemMessage;
    })();

    /**
     * Payment enum.
     * @name TransactionMessage.Payment
     * @enum {number}
     * @property {number} CASH=0 CASH value
     * @property {number} BON=1 BON value
     * @property {number} SUM_UP=2 SUM_UP value
     * @property {number} VOUCHER=3 VOUCHER value
     * @property {number} FREE_CREW=4 FREE_CREW value
     * @property {number} FREE_BAND=5 FREE_BAND value
     */
    TransactionMessage.Payment = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "CASH"] = 0;
        values[valuesById[1] = "BON"] = 1;
        values[valuesById[2] = "SUM_UP"] = 2;
        values[valuesById[3] = "VOUCHER"] = 3;
        values[valuesById[4] = "FREE_CREW"] = 4;
        values[valuesById[5] = "FREE_BAND"] = 5;
        return values;
    })();

    return TransactionMessage;
})();

module.exports = $root;
