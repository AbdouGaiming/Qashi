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

// Fetch traffic overview data
$trafficOverview = [];
$trafficQuery = "SELECT DATE(visit_date) as date, COUNT(*) as visits FROM traffic GROUP BY DATE(visit_date)";
$trafficResult = $conn->query($trafficQuery);
if ($trafficResult && $trafficResult->num_rows > 0) {
    while ($row = $trafficResult->fetch_assoc()) {
        $trafficOverview['labels'][] = $row['date'];
        $trafficOverview['values'][] = $row['visits'];
    }
}

// Fetch conversion rate data
$conversionRate = [];
$conversionQuery = "SELECT COUNT(*) as total, SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as converted FROM orders";
$conversionResult = $conn->query($conversionQuery);
if ($conversionResult && $conversionResult->num_rows > 0) {
    $row = $conversionResult->fetch_assoc();
    $conversionRate['values'] = [$row['converted'], $row['total'] - $row['converted']];
}

// Fetch top products data
$topProducts = [];
$topProductsQuery = "SELECT p.name, SUM(oi.quantity) as total_sales FROM order_items oi JOIN products p ON oi.product_id = p.product_id GROUP BY oi.product_id ORDER BY total_sales DESC LIMIT 5";
$topProductsResult = $conn->query($topProductsQuery);
if ($topProductsResult && $topProductsResult->num_rows > 0) {
    while ($row = $topProductsResult->fetch_assoc()) {
        $topProducts['labels'][] = $row['name'];
        $topProducts['values'][] = $row['total_sales'];
    }
}

// Fetch total sales data
$totalSales = [];
$totalSalesQuery = "SELECT DATE(order_date) as date, SUM(total_amount) as sales FROM orders GROUP BY DATE(order_date)";
$totalSalesResult = $conn->query($totalSalesQuery);
if ($totalSalesResult && $totalSalesResult->num_rows > 0) {
    while ($row = $totalSalesResult->fetch_assoc()) {
        $totalSales['labels'][] = $row['date'];
        $totalSales['values'][] = $row['sales'];
    }
}

echo json_encode([
    'salesOverview' => $salesOverview,
    'trafficOverview' => $trafficOverview,
    'conversionRate' => $conversionRate,
    'topProducts' => $topProducts,
    'totalSales' => $totalSales
]);

$conn->close();
?>