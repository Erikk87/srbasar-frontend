<template>
  <div class="mt-0 table-container">
    <!-- Collapsible Filter-Bereich -->
    <div class="filters-section mb-3">
      <div class="filters-header" @click="toggleFilters">
        <h5 class="mb-0">
          <font-awesome-icon icon="fa-solid fa-filter" class="me-2" />
          Filter anzeigen
          <font-awesome-icon
            :icon="
              filtersCollapsed
                ? 'fa-solid fa-chevron-down'
                : 'fa-solid fa-chevron-up'
            "
            class="ms-2 chevron-icon"
          />
        </h5>
        <!-- Badge für aktive Filter -->
        <div
          v-if="hasActiveFilters"
          class="active-filters-badge"
          @click.stop="clearFilters"
        >
          <span class="badge-count">{{ activeFiltersCount }}</span>
          <span class="badge-text">Filter aktiv</span>
          <font-awesome-icon icon="fa-solid fa-times" class="ms-1" />
        </div>
      </div>

      <div v-show="!filtersCollapsed" class="filters-content">
        <div class="row gx-2 align-items-end">
          <div class="col">
            <label class="form-label">Halle</label>
            <Multiselect
              v-model="localFilters.spielfeldName"
              :options="availableFilters.spielfeldName || []"
              :searchable="true"
              :create-option="false"
              :show-labels="false"
              placeholder="Alle Hallen"
              noOptionsText="Liste ist leer"
              noResultsText="Keine Ergebnisse gefunden"
              searchPlaceholder="Suchen..."
              @change="applyFilters"
              class="custom-multiselect"
            />
          </div>
          <div class="col">
            <label class="form-label">Liga</label>
            <Multiselect
              v-model="localFilters.ligaName"
              :options="availableFilters.ligaName || []"
              :searchable="true"
              :create-option="false"
              :show-labels="false"
              placeholder="Alle Ligen"
              noOptionsText="Liste ist leer"
              noResultsText="Keine Ergebnisse gefunden"
              searchPlaceholder="Suchen..."
              @change="applyFilters"
              class="custom-multiselect"
            />
          </div>
          <div v-if="enableBezirkFilter" class="col">
            <label class="form-label">Bezirk</label>
            <Multiselect
              v-model="localFilters.bezirkName"
              :options="availableFilters.bezirkName || []"
              :searchable="true"
              :create-option="false"
              :show-labels="false"
              placeholder="Alle Bezirke"
              noOptionsText="Liste ist leer"
              noResultsText="Keine Ergebnisse gefunden"
              searchPlaceholder="Suchen..."
              @change="applyFilters"
              class="custom-multiselect"
            />
          </div>
          <div class="col">
            <label class="form-label">SR-Lizenz</label>
            <Multiselect
              v-model="localFilters.srLizenz"
              :options="availableFilters.srLizenz || []"
              :searchable="true"
              :create-option="false"
              :show-labels="false"
              placeholder="Alle Lizenzen"
              noOptionsText="Liste ist leer"
              noResultsText="Keine Ergebnisse gefunden"
              searchPlaceholder="Suchen..."
              @change="applyFilters"
              class="custom-multiselect"
            />
          </div>
          <div class="col">
            <label class="form-label">Suche</label>
            <input
              type="text"
              v-model="localFilters.search"
              class="form-control"
              placeholder="Team, Verein, Ort..."
              @input="debounceSearch"
            />
          </div>
          <div class="col-auto">
            <Datepicker
              v-model="localFilters.spieldatum"
              ref="datepicker"
              no-today
              :enable-time-picker="false"
              :locale="'de'"
              :auto-apply="true"
              :close-on-auto-apply="true"
              :teleport-to="'body'"
              :allowed-dates="availableDates"
              teleport-center
              class="custom-datepicker"
            />
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm datepicker-trigger"
              :class="{ active: localFilters.spieldatum }"
              @click="toggleDatepicker"
            >
              <font-awesome-icon icon="fa-solid fa-calendar" class="me-1" />
              {{ localFilters.spieldatum ? formatDateForDisplay(localFilters.spieldatum.getTime().toString()) : "Datum" }}
            </button>
          </div>
          <div class="col-auto">
            <button
              @click="clearFilters"
              class="btn btn-outline-secondary btn-sm"
              :disabled="loading"
            >
              Zurücksetzen
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabelle mit Server-Side-Modus -->
    <vue-good-table
      ref="my-table"
      mode="remote"
      :columns="columns"
      :rows="games"
      :totalRows="pagination.totalItems"
      :rowStyleClass="getRowClass"
      :isLoading.sync="loading"
      :pagination-options="{
        enabled: true,
        perPage: pagination.pageSize || 10,
        perPageDropdown: [10, 20, 50, 100],
        perPageDropdownEnabled: true,
        nextLabel: 'Nächste',
        prevLabel: 'Vorherige',
        rowsPerPageLabel: 'Spiele pro Seite',
        ofLabel: 'von',
        pageLabel: 'Seite',
        allLabel: 'Alle',
      }"
      :search-options="{
        enabled: false, // Server-seitige Suche
      }"
      :sort-options="{
        enabled: true,
        initialSortBy: { field: 'datum', type: 'asc' },
        multiColumn: false,
      }"
      @page-change="onPageChange"
      @per-page-change="onPerPageChange"
      @sort-change="onSortChange"
      @column-filter="onColumnFilter"
    >
      <template #emptystate>
        <div class="text-center py-4">
          <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
          <p class="text-muted">Es sind keine Spiele im Basar vorhanden.</p>
        </div>
      </template>

      <template #loadingContent>
        <div class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Laden...</span>
          </div>
        </div>
      </template>
    </vue-good-table>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Multiselect from "vue-multiselect";
