import { BsGrid3X3Gap, BsList, BsSearch } from 'react-icons/bs';
import styles from './CategoryFilter.module.css';

const CategoryFilter = ({
  viewMode,
  onViewModeChange,
  filterText,
  onFilterChange,
  totalCategories,
  filteredCount
}) => {
  return (
    <div className={`container ${styles.filterContainer}`}>
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <BsSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search categories..."
            value={filterText}
            onChange={(e) => onFilterChange(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.resultsCount}>
          {filteredCount} of {totalCategories} categories
        </div>
      </div>

      <div className={styles.viewControls}>
        <button
          className={`${styles.viewButton} ${
            viewMode === 'grid' ? styles.active : ''
          }`}
          onClick={() => onViewModeChange('grid')}
          title="Grid View"
        >
          <BsGrid3X3Gap />
        </button>
        <button
          className={`${styles.viewButton} ${
            viewMode === 'list' ? styles.active : ''
          }`}
          onClick={() => onViewModeChange('list')}
          title="List View"
        >
          <BsList />
        </button>
      </div>
    </div>
  );
};

export default CategoryFilter;