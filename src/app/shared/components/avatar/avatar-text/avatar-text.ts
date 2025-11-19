import { CommonModule } from '@angular/common';
import { Component, computed, input, Input } from '@angular/core';

@Component({
  selector: 'app-avatar-text',
  imports: [CommonModule],
  templateUrl: './avatar-text.html',
})
export class AvatarText {
  name = input<string>('');
  className = input<string>('');

  initials = computed(() => {
    const nameValue = this.name();
    if (!nameValue) return '';
    return nameValue
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  colorClass = computed(() => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-pink-100 text-pink-600',
      'bg-cyan-100 text-cyan-600',
      'bg-orange-100 text-orange-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-yellow-100 text-yellow-600',
      'bg-red-100 text-red-600',
    ];
    const nameValue = this.name();
    if (!nameValue) return colors[0];
    
    const index = nameValue
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  });
}
