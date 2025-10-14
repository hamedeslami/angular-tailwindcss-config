import { Component, ElementRef, Input, Renderer2, HostListener, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, input, effect, signal } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  templateUrl: './tooltip.html',
})
export class Tooltip implements AfterViewInit, OnDestroy {

  text = input<string>('');
  position = input<'top' | 'bottom' | 'left' | 'right'>('top');
  margin = input<number>(8);
  maxWidth = input<number>(200);
  arrowSize = input<number>(6);
  theme = input<'light' | 'dark'>('light');
    private isVisible = signal(false);

  private tooltipEl: HTMLElement | null = null;
  private arrowEl: HTMLElement | null = null;

  constructor(private host: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit() {
    this.createTooltip();

    // Reactive effect for text changes
    effect(() => {
      if (!this.tooltipEl) return;
      this.tooltipEl.textContent = this.text();
      if (this.arrowEl) this.tooltipEl.appendChild(this.arrowEl);
    });

    // Reactive effect for theme or maxWidth changes
    effect(() => {
      if (!this.tooltipEl) return;
      this.applyGlassStyle();
      this.tooltipEl.style.maxWidth = `${this.maxWidth()}px`;
    });

    // Reactive effect for visibility
    effect(() => {
      if (!this.tooltipEl) return;
      if (this.isVisible()) this.showTooltip();
      else this.hideTooltip();
    });
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['text'] && this.tooltipEl) {
  //     this.tooltipEl.textContent = this.text();
  //     if (this.arrowEl) this.tooltipEl.appendChild(this.arrowEl);
  //   }
  //   if ((changes['theme'] || changes['maxWidth']) && this.tooltipEl) {
  //     this.applyGlassStyle();
  //   }
  // }
  

  ngOnDestroy() { this.removeTooltip(); }

  private applyGlassStyle() {
    if (!this.tooltipEl) return;

    const bg = this.theme() === 'dark'
      ? 'rgba(31, 41, 55, 0.5)'   // dark glass
      : 'rgba(255, 255, 255, 0.3)'; // light glass

    const border = this.theme() === 'dark'
      ? '1px solid rgba(255,255,255,0.2)'
      : '1px solid rgba(0,0,0,0.1)';

    this.tooltipEl.style.backgroundColor = bg;
    this.tooltipEl.style.backdropFilter = 'blur(8px)';
    this.tooltipEl.style.border = border;
    this.tooltipEl.style.color = this.theme() === 'dark' ? '#fff' : '#111827';
  }

  // Desktop hover
  @HostListener('mouseenter') show() { this.showTooltip(); }
  @HostListener('mouseleave') hide() { this.hideTooltip(); }

  // Mobile tap
  @HostListener('touchstart', ['$event'])
  onTouch(event: TouchEvent) {
    event.preventDefault();
    this.showTooltip();
  }
  @HostListener('touchend') onTouchEnd() { this.hideTooltip(); }

  // Recalculate tooltip on scroll/resize
  @HostListener('window:scroll') @HostListener('window:resize') onWindowChange() { this.updatePosition(); }

  private showTooltip() {
    if (!this.tooltipEl) return;
    this.tooltipEl.style.display = 'block';
    this.tooltipEl.classList.remove('opacity-0', 'scale-95');
    this.tooltipEl.classList.add('opacity-100', 'scale-100');
    this.setPosition();
  }

  private hideTooltip() {
    if (!this.tooltipEl) return;
    this.tooltipEl.classList.remove('opacity-100', 'scale-100');
    this.tooltipEl.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
      if (this.tooltipEl) this.tooltipEl.style.display = 'none';
    }, 150);
  }

  private createTooltip() {
    const tooltipEl = this.renderer.createElement('div') as HTMLElement;
    this.tooltipEl = tooltipEl;

    this.renderer.addClass(tooltipEl, 'rounded-lg');
    this.renderer.addClass(tooltipEl, 'shadow-lg');
    this.renderer.addClass(tooltipEl, 'transition-all');
    this.renderer.addClass(tooltipEl, 'duration-150');
    this.renderer.addClass(tooltipEl, 'opacity-0');
    this.renderer.addClass(tooltipEl, 'scale-95');
    this.renderer.addClass(tooltipEl, 'whitespace-normal');
    this.renderer.addClass(tooltipEl, 'break-words');

    tooltipEl.style.display = 'none';
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.maxWidth = `${this.maxWidth}px`;
    tooltipEl.textContent = this.text();

    this.applyGlassStyle();

    // Arrow
    const arrowEl = this.renderer.createElement('div') as HTMLElement;
    this.arrowEl = arrowEl;
    this.renderer.addClass(arrowEl, 'absolute');

    this.renderer.appendChild(tooltipEl, arrowEl);
    document.body.appendChild(tooltipEl);
  }

  private removeTooltip() {
    if (this.tooltipEl) {
      document.body.removeChild(this.tooltipEl);
      this.tooltipEl = null;
      this.arrowEl = null;
    }
  }

