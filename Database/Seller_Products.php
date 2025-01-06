<?php
require_once 'database.php';

header('Content-Type: application/json');

// Define the directory for uploads
$uploadDir = 'uploads/';

// Ensure the upload directory exists
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$action = isset($_POST['action']) ? $_POST['action'] : '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch products with variants
    $sql = "SELECT p.product_id, p.name, p.description, p.price, pv.variant_id, pv.color, pv.size, pv.stock_quantity, p.category, p.sub_category, p.image_url
            FROM products p
            LEFT JOIN product_variants pv ON p.product_id = pv.product_id
            ORDER BY p.product_id ASC, pv.variant_id ASC";
    $result = $conn->query($sql);

    $products = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $pid = $row['product_id'];
            if (!isset($products[$pid])) {
                $products[$pid] = [
                    'product_id' => $row['product_id'],
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'price' => $row['price'],
                    'category' => $row['category'],
                    'sub_category' => $row['sub_category'],
                    'image_url' => $row['image_url'],
                    'variants' => []
                ];
            }
            if ($row['variant_id']) {
                $products[$pid]['variants'][] = [
                    'variant_id' => $row['variant_id'],
                    'color' => $row['color'],
                    'size' => $row['size'],
                    'stock_quantity' => $row['stock_quantity']
                ];
            }
        }
    }

    // Reset array keys
    $products = array_values($products);

    echo json_encode($products);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    switch ($action) {
        case 'add':
            // Handle 'add' action
            $name = isset($_POST['name']) ? $conn->real_escape_string($_POST['name']) : '';
            $description = isset($_POST['description']) ? $conn->real_escape_string($_POST['description']) : '';
            $price = isset($_POST['price']) ? floatval($_POST['price']) : 0.00;
            $category = isset($_POST['category']) ? $conn->real_escape_string($_POST['category']) : '';
            $sub_category = isset($_POST['sub_category']) ? $conn->real_escape_string($_POST['sub_category']) : '';

            // Handle file upload
            if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
                $fileTmpPath = $_FILES['image_file']['tmp_name'];
                $fileName = $_FILES['image_file']['name'];
                $fileSize = $_FILES['image_file']['size'];
                $fileType = $_FILES['image_file']['type'];
                $fileNameCmps = explode(".", $fileName);
                $fileExtension = strtolower(end($fileNameCmps));

                // Sanitize file name
                $newFileName = md5(time() . $fileName) . '.' . $fileExtension;

                // Allowed file extensions
                $allowedfileExtensions = array('jpg', 'jpeg', 'png', 'gif', 'svg');

                if (in_array($fileExtension, $allowedfileExtensions)) {
                    // Directory in which the uploaded file will be moved
                    $dest_path = $uploadDir . $newFileName;

                    if(move_uploaded_file($fileTmpPath, $dest_path)) {
                        $image_url = $dest_path;
                    } else {
                        echo json_encode(["error" => "There was an error moving the uploaded file."]);
                        exit;
                    }
                } else {
                    echo json_encode(["error" => "Upload failed. Allowed file types: " . implode(', ', $allowedfileExtensions)]);
                    exit;
                }
            } else {
                echo json_encode(["error" => "Image file is required and must be a valid image."]);
                exit;
            }

            // Insert into products table
            $sql = "INSERT INTO products (name, description, price, stock, category, sub_category, image_url) 
                    VALUES ('$name', '$description', $price, 0, '$category', '$sub_category', '$image_url')";

            if ($conn->query($sql) === TRUE) {
                $product_id = $conn->insert_id;

                // Handle variants
                if (isset($_POST['variants'])) {
                    $variants = json_decode($_POST['variants'], true);
                    foreach ($variants as $variant) {
                        $variant_color = isset($variant['color']) ? $conn->real_escape_string($variant['color']) : '';
                        $variant_size = isset($variant['size']) ? $conn->real_escape_string($variant['size']) : '';
                        $variant_stock_quantity = isset($variant['stock_quantity']) ? intval($variant['stock_quantity']) : 0;

                        // Insert into product_variants
                        $sql_variant = "INSERT INTO product_variants (product_id, color, size, stock_quantity)
                                        VALUES ($product_id, '$variant_color', '$variant_size', $variant_stock_quantity)";
                        $conn->query($sql_variant);
                    }
                }

                echo json_encode(["success" => "Product added successfully."]);
            } else {
                echo json_encode(["error" => "Error adding product: " . $conn->error]);
            }
            break;

        case 'update':
            // Handle 'update' action
            $product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;
            $name = isset($_POST['name']) ? $conn->real_escape_string($_POST['name']) : '';
            $description = isset($_POST['description']) ? $conn->real_escape_string($_POST['description']) : '';
            $price = isset($_POST['price']) ? floatval($_POST['price']) : 0.00;
            $category = isset($_POST['category']) ? $conn->real_escape_string($_POST['category']) : '';
            $sub_category = isset($_POST['sub_category']) ? $conn->real_escape_string($_POST['sub_category']) : '';

            // Handle file upload
            if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
                $fileTmpPath = $_FILES['image_file']['tmp_name'];
                $fileName = $_FILES['image_file']['name'];
                $fileSize = $_FILES['image_file']['size'];
                $fileType = $_FILES['image_file']['type'];
                $fileNameCmps = explode(".", $fileName);
                $fileExtension = strtolower(end($fileNameCmps));

                // Sanitize file name
                $newFileName = md5(time() . $fileName) . '.' . $fileExtension;

                // Allowed file extensions
                $allowedfileExtensions = array('jpg', 'jpeg', 'png', 'gif', 'svg');

                if (in_array($fileExtension, $allowedfileExtensions)) {
                    // Directory in which the uploaded file will be moved
                    $dest_path = $uploadDir . $newFileName;

                    if(move_uploaded_file($fileTmpPath, $dest_path)) {
                        $image_url = $dest_path;
                        // Optionally, delete the old image file
                        $sql_old = "SELECT image_url FROM products WHERE product_id = $product_id";
                        $result_old = $conn->query($sql_old);
                        if ($result_old && $result_old->num_rows > 0) {
                            $row_old = $result_old->fetch_assoc();
                            if (file_exists($row_old['image_url'])) {
                                unlink($row_old['image_url']);
                            }
                        }
                    } else {
                        echo json_encode(["error" => "There was an error moving the uploaded file."]);
                        exit;
                    }
                } else {
                    echo json_encode(["error" => "Upload failed. Allowed file types: " . implode(', ', $allowedfileExtensions)]);
                    exit;
                }
            } else {
                // If no new image is uploaded, retain the existing image_url
                $sql_select = "SELECT image_url FROM products WHERE product_id = $product_id";
                $result_select = $conn->query($sql_select);
                if ($result_select && $result_select->num_rows > 0) {
                    $row = $result_select->fetch_assoc();
                    $image_url = $row['image_url'];
                } else {
                    echo json_encode(["error" => "Product not found."]);
                    exit;
                }
            }

            // Update products table
            $sql = "UPDATE products 
                    SET name = '$name', description = '$description', price = $price, category = '$category', sub_category = '$sub_category', image_url = '$image_url'
                    WHERE product_id = $product_id";

            if ($conn->query($sql) === TRUE) {
                // Handle variants
                if (isset($_POST['variants'])) {
                    $variants = json_decode($_POST['variants'], true);
                    // First, delete existing variants for simplicity
                    $sql_delete = "DELETE FROM product_variants WHERE product_id = $product_id";
                    $conn->query($sql_delete);

                    // Insert new variants
                    foreach ($variants as $variant) {
                        $variant_color = isset($variant['color']) ? $conn->real_escape_string($variant['color']) : '';
                        $variant_size = isset($variant['size']) ? $conn->real_escape_string($variant['size']) : '';
                        $variant_stock_quantity = isset($variant['stock_quantity']) ? intval($variant['stock_quantity']) : 0;

                        // Insert into product_variants
                        $sql_variant = "INSERT INTO product_variants (product_id, color, size, stock_quantity)
                                        VALUES ($product_id, '$variant_color', '$variant_size', $variant_stock_quantity)";
                        $conn->query($sql_variant);
                    }
                }

                echo json_encode(["success" => "Product updated successfully."]);
            } else {
                echo json_encode(["error" => "Error updating product: " . $conn->error]);
            }
            break;

        case 'delete':
            // Delete a product
            $product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;

            // First, retrieve the image_url to delete the image file from the server
            $sql_select = "SELECT image_url FROM products WHERE product_id = $product_id";
            $result_select = $conn->query($sql_select);
            if ($result_select && $result_select->num_rows > 0) {
                $row = $result_select->fetch_assoc();
                $image_url = $row['image_url'];

                // Delete the image file
                if (file_exists($image_url)) {
                    unlink($image_url);
                }
            }

            // Delete product_variants
            $sql_delete_variants = "DELETE FROM product_variants WHERE product_id = $product_id";
            $conn->query($sql_delete_variants);

            // Delete the product from the database
            $sql = "DELETE FROM products WHERE product_id=$product_id";

            if ($conn->query($sql) === TRUE) {
                echo json_encode(["success" => "Product deleted successfully."]);
            } else {
                echo json_encode(["error" => "Error deleting product: " . $conn->error]);
            }
            break;

        case 'delete_variant':
            // Handle 'delete_variant' action
            $product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;
            $variant_id = isset($_POST['variant_id']) ? intval($_POST['variant_id']) : 0;

            if ($product_id > 0 && $variant_id > 0) {
                $sql = "DELETE FROM product_variants WHERE variant_id = $variant_id AND product_id = $product_id";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(["success" => "Variant deleted successfully."]);
                } else {
                    echo json_encode(["error" => "Error deleting variant: " . $conn->error]);
                }
            } else {
                echo json_encode(["error" => "Invalid product or variant ID."]);
            }
            break;

        default:
            echo json_encode(["error" => "Invalid action."]);
            break;
    }
} else {
    echo json_encode(["error" => "Invalid request method."]);
}

$conn->close();
?>