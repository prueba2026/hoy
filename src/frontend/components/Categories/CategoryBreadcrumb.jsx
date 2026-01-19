import { Link } from 'react-router-dom';
import { BsChevronRight, BsHouse } from 'react-icons/bs';
import styles from './CategoryBreadcrumb.module.css';

const CategoryBreadcrumb = ({ category, subcategory }) => {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.breadcrumbList}>
        <li className={styles.breadcrumbItem}>
          <Link to="/" className={styles.breadcrumbLink}>
            <BsHouse className={styles.homeIcon} />
            <span>Home</span>
          </Link>
        </li>
        
        <li className={styles.separator}>
          <BsChevronRight />
        </li>
        
        <li className={styles.breadcrumbItem}>
          <Link to="/products" className={styles.breadcrumbLink}>
            All Products
          </Link>
        </li>
        
        {category && (
          <>
            <li className={styles.separator}>
              <BsChevronRight />
            </li>
            <li className={styles.breadcrumbItem}>
              <Link 
                to={`/products?category=${category.categoryName}`} 
                className={styles.breadcrumbLink}
              >
                {category.displayName}
              </Link>
            </li>
          </>
        )}
        
        {subcategory && (
          <>
            <li className={styles.separator}>
              <BsChevronRight />
            </li>
            <li className={`${styles.breadcrumbItem} ${styles.current}`}>
              <span>{subcategory.name}</span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};

export default CategoryBreadcrumb;