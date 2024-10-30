export const CREATE_USER = 'CREATE_USER'

export type API_TO_ENGINE_ORDER_TYPES = {
    type: "CREATE_USER",
    data: {
        userId: string,
    }
} | {
    type: "CREATE_SYMBOL",
    data: {
        stockSymbol: string,
    }
} | {
    type: "GET_ORDERBOOK",
}  | {
    type: "GET_INR_BALANCES",
} | {
    type: "GET_STOCK_BALANCES",
} | {
    type: "RESET_DATA",
} | {
    type: 'ONRAMP_INR',
    data: {
        userId: string,
        amount: number
    }
} | {
    type: "GET_USER_BALANCE",
    data: {
        userId: string,
    }
}

export type ENGINE_TO_API_RESPONSE_TYPES = {
    payload: {
        message: string
    }
}