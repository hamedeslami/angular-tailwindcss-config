import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { LangService } from '@core/services/lang.service';
import { TextService } from '@core/services/text.service';
import { LAYOUT_TEXTS } from '@features/dashboard/content/layout.text';
import { Dropdown } from '@shared/components/dropdown/dropdown';


@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [CommonModule, Dropdown],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notification-dropdown.html'
})
export class NotificationDropdown {
  isOpen = false;
  notifying = true;

  private textService = inject(TextService);
  readonly texts = this.textService.getTexts(LAYOUT_TEXTS, 'notification');

  private langService = inject(LangService);
  readonly isRtl = this.langService.dir();

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.notifying = false;
  }

  closeDropdown() {
    this.isOpen = false;
  }
}