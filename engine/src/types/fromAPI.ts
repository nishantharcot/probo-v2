import { REQUEST_TYPES } from "./index"

export type MessageFromApi = {
    type: REQUEST_TYPES,
    data: {
        userId: string
    }
}