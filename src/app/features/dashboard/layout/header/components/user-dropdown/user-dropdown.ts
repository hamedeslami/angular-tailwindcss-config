import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Dropdown } from '@shared/components/dropdown/dropdown';
import { TextService } from '@core/services/text.service';
import { LAYOUT_TEXTS } from '@features/dashboard/content/layout.text';
import { AvatarText } from '@shared/components/avatar/avatar-text/avatar-text';


@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.html',
  imports:[CommonModule,RouterModule,Dropdown, AvatarText]
})
export class UserDropdown {
  isOpen = false;

  private textService = inject(TextService);
  readonly texts = this.textService.getTexts(LAYOUT_TEXTS, 'user');

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }
}