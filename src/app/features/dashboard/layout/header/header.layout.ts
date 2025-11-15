import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { SidebarService } from '@features/dashboard/services/sidebar.service';
import { ThemeToggleButton } from './components/theme-toggle-button/theme-toggle-button';
import { NotificationDropdown } from './components/notification-dropdown/notification-dropdown';
import { UserDropdown } from './components/user-dropdown/user-dropdown';
import { TextService } from '@core/services/text.service';
import { LAYOUT_TEXTS } from '@features/dashboard/content/layout.text';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ThemeToggleButton, NotificationDropdown, UserDropdown],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.layout.html'
})
export class HeaderLayout {
  private textService = inject(TextService);
  readonly texts = this.textService.getTexts(LAYOUT_TEXTS, 'search');

  private platform = navigator.platform.toLowerCase();

  isApplicationMenuOpen = false;
  readonly isMobileOpen$;

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(public sidebarService: SidebarService) {
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  handleToggle() {
    if (window.innerWidth >= 1280) {
      this.sidebarService.toggleExpanded();
    } else {
      this.sidebarService.toggleMobileOpen();
    }
  }

  toggleApplicationMenu() {
    this.isApplicationMenuOpen = !this.isApplicationMenuOpen;
  }

  ngAfterViewInit() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.searchInput?.nativeElement.focus();
    }
  };

  get getPlatform() {
    if (this.platform.includes('win')) {
      return 'ctrl+k'
    } else if (this.platform.includes('mac')) {
      return '⌘+k'
    } else {
      return ''
    }
  }
}