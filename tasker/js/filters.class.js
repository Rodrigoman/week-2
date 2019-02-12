class Filters {
  constructor() {
    this.status = 'All';
    this.sort = 'asc';
    this.search = '';
  }

  updateFilters(newFilters) {
    this.appliedFilters = newFilters;
  }
}

export default Filters;
