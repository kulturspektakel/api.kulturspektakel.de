import * as $protobuf from "protobufjs";
/** Properties of a ConfigMessage. */
export interface IConfigMessage {

    /** ConfigMessage name */
    name: string;

    /** ConfigMessage product1 */
    product1?: (string|null);

    /** ConfigMessage price1 */
    price1?: (number|null);

    /** ConfigMessage product2 */
    product2?: (string|null);

    /** ConfigMessage price2 */
    price2?: (number|null);

    /** ConfigMessage product3 */
    product3?: (string|null);

    /** ConfigMessage price3 */
    price3?: (number|null);

    /** ConfigMessage product4 */
    product4?: (string|null);

    /** ConfigMessage price4 */
    price4?: (number|null);

    /** ConfigMessage product5 */
    product5?: (string|null);

    /** ConfigMessage price5 */
    price5?: (number|null);

    /** ConfigMessage product6 */
    product6?: (string|null);

    /** ConfigMessage price6 */
    price6?: (number|null);

    /** ConfigMessage product7 */
    product7?: (string|null);

    /** ConfigMessage price7 */
    price7?: (number|null);

    /** ConfigMessage product8 */
    product8?: (string|null);

    /** ConfigMessage price8 */
    price8?: (number|null);

    /** ConfigMessage product9 */
    product9?: (string|null);

    /** ConfigMessage price9 */
    price9?: (number|null);

    /** ConfigMessage checksum */
    checksum: number;

    /** ConfigMessage listId */
    listId: number;
}

/** Represents a ConfigMessage. */
export class ConfigMessage implements IConfigMessage {

    /**
     * Constructs a new ConfigMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: IConfigMessage);

    /** ConfigMessage name. */
    public name: string;

    /** ConfigMessage product1. */
    public product1: string;

    /** ConfigMessage price1. */
    public price1: number;

    /** ConfigMessage product2. */
    public product2: string;

    /** ConfigMessage price2. */
    public price2: number;

    /** ConfigMessage product3. */
    public product3: string;

    /** ConfigMessage price3. */
    public price3: number;

    /** ConfigMessage product4. */
    public product4: string;

    /** ConfigMessage price4. */
    public price4: number;

    /** ConfigMessage product5. */
    public product5: string;

    /** ConfigMessage price5. */
    public price5: number;

    /** ConfigMessage product6. */
    public product6: string;

    /** ConfigMessage price6. */
    public price6: number;

    /** ConfigMessage product7. */
    public product7: string;

    /** ConfigMessage price7. */
    public price7: number;

    /** ConfigMessage product8. */
    public product8: string;

    /** ConfigMessage price8. */
    public price8: number;

    /** ConfigMessage product9. */
    public product9: string;

    /** ConfigMessage price9. */
    public price9: number;

    /** ConfigMessage checksum. */
    public checksum: number;

    /** ConfigMessage listId. */
    public listId: number;

    /**
     * Creates a new ConfigMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ConfigMessage instance
     */
    public static create(properties?: IConfigMessage): ConfigMessage;

    /**
     * Encodes the specified ConfigMessage message. Does not implicitly {@link ConfigMessage.verify|verify} messages.
     * @param message ConfigMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IConfigMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ConfigMessage message, length delimited. Does not implicitly {@link ConfigMessage.verify|verify} messages.
     * @param message ConfigMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IConfigMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ConfigMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ConfigMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ConfigMessage;

    /**
     * Decodes a ConfigMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ConfigMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ConfigMessage;

    /**
     * Verifies a ConfigMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ConfigMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ConfigMessage
     */
    public static fromObject(object: { [k: string]: any }): ConfigMessage;

    /**
     * Creates a plain object from a ConfigMessage message. Also converts values to other types if specified.
     * @param message ConfigMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ConfigMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ConfigMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a TransactionMessage. */
export interface ITransactionMessage {

    /** TransactionMessage id */
    id: string;

    /** TransactionMessage deviceId */
    deviceId: string;

    /** TransactionMessage mode */
    mode: TransactionMessage.Mode;

    /** TransactionMessage deviceTime */
    deviceTime: number;

    /** TransactionMessage card */
    card?: (string|null);

    /** TransactionMessage deposit */
    deposit: number;

