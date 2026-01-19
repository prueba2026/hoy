import { useState } from 'react';
import { Filters, ProductsList, CategoryBreadcrumb } from '../../components';
import { useAllProductsContext } from '../../contexts/ProductsContextProvider';
import { useFiltersContext } from '../../contexts/FiltersContextProvider';
import styles from './ProductListingPage.module.css';
import { useIsMobile } from '../../hooks';

const ProductListingPage = () => {
  const { 
    products: productsFromContext, 
    categories: categoriesFromContext 
  } = useAllProductsContext();
  
  const { filters } = useFiltersContext();

  const [isFilterContainerVisible, setIsFilterContainerVisible] =
    useState(false);
  const isMobile = useIsMobile();

  // Find current category for breadcrumb
  const currentCategory = categoriesFromContext.find(cat => {
    const checkedCategories = Object.keys(filters.category || {}).filter(
      key => filters.category[key]
    );
    return checkedCategories.includes(cat.categoryName);
  });

  //  on hard refresh on productListing page, when there is no products in productsContext, show this!!
  if (productsFromContext.length < 1) {
    return <main className='full-page'></main>;
  }

  const handleFilterToggle = () => {
    setIsFilterContainerVisible(!isFilterContainerVisible);
  };

  return (
    <main
      id='filters'
      className={`${styles.productsAndFilterContainer} ${
        isFilterContainerVisible && styles.showFilters
      }`}
    >
      <div className={styles.breadcrumbContainer}>
        <CategoryBreadcrumb category={currentCategory} />
      </div>

      <Filters
        handleFilterToggle={handleFilterToggle}
        isFilterContainerVisible={isFilterContainerVisible}
        isMobile={isMobile}
      />

      <ProductsList
        handleFilterToggle={handleFilterToggle}
        isFilterContainerVisible={isFilterContainerVisible}
        isMobile={isMobile}
      />
    </main>
  );
};

export default ProductListingPage;
