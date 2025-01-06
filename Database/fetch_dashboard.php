<?php
require 'database.php';

// Fetch sales overview data
$salesOverview = [];
$salesQuery = "SELECT DATE(order_date) as date, SUM(total_amount) as sales FROM orders GROUP BY DATE(order_date)";
$salesResult = $conn->query($salesQuery);
if ($salesResult && $salesResult->num_rows > 0) {
    while ($row = $salesResult->fetch_assoc()) {
        $salesOverview['labels'][] = $row['date'];
        $salesOverview['values'][] = $row['sales'];
    }
}

// Fetch total sales data
$totalSalesQuery = "SELECT SUM(total_amount) as totalSales FROM orders";
$totalSalesResult = $conn->query($totalSalesQuery);
$totalSales = $totalSalesResult->fetch_assoc()['totalSales'] ?? 0;

// Fetch average order value data
$avgOrderValueQuery = "SELECT AVG(total_amount) as avgOrderValue FROM orders";
$avgOrderValueResult = $conn->query($avgOrderValueQuery);
$avgOrderValue = $avgOrderValueResult->fetch_assoc()['avgOrderValue'] ?? 0;

// Fetch conversion rate data
$conversionRateQuery = "SELECT COUNT(*) as total, SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as converted FROM orders";
$conversionRateResult = $conn->query($conversionRateQuery);
$conversionRateRow = $conversionRateResult->fetch_assoc();
$conversionRate = ($conversionRateRow['converted'] / $conversionRateRow['total']) * 100;

// Fetch top selling products data
$topSellingProducts = [];
$topSellingProductsQuery = "SELECT p.name, p.price, SUM(oi.quantity) as soldUnits, 
                            CASE WHEN p.stock > 0 THEN 'In Stock' ELSE 'Out of Stock' END as status 
                            FROM order_items oi 
                            JOIN products p ON oi.product_id = p.product_id 
                            GROUP BY oi.product_id 
                            ORDER BY soldUnits DESC 
                            LIMIT 5";
$topSellingProductsResult = $conn->query($topSellingProductsQuery);
if ($topSellingProductsResult && $topSellingProductsResult->num_rows > 0) {
    while ($row = $topSellingProductsResult->fetch_assoc()) {
        $topSellingProducts[] = $row;
    }
}

// Calculate percentage changes (dummy values for now)
$totalSalesChange = 5; // Example: +5%
$avgOrderValueChange = 2; // Example: +2%
$conversionRateChange = 1; // Example: +1%

echo json_encode([
    'salesOverview' => $salesOverview,
    'totalSales' => $totalSales,
    'totalSalesChange' => $totalSalesChange,
    'avgOrderValue' => $avgOrderValue,
    'avgOrderValueChange' => $avgOrderValueChange,
    'conversionRate' => $conversionRate,
    'conversionRateChange' => $conversionRateChange,
    'topSellingProducts' => $topSellingProducts
]);

$conn->close();