  private updatePosition() {
    if (!this.tooltipEl || !this.arrowEl || this.tooltipEl.style.display === 'none') return;
    this.setPosition();
  }

  private setPosition() {
    if (!this.tooltipEl || !this.arrowEl) return;

    const hostRect = this.host.nativeElement.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const scrollY = window.scrollY || window.pageYOffset;

    const padding = 8;
    const responsiveMaxWidth = Math.min(this.maxWidth(), viewportW - padding * 2);
    this.tooltipEl.style.maxWidth = `${responsiveMaxWidth}px`;

    const tooltipRect = this.tooltipEl.getBoundingClientRect();
    let pos: ReturnType<typeof this.position> = this.position();
    let top = 0;
    let left = 0;
    const offset = this.margin();
    const arrowSize = this.arrowSize();

    const compute = (p: ReturnType<typeof this.position>) => {
      switch (p) {
        case 'top': return { top: hostRect.top - tooltipRect.height - offset - arrowSize + scrollY, left: hostRect.left + hostRect.width / 2 - tooltipRect.width / 2 };
        case 'bottom': return { top: hostRect.bottom + offset + arrowSize + scrollY, left: hostRect.left + hostRect.width / 2 - tooltipRect.width / 2 };
        case 'left': return { top: hostRect.top + hostRect.height / 2 - tooltipRect.height / 2 + scrollY, left: hostRect.left - tooltipRect.width - offset - arrowSize };
        case 'right': return { top: hostRect.top + hostRect.height / 2 - tooltipRect.height / 2 + scrollY, left: hostRect.right + offset + arrowSize };
      }
    };

    ({ top, left } = compute(pos));

    // Auto-flip
    if (pos === 'top' && top < scrollY) pos = 'bottom';
    if (pos === 'bottom' && top + tooltipRect.height > viewportH + scrollY) pos = 'top';
    if (pos === 'left' && left < 0) pos = 'right';
    if (pos === 'right' && left + tooltipRect.width > viewportW) pos = 'left';

    ({ top, left } = compute(pos));

    // Clamp inside viewport
    left = Math.min(left, viewportW - responsiveMaxWidth - padding);
    left = Math.max(left, padding);

    this.tooltipEl.style.top = `${top}px`;
    this.tooltipEl.style.left = `${left}px`;

    // Responsive font
    if (viewportW < 640) {
      this.tooltipEl.style.fontSize = '0.7rem';
      this.tooltipEl.style.padding = '4px 6px';
    } else {
      this.tooltipEl.style.fontSize = '0.875rem';
      this.tooltipEl.style.padding = '8px 12px';
    }

    // Dynamic arrow
    const arrow = this.arrowEl;
    arrow.style.width = '0';
    arrow.style.height = '0';
    arrow.style.border = '';
    arrow.style.top = '';
    arrow.style.bottom = '';
    arrow.style.left = '';
    arrow.style.right = '';
    arrow.style.transform = '';

    if (pos === 'top' || pos === 'bottom') {
      const hostCenterX = hostRect.left + hostRect.width / 2;
      let arrowLeft = hostCenterX - left;
      arrowLeft = Math.max(arrowSize, Math.min(arrowLeft, tooltipRect.width - arrowSize));
      arrow.style.left = `${arrowLeft}px`;
      arrow.style.transform = 'translateX(0)';
    } else {
      const hostCenterY = hostRect.top + hostRect.height / 2 + scrollY;
      let arrowTop = hostCenterY - top;
      arrowTop = Math.max(arrowSize, Math.min(arrowTop, tooltipRect.height - arrowSize));
      arrow.style.top = `${arrowTop}px`;
      arrow.style.transform = 'translateY(0)';
    }

    // Draw triangle
    const color = this.theme() === 'dark' ? 'rgba(31,41,55,0.5)' : 'rgba(255,255,255,0.5)';
    switch (pos) {
      case 'top':
        arrow.style.borderLeft = `${arrowSize}px solid transparent`;
        arrow.style.borderRight = `${arrowSize}px solid transparent`;
        arrow.style.borderTop = `${arrowSize}px solid ${color}`;
        arrow.style.bottom = `-${arrowSize}px`;
        break;
      case 'bottom':
        arrow.style.borderLeft = `${arrowSize}px solid transparent`;
        arrow.style.borderRight = `${arrowSize}px solid transparent`;
        arrow.style.borderBottom = `${arrowSize}px solid ${color}`;
        arrow.style.top = `-${arrowSize}px`;
        break;
      case 'left':
        arrow.style.borderTop = `${arrowSize}px solid transparent`;
        arrow.style.borderBottom = `${arrowSize}px solid transparent`;
        arrow.style.borderLeft = `${arrowSize}px solid ${color}`;
        arrow.style.right = `-${arrowSize}px`;
        break;
      case 'right':
        arrow.style.borderTop = `${arrowSize}px solid transparent`;
        arrow.style.borderBottom = `${arrowSize}px solid transparent`;
        arrow.style.borderRight = `${arrowSize}px solid ${color}`;
        arrow.style.left = `-${arrowSize}px`;
        break;
    }
  }
}
