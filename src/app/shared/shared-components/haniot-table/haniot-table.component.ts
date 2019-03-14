import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';

import { AuthService } from 'app/security/auth/services/auth.service';
import { AdminService } from 'app/modules/admin/services/admin.service';
import { HealthProfessionalService } from 'app/modules/admin/services/health-professional.service';
import { UserService } from 'app/modules/admin/services/users.service';
import { IUser } from 'app/shared/shared-models/users.models';

@Component({
  selector: 'haniot-table',
  templateUrl: './haniot-table.component.html',
  styleUrls: ['./haniot-table.component.scss']
})
export class HaniotTableComponent {

  // MatPaginator Inputs
  @Input() length: number;
  @Input() pageSize: number;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  @Input() list: Array<IUser>;
  @Output() onremove = new EventEmitter();
  @Input() userType: string;// Admin or HealthProfessional
  @Output() onedit = new EventEmitter();
  @Output() pagination = new EventEmitter();

  private search: string;
  private searchTime;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private healthService: HealthProfessionalService,
    private userService: UserService,
    private toastr: ToastrService) { }

  verifySameUser(user: any): boolean {
    return user.id == this.authService.decodeToken().sub;
  }

  removeUser(id: string) {
    this.userService.removeUser(id)
      .then(() => {
        this.onremove.emit();
        this.toastr.info('Usuário excluido com sucesso!');
      })
      .catch(error => {
        this.toastr.error('Não foi possível excluir usuário!');
      });

  }

  editUser(id: string) {
    this.userService.getUserById(id)
      .then((user) => {
        this.onedit.emit(user);
      })
      .catch(error => {
        this.toastr.error('Não foi possível buscar usuário!');
      });

  }

  searchOnSubmit() {
    clearInterval(this.searchTime);
    this.searchTime = setTimeout(() => {
      this.getAllUsers().
        then(users => {
          this.list = users;
          this.list = this.list.filter((user) => {
            return user.name.search(this.search) != -1;
          });
        })
        .catch();
    }, 200);

  }

  getAllUsers(): Promise<Array<IUser>> {
    if (this.search === '') {
      const page = this.pageEvent && this.pageEvent.pageIndex ? this.pageEvent.pageIndex : 0;
      const limit = this.pageEvent && this.pageEvent.pageSize ? this.pageEvent.pageSize : 5;
      switch (this.userType) {
        case 'Admin':
          return this.adminService.getAll(page + 1, limit);
        case 'HealthProfessional':
          return this.healthService.getAll(page + 1, limit);
      }
    }

    switch (this.userType) {
      case 'Admin':
        return this.adminService.getAll();
      case 'HealthProfessional':
        return this.healthService.getAll();
    }

  }

  clickPagination(event) {

    this.pageEvent = event;

    const eventPagination = { page: this.pageEvent.pageIndex + 1, limit: this.pageEvent.pageSize };

    this.pagination.emit(eventPagination);
  }

  getIndex(index: number): number {
    if(this.search){
      return null;
    }
    const size = this.pageEvent && this.pageEvent.pageSize ? this.pageEvent.pageSize : this.pageSize;

    if (this.pageEvent && this.pageEvent.pageIndex) {
      return index + 1 + size * this.pageEvent.pageIndex;
    }
    else {
      return index + Math.pow(size, 1 - 1);
    }
  }
}
