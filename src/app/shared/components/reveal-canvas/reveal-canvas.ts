import { Component, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '@core/services/theme.service';

@Component({
    selector: 'app-reveal-canvas',
    standalone: true,
    template: `<canvas class="fixed inset-0 z-[9999] pointer-events-none"></canvas>`,
})
export class RevealCanvas implements OnInit, OnDestroy {
    private el = inject(ElementRef);
    private themeService = inject(ThemeService);
    private canvas!: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;
    private raf = 0;
    private animating = false;

    ngOnInit(): void {
        this.canvas = this.el.nativeElement.querySelector('canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.resize();
        window.addEventListener('resize', this.resize);
        window.addEventListener('darkModeToggle', this.onToggle as EventListener);
    }

    ngOnDestroy(): void {
        window.removeEventListener('resize', this.resize);
        window.removeEventListener('darkModeToggle', this.onToggle as EventListener);
        cancelAnimationFrame(this.raf);
    }

    private resize = () => {
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const w = window.innerWidth;
        const h = window.innerHeight;
        const ratio = dpr * 0.9;
        this.canvas.width = Math.round(w * ratio);
        this.canvas.height = Math.round(h * ratio);
        this.canvas.style.width = `${w}px`;
        this.canvas.style.height = `${h}px`;
        this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    private onToggle = (ev: Event) => {
        const e = ev as CustomEvent<{ x: number; y: number; theme: 'light' | 'dark' }>;
        if (!e.detail) return;
        this.playReveal(e.detail.x, e.detail.y, e.detail.theme);
    };

    private playReveal(cx: number, cy: number, theme: 'light' | 'dark') {
        cancelAnimationFrame(this.raf);
        this.animating = true;

        if (!isFinite(cx) || !isFinite(cy)) {
            cx = window.innerWidth / 2;
            cy = window.innerHeight / 2;
        }

        const w = window.innerWidth;
        const h = window.innerHeight;
        const maxR = Math.hypot(w, h);
        const duration = 700;
        const start = performance.now();
        const isToDark = theme === 'dark';

        const animate = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);

            let radius = isToDark ? maxR * eased : maxR * (1 - eased);

            if (!isFinite(radius)) radius = 0;
            radius = Math.max(0, radius);

            this.ctx.clearRect(0, 0, w, h);
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = isToDark ? '#000' : '#fff';
            this.ctx.fill();

            if (t < 1) {
                this.raf = requestAnimationFrame(animate);
            } else {
                this.themeService.setThemeImmediate(theme);
                setTimeout(() => {
                    this.ctx.clearRect(0, 0, w, h);
                    this.animating = false;
                }, 60);
            }
        };

        this.raf = requestAnimationFrame(animate);
    }
}
