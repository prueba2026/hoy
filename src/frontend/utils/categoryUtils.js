/**
 * Utility functions for category management
 */

export const getCategoryById = (categories, categoryId) => {
  return categories.find(category => category._id === categoryId);
};

export const getCategoryByName = (categories, categoryName) => {
  return categories.find(category => category.categoryName === categoryName);
};

export const getSubcategoryById = (category, subcategoryId) => {
  return category?.subcategories?.find(sub => sub.id === subcategoryId);
};

export const getActiveCategories = (categories) => {
  return categories.filter(category => category.isActive);
};

export const sortCategoriesByOrder = (categories) => {
  return [...categories].sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));
};

export const searchCategories = (categories, searchTerm) => {
  const term = searchTerm.toLowerCase();
  return categories.filter(category => 
    category.displayName.toLowerCase().includes(term) ||
    category.description.toLowerCase().includes(term) ||
    category.categoryName.toLowerCase().includes(term) ||
    category.subcategories?.some(sub => 
      sub.name.toLowerCase().includes(term) ||
      sub.description.toLowerCase().includes(term)
    )
  );
};

export const getCategoryProductCount = (products, categoryName) => {
  return products.filter(product => product.category === categoryName).length;
};

export const getCategoriesWithProductCounts = (categories, products) => {
  return categories.map(category => ({
    ...category,
    productCount: getCategoryProductCount(products, category.categoryName)
  }));
};

export const generateCategoryUrl = (category, subcategory = null) => {
  let url = `/products?category=${category.categoryName}`;
  if (subcategory) {
    url += `&subcategory=${subcategory.id}`;
  }
  return url;
};

export const generateCategorySEO = (category, subcategory = null) => {
  if (subcategory) {
    return {
      title: `${subcategory.name} - ${category.displayName} | Gada Electronics`,
      description: `${subcategory.description}. Shop the best ${subcategory.name.toLowerCase()} at Gada Electronics.`,
      keywords: [category.categoryName, subcategory.name.toLowerCase(), ...category.seo.keywords]
    };
  }
  
  return {
    title: category.seo.metaTitle,
    description: category.seo.metaDescription,
    keywords: category.seo.keywords
  };
};