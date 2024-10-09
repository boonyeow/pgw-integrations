function validatePrice(value) {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue) || parsedValue <= 0) {
    return false;
  }
  return true;
}

function validateCardNumber(value) {
  const regex = /^[0-9]{15,16}$/;
  if (!regex.test(value)) {
    return false;
  }
  return true;
}

function validateCCV(value) {
  const regex = /^[0-9]{3,4}$/;
  if (!regex.test(value)) {
    return false;
  }
  return true;
}

function validateExpirationMonth(value) {
  const regex = /^(0[1-9]|1[0-2])$/;
  if (!regex.test(value)) {
    return false;
  }
  return true;
}

function validateExpirationYear(value) {
  const yearRegex = new RegExp(
    `^(${currentYear}|${currentYear + 1}|[2-9][0-9]{3})$`
  );
  if (!yearRegex.test(value)) {
    return false;
  }
  return true;
}

// function validateExpirationMonth(input) {
//   const errorElement = document.getElementById("expiration-month-help"); // Get the error message element

//   const regex = /^(0[1-9]|1[0-2])$/;
//   if (!regex.test(input.value)) {
//     errorElement.classList.remove("d-none");
//     return false;
//   }
//   errorElement.classList.add("d-none");
//   return true;
// }
