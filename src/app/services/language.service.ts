import { Injectable, signal, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private translate = inject(TranslateService);

  // Signal to expose current language code
  currentLang = signal<string>('pt');

  // Available languages
  languages = [
    { name: 'Español', code: 'es', flag: '/flags/es.png' },
    { name: 'English', code: 'en', flag: '/flags/us.png' },
    { name: 'Português', code: 'pt', flag: '/flags/br.png' },
  ];

  constructor() {
    this.initLanguage();
  }

  private initLanguage() {
    this.translate.addLangs(['es', 'en', 'pt']);

    // Check localStorage or browser lang
    const savedLang = localStorage.getItem('app-lang');
    const browserLang = this.translate.getBrowserLang();
    const defaultLang =
      savedLang || (browserLang && browserLang.match(/es|en|pt/) ? browserLang : 'pt');

    this.setLanguage(defaultLang);
  }

  setLanguage(lang: string) {
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    this.currentLang.set(lang);
    localStorage.setItem('app-lang', lang);
  }
}
