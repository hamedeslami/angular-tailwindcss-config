import {
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { columns, users } from '@features/dashboard/data/users-items.data';
import { AvatarText } from '@shared/components/avatar/avatar-text/avatar-text';
import { Badge } from '@shared/components/badge/badge';
import { Modal } from '@shared/components/modal/modal';
import { Pagination } from '@shared/components/pagination/pagination';
import { Table } from '@shared/components/table/table';

@Component({
  selector: 'app-users',
  imports: [Table, Badge, AvatarText, Modal, Pagination],
  templateUrl: './users.html',
})
export class Users {
  isOpen = false;
  usersList = users;
  userListCol = columns

  templateMap: { [key: string]: any } = {};
  @ViewChild('userTemplate', { static: true }) userTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true })
  statusTemplate!: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: true })
  actionTemplate!: TemplateRef<any>;

  ngOnInit() {
    this.templateMap = {
      userTemplate: { template: this.userTemplate },
      statusTemplate: { template: this.statusTemplate },
      actionTemplate: { template: this.actionTemplate },
    };
  }

  getBadgeColor(type: string): 'success' | 'warning' | 'error' {
    if (type === 'Complete') return 'success';
    if (type === 'Pending') return 'warning';
    return 'error';
  }

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }
}
