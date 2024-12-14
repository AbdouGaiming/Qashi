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
window.onclick = function(event) {
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
