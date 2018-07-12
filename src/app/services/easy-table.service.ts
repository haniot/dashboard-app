import { Injectable } from '@angular/core';
//import { Config } from ngx-easy-table/model/config';

@Injectable()
export class ConfigService {
  public static config: any = {
    searchEnabled: false,
    headerEnabled: true,
    orderEnabled: true,
    globalSearchEnabled: true,
    paginationEnabled: true,
    exportEnabled: false,
    clickEvent: true,
    selectRow: false,
    selectCol: false,
    selectCell: false,
    rows: 10,
    additionalActions: false,
    serverPagination: false,
    isLoading: false,
    detailsTemplate: false,
    groupRows: false,
    paginationRangeEnabled: true,
    collapseAllRows: false,
    checkboxes: false,
    resizeColumn: true,
    fixedColumnWidth: false,
    horizontalScroll: false,
    tableLayout: {
      style: 'tiny', // or big or tiny
      theme: 'normal', // or dark
      border: true,
      hover: true,
      striped: false,
    }
  };
}