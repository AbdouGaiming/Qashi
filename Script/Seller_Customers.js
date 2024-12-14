document.addEventListener('DOMContentLoaded', function () {
    loadCustomers();

    document.getElementById('add-customer-form').addEventListener('submit', function(event) {
        event.preventDefault();

        let valid = true;

        const firstname = document.getElementById("firstname").value.trim();
        const lastname = document.getElementById("lastname").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();

        const nameRegExp = /^[a-zA-Z\s]+$/;
        const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegExp = /^\d{10}$/;

        if (!nameRegExp.test(firstname)) {
            document.getElementById("I-firstname").style.display = "block";
            valid = false;
        } else {
            document.getElementById("I-firstname").style.display = "none";
        }

        if (!nameRegExp.test(lastname)) {
            document.getElementById("I-lastname").style.display = "block";
            valid = false;
        } else {
            document.getElementById("I-lastname").style.display = "none";
        }

        if (!emailRegExp.test(email)) {
            document.getElementById("I-email").style.display = "block";
            valid = false;
        } else {
            document.getElementById("I-email").style.display = "none";
        }

        if (!phoneRegExp.test(phone)) {
            document.getElementById("I-phone").style.display = "block";
            valid = false;
        } else {
            document.getElementById("I-phone").style.display = "none";
        }

        if (valid) {
            const customerData = {
                firstname: firstname,
                lastname: lastname,
                email: email,
                phone: phone
            };

            if (document.getElementById('add-customer-submit').textContent === 'Add Customer') {
                addCustomer(customerData);
            } else {
                customerData.user_id = document.getElementById('user-id').value;
                updateCustomer(customerData);
            }
        }
    });
});

function loadCustomers() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'Database/fetch_customers.php', true);

    xhr.onload = function () {
        if (this.status === 200) {
            const customers = JSON.parse(this.responseText);
            displayCustomers(customers);
        }
    };

    xhr.send();
}

function displayCustomers(customers) {
    const customersTableBody = document.querySelector('.customers-table tbody');
    customersTableBody.innerHTML = '';

    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.user_id}</td>
            <td>${customer.firstname} ${customer.lastname}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>
                <button class="edit-button">Edit</button>
                <button class="delete-button">Delete</button>
            </td>
        `;

        // Attach event listeners
        const editButton = row.querySelector('.edit-button');
        const deleteButton = row.querySelector('.delete-button');

        editButton.addEventListener('click', function () {
            editCustomer(customer);
        });

        deleteButton.addEventListener('click', function () {
            deleteCustomer(customer.user_id);
        });

        customersTableBody.appendChild(row);
    });
}

function addCustomer(customerData) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'Database/customers.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (this.status === 200) {
            loadCustomers();
        }
    };

    const params = new URLSearchParams(customerData).toString();

    xhr.send(`action=add&${params}`);
}

function deleteCustomer(userId) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'Database/customers.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (this.status === 200) {
            loadCustomers();
        }
    };

    xhr.send(`action=delete&user_id=${encodeURIComponent(userId)}`);
}

function editCustomer(customer) {
    // Populate form with customer data
    document.getElementById('user-id').value = customer.user_id;
    document.getElementById('firstname').value = customer.firstname;
    document.getElementById('lastname').value = customer.lastname;
    document.getElementById('email').value = customer.email;
    document.getElementById('phone').value = customer.phone;

    // Show form
    toggleAddCustomerForm();

    // Change submit event to update
    document.getElementById('add-customer-submit').textContent = 'Update Customer';
}

function updateCustomer(customerData) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'Database/customers.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (this.status === 200) {
            loadCustomers();
        }
    };

    const params = new URLSearchParams(customerData).toString();

    xhr.send(`action=update&${params}`);
}

function toggleAddCustomerForm() {
    const form = document.getElementById('add-customer-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    form.reset();
    document.getElementById('add-customer-submit').textContent = 'Add Customer';
}