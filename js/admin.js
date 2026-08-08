// Nairobi Youth Economic Engagement Initiative — Admin Script
var ADMIN_PASS = 'Johnohuru048';
var adminUnlocked = false;

function adminLogin() {
  var pwInput = document.getElementById('admin-pw');
  var pw = pwInput ? pwInput.value : '';
  var err = document.getElementById('admin-login-error');
  var loginScreen = document.getElementById('admin-login-screen');
  var adminMain = document.getElementById('admin-main');

  if (pw === ADMIN_PASS) {
    adminUnlocked = true;
    if (loginScreen) loginScreen.style.display = 'none';
    if (adminMain) adminMain.style.display = 'block';
    loadAdminTab('overview');
  } else {
    if (err) {
      err.style.display = 'block';
      err.textContent = '❌ Incorrect password. Please try again.';
    }
    if (pwInput) pwInput.value = '';
  }
}

function adminLogout() {
  adminUnlocked = false;
  var pwInput = document.getElementById('admin-pw');
  var loginScreen = document.getElementById('admin-login-screen');
  var adminMain = document.getElementById('admin-main');

  if (loginScreen) loginScreen.style.display = 'flex';
  if (adminMain) adminMain.style.display = 'none';
  if (pwInput) pwInput.value = '';
}

function loadAdminTab(tab) {
  document.querySelectorAll('.admin-tab-btn').forEach(function(b) {
    b.classList.remove('active');
  });
  var tabBtn = document.getElementById('tab-' + tab);
  if (tabBtn) tabBtn.classList.add('active');
  
  var content = document.getElementById('admin-content');
  if (!content) return;

  if (tab === 'registrations') {
    var records = JSON.parse(localStorage.getItem('nyeei_registrations') || '[]');
    var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">' +
      '<h3 style="font-family:Syne,sans-serif;font-size:1.1rem;font-weight:800;">Member Registrations <span style="background:#e6f4ec;color:#0f5228;border-radius:100px;font-size:0.78rem;padding:0.2rem 0.7rem;margin-left:0.5rem;">' + records.length + '</span></h3>' +
      '<button onclick="exportCSV(\'nyeei_registrations\')" style="background:#0f5228;color:white;border:none;border-radius:6px;padding:0.45rem 1rem;font-size:0.82rem;font-weight:600;cursor:pointer;">⬇ Export CSV</button></div>';
    
    if (records.length === 0) {
      html += '<div style="text-align:center;padding:3rem;color:#4a6355;font-size:0.95rem;">No registrations yet.</div>';
    } else {
      html += '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.85rem;">' +
        '<thead><tr style="background:#f0f7f3;">' +
        '<th style="padding:0.65rem 0.75rem;text-align:left;font-weight:700;border-bottom:2px solid #d4e0d8;white-space:nowrap;">#</th>' +
        '<th style="padding:0.65rem 0.75rem;text-align:left;font-weight:700;border-bottom:2px solid #d4e0d8;white-space:nowrap;">Date</th>' +
        '<th style="padding:0.65rem 0.75rem;text-align:left;font-weight:700;border-bottom:2px solid #d4e0d8;white-space:nowrap;">Full Name</th>' +
        '<th style="padding:0.65rem 0.75rem;text-align:left;font-weight:700;border-bottom:2px solid #d4e0d8;white-space:nowrap;">Phone</th>' +
        '<th style="padding:0.65rem 0.75rem;text-align:left;font-weight:700;border-bottom:2px solid #d4e0d8;white-space:nowrap;">Email</th>' +
        '<th style="padding:0.65rem 0.75rem;text-align:left;font-weight:700;border-bottom:2px solid #d4e0d8;white-space:nowrap;">Constituency</th>' +
        '<th style="padding:0.65rem 0.75rem;text-align:left;font-weight:700;border-bottom:2px solid #d4e0d8;white-space:nowrap;">Reason</th>' +
        '<th style="padding:0.65rem 0.75rem;text-align:left;font-weight:700;border-bottom:2px solid #d4e0d8;white-space:nowrap;">Status</th>' +
        '<th style="padding:0.65rem 0.75rem;text-align:left;font-weight:700;border-bottom:2px solid #d4e0d8;white-space:nowrap;">Actions</th>' +
        '</tr></thead><tbody>';
      records.forEach(function(r, i) {
        var statusColor = r.status === 'Approved' ? '#1a7a3c' : r.status === 'Rejected' ? '#c0392b' : '#d4a017';
        html += '<tr style="border-bottom:1px solid #eef3f0;">' +
          '<td style="padding:0.65rem 0.75rem;color:#4a6355;">' + (i+1) + '</td>' +
          '<td style="padding:0.65rem 0.75rem;white-space:nowrap;color:#4a6355;">' + r.date + '</td>' +
          '<td style="padding:0.65rem 0.75rem;font-weight:600;">' + r.name + '</td>' +
          '<td style="padding:0.65rem 0.75rem;"><a href="tel:' + r.phone + '" style="color:#1a7a3c;">' + r.phone + '</a></td>' +
          '<td style="padding:0.65rem 0.75rem;"><a href="mailto:' + r.email + '" style="color:#1a7a3c;">' + r.email + '</a></td>' +
          '<td style="padding:0.65rem 0.75rem;">' + r.constituency + '</td>' +
          '<td style="padding:0.65rem 0.75rem;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + r.reason + '">' + r.reason + '</td>' +
          '<td style="padding:0.65rem 0.75rem;"><span style="background:' + statusColor + '20;color:' + statusColor + ';border-radius:100px;font-size:0.75rem;font-weight:700;padding:0.2rem 0.6rem;">' + r.status + '</span></td>' +
          '<td style="padding:0.65rem 0.75rem;white-space:nowrap;">' +
          '<button onclick="updateStatus(\'nyeei_registrations\',' + r.id + ',\'Approved\')" style="background:#e6f4ec;color:#0f5228;border:none;border-radius:5px;padding:0.3rem 0.6rem;font-size:0.75rem;font-weight:700;cursor:pointer;margin-right:0.3rem;">✓ Approve</button>' +
          '<button onclick="updateStatus(\'nyeei_registrations\',' + r.id + ',\'Rejected\')" style="background:#fdecea;color:#c0392b;border:none;border-radius:5px;padding:0.3rem 0.6rem;font-size:0.75rem;font-weight:700;cursor:pointer;margin-right:0.3rem;">✗ Reject</button>' +
          '<button onclick="deleteRecord(\'nyeei_registrations\',' + r.id + ')" style="background:#f5f5f5;color:#666;border:none;border-radius:5px;padding:0.3rem 0.6rem;font-size:0.75rem;cursor:pointer;">🗑</button>' +
          '</td></tr>';
      });
      html += '</tbody></table></div>';
    }
    content.innerHTML = html;

  } else if (tab === 'donations') {
    var records = JSON.parse(localStorage.getItem('nyeei_donations') || '[]');
    var total = records.reduce(function(s,r){ return s + (parseFloat(r.amount)||0); }, 0);
    var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">' +
      '<h3 style="font-family:Syne,sans-serif;font-size:1.1rem;font-weight:800;">Donations <span style="background:#e6f4ec;color:#0f5228;border-radius:100px;font-size:0.78rem;padding:0.2rem 0.7rem;margin-left:0.5rem;">' + records.length + '</span></h3>' +
      '<button onclick="exportCSV(\'nyeei_donations\')" style="background:#0f5228;color:white;border:none;border-radius:6px;padding:0.45rem 1rem;font-size:0.82rem;font-weight:600;cursor:pointer;">⬇ Export CSV</button></div>' +
      '<div style="background:linear-gradient(135deg,#0f5228,#1a7a3c);border-radius:12px;padding:1.25rem 1.5rem;margin-bottom:1.25rem;color:white;">' +
      '<div style="font-size:0.8rem;opacity:0.75;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Total Recorded Donations</div>' +
      '<div style="font-family:Syne,sans-serif;font-size:2rem;font-weight:800;margin-top:0.25rem;">KES ' + total.toLocaleString() + '</div>' +
      '<div style="font-size:0.8rem;opacity:0.6;margin-top:0.2rem;">Pending bank confirmation</div></div>';
    
    if (records.length === 0) {
      html += '<div style="text-align:center;padding:3rem;color:#4a6355;font-size:0.95rem;">No donations recorded yet.</div>';
    } else {
      html += '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.85rem;">' +
        '<thead><tr style="background:#f0f7f3;">' +
        '<th style="padding:0.65rem 0.75rem;text-align:left;font-weight:700;border-bottom:2px solid #d4e0d8;">#</th>' +
        '<th style="padding:0.65rem 0.75rem;text-align:left;font-weight:700;border-bottom:2px solid #d4e0d8;">Date</th>' +
        '<th style="padding:0.65rem 0.75rem;text-align:left;font-weight:700;border-bottom:2px solid #d4e0d8;">Donor Name</th>' +
        '<th style="padding:0.65rem 0.75rem;text-align:left;font-weight:700;border-bottom:2px solid #d4e0d8;">Email</th>' +
        '<th style="padding:0.65rem 0.75rem;text-align:left;font-weight:700;border-bottom:2px solid #d4e0d8;">Amount (KES)</th>' +
        '<th style="padding:0.65rem 0.75rem;text-align:left;font-weight:700;border-bottom:2px solid #d4e0d8;">Status</th>' +
        '<th style="padding:0.65rem 0.75rem;text-align:left;font-weight:700;border-bottom:2px solid #d4e0d8;">Actions</th>' +
        '</tr></thead><tbody>';
      records.forEach(function(r, i) {
        var statusColor = r.status === 'Confirmed' ? '#1a7a3c' : '#d4a017';
        html += '<tr style="border-bottom:1px solid #eef3f0;">' +
          '<td style="padding:0.65rem 0.75rem;color:#4a6355;">' + (i+1) + '</td>' +
          '<td style="padding:0.65rem 0.75rem;white-space:nowrap;color:#4a6355;">' + r.date + '</td>' +
          '<td style="padding:0.65rem 0.75rem;font-weight:600;">' + r.name + '</td>' +
          '<td style="padding:0.65rem 0.75rem;">' + (r.email || '—') + '</td>' +
          '<td style="padding:0.65rem 0.75rem;font-weight:700;color:#0f5228;">KES ' + parseFloat(r.amount).toLocaleString() + '</td>' +
          '<td style="padding:0.65rem 0.75rem;"><span style="background:' + statusColor + '20;color:' + statusColor + ';border-radius:100px;font-size:0.75rem;font-weight:700;padding:0.2rem 0.6rem;">' + r.status + '</span></td>' +
          '<td style="padding:0.65rem 0.75rem;white-space:nowrap;">' +
          '<button onclick="updateStatus(\'nyeei_donations\',' + r.id + ',\'Confirmed\')" style="background:#e6f4ec;color:#0f5228;border:none;border-radius:5px;padding:0.3rem 0.6rem;font-size:0.75rem;font-weight:700;cursor:pointer;margin-right:0.3rem;">✓ Confirm</button>' +
          '<button onclick="deleteRecord(\'nyeei_donations\',' + r.id + ')" style="background:#f5f5f5;color:#666;border:none;border-radius:5px;padding:0.3rem 0.6rem;font-size:0.75rem;cursor:pointer;">🗑</button>' +
          '</td></tr>';
      });
      html += '</tbody></table></div>';
    }
    content.innerHTML = html;

  } else if (tab === 'messages') {
    var records = JSON.parse(localStorage.getItem('nyeei_messages') || '[]');
    var unread = records.filter(function(r){ return r.status === 'Unread'; }).length;
    var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">' +
      '<h3 style="font-family:Syne,sans-serif;font-size:1.1rem;font-weight:800;">Contact Messages <span style="background:#e6f4ec;color:#0f5228;border-radius:100px;font-size:0.78rem;padding:0.2rem 0.7rem;margin-left:0.5rem;">' + records.length + '</span>' +
      (unread > 0 ? '<span style="background:#c0392b;color:white;border-radius:100px;font-size:0.75rem;padding:0.2rem 0.65rem;margin-left:0.4rem;">' + unread + ' unread</span>' : '') + '</h3>' +
      '<button onclick="exportCSV(\'nyeei_messages\')" style="background:#0f5228;color:white;border:none;border-radius:6px;padding:0.45rem 1rem;font-size:0.82rem;font-weight:600;cursor:pointer;">⬇ Export CSV</button></div>';
    
    if (records.length === 0) {
      html += '<div style="text-align:center;padding:3rem;color:#4a6355;font-size:0.95rem;">No messages yet.</div>';
    } else {
      records.forEach(function(r, i) {
        html += '<div style="background:' + (r.status === 'Unread' ? '#fafffe' : 'white') + ';border:1.5px solid ' + (r.status === 'Unread' ? '#1a7a3c' : '#d4e0d8') + ';border-radius:10px;padding:1.1rem 1.25rem;margin-bottom:0.85rem;">' +
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem;">' +
          '<div><span style="font-weight:700;font-size:0.95rem;">' + r.name + '</span>' +
          (r.status === 'Unread' ? '<span style="background:#c0392b;color:white;border-radius:100px;font-size:0.7rem;padding:0.15rem 0.55rem;margin-left:0.5rem;font-weight:700;">NEW</span>' : '') + '</div>' +
          '<span style="font-size:0.78rem;color:#4a6355;">' + r.date + '</span></div>' +
          '<div style="font-size:0.82rem;color:#4a6355;margin-bottom:0.6rem;">' +
          '<a href="mailto:' + r.email + '" style="color:#1a7a3c;">' + r.email + '</a>' + (r.phone ? ' · <a href="tel:' + r.phone + '" style="color:#1a7a3c;">' + r.phone + '</a>' : '') + '</div>' +
          '<div style="font-size:0.9rem;color:#0f1a14;line-height:1.6;margin-bottom:0.75rem;">' + r.message + '</div>' +
          '<div style="display:flex;gap:0.5rem;">' +
          '<a href="mailto:' + r.email + '" style="background:#e6f4ec;color:#0f5228;border-radius:6px;padding:0.35rem 0.8rem;font-size:0.8rem;font-weight:600;text-decoration:none;">✉ Reply</a>' +
          '<button onclick="updateStatus(\'nyeei_messages\',' + r.id + ',\'Read\')" style="background:#f0f0f0;color:#333;border:none;border-radius:6px;padding:0.35rem 0.8rem;font-size:0.8rem;font-weight:600;cursor:pointer;">Mark read</button>' +
          '<button onclick="deleteRecord(\'nyeei_messages\',' + r.id + ')" style="background:#fdecea;color:#c0392b;border:none;border-radius:6px;padding:0.35rem 0.8rem;font-size:0.8rem;cursor:pointer;">🗑</button>' +
          '</div></div>';
      });
    }
    content.innerHTML = html;

  } else if (tab === 'overview') {
    var regs = JSON.parse(localStorage.getItem('nyeei_registrations') || '[]');
    var dons = JSON.parse(localStorage.getItem('nyeei_donations') || '[]');
    var msgs = JSON.parse(localStorage.getItem('nyeei_messages') || '[]');
    var totalDon = dons.reduce(function(s,r){ return s + (parseFloat(r.amount)||0); }, 0);
    var approved = regs.filter(function(r){ return r.status === 'Approved'; }).length;
    var pending = regs.filter(function(r){ return r.status === 'Pending'; }).length;
    var unread = msgs.filter(function(r){ return r.status === 'Unread'; }).length;
    
    var html = '<h3 style="font-family:Syne,sans-serif;font-size:1.1rem;font-weight:800;margin-bottom:1.25rem;">Dashboard Overview</h3>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:1.5rem;">' +
      adminStatCard('Total Members', regs.length, '#0f5228', '👥') +
      adminStatCard('Approved', approved, '#1a7a3c', '✅') +
      adminStatCard('Pending', pending, '#d4a017', '⏳') +
      adminStatCard('Donations', dons.length, '#1a5fa0', '💰') +
      adminStatCard('KES Recorded', totalDon.toLocaleString(), '#7b3fa0', '🏦') +
      adminStatCard('Unread Messages', unread, '#c0392b', '📩') +
      '</div>' +
      '<h4 style="font-family:Syne,sans-serif;font-weight:700;margin-bottom:0.75rem;font-size:0.95rem;">Recent Registrations</h4>';
    
    regs.slice(0, 5).forEach(function(r) {
      html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.65rem 0;border-bottom:1px solid #eef3f0;font-size:0.88rem;">' +
        '<div><strong>' + r.name + '</strong> <span style="color:#4a6355;">· ' + r.constituency + '</span></div>' +
        '<div style="color:#4a6355;font-size:0.8rem;">' + r.date + '</div></div>';
    });
    content.innerHTML = html;
  }
}

