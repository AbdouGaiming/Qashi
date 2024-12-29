// Toggle sidebar menu
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("active");
}

// Toggle cart dropdown
function toggleCartDropdown() {
  const cartDropdown = document.getElementById("cartDropdown");
  cartDropdown.style.display = cartDropdown.style.display === "none" || cartDropdown.style.display === "" ? "block" : "none";
}

// Close dropdowns and sidebar if clicked outside
window.onclick = function (event) {
  const cartDropdown = document.getElementById("cartDropdown");
  const cartIcon = document.querySelector(".cart-icon");
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.querySelector(".hamburger");

  // Close the cart dropdown if clicked outside
  if (cartDropdown && cartIcon && !cartDropdown.contains(event.target) && !cartIcon.contains(event.target)) {
    cartDropdown.style.display = "none";
  }

  // Close the sidebar if clicked outside
  if (sidebar && hamburger && !sidebar.contains(event.target) && !hamburger.contains(event.target)) {
    sidebar.classList.remove("active");
  }
};

function generateFilterSidebar() {
  
  // Categories data structure
  const categories = {
    // Represents different categories in the sidebar.
    // Each key is a category identifier, and its value contains:
    // - title: The display name of the category.
    // - items: An array of strings, representing filter options for the category.
    outerwear: {
      title: "Outerwear",
      items: ["Jackets", "Coats", "Vests", "Bombers"]
    },
    tops: {
      title: "Tops",
      items: ["Sweatshirts", "T-shirts", "Shirts", "Polos", "Knitwear", "Sweaters", "Hoodies"]
    },
    formalWear: {
      title: "Formal Wear",
      items: ["Suits", "Blazers"]
    },
    bottoms: {
      title: "Bottoms",
      items: ["Shorts", "Jeans", "Pants", "Trousers"]
    },
    footwear: {
      title: "Footwear",
      items: ["Shoes", "Boots"]
    },
    womensClothing: {
      title: "Women's Clothing",
      items: ["Robes", "Dresses", "Skirts"]
    },
    kids: {
      title: "Kids",
      items: ["T-Shirts", "Shorts", "Sneakers"]
    },
    accessories: {
      title: "Accessories",
      items: ["Accessories"]
    }
  };

  function generateFilterSidebar() {
    const sidebar = document.getElementById('sidebar');
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-sidebar';

    // Create filter sections for each category
    for (const [key, category] of Object.entries(categories)) {
      const section = document.createElement('div');
      section.className = 'filter-section';

      // Add title
      const title = document.createElement('h3');
      title.className = 'filter-title';
      title.textContent = category.title; // Display the category title as a header
      section.appendChild(title);

      // Add filter group
      const group = document.createElement('div');
      group.className = 'filter-group';

      // Add items
      category.items.forEach(item => {
        const label = document.createElement('label');
        label.className = 'filter-item'; // Wrapper for the input and label text

        const input = document.createElement('input');
        input.type = 'radio'; // Ensures only one filter can be selected per category
        input.name = `category-${key}`; // Groups radio buttons by category
        input.className = 'filter-radio';
        input.value = item.toLowerCase().replace(/\s+/g, '-'); // Generates a value usable for filtering

        const span = document.createElement('span');
        span.className = 'filter-label'; // Styles for the label text
        span.textContent = item; // Display the filter option name

        label.appendChild(input); // Attach the input to the label
        label.appendChild(span); // Attach the text to the label
        group.appendChild(label); // Add the label to the group
      });

      section.appendChild(group); // Add the group to the section
      filterContainer.appendChild(section); // Add the section to the container
    }

    // Add the filter container to the sidebar
    sidebar.appendChild(filterContainer); // Append the fully constructed filter sidebar to the DOM
  }

  // Add the CSS
  const styles = `
      .filter-sidebar {
          width: 280px;
          background: white;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: fixed;
          top: 60px; /* Adjust this value to match the height of your green menu */
          left: 0;
          bottom: 60px; /* Adjust this value to match the height of your footer */
          overflow-y: auto;
          z-index: 1000; /* Ensure it stays above other content */
      }
      #productContainer {
          margin-left: 300px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
          padding: 20px;
          padding-top: 80px; /* Add padding to avoid overlap with the green menu */
      }

      .filter-section {
          margin-bottom: 25px;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 15px;
      }

      .filter-section:last-child {
          border-bottom: none;
      }

      .filter-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 15px;
          text-transform: uppercase;
      }

      .filter-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
      }

      .filter-item {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
      }

      .filter-radio {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid #757575;
          border-radius: 50%;
          position: relative;
          cursor: pointer;
      }

      .filter-radio:checked {
          border-color: #4CAF50;
      }

      .filter-radio:checked::after {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          background: #4CAF50;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
      }

      .filter-label {
          font-size: 14px;
          color: #555;
          cursor: pointer;
      }

      #productContainer {
          margin-left: 300px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
          padding: 20px;
      }
  `;

  // Add styles to document
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles; // Attach the CSS styles dynamically
  document.head.appendChild(styleSheet);

  // Initialize the filter sidebar
  generateFilterSidebar(); // Call the function to build and display the sidebar

  // Add event listeners for radio buttons
  document.querySelectorAll('.filter-radio').forEach(radio => {
    radio.addEventListener('change', function (e) {
      const category = this.name.replace('category-', ''); // Extract the category name from the radio input
      const value = this.value; // Get the selected filter value
      console.log(`Selected ${value} in ${category}`); // Log the selected filter for debugging
      // Add your filter logic here
    });
  });
}
