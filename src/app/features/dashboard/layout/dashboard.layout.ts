import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarService } from '../services/sidebar.service';
import { HeaderLayout } from './header/header.layout';
import { SidebarLayout } from './sidebar/sidebar.layout';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, HeaderLayout, SidebarLayout, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.layout.html'
})
export class DashboardLayout {
  readonly isExpanded$;
  readonly isHovered$;
  readonly isMobileOpen$;

  constructor(public sidebarService: SidebarService) {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isHovered$ = this.sidebarService.isHovered$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  get containerClasses() {
    return [
      'flex-1',
      'transition-all',
      'duration-300',
      'ease-in-out',
      (this.isExpanded$ || this.isHovered$) ? 'xl:ml-[290px]' : 'xl:ml-[90px]',
      this.isMobileOpen$ ? 'ml-0' : ''
    ];
  }
}