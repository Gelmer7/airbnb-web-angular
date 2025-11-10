import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-status-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ToolbarModule],
  templateUrl: './status-bar.component.html',
})
export class StatusBarComponent {
  @Input() statusText = 'Status bar';
  @Input() infoRight = 'Conect..';
}
