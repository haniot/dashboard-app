export class DataResponse {
    status: string;
    completion_estimate: string;
}

export class DataRequest {
    data_types: Array<string>;
    patients: Array<string>;

    constructor() {
        this.data_types = new Array<string>();
        this.patients = new Array<string>();
    }

}

export class Data extends DataRequest {
    id: string;
    created_at: string;
    total_patients: number;
    file_csv: string;
    file_xls: string;

    constructor() {
        super();
        this.id = '';
        this.created_at = '';
        this.total_patients = 0;
        this.file_csv = '';
        this.file_xls = '';
    }
}