import Datepicker from "@vuepic/vue-datepicker";

const enableBezirkFilter =
  String(import.meta.env.VITE_ENABLE_BEZIRK_FILTER || "")
    .trim()
    .toLowerCase() === "true";

const datepicker = ref(null);
const toggleDatepicker = () => {
  datepicker.value.toggleMenu();
};
const props = defineProps({
  games: {
    type: Array,
    default: () => [],
  },
  pagination: {
    type: Object,
    default: () => ({}),
  },
  availableFilters: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  availableDates: {
    type: Array,
    default: () => [],
  },
});

const getRowClass = (row) => {
  let classes = [];

  if (row.sr1) {
    classes.push("sr1-true");
  } else {
    if (row.sr1OffenAngeboten) {
      classes.push("sr1-offenAngeboten");
    }
  }
  if (row.sr2) {
    classes.push("sr2-true");
  } else {
    if (row.sr2OffenAngeboten) {
      classes.push("sr2-offenAngeboten");
    }
  }
  if (row.sr3) {
    classes.push("sr3-true");
  } else {
    if (row.sr3OffenAngeboten) {
      classes.push("sr3-offenAngeboten");
    }
  }

  return classes.join(" ");
};

const emit = defineEmits([
  "page-change",
  "filter-change",
  "sort-change",
  "search-change",
  "per-page-change",
]);

// Collapsible Filter
const filtersCollapsed = ref(true);

// Lokale Filter
const localFilters = ref({
  spieldatum: null,
  ligaName: "",
  bezirkName: "",
  spielfeldName: "",
  srLizenz: "",
  search: "",
});

// Verfügbare Datums für den Datepicker
const availableDates = computed(() => {
  if (!props.availableFilters?.spieldatum) return [];

  return props.availableFilters.spieldatum.map((timestamp) => {
    const date = new Date(parseInt(timestamp));
    return date;
  });
});

// Überprüfe ob aktive Filter vorhanden sind
const hasActiveFilters = computed(() => {
  return (
    localFilters.value.spieldatum ||
    localFilters.value.ligaName ||
    (enableBezirkFilter && localFilters.value.bezirkName) ||
    localFilters.value.spielfeldName ||
    localFilters.value.srLizenz ||
    localFilters.value.search
  );
});

// Zähle aktive Filter
const activeFiltersCount = computed(() => {
  let count = 0;
  if (localFilters.value.spieldatum) count++;
  if (localFilters.value.ligaName) count++;
  if (enableBezirkFilter && localFilters.value.bezirkName) count++;
  if (localFilters.value.spielfeldName) count++;
  if (localFilters.value.srLizenz) count++;
  if (localFilters.value.search) count++;
  return count;
});

// Filter ein-/ausklappen
const toggleFilters = () => {
  filtersCollapsed.value = !filtersCollapsed.value;
};

// Debounce für Suche
let searchTimeout = null;
const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 500);
};

// Filter anwenden
const applyFilters = () => {
  emit("filter-change", { ...localFilters.value });
};

// Filter zurücksetzen
const clearFilters = () => {
  localFilters.value = {
    spieldatum: null,
    ligaName: "",
    bezirkName: "",
    spielfeldName: "",
    srLizenz: "",
    search: "",
  };

  applyFilters();
};

