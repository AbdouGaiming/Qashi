document.addEventListener('DOMContentLoaded', function () {
    loadDashboardData();
    checkSession();
});
// ...existing code...

function checkSession() {
    fetch('Database/GetSession.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(`Session active. User ID: ${data.data.user_id}`);
            } else {
                console.log('No active session found. Please log in.');
            }
        })
        .catch(error => console.error('Error checking session:', error));
}

function loadDashboardData() {
    fetch('Database/fetch_dashboard.php')
        .then(response => response.json())
        .then(data => {
            displaySalesOverview(data.salesOverview);
            document.getElementById('total-sales').innerHTML = `$${data.totalSales} <span class="percentage-change">${data.totalSalesChange}%</span>`;
            document.getElementById('avg-order-value').innerHTML = `$${data.avgOrderValue} <span class="percentage-change">${data.avgOrderValueChange}%</span>`;
            document.getElementById('conversion-rate').innerHTML = `${data.conversionRate}% <span class="percentage-change">${data.conversionRateChange}%</span>`;
            displayTopSellingProducts(data.topSellingProducts);
        })
        .catch(error => console.error('Error fetching dashboard data:', error));
}

function displaySalesOverview(data) {
    const ctx = document.getElementById('salesChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Sales',
                data: data.values,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { display: true, title: { display: true, text: 'Date' } },
                y: { display: true, title: { display: true, text: 'Sales' } }
            }
        }
    });
}

function displayTopSellingProducts(products) {
    const topSellingProductsBody = document.getElementById('top-selling-products');
    topSellingProductsBody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td>${product.soldUnits}</td>
            <td><span class="status ${product.status.toLowerCase().replace(' ', '-')}">${product.status}</span></td>
        `;
        topSellingProductsBody.appendChild(row);
    });
}