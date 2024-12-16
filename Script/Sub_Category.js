document.addEventListener("DOMContentLoaded", () => {
    const categories = document.querySelectorAll(".category");
    const subCategories = {
      men: document.getElementById("menSubCategories"),
      women: document.getElementById("womenSubCategories"),
      kids: document.getElementById("kidsSubCategories")
    };
  
    categories.forEach(category => {
      category.addEventListener("click", (event) => {
        event.preventDefault();
        
        // Hide all sub-categories
        Object.values(subCategories).forEach(subCat => {
          subCat.style.display = "none";
        });
  
        // Show the clicked category's sub-categories
        const selectedSubCategory = subCategories[category.id];
        if (selectedSubCategory) {
          selectedSubCategory.style.display = "block";
        } else {
          console.warn(`No sub-category element found for category id: ${category.id}`);
        }
      });
    });
});
  