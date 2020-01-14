export enum AccessStatus {
    VALID_TOKEN = 'valid_token',
    INVALID_TOKEN = 'invalid_token',
    EXPIRED_TOKEN = 'expired_token',
    INVALID_REFRESH_TOKEN = 'invalid_refresh_token',
    NONE = 'none'
}

export class ExternalService {
    /* readonly */
    private readonly _fitbit_status: AccessStatus;
    private readonly _fitbit_last_sync: string;

    get fitbit_status(): AccessStatus {
        return this._fitbit_status
    }

    get fitbit_last_sync(): string {
        return this._fitbit_last_sync
    }

}
