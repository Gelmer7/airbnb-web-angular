import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-upload-csv-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CardModule, FileUploadModule, TableModule, TranslateModule],
  templateUrl: './upload-csv.page.html',
})
export class UploadCsvPage {}
