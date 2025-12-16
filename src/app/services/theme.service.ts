import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);

  // 'light' | 'dark'
  currentTheme = signal<string>('light');

  themes = [
    { name: 'THEME.LIGHT', code: 'light', icon: 'pi pi-sun' },
    { name: 'THEME.DARK', code: 'dark', icon: 'pi pi-moon' },
  ];

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initTheme();
    }

    // Effect to apply theme whenever signal changes
    effect(() => {
      const theme = this.currentTheme();
      if (isPlatformBrowser(this.platformId)) {
        this.applyTheme(theme);
        localStorage.setItem('app-theme', theme);
      }
    });
  }

  private initTheme() {
    const savedTheme = localStorage.getItem('app-theme');
    // Default to light if nothing saved, or respect system preference if you wanted
    // For now, let's default to light as per prompt implied 2 options, starting somewhere.
    // Or we can check system preference:
    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // const defaultTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    const defaultTheme = savedTheme || 'light';
    this.currentTheme.set(defaultTheme);
  }

  private applyTheme(theme: string) {
    const html = document.querySelector('html');
    if (html) {
      if (theme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  }

  setTheme(theme: string) {
    this.currentTheme.set(theme);
  }
}
