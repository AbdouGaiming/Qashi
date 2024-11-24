document.getElementById("Submit").addEventListener("click", function () {
  event.preventDefault();
  var fullname = document.getElementById("fname").value.trim();
  var phone = document.getElementById("phone").value.trim();
  var address = document.getElementById("adr").value.trim();
  var city = document.getElementById("wilaya").value.trim();
  var ville = document.getElementById("ville").value.trim();
  var zip = document.getElementById("zip").value.trim();

  var valid = true;

  RegExpfullname = /^[a-zA-Z ]{2,30}$/;
  phoneRegExp =
    /^(0(6|5|7|9)\d{8}|0(21|23|29|44|20)\d{6}|\+213(7|5|6|9)\d{8})$/;
  RegExpaddress = /^[a-zA-Z0-9 ]{2,50}$/;
  RegExpcity = /^[a-zA-Z ]{2,30}$/;
  RegExpville = /^[a-zA-Z ]{2,30}$/;
  RegExpzip = /^[0-9]{5}$/;

  if (!RegExpfullname.test(fullname)) {
    valid = false;
    document.getElementById("fname").style.borderColor = "red";
    document.getElementById("I-fullname").style.display = "block";
  } else {
    document.getElementById("fname").style.borderColor = "green";
    document.getElementById("I-fullname").style.display = "none";
  }

  if (!phoneRegExp.test(phone)) {
    valid = false;
    document.getElementById("phone").style.borderColor = "red";
    document.getElementById("I-phone").style.display = "block";
  } else {
    document.getElementById("phone").style.borderColor = "green";
    document.getElementById("I-phone").style.display = "none";
  }

  if (!RegExpaddress.test(address)) {
    valid = false;
    document.getElementById("adr").style.borderColor = "red";
    document.getElementById("I-address").style.display = "block";
  } else {
    document.getElementById("adr").style.borderColor = "green";
    document.getElementById("I-address").style.display = "none";
  }

  if (!RegExpcity.test(city)) {
    valid = false;
    document.getElementById("wilaya").style.borderColor = "red";
    document.getElementById("I-wilaya").style.display = "block";
  } else {
    document.getElementById("wilaya").style.borderColor = "green";
    document.getElementById("I-wilaya").style.display = "none";
  }

  if (!RegExpville.test(ville)) {
    valid = false;
    document.getElementById("ville").style.borderColor = "red";
    document.getElementById("I-ville").style.display = "block";
  } else {
    document.getElementById("ville").style.borderColor = "green";
    document.getElementById("I-ville").style.display = "none";
  }

  if (!RegExpzip.test(zip)) {
    valid = false;
    document.getElementById("zip").style.borderColor = "red";
    document.getElementById("I-zip").style.display = "block";
  } else {
    document.getElementById("zip").style.borderColor = "green";
    document.getElementById("I-zip").style.display = "none";
  }

  if (valid) {
    Swal.fire({
      icon: "success",
      title: "Your order has been placed successfully",
      confirmButtonText: "Continue",
    }).then((result) => {
      if (result.isConfirmed) {
        document.getElementById("FormCheckOut").submit();
      }
    });
  }
});
