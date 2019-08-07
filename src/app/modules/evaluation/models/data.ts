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
}
