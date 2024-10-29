type UserBalance = {
    balance: number,
    locked: number
}


export const INR_BALANCES: Map<string, UserBalance> = new Map()
export const ORDERBOOK = {}
export const STOCK_BALANCES = {}