import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavItem } from '../types';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MenuModule,
    BadgeModule,
    RippleModule,
    AvatarModule,
    ButtonModule,
    TooltipModule,
    TranslateModule,
  ],
  templateUrl: './sidebar-menu.component.html',
})
export class SidebarMenuComponent {
  @Input({ required: true }) items: {
    id: string;
    label: string;
    icon: string;
    route: string;
    badge?: string | number;
    shortcut?: string;
  }[] = [];
  @Input({ required: true }) collapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  protected onToggle(): void {
    this.toggleSidebar.emit();
  }

  protected trackById = (_: number, item: NavItem) => item.id;
  protected get menuModel(): (MenuItem & { badge?: string | number; shortcut?: string })[] {
    return this.items.map((i) => ({
      label: i.label,
      icon: `pi ${i.icon}`,
      routerLink: i.route,
      badge: i.badge?.toString(),
      shortcut: i.shortcut,
    }));
  }
}
