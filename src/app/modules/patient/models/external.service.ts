export enum AccessStatus {
    valid_token = 'valid_token',
    invalid_token = 'invalid_token',
    expired_token = 'expired_token',
    invalid_refresh_token = 'invalid_refresh_token',
    none = 'none'
}

export class ExternalService {
    /* readonly */
    /* TODO: adicionar readonly */
    private _fitbit_status: AccessStatus;
    private _fitbit_last_sync: string;

    /* TODO: remover */
    constructor() {
        this._fitbit_status = AccessStatus.expired_token;
        this._fitbit_last_sync = new Date().toISOString();
    }

    get fitbit_status(): AccessStatus {
        return this._fitbit_status
    }

    get fitbit_last_sync(): string {
        return this._fitbit_last_sync
    }

}

export class SynchronizeLog {
    private _steps: number;
    private _calories: number;
    private _active_minutes: number;
    private _lightly_active_minutes: number;
    private _sedentary_minutes: number;

    get steps(): number {
        return this._steps
    }

    set steps(value: number) {
        this._steps = value
    }

    get calories(): number {
        return this._calories
    }

    set calories(value: number) {
        this._calories = value
    }

    get active_minutes(): number {
        return this._active_minutes
    }

    set active_minutes(value: number) {
        this._active_minutes = value
    }

    get lightly_active_minutes(): number {
        return this._lightly_active_minutes
    }

    set lightly_active_minutes(value: number) {
        this._lightly_active_minutes = value
    }

    get sedentary_minutes(): number {
        return this._sedentary_minutes
    }

    set sedentary_minutes(value: number) {
        this._sedentary_minutes = value
    }
}

export class SynchronizeData {
    private _activities: number;
    private _sleep: number;
    private _weights: number;
    private _logs: SynchronizeLog;

    get activities(): number {
        return this._activities
    }

    set activities(value: number) {
        this._activities = value
    }

    get sleep(): number {
        return this._sleep
    }

    set sleep(value: number) {
        this._sleep = value
    }

    get weights(): number {
        return this._weights
    }

    set weights(value: number) {
        this._weights = value
    }

    get logs(): SynchronizeLog {
        return this._logs
    }

    set logs(value: SynchronizeLog) {
        this._logs = value
    }
}

export class FitBitClient {
    private _client_id: string;
    private _client_secret: string;

    get client_id(): string {
        return this._client_id
    }

    set client_id(value: string) {
        this._client_id = value
    }

    get client_secret(): string {
        return this._client_secret
    }

    set client_secret(value: string) {
        this._client_secret = value
    }
}

export class OAuthUser {
    private _access_token: string;
    private _refresh_token: string;

    get access_token(): string {
        return this._access_token
    }

    set access_token(value: string) {
        this._access_token = value
    }

    get refresh_token(): string {
        return this._refresh_token
    }

    set refresh_token(value: string) {
        this._refresh_token = value
    }
}
