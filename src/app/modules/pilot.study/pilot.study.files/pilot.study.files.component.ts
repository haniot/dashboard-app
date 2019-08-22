import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PageEvent } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { PilotStudy } from '../models/pilot.study';
import { ModalService } from '../../../shared/shared.components/haniot.modal/service/modal.service';
import { PilotStudyService } from '../services/pilot.study.service';
import { DateRange } from '../models/range-date';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { ConfigurationBasic, PaginatorIntlService } from '../../config.matpaginator'
import { Data, DataRequest, DataResponse } from '../../evaluation/models/data'
import { MeasurementService } from '../../measurement/services/measurement.service'
import { EnumMeasurementType } from '../../measurement/models/measurement'
import { NutritionalQuestionnairesService } from '../../habits/services/nutritional.questionnaires.service'
import { QuestionnairesCategory, QuestionnaireType } from '../../habits/models/questionnaire.type'
import { Patient } from '../../patient/models/patient'
import { PatientService } from '../../patient/services/patient.service'
import { MeasurementType } from '../../measurement/models/measurement.types'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'pilot-study-files',
    templateUrl: './pilot.study.files.component.html',
    styleUrls: ['./pilot.study.files.component.scss']
})
export class PilotStudyFilesComponent implements OnInit, OnChanges {
    LengthDataTypes = 2;
    dataTypeIndexs: Array<number> = new Array<number>(this.LengthDataTypes);
    @Input() pilotStudy: PilotStudy;
    /* Paging Settings */
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    listOfFiles: Array<Data>;
    listOfDataTypes: Array<{ measurement_type: Array<EnumMeasurementType>, questionnaires: Array<string> }>;
    search: DateRange;
    maxDate: Date;
    searchTime;
    lastFile: Data;
    generatingFile: boolean;
    listOfFilesIsEmpty: boolean;
    dataResponse: DataResponse;
    measurementsTypeOptions: Array<MeasurementType>
    questionnaireTypeOptions: QuestionnaireType;
    checkSelectMeasurementTypeAll: boolean;
    listCheckMeasurementTypes: Array<boolean>;
    checkSelectQuestionnaireTypeAll: boolean;
    listCheckQuestionnaireNutritionalTypes: Array<boolean>;
    listCheckQuestionnaireOdontologicalTypes: Array<boolean>;
    listOfPatients: Array<Patient>;
    listOfPatientsAux: Array<Patient>;
    checkSelectPatientsAll: boolean;
    listCheckPatients: Array<boolean>;
    listOfPatientsIsEmpty: boolean;
    patientPageSizeOptions: number[];
    patientPageEvent: PageEvent;
    patientPage: number;
    patientLimit: number;
    patientLength: number;

    constructor(
        private pilotService: PilotStudyService,
        private paginatorService: PaginatorIntlService,
        private toastService: ToastrService,
        private modalService: ModalService,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService,
        private sanitizer: DomSanitizer,
        private measurementService: MeasurementService,
        private questionnaireService: NutritionalQuestionnairesService,
        private patientService: PatientService
    ) {
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.generatingFile = false;
        this.pilotStudy = new PilotStudy();
        this.listOfFiles = new Array<Data>();
        this.listOfFilesIsEmpty = false;
        this.search = new DateRange();
        this.maxDate = new Date();
        this.dataResponse = new DataResponse();
        this.checkSelectMeasurementTypeAll = false;
        this.listCheckMeasurementTypes = new Array<boolean>();
        this.questionnaireTypeOptions = new QuestionnaireType();
        this.listCheckQuestionnaireNutritionalTypes = new Array<boolean>();
        this.listCheckQuestionnaireOdontologicalTypes = new Array<boolean>();
        this.checkSelectQuestionnaireTypeAll = false;
        this.listOfPatients = new Array<Patient>();
        this.checkSelectPatientsAll = false;
        this.listCheckPatients = new Array<boolean>();
        this.listOfPatientsIsEmpty = false;
        this.patientPage = PaginatorConfig.page;
        this.patientPageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.patientLimit = PaginatorConfig.limit;
        this.listOfDataTypes = new Array<{ measurement_type: Array<EnumMeasurementType>, questionnaires: Array<string> }>();
    }

    ngOnInit() {
        this.getAllFiles();
    }

    getAllFiles() {
        if (this.pilotStudy && this.pilotStudy.id) {
            this.listOfFiles = new Array<Data>();
            this.pilotService.getAllFiles(this.pilotStudy.id, this.page, this.limit, this.search)
                .then(httpResponse => {
                    this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                    this.listOfFiles = httpResponse.body;
                    this.lastFile = this.listOfFiles[0];
                    this.listOfFilesIsEmpty = !this.listOfFiles.length;
                    this.seperateDataTypes();
                })
                .catch(() => {
                    this.listOfFilesIsEmpty = true;
                });
        }
    }

    clickPagination(event) {
        this.pageEvent = event;
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.getAllFiles();
    }

