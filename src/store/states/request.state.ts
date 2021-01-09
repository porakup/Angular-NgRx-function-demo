export interface RequestState {
    request: number;
    message: string;
    loginMessage: string;
}

export const initialRequestState: RequestState = {
    request: 0,
    message: null,
    loginMessage: null
};
