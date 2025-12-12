import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppToolbarComponent } from '../../../../components/ui/app-toolbar/app-toolbar.component';
import { SidebarMenuComponent } from '../../../../components/ui/sidebar-menu/sidebar-menu.component';
import { NavItem } from '../../../../components/ui/types';
import { PanelModule } from 'primeng/panel';
import { StatusBarComponent } from '../../../../components/ui/status-bar/status-bar.component';
import { DASHBOARD_MENU_ITEMS } from '../../dashboard.config';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    AppToolbarComponent,
    SidebarMenuComponent,
    PanelModule,
    StatusBarComponent,
  ],
  templateUrl: './dashboard-layout.page.html',
})
export class DashboardLayoutPage {
  protected readonly collapsed = signal(false);

  protected readonly navItems: NavItem[] = DASHBOARD_MENU_ITEMS;

  protected toggleSidebar(): void {
    this.collapsed.update((v) => !v);
  }
}
