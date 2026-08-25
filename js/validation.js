// ============================================================
// Campus Placement Cell — form validation
// A small, reusable validation engine driven entirely by
// data-validate="rule1 rule2:param" attributes on inputs.
// Used by every form across the portal (login, register, apply,
// profile, resume builder, admin-companies, help/contact).
// ============================================================

(function () {

  // ---- individual rule functions -----------------------------------
  var Validators = {
    required: function (value, field) {
      if (field.type === 'checkbox') return field.checked;
      return value.trim().length > 0;
    },
    email: function (value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    },
    phone: function (value) {
      // 10-digit Indian mobile number, starting 6-9
      return /^[6-9]\d{9}$/.test(value.trim());
    },
    cgpa: function (value) {
      var n = parseFloat(value);
      return !isNaN(n) && n >= 0 && n <= 10;
    },
    integerMin0: function (value) {
      if (value.trim() === '') return false;
      var n = Number(value);
      return Number.isInteger(n) && n >= 0;
    },
    minLength8: function (value) {
      return value.trim().length >= 8;
    },
    year: function (value) {
      return /^20\d{2}$/.test(value.trim());
    },
    rollNumber: function (value) {
      // e.g. 22CS1042
      return /^\d{2}[A-Za-z]{2,4}\d{3,5}$/.test(value.trim());
    },
    futureDate: function (value) {
      if (!value) return false;
      var picked = new Date(value);
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      return picked >= today;
    }
  };

  var Messages = {
    required: 'This field is required.',
    email: 'Enter a valid email address.',
    phone: 'Enter a valid 10-digit mobile number.',
    cgpa: 'CGPA must be a number between 0 and 10.',
    integerMin0: 'Enter a whole number of 0 or more.',
    minLength8: 'Must be at least 8 characters.',
    year: 'Enter a 4-digit year, e.g. 2027.',
    rollNumber: 'Enter a roll number like 22CS1042.',
    futureDate: 'Pick today\u2019s date or a date in the future.',
    match: 'Doesn\u2019t match.'
  };

  // ---- error display helpers -----------------------------------
  function fieldWrap(field) {
    return field.closest('.field') || field.parentElement;
  }

  function showFieldError(field, message) {
    var wrap = fieldWrap(field);
    wrap.classList.add('has-error');
    var msg = wrap.querySelector('.field-error');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'field-error';
      wrap.appendChild(msg);
    }
    msg.textContent = message;
  }

  function clearFieldError(field) {
    var wrap = fieldWrap(field);
    wrap.classList.remove('has-error');
    var msg = wrap.querySelector('.field-error');
    if (msg) msg.remove();
  }

  // ---- core validation -----------------------------------
  function validateField(field, form) {
    var rulesAttr = field.getAttribute('data-validate');
    if (!rulesAttr) return true;
    var rules = rulesAttr.split(' ').filter(Boolean);
    var value = field.type === 'checkbox' ? '' : field.value;

    for (var i = 0; i < rules.length; i++) {
      var parts = rules[i].split(':');
      var ruleName = parts[0];
      var param = parts[1];
      var ok;

      if (ruleName === 'match') {
        var target = form.querySelector('[name="' + param + '"]');
        ok = target ? value === target.value : true;
      } else if (Validators[ruleName]) {
        ok = Validators[ruleName](value, field);
      } else {
        ok = true; // unknown rule name — don't block submission
      }

      if (!ok) {
        showFieldError(field, Messages[ruleName] || 'Invalid value.');
        return false;
      }
    }
    clearFieldError(field);
    return true;
  }

  function validateForm(form) {
    var fields = form.querySelectorAll('[data-validate]');
    var allValid = true;
    var firstInvalid = null;

    fields.forEach(function (field) {
      var ok = validateField(field, form);
      if (!ok) {
        allValid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      fieldWrap(firstInvalid).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return allValid;
  }

  // ---- wire up live re-validation as the person fixes a field -------
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-validate]').forEach(function (field) {
      var form = field.closest('form');
      if (!form) return;
      var evt = (field.tagName === 'SELECT' || field.type === 'checkbox' || field.type === 'date') ? 'change' : 'input';
      field.addEventListener(evt, function () {
        if (fieldWrap(field).classList.contains('has-error')) {
          validateField(field, form);
        }
      });
      // Password confirmation should also re-check when the original changes
      if (field.name) {
        form.querySelectorAll('[data-validate*="match:' + field.name + '"]').forEach(function (dependent) {
          field.addEventListener('input', function () {
            if (fieldWrap(dependent).classList.contains('has-error')) {
              validateField(dependent, form);
            }
          });
        });
      }
    });
  });

  // Exposed for main.js to call before showing the demo-submit note
  window.PortalValidation = {
    validateForm: validateForm,
    validateField: validateField
  };

})();