// Event-Handler für Remote-Modus
const onPageChange = (params) => {
  emit("page-change", params.currentPage);
};

const onPerPageChange = (params) => {
  emit("per-page-change", params.currentPerPage);
};

const onSortChange = (params) => {
  if (Array.isArray(params)) {
    params = params[0];
  }
  const { field, type } = params;
  emit("sort-change", {
    sortBy: field,
    sortOrder: type,
  });
};

const onColumnFilter = (params) => {
  emit("filter-change", params);
};

const columns = (() => {
  const cols = [
  {
    label: "Datum",
    field: "datum",
    tdClass: "text-center",
    thClass: "text-center",
    sortable: true,
    sortField: "spieldatum",
  },
  {
    label: "Zeit",
    field: "zeit",
    tdClass: "text-center",
    thClass: "text-center",
    sortable: false,
  },
  {
    label: "Halle",
    field: "spielfeldName",
    thClass: "text-center",
    tdClass: "text-center",
    sortable: true,
    sortField: "spielfeldName",
  },
  {
    label: "Heimteam",
    field: "heimMannschaftName",
    type: "text",
    tdClass: "text-center",
    thClass: "text-center",
    sortable: true,
    sortField: "heimMannschaftName",
  },
  {
    label: "Gastteam",
    field: "gastMannschaftName",
    type: "text",
    tdClass: "text-center",
    thClass: "text-center",
    sortable: true,
    sortField: "gastMannschaftName",
  },
  {
    label: "Liga",
    field: "ligaName",
    tdClass: "text-center",
    thClass: "text-center",
    sortable: true,
    sortField: "ligaName",
  },
  ...(enableBezirkFilter
    ? [
        {
          label: "Bezirk",
          field: "bezirkName",
          tdClass: "text-center",
          thClass: "text-center",
          sortable: true,
          sortField: "bezirkName",
        },
      ]
    : []),
  {
    label: "SR-Lizenz",
    field: "srLizenz",
    tdClass: "text-center license-cell",
    thClass: "text-center",
    sortable: true,
    sortField: "srLizenz",
  },
  {
    label: "SR Verein 1",
    field: "sr1VereinName",
    tdClass: "text-center sr1-cell",
    thClass: "text-center",
    sortable: true,
    sortField: "sr1VereinName",
  },
  {
    label: "SR Verein 2",
    field: "sr2VereinName",
    tdClass: "text-center sr2-cell",
    thClass: "text-center",
    sortable: true,
    sortField: "sr2VereinName",
  },
  {
    label: "Aktion",
    field: "id",
    tdClass: "text-center",
    thClass: "text-center",
    sortable: false,
    html: true,
  },
  ];

  return cols;
})();