    clickPatientPagination(event) {
        this.patientPageEvent = event;
        this.patientPage = event.pageIndex + 1;
        this.patientLimit = event.pageSize;
        this.loadListPatientAux();
    }

    closeModalComfimation() {
        this.modalService.close('modalConfirmation');
    }

    getIndex(index: number): number {
        if (this.search) {
            return null;
        }
        return this.paginatorService.getIndex(this.pageEvent, this.limit, index);
    }


    generateFile(stepper) {
        this.closeModalFileConfig();
        this.generatingFile = true;
        const body = this.buildBody();
        this.pilotService.generateNewFile(this.pilotStudy, body)
            .then(response => {
                this.dataResponse = response;
                this.openModalFileInProcessing();
                this.generatingFile = false;
                this.closeAndResetConfigurations(stepper);
            })
            .catch(error => {
                    this.generatingFile = false;
                    if (error.code === 404 && error.message === 'PILOTSTUDY NOT FOUND') {
                        this.toastService.error(this.translateService.instant('TOAST-MESSAGES.STUDY-NOT-FOUND'));
                    } else if (error.code === 404 && error.message === 'HEALTHPROFESSIONALID NOT FOUND') {
                        this.toastService.error(this.translateService.instant('TOAST-MESSAGES.HEALTHPROFESSIONALS-NOTFOUND'));
                    } else if (error.code === 400 && error.message === 'PILOTSTUDY EMPTY') {
                        this.toastService.error(this.translateService.instant('TOAST-MESSAGES.STUDY-EMPTY'));
                    } else if (error.code === 400) {
                        this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PATIENT-ERROR'));
                    } else {
                        this.toastService.error(this.translateService.instant('TOAST-MESSAGES.DATA-NOT-SOLICITED'));
                    }
                }
            )
    }

    buildBody(): DataRequest {
        const dataRequest = new DataRequest();
        this.listCheckMeasurementTypes.forEach((item, index) => {
            if (item) {
                dataRequest.data_types.push(this.measurementsTypeOptions[index].id);
            }
        })
        this.listCheckQuestionnaireOdontologicalTypes.forEach((item, index) => {
            if (item) {
                dataRequest.data_types.push(this.questionnaireTypeOptions.odontological[index].id);
            }
        })
        this.listCheckQuestionnaireNutritionalTypes.forEach((item, index) => {
            if (item) {
                dataRequest.data_types.push(this.questionnaireTypeOptions.nutritional[index].id);
            }
        })
        if (!this.checkSelectPatientsAll) {
            this.listCheckPatients.forEach((item, index) => {
                if (item) {
                    dataRequest.patients.push(this.listOfPatients[index].id);
                }
            })
        }
        return dataRequest;
    }


    openModalFileConfig() {
        this.loadMeasurementsTypes()
            .then(() => {
                this.modalService.open('modalFileConfig');
            })
            .catch();
        this.loadQuestionnaireTypes();
        this.loadPatients();

    }

    closeModalFileConfig() {
        this.modalService.close('modalFileConfig');
    }

    closeAndResetConfigurations(stepper): void {
        if (stepper) {
            stepper.reset();
        }/* reset all configurations */
        this.checkSelectMeasurementTypeAll = false;
        this.listCheckMeasurementTypes = new Array<boolean>();
        this.questionnaireTypeOptions = new QuestionnaireType();
        this.listCheckQuestionnaireNutritionalTypes = new Array<boolean>();
        this.listCheckQuestionnaireOdontologicalTypes = new Array<boolean>();
        this.checkSelectQuestionnaireTypeAll = false;
        this.checkSelectPatientsAll = false;
        this.listCheckPatients = new Array<boolean>();
        this.closeModalFileConfig();
    }

    openModalFileInProcessing() {
        this.modalService.open('modalFileInProcessing');
    }

    closeModalFileInProcessing() {
        this.modalService.close('modalFileInProcessing');
    }

    fileGenerated(indexLastData) {
        this.lastFile = this.listOfFiles[indexLastData];
        this.modalService.open('modalFile');
    }

    closeModalFile() {
        this.modalService.close('modalFile');
    }

    cleanDateRange() {
        this.search = new DateRange();
        this.getAllFiles();
    }

    loadMeasurementsTypes(): Promise<any> {
        return this.measurementService.getAllTypes()
            .then(types => {
                this.measurementsTypeOptions = types;
                this.measurementsTypeOptions.forEach(() => {
                    this.listCheckMeasurementTypes.push(false);
                })
            })
            .catch(error => {

            })
    }

    loadQuestionnaireTypes(): void {
        this.questionnaireService.getAllTypes()
            .then(types => {
                this.questionnaireTypeOptions = types;
                this.questionnaireTypeOptions.odontological.forEach(() => {
                    this.listCheckQuestionnaireOdontologicalTypes.push(false);
                })
                this.questionnaireTypeOptions.nutritional.forEach(() => {
                    this.listCheckQuestionnaireNutritionalTypes.push(false);
                })
            })
            .catch()
    }

