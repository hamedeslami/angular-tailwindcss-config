import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

type AvatarSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
type AvatarStatus = 'online' | 'offline' | 'busy' | 'none';


@Component({
  selector: 'app-avatar',
  imports: [CommonModule],
  templateUrl: './avatar.html'
})
export class Avatar {
  src = input<string>('');
  alt = input<string>('User Avatar');
  size = input<AvatarSize>('medium');
  status = input<AvatarStatus>('none');


  sizeClasses: Record<AvatarSize, string> = {
    xsmall: 'h-6 w-6 max-w-6',
    small: 'h-8 w-8 max-w-8',
    medium: 'h-10 w-10 max-w-10',
    large: 'h-12 w-12 max-w-12',
    xlarge: 'h-14 w-14 max-w-14',
    xxlarge: 'h-16 w-16 max-w-16',
  };

  statusSizeClasses: Record<AvatarSize, string> = {
    xsmall: 'h-1.5 w-1.5 max-w-1.5',
    small: 'h-2 w-2 max-w-2',
    medium: 'h-2.5 w-2.5 max-w-2.5',
    large: 'h-3 w-3 max-w-3',
    xlarge: 'h-3.5 w-3.5 max-w-3.5',
    xxlarge: 'h-4 w-4 max-w-4',
  };

  statusColorClasses: Record<AvatarStatus, string> = {
    online: 'bg-success-500',
    offline: 'bg-error-400',
    busy: 'bg-warning-500',
    none: '',
  };

  avatarClass = computed(() => this.sizeClasses[this.size()]);

  statusClass = computed(() => {
    const status = this.status();
    if (status === 'none') return '';

    return `${this.statusSizeClasses[this.size()]} ${this.statusColorClasses[status]}`;
  });

}
