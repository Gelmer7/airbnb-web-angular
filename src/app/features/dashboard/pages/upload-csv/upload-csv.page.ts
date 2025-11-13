import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-upload-csv-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CardModule, FileUploadModule, TableModule],
  templateUrl: './upload-csv.page.html',
})
export class UploadCsvPage {
  protected readonly files = signal<File[]>([]);
  protected readonly bookings = signal<{
    confirmationCode: string;
    reservationDate?: string;
    startDate?: string;
    endDate?: string;
    nights?: number;
    guest?: string;
    listing?: string;
    currency: string;
    amount: number;
    serviceFee?: number;
    fastPayoutFee?: number;
    cleaningFee?: number;
    grossEarnings?: number;
    occupancyTaxes?: number;
  }[]>([]);
  protected readonly cohostShares = signal<{
    confirmationCode: string;
    currency: string;
    hostAmount?: number;
    cohostAmount?: number;
  }[]>([]);
  protected readonly payouts = signal<{
    availableDate?: string;
    referenceCode?: string;
    info?: string;
    accountOwner: 'host' | 'cohost';
    currency?: string;
    amount?: number;
  }[]>([]);
  protected readonly issues = signal<string[]>([]);

  protected onSelectFiles(event: { files: File[] }): void {
    const next = [...this.files(), ...event.files];
    this.files.set(next);
  }

  protected onClearFiles(): void {
    this.files.set([]);
    this.bookings.set([]);
    this.cohostShares.set([]);
    this.payouts.set([]);
    this.issues.set([]);
  }

  protected async onUploadHandler(event: { files: File[] }): Promise<void> {
    const selected = event.files.length ? event.files : this.files();
    if (!selected.length) return;
    const byRole = await this.readAndClassify(selected);
    const result = this.transform(byRole.hostRows, byRole.cohostRows);
    this.bookings.set(result.bookings);
    this.cohostShares.set(result.cohostShares);
    this.payouts.set(result.payouts);
    this.issues.set(result.issues);
  }

  private async readAndClassify(files: File[]): Promise<{ hostRows: any[]; cohostRows: any[] }> {
    const hostRows: any[] = [];
    const cohostRows: any[] = [];
    for (const f of files) {
      const text = await f.text();
      const rows = this.parseCsv(text);
      const name = f.name.toLowerCase();
      const isCohost = this.isCohostFile(name);
      if (isCohost) cohostRows.push(...rows);
      else hostRows.push(...rows);
    }
    return { hostRows, cohostRows };
  }

  private isCohostFile(name: string): boolean {
    return name.includes('coanfit') || name.includes('co anfit') || name.includes('cohost');
  }

