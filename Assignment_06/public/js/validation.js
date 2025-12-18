$(document).ready(function() {

  // ---------- TOGGLE CARD DETAILS ----------
  function toggleCard() {
    $('#cardDetails').toggle($('#card').is(':checked'));
  }
  toggleCard();
  $('input[name="payment"]').change(toggleCard);

  // Enable "Place Order" only when terms are checked
  $('#terms').change(function() {
    $('#placeOrder').prop('disabled', !this.checked);
  });

  // ---------- CHECKOUT BUTTON ----------
  $('#toCheckout').off('click').on('click', function() {
    const selected = $('.menu-checkbox:checked');
    if (selected.length === 0) {
      alert('Select at least one item!');
      return;
    }

    // Hide menu and filter section
    $('#menu-section').hide();
    $('form.row.g-3').hide(); // filter form
    $('#checkout-section').show();
    $('html, body').animate({ scrollTop: 0 }, 200);

    // Build order summary
    $('#orderSummaryList').empty();
    let subtotal = 0;

    selected.each(function() {
      const name = $(this).data('name');
      const price = parseFloat($(this).data('price'));
      subtotal += price;
      $('#orderSummaryList').append(`
        <li class="list-group-item d-flex justify-content-between">
          ${name}<span>$${price.toFixed(2)}</span>
        </li>
      `);
    });

    const shipping = 5.00;
    const tax = subtotal * 0.10;
    const grandTotal = subtotal + shipping + tax;

    $('#orderSummaryList').append(`
      <li class="list-group-item d-flex justify-content-between fw-bold">
        Subtotal<span>$${subtotal.toFixed(2)}</span>
      </li>
      <li class="list-group-item d-flex justify-content-between">
        Shipping<span>$${shipping.toFixed(2)}</span>
      </li>
      <li class="list-group-item d-flex justify-content-between">
        Tax (10%)<span>$${tax.toFixed(2)}</span>
      </li>
      <li class="list-group-item d-flex justify-content-between fw-bold text-success">
        Grand Total<span>$${grandTotal.toFixed(2)}</span>
      </li>
    `);
  });

  // ---------- LIVE VALIDATION ----------
  function validateField(field) {
    const id = field.attr('id');
    const val = field.val().trim();
    let valid = true;
    let message = '';

    switch (id) {
      case 'fullName':
        if (val.length < 3) { valid = false; message = 'Full name must be at least 3 characters'; }
        break;
      case 'email':
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(val)) { valid = false; message = 'Enter a valid email'; }
        break;
      case 'phone':
        if (!/^\d{10,}$/.test(val)) { valid = false; message = 'Enter at least 10 digits'; }
        break;
      case 'address':
        if (!val) { valid = false; message = 'Address is required'; }
        break;
      case 'city':
        if (!val) { valid = false; message = 'City is required'; }
        break;
      case 'postal':
        if (!/^\d{4,6}$/.test(val)) { valid = false; message = 'Postal code must be 4–6 digits'; }
        break;
      case 'country':
        if (!val) { valid = false; message = 'Select a country'; }
        break;
      case 'cardName':
      case 'cardNumber':
      case 'expiry':
      case 'cvv':
        if ($('#card').is(':checked') && !val) { valid = false; message = 'Required'; }
        break;
    }

    if (valid) {
      field.removeClass('is-invalid').addClass('is-valid');
      field.siblings('.invalid-feedback').text('');
    } else {
      field.removeClass('is-valid').addClass('is-invalid');
      field.siblings('.invalid-feedback').text(message);
    }
    return valid;
  }

  // Trigger live validation
  $('#customerForm input, #customerForm select, #cardDetails input').on('input change', function() {
    validateField($(this));
  });

  // ---------- PLACE ORDER ----------
  $('#placeOrder').click(function(e) {
    e.preventDefault();
    let firstError = null;

    $('#customerForm input, #customerForm select, #cardDetails input').each(function() {
      const valid = validateField($(this));
      if (!firstError && !valid) firstError = $(this);
    });

    if (!$('input[name="payment"]:checked').val()) {
      alert('Select a payment method');
      return;
    }

    if (!$('#terms').is(':checked')) {
      alert('You must agree to terms & conditions');
      return;
    }

    if (firstError) {
      $('html, body').animate({ scrollTop: firstError.offset().top - 100 }, 300);
      return;
    }

    alert('Order placed successfully!');
  });

  // Revalidate card inputs when payment method changes
  $('input[name="payment"]').change(function() {
    $('#cardDetails input').each(function() {
      validateField($(this));
    });
  });

});
