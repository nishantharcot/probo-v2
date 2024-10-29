import { REQUEST_TYPES } from "./index"

type USER_CREATED = 'USER_CREATED'


export type MessageToApi = {
    type: USER_CREATED,
    payload: {
        message: string
    }
}