import { Component, computed, Input, signal, TemplateRef, ViewChild } from '@angular/core';
import { AvatarText } from '@shared/components/avatar/avatar-text/avatar-text';
import { Badge } from '@shared/components/badge/badge';
import { BasicTable } from '@shared/components/basic-table/basic-table';






@Component({
  selector: 'app-users',
  imports: [BasicTable, Badge, AvatarText],
  templateUrl: './users.html',
})
export class Users {
  tableRowData = [
    {
      id: 'DE124321',
      user: { initials: 'ح ا', name: 'حامد اسلامی', email: 'johndoe@gmail.com' },
      avatarColor: 'brand',
      product: { name: 'Software License', price: '$18,50.34', purchaseDate: '2024-06-15' },
      status: { type: 'Complete', text: 'فعال' },
      actions: { delete: true },
    },
    {
      id: 'DE124322',
      user: { initials: 'CD', name: 'Jane Smith', email: 'janesmith@gmail.com' },
      avatarColor: 'brand',
      product: { name: 'Cloud Hosting', price: '$12,99.00', purchaseDate: '2024-06-18' },
      status: { type: 'Pending', text: 'در انتظار تایید' },
      actions: { delete: true },
    },
    {
      id: 'DE124323',
      user: { initials: 'EF', name: 'Michael Brown', email: 'michaelbrown@gmail.com' },
      avatarColor: 'brand',
      product: { name: 'Web Domain', price: '$9,50.00', purchaseDate: '2024-06-20' },
      status: { type: 'Cancel', text: 'غیرفعال' },
      actions: { delete: true },
    },
    {
      id: 'DE124324',
      user: { initials: 'GH', name: 'Alice Johnson', email: 'alicejohnson@gmail.com' },
      avatarColor: 'brand',
      product: { name: 'SSL Certificate', price: '$2,30.45', purchaseDate: '2024-06-25' },
      status: { type: 'Pending', text: 'در انتظار تایید' },
      actions: { delete: true },
    },
    {
      id: 'DE124325',
      user: { initials: 'IJ', name: 'Robert Lee', email: 'robertlee@gmail.com' },
      avatarColor: 'brand',
      product: { name: 'Premium Support', price: '$15,20.00', purchaseDate: '2024-06-30' },
      status: { type: 'Complete', text: 'فعال' },
      actions: { delete: true },
    },
  ];

  columns: any[] = [];
  templateMap: { [key: string]: any } = {};

  @ViewChild('userTemplate', { static: true }) userTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;

  ngOnInit() {
    this.templateMap = {
      'userTemplate': { template: this.userTemplate },
      'statusTemplate': { template: this.statusTemplate },
      'actionTemplate': { template: this.actionTemplate }
    };

    this.columns = [
      { key: 'id', label: 'Deal ID' },
      { key: 'user', label: 'Customer', templateName: 'userTemplate' },
      { key: 'product.name', label: 'Product/Service' },
      { key: 'product.price', label: 'Deal Value' },
      { key: 'product.purchaseDate', label: 'Close Date' },
      { key: 'status', label: 'Status', templateName: 'statusTemplate' },
      { key: 'actions', label: 'Actions', templateName: 'actionTemplate' },
    ];
  }

  getBadgeColor(type: string): 'success' | 'warning' | 'error' {
    if (type === 'Complete') return 'success';
    if (type === 'Pending') return 'warning';
    return 'error';
  }
}