function adminStatCard(label, value, color, icon) {
  return '<div style="background:white;border:1px solid #d4e0d8;border-radius:10px;padding:1.1rem;text-align:center;">' +
    '<div style="font-size:1.5rem;margin-bottom:0.3rem;">' + icon + '</div>' +
    '<div style="font-family:Syne,sans-serif;font-size:1.4rem;font-weight:800;color:' + color + ';">' + value + '</div>' +
    '<div style="font-size:0.78rem;color:#4a6355;margin-top:0.2rem;font-weight:600;">' + label + '</div></div>';
}

function updateStatus(key, id, status) {
  var records = JSON.parse(localStorage.getItem(key) || '[]');
  records = records.map(function(r) {
    if (r.id === id) r.status = status;
    return r;
  });
  localStorage.setItem(key, JSON.stringify(records));
  var activeTab = document.querySelector('.admin-tab-btn.active');
  if (activeTab) loadAdminTab(activeTab.dataset.tab);
}

function deleteRecord(key, id) {
  if (!confirm('Delete this record? This cannot be undone.')) return;
  var records = JSON.parse(localStorage.getItem(key) || '[]').filter(function(r) {
    return r.id !== id;
  });
  localStorage.setItem(key, JSON.stringify(records));
  var activeTab = document.querySelector('.admin-tab-btn.active');
  if (activeTab) loadAdminTab(activeTab.dataset.tab);
}

function exportCSV(key) {
  var records = JSON.parse(localStorage.getItem(key) || '[]');
  if (!records.length) {
    alert('No data to export.');
    return;
  }
  var keys = Object.keys(records[0]);
  var csv = keys.join(',') + '\n';
  records.forEach(function(r) {
    csv += keys.map(function(k) {
      return '"' + String(r[k] || '').replace(/"/g, '""') + '"';
    }).join(',') + '\n';
  });
  var blob = new Blob([csv], { type: 'text/csv' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = key + '_' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
}

// Support auto-login if they hit Enter
document.addEventListener('DOMContentLoaded', function() {
  var adminPw = document.getElementById('admin-pw');
  if (adminPw) {
    adminPw.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        adminLogin();
      }
    });
  }
});
