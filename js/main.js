// Nairobi Youth Economic Engagement Initiative — Main JavaScript
var FORMSPREE_ID = 'mykqvvdv';
var FORMSPREE_URL = 'https://formspree.io/f/' + FORMSPREE_ID;

// Local Storage helpers to record interactions for Admin Dashboard
function saveRegistration(data) {
  var records = JSON.parse(localStorage.getItem('nyeei_registrations') || '[]');
  data.id = Date.now();
  data.date = new Date().toLocaleString('en-KE');
  data.status = 'Pending';
  records.unshift(data);
  localStorage.setItem('nyeei_registrations', JSON.stringify(records));
}

function saveContactMessage(data) {
  var records = JSON.parse(localStorage.getItem('nyeei_messages') || '[]');
  data.id = Date.now();
  data.date = new Date().toLocaleString('en-KE');
  data.status = 'Unread';
  records.unshift(data);
  localStorage.setItem('nyeei_messages', JSON.stringify(records));
}

function saveDonation(data) {
  var records = JSON.parse(localStorage.getItem('nyeei_donations') || '[]');
  data.id = Date.now();
  data.date = new Date().toLocaleString('en-KE');
  data.status = 'Pending confirmation';
  records.unshift(data);
  localStorage.setItem('nyeei_donations', JSON.stringify(records));
}

// ── DONATION FLOW ──
function setAmount(val, btn) {
  var amtInput = document.getElementById('amount-input');
  var donateAmt = document.getElementById('donate-amount');
  if (amtInput) amtInput.value = val;
  if (donateAmt) donateAmt.textContent = val.toLocaleString();
  document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function syncAmount(val) {
  var v = parseInt(val) || 0;
  var donateAmt = document.getElementById('donate-amount');
  if (donateAmt) donateAmt.textContent = v.toLocaleString();
  document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
}

function resetDonate() {
  var step1 = document.getElementById('donate-step-1');
  var step2 = document.getElementById('donate-step-2');
  if (step1) step1.style.display = 'block';
  if (step2) step2.style.display = 'none';
}

function handleDonate() {
  var amtInput = document.getElementById('amount-input');
  var donorName = document.getElementById('donor-name');
  var donorEmail = document.getElementById('donor-email');
  
  var amt = parseInt(amtInput ? amtInput.value : 1000) || 0;
  var name = donorName ? donorName.value.trim() : 'Anonymous';
  var email = donorEmail ? donorEmail.value.trim() : '';

  if (amt < 1) {
    alert('Please enter a donation amount.');
    return;
  }

  // Save donation intent locally
  saveDonation({ name: name || 'Anonymous', email: email, amount: amt });

  // Notify Admin via Formspree fetch
  fetch(FORMSPREE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      _subject: '💰 New Donation Intent — KES ' + amt.toLocaleString() + ' from ' + (name || 'Anonymous'),
      _replyto: 'nyeeiorganization@gmail.com',
      'Form Type': 'Donation',
      'Donor Name': name || 'Anonymous',
      'Email': email || '—',
      'Amount (KES)': amt.toLocaleString(),
      'Bank': 'I&M Bank Kenya',
      'Account Name': 'John Ochieng Ohuru',
      'Account Number': '04007912526150',
      'Status': 'Pending bank transfer confirmation'
    })
  }).catch(function() {});

  // Update bank confirmation step UI
  var confirmAmt = document.getElementById('confirm-amount');
  var confirmRef = document.getElementById('confirm-ref');
  var waLink = document.getElementById('whatsapp-link');
  var step1 = document.getElementById('donate-step-1');
  var step2 = document.getElementById('donate-step-2');

  if (confirmAmt) confirmAmt.textContent = amt.toLocaleString();
  if (confirmRef) confirmRef.textContent = name || 'Anonymous';
  
  var waText = encodeURIComponent('Hello NYEEI, I have just made a donation of KES ' + amt.toLocaleString() + '. My name is ' + (name || 'Donor') + '.');
  if (waLink) waLink.href = 'https://wa.me/254793633079?text=' + waText;
  
  if (step1) step1.style.display = 'none';
  if (step2) step2.style.display = 'block';
  if (step2) step2.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── UTILITIES ──
function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(function() {
    var orig = btn.textContent;
    btn.textContent = 'Copied!';
    btn.style.background = 'var(--green)';
    btn.style.color = 'white';
    setTimeout(function() {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.color = '';
    }, 2000);
  });
}

// ── FORM INITIALIZATION (Formspree AJAX Integration) ──
document.addEventListener('DOMContentLoaded', function() {
  // Init Registration Form
  var regForm = document.getElementById('reg-form');
  if (typeof formspree === 'function' && regForm) {
    formspree('initForm', { formElement: '#reg-form', formId: FORMSPREE_ID });
    
    regForm.addEventListener('formspree:success', function() {
      var name = document.getElementById('reg-name').value.trim();
      var phone = document.getElementById('reg-phone').value.trim();
      var email = document.getElementById('reg-email').value.trim();
      var constituency = document.getElementById('reg-constituency').value;
      var reason = document.getElementById('reg-reason').value.trim();
      
      saveRegistration({ name: name, phone: phone, email: email, constituency: constituency, reason: reason });
      
      var msg = encodeURIComponent('🌍 *New NYEEI Member Registration*\n\n👤 *Name:* ' + name + '\n📞 *Phone:* ' + phone + '\n📧 *Email:* ' + email + '\n📍 *Constituency:* ' + constituency + '\n💬 *Reason:* ' + reason);
      var regWaBtn = document.getElementById('reg-whatsapp-btn');
      if (regWaBtn) regWaBtn.href = 'https://wa.me/254793633079?text=' + msg;
      
      setTimeout(function() {
        window.open('https://wa.me/254793633079?text=' + msg, '_blank');
      }, 800);
    });
  }

  // Init Contact Form
  var contactForm = document.getElementById('contact-form');
  if (typeof formspree === 'function' && contactForm) {
    formspree('initForm', { formElement: '#contact-form', formId: FORMSPREE_ID });
    
    contactForm.addEventListener('formspree:success', function() {
      var name = document.getElementById('contact-name').value.trim();
      var email = document.getElementById('contact-email').value.trim();
      var message = document.getElementById('contact-message').value.trim();
      
      saveContactMessage({ name: name, email: email, message: message, phone: '' });
    });
  }
});