// Datum für Anzeige formatieren
const formatDateForDisplay = (timestamp) => {
  if (!timestamp) return "N/A";
  try {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (error) {
    return "N/A";
  }
};

// Watch für Filter-Änderungen
watch(
  () => localFilters.value.spieldatum,
  (newVal) => {
    if (newVal) {
      const timestamp = newVal.getTime().toString();
      emit("filter-change", { spieldatum: timestamp });
    } else {
      emit("filter-change", { spieldatum: "" });
    }
  }
);

watch(
  () => localFilters.value.spielfeldName,
  (newVal) => {
    emit("filter-change", { spielfeldName: newVal?.value || newVal });
  }
);

watch(
  () => localFilters.value.ligaName,
  (newVal) => {
    emit("filter-change", { ligaName: newVal?.value || newVal });
  }
);

watch(
  () => localFilters.value.bezirkName,
  (newVal) => {
    if (!enableBezirkFilter) return;
    emit("filter-change", { bezirkName: newVal?.value || newVal });
  }
);

watch(
  () => localFilters.value.srLizenz,
  (newVal) => {
    emit("filter-change", { srLizenz: newVal?.value || newVal });
  }
);
</script>

<style scoped>
:deep(.vgt-table) {
  --red: #dc35455b;
  --green: #1987545b;
}

:deep(.sr1-true .sr1-cell) {
  background-color: var(--green);
}

:deep(.sr1-offenAngeboten .sr1-cell) {
  background-color: var(--red);
}

:deep(.sr2-true .sr2-cell) {
  background-color: var(--green);
}

:deep(.sr2-offenAngeboten .sr2-cell) {
  background-color: var(--red);
}

:deep(.sr3-true .sr3-cell) {
  background-color: var(--green);
}

:deep(.sr3-offenAngeboten .sr3-cell) {
  background-color: var(--red);
}

/* Filter section */
.filters-section,
.filters-section .form-label,
.filters-section .form-control,
.filters-section .btn {
  font-size: 0.9rem;
}

.filters-section {
  background: #f0f2f4;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
}

.filters-header {
  padding: 0.6rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filters-header:hover {
  background: #e9ecef;
}

.filters-header h5 {
  color: #333333;
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
}

.filters-content {
  padding: 0.2rem 0.75rem 0.4rem;
  background: #ffffff;
}

.filters-content .form-label {
  margin-bottom: 0.1rem;
}

/* Search input: match the fixed height of Multiselect/Datepicker/buttons */
.filters-content input.form-control {
  min-height: 38px;
}

.active-filters-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #dc3545;
  font-size: 0.9rem;
  cursor: pointer;
}

.active-filters-badge:hover {
  text-decoration: underline;
}

.badge-count {
  font-weight: 600;
}

/* Datepicker trigger button */
.datepicker-trigger {
  min-height: 38px;
  border: 1px solid #ced4da;
  background: #ffffff;
  color: #333333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.datepicker-trigger.active {
  border-color: #d78300;
  color: #d78300;
}

/* Multiselect (vue-multiselect 3.x — BEM double-underscore naming) */
:deep(.multiselect),
:deep(.multiselect__input),
:deep(.multiselect__single) {
  font-size: 0.9rem;
}

:deep(.multiselect) {
  min-height: 38px;
  background: white;
  border-radius: 0.25rem;
}

:deep(.multiselect__tags) {
  min-height: 38px;
  padding: 6px 40px 0 6px;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  background: white;
  font-size: 0.9rem;
}

:deep(.multiselect__input) {
  border: none;
  padding: 0.2rem 0.3rem;
  background: transparent;
  color: #495057;
}

:deep(.multiselect__input::placeholder) {
  color: #6c757d;
}

:deep(.multiselect__placeholder) {
  color: #6c757d;
  padding: 0.2rem 0.3rem;
  font-size: 0.9rem;
}

:deep(.multiselect__single) {
  color: #495057;
  padding: 0.2rem 0.3rem;
  margin-bottom: 0;
}

:deep(.multiselect__tag) {
  background: #d78300;
  color: white;
  border-radius: 0.2rem;
  padding: 0.2rem 1.5rem 0.2rem 0.4rem;
  margin: 0.1rem;
  font-size: 0.9rem;
}

:deep(.multiselect__tag-icon::after) {
  color: white;
  font-size: 0.9rem;
}

:deep(.multiselect__tag-icon:hover) {
  background: #bf7200;
}

:deep(.multiselect__content-wrapper) {
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  background: white;
  margin-top: 1px;
  font-size: 0.9rem;
  min-width: 100%;
  width: max-content;
  max-width: min(90vw, 320px);
}

:deep(.multiselect__option) {
  padding: 0.4rem 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: normal;
  overflow-wrap: anywhere;
}

:deep(.multiselect__option--highlight) {
  background: #f8f9fa;
  color: #212529;
}

:deep(.multiselect__option--selected) {
  background: #d78300;
  color: white;
  font-weight: 500;
}

:deep(.multiselect__option--selected.multiselect__option--highlight) {
  background: #bf7200;
  color: white;
}

/* Datepicker */
:deep(.dp__main) {
  font-family: inherit;
}

:deep(.dp__input) {
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  padding: 0.4rem 0.5rem;
  background: white;
  color: #495057;
  min-height: 38px;
  width: 100%;
}

:deep(.dp__input:focus) {
  outline: none;
  border-color: #d78300;
  box-shadow: 0 0 0 0.15rem rgba(215, 131, 0, 0.2);
}

:deep(.dp__menu) {
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  background: white;
}

:deep(.dp__calendar_header) {
  background: #e9ecef;
  color: #333333;
  border-radius: 0;
}

:deep(.dp__calendar_header_cell) {
  color: #333333;
  font-weight: 600;
}

:deep(.dp__cell_inner) {
  border-radius: 0.2rem;
}

:deep(.dp__cell_inner:hover) {
  background: #f0f2f4;
}

:deep(.dp__active_date) {
  background: #d78300;
  color: white;
}

:deep(.dp__today) {
  border: 2px solid #d78300;
  color: #333333;
}

:deep(.custom-datepicker input),
:deep(.custom-datepicker .dp__input_icons),
:deep(.custom-datepicker .dp__input_icon),
:deep(.custom-datepicker .dp__input_wrap) {
  display: none !important;
}

.chevron-icon {
  font-size: 0.9rem;
}

</style>
