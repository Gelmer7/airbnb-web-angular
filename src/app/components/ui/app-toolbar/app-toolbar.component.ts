import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
// DropdownModule removed

// Actually, I saw `select` folder.
import { SelectModule } from 'primeng/select';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';

/**
 * Toolbar do app (apresentação)
 * Exibe botão de colapso da sidebar, logo "airbnb" e ação "login".
 */
@Component({
  selector: 'app-app-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ToolbarModule, ButtonModule, SelectModule, TranslateModule],
  templateUrl: './app-toolbar.component.html',
})
export class AppToolbarComponent {
  private languageService = inject(LanguageService);

  languages = this.languageService.languages;

  // Getter for two-way binding: returns the full Language Object matched by code
  get currentLang() {
    const code = this.languageService.currentLang();
    return this.languages.find((l) => l.code === code) || this.languages[0];
  }

  // Setter: receives full Language Object, extracts code to update Service
  set currentLang(val: { name: string; code: string; flag: string }) {
    if (val && val.code) {
      this.languageService.setLanguage(val.code);
    }
  }
}
