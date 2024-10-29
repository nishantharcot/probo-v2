export const CREATE_USER = 'CREATE_USER'

export type API_TO_ENGINE_ORDER_TYPES = {
    type: "CREATE_USER",
    data: {
        userId: string,
    }
}

export type ENGINE_TO_API_RESPONSE_TYPES = {
    payload: {
        message: string
    }
}