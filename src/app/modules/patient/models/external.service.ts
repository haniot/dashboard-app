export enum AccessStatus {
    valid_token = 'valid_token',
    invalid_token = 'invalid_token',
    expired_token = 'expired_token',
    invalid_refresh_token = 'invalid_refresh_token',
    none = 'none'
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
