import { useState } from 'react';
import Title from '../Title/Title';
import styles from './Categories.module.css';
import { useAllProductsContext } from '../../contexts/ProductsContextProvider';
import CategoryCard from './CategoryCard';
import CategoryFilter from './CategoryFilter';

const Categories = () => {
  const { categories: categoriesFromContext } = useAllProductsContext();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterText, setFilterText] = useState('');

  // Filter categories based on search text
  const filteredCategories = categoriesFromContext.filter(category =>
    category.displayName.toLowerCase().includes(filterText.toLowerCase()) ||
    category.description.toLowerCase().includes(filterText.toLowerCase()) ||
    category.subcategories?.some(sub => 
      sub.name.toLowerCase().includes(filterText.toLowerCase())
    )
  );

  // Sort categories by sortOrder
  const sortedCategories = filteredCategories.sort((a, b) => 
    (a.sortOrder || 999) - (b.sortOrder || 999)
  );

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleFilterChange = (text) => {
    setFilterText(text);
  };

  return (
    <section className='section'>
      <Title>Categories</Title>

      <CategoryFilter
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        filterText={filterText}
        onFilterChange={handleFilterChange}
        totalCategories={categoriesFromContext.length}
        filteredCount={sortedCategories.length}
      />

      <div className={`container ${styles.categoryContainer}`}>
        <div className={
          viewMode === 'grid' 
            ? styles.gridContainer 
            : styles.listContainer
        }>
          {sortedCategories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              variant={viewMode === 'list' ? 'compact' : 'default'}
            />
          ))}
        </div>
      </div>

      {sortedCategories.length === 0 && (
        <div className={styles.noResults}>
          <p>No categories found matching "{filterText}"</p>
          <button 
            className='btn btn-hipster'
            onClick={() => setFilterText('')}
          >
            Clear Filter
          </button>
        </div>
      )}
    </section>
  );
};

export default Categories;
