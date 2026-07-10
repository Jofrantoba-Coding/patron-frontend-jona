export interface DocumentosPageContract {
  rows: import('../../core/models').Documento[];
  filtro: import('../../core/models').DocumentoFiltro;
  preview: import('../../core/models').DocumentoPreview | null;
  canDownload: boolean;
  canDownloadCifrado: boolean;
}
