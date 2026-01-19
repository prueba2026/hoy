import { useNavigate } from 'react-router-dom';
import { useFiltersContext } from '../../contexts/FiltersContextProvider';
import styles from './CategoryCard.module.css';

const CategoryCard = ({ category, variant = 'default' }) => {
  const navigate = useNavigate();
  const { checkCategoryOnTabClick } = useFiltersContext();

  const {
    categoryName,
    displayName,
    categoryImage,
    description,
    icon,
    subcategories = []
  } = category;

  const handleCategoryClick = () => {
    checkCategoryOnTabClick(categoryName);
    navigate('/products');
  };

  const handleSubcategoryClick = (e, subcategoryId) => {
    e.stopPropagation();
    // Future implementation for subcategory filtering
    checkCategoryOnTabClick(categoryName);
    navigate('/products');
  };

  if (variant === 'compact') {
    return (
      <article className={styles.categoryCompact} onClick={handleCategoryClick}>
        <div className={styles.iconContainer}>
          <span className={styles.categoryIcon}>{icon}</span>
        </div>
        <div className={styles.categoryInfo}>
          <h4>{displayName}</h4>
          <span className={styles.subcategoryCount}>
            {subcategories.length} subcategories
          </span>
        </div>
      </article>
    );
  }

  return (
    <article className={styles.categoryCard} onClick={handleCategoryClick}>
      <div className={styles.imageContainer}>
        <img src={categoryImage} alt={displayName} />
        <div className={styles.overlay}>
          <span className={styles.categoryIcon}>{icon}</span>
          <h3>{displayName}</h3>
          <p>{description}</p>
        </div>
      </div>
      
      {subcategories.length > 0 && (
        <div className={styles.subcategoriesContainer}>
          <h4>Popular in {displayName}</h4>
          <div className={styles.subcategories}>
            {subcategories.slice(0, 3).map((subcategory) => (
              <button
                key={subcategory.id}
                className={styles.subcategoryTag}
                onClick={(e) => handleSubcategoryClick(e, subcategory.id)}
              >
                {subcategory.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default CategoryCard;