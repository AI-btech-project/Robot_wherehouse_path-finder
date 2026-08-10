import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Filter, SearchX } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { TableSkeleton } from './Skeleton';

export const Table = ({
  columns,
  data,
  searchPlaceholder = 'Search records...',
  filterOptions = [],
  filterKey = 'status',
  pageSize = 10,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Search & Filter Logic
  const filteredData = useMemo(() => {
    return data.filter(row => {
      if (selectedFilter !== 'ALL' && String(row[filterKey]).toLowerCase() !== String(selectedFilter).toLowerCase()) {
        return false;
      }
      if (!searchTerm) return true;
      return Object.values(row).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [data, searchTerm, selectedFilter, filterKey]);

  // Sorting Logic
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (colKey) => {
    if (sortColumn === colKey) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(colKey);
      setSortDirection('asc');
    }
  };

  if (loading) {
    return <TableSkeleton rows={pageSize} />;
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-textDark" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-textLight placeholder-textDark focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>

        {filterOptions.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-textDark" />
            <select
              value={selectedFilter}
              onChange={(e) => {
                setSelectedFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs font-medium text-textLight focus:outline-none focus:border-white/20 cursor-pointer"
            >
              <option value="ALL" className="bg-cardDark">All Statuses</option>
              {filterOptions.map(opt => (
                <option key={opt} value={opt} className="bg-cardDark">{opt}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/5 bg-cardDark shadow-card">
        <table className="w-full text-left text-xs text-textMuted">
          <thead className="bg-sidebarDark text-[11px] font-medium uppercase tracking-wider text-textDark border-b border-white/5">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`px-4 py-3.5 select-none ${col.sortable !== false ? 'cursor-pointer hover:text-textLight' : ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable !== false && (
                      <ArrowUpDown className="w-3 h-3 text-textDark hover:text-primaryCyan" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cardBorder/60">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="hover:bg-slate-800/50 transition-colors duration-150"
                >
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3.5 whitespace-nowrap text-textMuted font-sans">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <EmptyState
                    icon={SearchX}
                    title="No Matching Records"
                    description={`No items match your search "${searchTerm}" or filter.`}
                    actionLabel="Reset Search & Filters"
                    onAction={() => {
                      setSearchTerm('');
                      setSelectedFilter('ALL');
                    }}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {sortedData.length > 0 && (
        <div className="flex items-center justify-between text-xs text-textDark px-1">
          <div>
            Showing <span className="font-mono font-bold text-textMuted">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-mono font-bold text-textMuted">{Math.min(currentPage * pageSize, sortedData.length)}</span> of{' '}
            <span className="font-mono font-bold text-primaryCyan">{sortedData.length}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-cardBorder bg-cardDark hover:bg-slate-800 text-textMuted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono font-semibold text-textLight">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-cardBorder bg-cardDark hover:bg-slate-800 text-textMuted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
