import { fieldFn } from '@/utils/fieldUtils'

export const search = {
  enabled: true,
  placeholder: 'Suchen...',
}

export const pagination = {
  enabled: true,
  perPage: 10,
  perPageDropdown: [10, 20, 50],
  dropdownAllowAll: false,
  setCurrentPage: 1,
  nextLabel: 'Nächste',
  prevLabel: 'Vorherige',
  rowsPerPageLabel: 'Zeilen pro Seite',
  ofLabel: 'von',
  pageLabel: 'Seite',
}

export const sort = {
  enabled: true,
  multiColumn: true,
  initialSortBy: { field: 'datum', type: 'asc' }
}

export { fieldFn }