  private parseCsv(text: string): any[] {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (!lines.length) return [];
    const header = this.splitCsvLine(lines[0]);
    const rows: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = this.splitCsvLine(lines[i]);
      const obj: any = {};
      for (let c = 0; c < header.length; c++) {
        obj[header[c]] = cols[c] ?? '';
      }
      rows.push(obj);
    }
    return rows;
  }

  private splitCsvLine(line: string): string[] {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        result.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    result.push(cur);
    return result.map((s) => s.trim().replace(/^"|"$/g, ''));
  }

  private parseAmount(s?: string): number | undefined {
    if (!s) return undefined;
    const t = s.replace(/\s/g, '');
    const n = parseFloat(t);
    return Number.isFinite(n) ? n : undefined;
  }

  private toIso(date?: string): string | undefined {
    if (!date) return undefined;
    const parts = date.split('/');
    if (parts.length !== 3) return undefined;
    const [m, d, y] = parts;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  private normalizeRow(r: any) {
    return {
      type: (r['Tipo'] || '').trim(),
      confirmationCode: (r['Código de Confirmação'] || '').trim(),
      currency: (r['Moeda'] || '').trim(),
      value: this.parseAmount(r['Valor']),
      reservationDate: this.toIso(r['Data da reserva']),
      startDate: this.toIso(r['Data de início']),
      endDate: this.toIso(r['Data de término']),
      availableDate: this.toIso(r['Disponível por data']),
      nights: r['Noites'] ? parseInt(r['Noites'], 10) : undefined,
      guest: (r['Hóspede'] || '').trim(),
      listing: (r['Anúncio'] || '').trim(),
      info: (r['Informações'] || '').trim(),
      referenceCode: (r['Código de referência'] || '').trim(),
      serviceFee: this.parseAmount(r['Taxa de serviço']),
      fastPayoutFee: this.parseAmount(r['Taxa de pagamento rápido']),
      cleaningFee: this.parseAmount(r['Taxa de limpeza']),
      grossEarnings: this.parseAmount(r['Ganhos brutos']),
      occupancyTaxes: this.parseAmount(r['Impostos de ocupação']),
    };
  }

  private transform(hostRaw: any[], cohostRaw: any[]) {
    const H = hostRaw.map((x) => this.normalizeRow(x));
    const C = cohostRaw.map((x) => this.normalizeRow(x));

    const bookingsMap = new Map<string, any>();
    H.filter((x) => x.type === 'Reserva' && x.confirmationCode).forEach((x) => {
      if (!bookingsMap.has(x.confirmationCode)) {
        bookingsMap.set(x.confirmationCode, {
          confirmationCode: x.confirmationCode,
          reservationDate: x.reservationDate,
          startDate: x.startDate,
          endDate: x.endDate,
          nights: x.nights,
          guest: x.guest,
          listing: x.listing,
          currency: x.currency || 'BRL',
          amount: x.value || 0,
          serviceFee: x.serviceFee,
          fastPayoutFee: x.fastPayoutFee,
          cleaningFee: x.cleaningFee,
          grossEarnings: x.grossEarnings,
          occupancyTaxes: x.occupancyTaxes,
        });
      }
    });

    const sharesMap = new Map<string, any>();
    H.filter((x) => x.type === 'Recebimento do coanfitrião' && x.confirmationCode).forEach((x) => {
      const key = `${x.confirmationCode}|${x.currency || 'BRL'}`;
      const s = sharesMap.get(key) || { confirmationCode: x.confirmationCode, currency: x.currency || 'BRL' };
      if (typeof x.value === 'number') s.hostAmount = Math.abs(x.value);
      sharesMap.set(key, s);
    });
    C.filter((x) => x.type === 'Recebimento do coanfitrião' && x.confirmationCode).forEach((x) => {
      const key = `${x.confirmationCode}|${x.currency || 'BRL'}`;
      const s = sharesMap.get(key) || { confirmationCode: x.confirmationCode, currency: x.currency || 'BRL' };
      if (typeof x.value === 'number') s.cohostAmount = Math.abs(x.value);
      sharesMap.set(key, s);
    });

    const payouts: any[] = [];
    H.filter((x) => x.type === 'Payout').forEach((x) => {
      payouts.push({
        availableDate: x.availableDate,
        referenceCode: x.referenceCode,
        info: x.info,
        accountOwner: 'host',
        currency: x.currency,
        amount: x.value,
      });
    });
    C.filter((x) => x.type === 'Payout').forEach((x) => {
      payouts.push({
        availableDate: x.availableDate,
        referenceCode: x.referenceCode,
        info: x.info,
        accountOwner: 'cohost',
        currency: x.currency,
        amount: x.value,
      });
    });

    const issues: string[] = [];
    Array.from(sharesMap.values()).forEach((s: any) => {
      if (typeof s.hostAmount === 'number' && typeof s.cohostAmount === 'number') {
        const diff = Math.abs((s.hostAmount || 0) - (s.cohostAmount || 0));
        if (diff > 0.01) issues.push(`Diferença de cohost para ${s.confirmationCode}: ${diff.toFixed(2)}`);
      }
    });

    return {
      bookings: Array.from(bookingsMap.values()),
      cohostShares: Array.from(sharesMap.values()),
      payouts,
      issues,
    };
  }
}
