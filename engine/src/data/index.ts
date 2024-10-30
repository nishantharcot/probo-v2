type UserBalance = {
    balance: number,
    locked: number
}

type StockBalance = {
    [key in 'yes' | 'no']: {
        quantity: number,
        locked: number
    } 
}


export const INR_BALANCES: Map<string, UserBalance> = new Map()
export const ORDERBOOK: Map<string, any> = new Map()
export const STOCK_BALANCES : Map<string, Map<string, StockBalance>> = new Map()