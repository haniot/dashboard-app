import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
/**
 * Use to exchande the date between the data picker and other components
 * It is the output formate of the date
 */
export interface OutputDate {
  fromDate : NgbDateStruct,
  toDate: NgbDateStruct
}