    /** TransactionMessage total */
    total: number;

    /** TransactionMessage cartItems */
    cartItems?: (TransactionMessage.ICartItemMessage[]|null);

    /** TransactionMessage payment */
    payment: TransactionMessage.Payment;

    /** TransactionMessage listId */
    listId?: (number|null);
}

/** Represents a TransactionMessage. */
export class TransactionMessage implements ITransactionMessage {

    /**
     * Constructs a new TransactionMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: ITransactionMessage);

    /** TransactionMessage id. */
    public id: string;

    /** TransactionMessage deviceId. */
    public deviceId: string;

    /** TransactionMessage mode. */
    public mode: TransactionMessage.Mode;

    /** TransactionMessage deviceTime. */
    public deviceTime: number;

    /** TransactionMessage card. */
    public card: string;

    /** TransactionMessage deposit. */
    public deposit: number;

    /** TransactionMessage total. */
    public total: number;

    /** TransactionMessage cartItems. */
    public cartItems: TransactionMessage.ICartItemMessage[];

    /** TransactionMessage payment. */
    public payment: TransactionMessage.Payment;

    /** TransactionMessage listId. */
    public listId: number;

    /**
     * Creates a new TransactionMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns TransactionMessage instance
     */
    public static create(properties?: ITransactionMessage): TransactionMessage;

    /**
     * Encodes the specified TransactionMessage message. Does not implicitly {@link TransactionMessage.verify|verify} messages.
     * @param message TransactionMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ITransactionMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified TransactionMessage message, length delimited. Does not implicitly {@link TransactionMessage.verify|verify} messages.
     * @param message TransactionMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ITransactionMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a TransactionMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns TransactionMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): TransactionMessage;

    /**
     * Decodes a TransactionMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns TransactionMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): TransactionMessage;

    /**
     * Verifies a TransactionMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a TransactionMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns TransactionMessage
     */
    public static fromObject(object: { [k: string]: any }): TransactionMessage;

    /**
     * Creates a plain object from a TransactionMessage message. Also converts values to other types if specified.
     * @param message TransactionMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: TransactionMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this TransactionMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace TransactionMessage {

    /** Mode enum. */
    enum Mode {
        TIME_ENTRY = 0,
        TOP_UP = 1,
        CHARGE = 2,
        CASHOUT = 3,
        INIT_CARD = 4
    }

    /** Properties of a CartItemMessage. */
    interface ICartItemMessage {

        /** CartItemMessage price */
        price: number;

        /** CartItemMessage product */
        product: string;
    }

    /** Represents a CartItemMessage. */
    class CartItemMessage implements ICartItemMessage {

        /**
         * Constructs a new CartItemMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: TransactionMessage.ICartItemMessage);

        /** CartItemMessage price. */
        public price: number;

        /** CartItemMessage product. */
        public product: string;

        /**
         * Creates a new CartItemMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CartItemMessage instance
         */
        public static create(properties?: TransactionMessage.ICartItemMessage): TransactionMessage.CartItemMessage;

        /**
         * Encodes the specified CartItemMessage message. Does not implicitly {@link TransactionMessage.CartItemMessage.verify|verify} messages.
         * @param message CartItemMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: TransactionMessage.ICartItemMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CartItemMessage message, length delimited. Does not implicitly {@link TransactionMessage.CartItemMessage.verify|verify} messages.
         * @param message CartItemMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: TransactionMessage.ICartItemMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CartItemMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CartItemMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): TransactionMessage.CartItemMessage;

        /**
         * Decodes a CartItemMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CartItemMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): TransactionMessage.CartItemMessage;

        /**
         * Verifies a CartItemMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CartItemMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CartItemMessage
         */
        public static fromObject(object: { [k: string]: any }): TransactionMessage.CartItemMessage;

        /**
         * Creates a plain object from a CartItemMessage message. Also converts values to other types if specified.
         * @param message CartItemMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: TransactionMessage.CartItemMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CartItemMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Payment enum. */
    enum Payment {
        CASH = 0,
        BON = 1,
        SUM_UP = 2,
        VOUCHER = 3,
        FREE_CREW = 4,
        FREE_BAND = 5
    }
}
