// JPaginationView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { InterJPagination, formatRowsInfo } from './InterJPagination';
import { JButton } from '../../atoms/JButton/JButton';
import { FG, FG_MUTED, HOVER_OVERLAY, LINE, ON_PRIMARY, TEXT_SMALL } from '../../theme/tokenClasses';

function buildRange(current: number, total: number, siblings: number): (number | '...')[] {
  const range: number[] = [];
  for (let i = Math.max(2, current - siblings); i <= Math.min(total - 1, current + siblings); i++) range.push(i);
  const result: (number | '...')[] = [1];
  if (range[0] > 2) result.push('...');
  result.push(...range);
  if (range[range.length - 1] < total - 1) result.push('...');
  if (total > 1) result.push(total);
  return result.filter((v, i, arr) => arr.indexOf(v) === i);
}

const ChevronLeft = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>;
const ChevronRight = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>;

export const JPaginationView: React.FC<InterJPagination> = ({
  currentPage, totalPages, onPageChange, onPrevious, onNext, onFirstPageReached, onLastPageReached, siblingCount = 1, className,
  totalRows, pageSize, showRowsInfo, rowsInfoLabel = formatRowsInfo,
}) => {
  // Rows info (R-DAT-7): only with showRowsInfo, totalRows and pageSize; otherwise the 1.5.1 output.
  const info = showRowsInfo && totalRows !== undefined && pageSize ? (
    <p className={cn('shrink-0 tabular-nums', TEXT_SMALL, FG_MUTED)}>
      {rowsInfoLabel(totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1, Math.min(currentPage * pageSize, totalRows), totalRows)}
    </p>
  ) : null;
  if (totalPages <= 1) return info;
  const pages = buildRange(currentPage, totalPages, siblingCount);
  // 44px touch targets below sm:, 36px from sm: up
  const btnBase = cn('inline-flex items-center justify-center h-11 min-w-[2.75rem] px-2 rounded text-sm sm:h-9 sm:min-w-[2.25rem] transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50');

  const nav = (
    <nav aria-label="JPagination" className={cn('flex w-full max-w-full items-center gap-1 overflow-x-auto py-1', className)}>
      <JButton variant="ghost" type="button" aria-label="Go to previous page" disabled={currentPage <= 1}
        onClick={() => { if (currentPage <= 1) { onFirstPageReached?.(); return; } onPrevious?.(currentPage); onPageChange?.(currentPage - 1); }}
        className={cn(btnBase, `gap-1 pr-3 ${FG_MUTED} ${HOVER_OVERLAY} border ${LINE}`)}>
        <span className="inline-flex items-center gap-1"><ChevronLeft /><span className="hidden sm:inline">Previous</span></span>
      </JButton>
      {pages.map((page, i) => page === '...' ? (
        <span key={`e-${i}`} className={`shrink-0 px-2 ${FG_MUTED} select-none`}>…</span>
      ) : (
        <JButton variant="ghost" key={page} type="button" aria-label={`Page ${page}`} aria-current={page === currentPage ? 'page' : undefined}
          onClick={() => onPageChange?.(page as number)}
          className={cn(btnBase, page === currentPage ? `bg-primary-600 ${ON_PRIMARY} border border-primary-600` : `${FG} ${HOVER_OVERLAY} border ${LINE}`)}>{page}</JButton>
      ))}
      <JButton variant="ghost" type="button" aria-label="Go to next page" disabled={currentPage >= totalPages}
        onClick={() => { if (currentPage >= totalPages) { onLastPageReached?.(); return; } onNext?.(currentPage); onPageChange?.(currentPage + 1); }}
        className={cn(btnBase, `gap-1 pl-3 ${FG_MUTED} ${HOVER_OVERLAY} border ${LINE}`)}>
        <span className="inline-flex items-center gap-1"><span className="hidden sm:inline">Next</span><ChevronRight /></span>
      </JButton>
    </nav>
  );
  if (!info) return nav;
  return (
    <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      {info}
      {nav}
    </div>
  );
};
