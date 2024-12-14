document.addEventListener('DOMContentLoaded', function () {
    loadAnalyticsData();
});

function loadAnalyticsData() {
    fetch('Database/fetch_analytics.php')
        .then(response => response.json())
        .then(data => {
            displaySalesOverview(data.salesOverview);
            displayTrafficOverview(data.trafficOverview);
            displayConversionRate(data.conversionRate);
            displayTopProducts(data.topProducts);
            displayTotalSales(data.totalSales);
        })
        .catch(error => console.error('Error fetching analytics data:', error));
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

function displayTrafficOverview(data) {
    const ctx = document.getElementById('trafficChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Traffic',
                data: data.values,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { display: true, title: { display: true, text: 'Date' } },
                y: { display: true, title: { display: true, text: 'Traffic' } }
            }
        }
    });
}

function displayConversionRate(data) {
    const ctx = document.getElementById('conversionChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Converted', 'Not Converted'],
            datasets: [{
                label: 'Conversion Rate',
                data: data.values,
                backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

function displayTopProducts(data) {
    const ctx = document.getElementById('topProductsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Top Products',
                data: data.values,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { display: true, title: { display: true, text: 'Product' } },
                y: { display: true, title: { display: true, text: 'Sales' } }
            }
        }
    });
}

function displayTotalSales(data) {
    const ctx = document.getElementById('totalSalesChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Total Sales',
                data: data.values,
                borderColor: 'rgba(255, 159, 64, 1)',
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