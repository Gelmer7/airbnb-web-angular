import { Component, ChangeDetectionStrategy, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';

/**
 * Toolbar do app (apresentação)
 * Exibe botão de colapso da sidebar, logo "airbnb" e ação "login".
 */
@Component({
  selector: 'app-app-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ToolbarModule, ButtonModule],
  templateUrl: './app-toolbar.component.html'
})
export class AppToolbarComponent {
  /** Estado atual da sidebar (colapsada). */
  @Input({ required: true }) collapsed = false;
  /** Evento disparado para alternar colapso da sidebar. */
  @Output() toggleSidebar = new EventEmitter<void>();

  protected onToggle(): void {
    this.toggleSidebar.emit();
  }
}
