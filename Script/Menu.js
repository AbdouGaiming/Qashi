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

    // Close the cart dropdown if clicked outside
    window.onclick = function(event) {
      const cartDropdown = document.getElementById("cartDropdown");
      const cartIcon = document.querySelector(".cart-icon");

      if (!cartDropdown.contains(event.target) && !cartIcon.contains(event.target)) {
        cartDropdown.style.display = "none";
      }
    };