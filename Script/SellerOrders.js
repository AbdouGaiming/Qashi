document.addEventListener('DOMContentLoaded', function () {
    loadOrders();
});

function loadOrders() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'Database/fetch_orders.php', true);

    xhr.onload = function () {
        if (this.status === 200) {
            const orders = JSON.parse(this.responseText);
            displayOrders(orders);
        }
    };

    xhr.send();
}

function displayOrders(orders) {
    const ordersTableBody = document.querySelector('.orders-table tbody');
    ordersTableBody.innerHTML = '';

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.order_id}</td>
            <td>${order.customer_name}</td>
            <td>${order.order_date}</td>
            <td>${order.total_amount}</td>
            <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
            <td>
                <button class="edit-button">Edit</button>
                <button class="delete-button">Delete</button>
            </td>
        `;

        // Attach event listeners to the buttons
        const editButton = row.querySelector('.edit-button');
        const deleteButton = row.querySelector('.delete-button');

        editButton.addEventListener('click', function () {
            updateOrderStatus(order.order_id, 'Completed');
        });

        deleteButton.addEventListener('click', function () {
            deleteOrder(order.order_id);
        });

        ordersTableBody.appendChild(row);
    });
}

function updateOrderStatus(orderId, status) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'Database/orders.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (this.status === 200) {
            loadOrders();
        }
    };

    xhr.send(`action=update&order_id=${encodeURIComponent(orderId)}&status=${encodeURIComponent(status)}`);
}

function deleteOrder(orderId) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'Database/orders.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (this.status === 200) {
            loadOrders();
        }
    };

    xhr.send(`action=delete&order_id=${encodeURIComponent(orderId)}`);
}