    loadPatients(): void {
        this.patientService.getAllByPilotStudy(this.pilotStudy.id, this.patientPage, this.patientLimit)
            .then(httpResponse => {
                this.patientLength = parseInt(httpResponse.headers.get('x-total-count'), 10);
                if (!this.patientLength) {
                    this.patientLength = 0;
                }
                if (httpResponse.body && httpResponse.body.length) {
                    this.listOfPatients = httpResponse.body;

                }
                this.listOfPatientsIsEmpty = !(this.listOfPatients && this.listOfPatients.length);
                this.listOfPatients.forEach(() => {
                    this.listCheckPatients.push(false);
                })
                /* Used for paginator*/
                this.loadListPatientAux();

            })
            .catch(() => {
                this.listOfPatientsIsEmpty = true;
            })

    }

    loadListPatientAux(): void {
        this.listOfPatientsAux = new Array<Patient>();
        /* -1 because pagination starts at 1 and indexing starts at 0 */
        for (let i = (this.patientLimit * (this.patientPage - 1)); i < this.patientLimit * this.patientPage; i++) {
            if (i < this.listOfPatients.length) {
                this.listOfPatientsAux.push(this.listOfPatients[i]);
            }
        }
    }

    clickCheckMeasurementTypeAll() {
        this.listCheckMeasurementTypes.forEach((item, index) => {
            this.listCheckMeasurementTypes[index] = !this.checkSelectMeasurementTypeAll;
        });
    }

    clickCheckQuestionnaireTypeAll() {
        this.listCheckQuestionnaireNutritionalTypes.forEach((item, index) => {
            this.listCheckQuestionnaireNutritionalTypes[index] = !this.checkSelectQuestionnaireTypeAll;
        });
        this.listCheckQuestionnaireOdontologicalTypes.forEach((item, index) => {
            this.listCheckQuestionnaireOdontologicalTypes[index] = !this.checkSelectQuestionnaireTypeAll;
        });
    }

    clickCheckPatientsAll() {
        this.listCheckPatients.forEach((item, index) => {
            this.listCheckPatients[index] = !this.checkSelectPatientsAll;
        });
    }

    changeMeasurementTypeCheck(): void {
        const typesSelected = this.listCheckMeasurementTypes.filter(item => item === true);
        this.checkSelectMeasurementTypeAll = this.listCheckMeasurementTypes.length === typesSelected.length;
    }

    changeQuestionnaireTypeCheck(): void {
        const typesNutritionalSelected = this.listCheckQuestionnaireNutritionalTypes.filter(item => item === true);
        const typesOdontologicalSelected = this.listCheckQuestionnaireOdontologicalTypes.filter(item => item === true);

        this.checkSelectQuestionnaireTypeAll =
            (this.listCheckQuestionnaireNutritionalTypes.length + this.listCheckQuestionnaireOdontologicalTypes.length)
            === (typesNutritionalSelected.length + typesOdontologicalSelected.length)
    }

    changePatientCheck(): void {
        const patientsSelected = this.listCheckPatients.filter(item => item === true);

        this.checkSelectPatientsAll = this.listCheckPatients.length === patientsSelected.length;
    }

    anyMeasurementTypeSelected(): boolean {
        const typesSelected = this.listCheckMeasurementTypes.filter(item => item === true);
        return (typesSelected && typesSelected.length > 0);
    }

    anyQuestionnaireSelected(): boolean {
        const typesNutritionalSelected = this.listCheckQuestionnaireNutritionalTypes.filter(item => item === true);
        const typesOdontologicalSelected = this.listCheckQuestionnaireOdontologicalTypes.filter(item => item === true);

        return (
            (typesNutritionalSelected && typesNutritionalSelected.length > 0) ||
            (typesOdontologicalSelected && typesOdontologicalSelected.length > 0)
        );
    }

    anyPatientSelected(): boolean {
        const patientsSelected = this.listCheckPatients.filter(item => item === true);

        return (patientsSelected && patientsSelected.length > 0);
    }

    selectPatient(index: number): void {
        this.listCheckPatients[index] = !this.listCheckPatients[index];
        this.changePatientCheck();
    }

    seperateDataTypes(): void {
        this.listOfFiles.forEach(file => {
            const dataReturn = { measurement_type: [], questionnaires: [] };
            const measurementsAllTypes = Object.keys(EnumMeasurementType);
            const questionnairesAllTypes = Object.keys(QuestionnairesCategory);

            file.data_types.forEach(type => {
                if (measurementsAllTypes.find(measurementType => {
                    return type === measurementType
                })) {
                    dataReturn.measurement_type.push(type);
                }
                if (questionnairesAllTypes.find(questionnaireType => {
                    return type === questionnaireType
                })) {
                    dataReturn.questionnaires.push(type);
                }
            })
            this.listOfDataTypes.push(dataReturn);
        });
    }

    trackById(index, item) {
        return item.id;
    }

    getTrustedUrl(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.pilotStudy.currentValue !== changes.pilotStudy.previousValue) {
            this.getAllFiles();
        }
    }

}
