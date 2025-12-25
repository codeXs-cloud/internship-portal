// GLOBAL STATE
let currentUser = null; 
let internshipData = [];
let isLoginMode = true; 
let selectedRole = 'user'; 

// DOM ELEMENTS
const authOverlay = document.getElementById('auth-overlay');
const loginTriggerBtn = document.getElementById('btn-login-trigger');
const userControls = document.getElementById('user-controls');
const btnAddTrigger = document.getElementById('btn-add-trigger');
const listContainer = document.getElementById('internship-list');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('filter-status');
const monthFilter = document.getElementById('filter-month');
const filterMenu = document.getElementById('filter-menu');
const filterToggleBtn = document.getElementById('filter-toggle-btn');

// Dialog Elements
const dialogOverlay = document.getElementById('dialog-overlay');
const dialogTitle = document.getElementById('dialog-title');
const dialogMsg = document.getElementById('dialog-msg');
const dialogOk = document.getElementById('dialog-ok');
const dialogCancel = document.getElementById('dialog-cancel');
let dialogCallback = null;

// Internship Modal Elements
const internshipModal = document.getElementById('internship-modal');
const internshipForm = document.getElementById('internship-form');
const modalTitle = document.getElementById('modal-title');

// ==========================================
// 1. DIALOG SYSTEM
// ==========================================
function showDialog(title, msg) {
    dialogTitle.innerText = title;
    dialogMsg.innerText = msg;
    dialogOk.innerText = "OK";
    dialogCancel.classList.add('hidden');
    dialogOverlay.classList.remove('hidden');
    dialogCallback = null;
}

function showConfirmDialog(title, msg, onConfirm) {
    dialogTitle.innerText = title;
    dialogMsg.innerText = msg;
    dialogOk.innerText = "Yes";
    dialogCancel.classList.remove('hidden');
    dialogOverlay.classList.remove('hidden');
    dialogCallback = onConfirm;
}

function closeDialog() { dialogOverlay.classList.add('hidden'); }
dialogOk.addEventListener('click', () => { if (dialogCallback) dialogCallback(); closeDialog(); });

// ==========================================
// 2. AUTHENTICATION & UI
// ==========================================
function openAuthModal() { authOverlay.classList.remove('hidden'); }
function closeAuthModal() { authOverlay.classList.add('hidden'); }

function updateHeaderUI() {
    if (currentUser) {
        loginTriggerBtn.classList.add('hidden');
        userControls.classList.remove('hidden');
        document.getElementById('display-email').innerText = currentUser.email.split('@')[0];
        if (currentUser.role === 'admin') btnAddTrigger.classList.remove('hidden');
        else btnAddTrigger.classList.add('hidden');
    } else {
        loginTriggerBtn.classList.remove('hidden');
        userControls.classList.add('hidden');
        btnAddTrigger.classList.add('hidden');
    }
}

function switchRole(role) {
    selectedRole = role;
    document.getElementById('tab-user').classList.toggle('active', role === 'user');
    document.getElementById('tab-admin').classList.toggle('active', role === 'admin');
    const adminInput = document.getElementById('auth-admin-key');
    adminInput.style.display = (role === 'admin' && !isLoginMode) ? 'block' : 'none';
}

function toggleSignup() {
    isLoginMode = !isLoginMode;
    document.getElementById('btn-submit').innerText = isLoginMode ? "Login" : "Create Account";
    document.getElementById('toggle-text').innerText = isLoginMode ? "New here? Create Account" : "Already have an account? Login";
    switchRole(selectedRole); 
}

function togglePasswordVisibility() {
    const passInput = document.getElementById('auth-pass');
    const iconSpan = document.getElementById('toggle-pass');
    const isPassword = passInput.getAttribute('type') === 'password';
    passInput.setAttribute('type', isPassword ? 'text' : 'password');
    if (isPassword) {
        iconSpan.innerHTML = `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>`;
    } else {
        iconSpan.innerHTML = `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>`;
    }
}

document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-pass').value;
    const adminKey = document.getElementById('auth-admin-key').value;
    const errorMsg = document.getElementById('auth-error');
    const endpoint = isLoginMode ? '/api/login' : '/api/signup';
    const payload = { email, password, role: selectedRole, adminKey };

    try {
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (res.ok) {
            if (isLoginMode) { currentUser = data; closeAuthModal(); updateHeaderUI(); renderInternships(); }
            else { showDialog("Success", "Account created! Please login."); toggleSignup(); }
        } else { errorMsg.innerText = data.error; }
    } catch (err) { errorMsg.innerText = "Server Error"; }
});

function logout() { location.reload(); }

// ==========================================
// 3. INTERNSHIP MODAL (ADD / EDIT)
// ==========================================
function openInternshipModal(editMode = false, data = null) {
    internshipModal.classList.remove('hidden');
    if (editMode && data) {
        modalTitle.innerText = "Edit Internship";
        document.getElementById('edit-id').value = data._id;
        document.getElementById('inp-company').value = data.company;
        document.getElementById('inp-role').value = data.role;
        document.getElementById('inp-start').value = data.startDate;
        document.getElementById('inp-end').value = data.endDate;
        document.getElementById('inp-link').value = data.link || '';
    } else {
        modalTitle.innerText = "+ Add New Internship";
        internshipForm.reset();
        document.getElementById('edit-id').value = '';
    }
}
function closeInternshipModal() { internshipModal.classList.add('hidden'); }

internshipForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const payload = {
        company: document.getElementById('inp-company').value,
        role: document.getElementById('inp-role').value,
        startDate: document.getElementById('inp-start').value,
        endDate: document.getElementById('inp-end').value,
        link: document.getElementById('inp-link').value
    };
    let url = id ? `/api/internships/${id}` : '/api/internships';
    let method = id ? 'PUT' : 'POST';

    try {
        await fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        closeInternshipModal();
        fetchInternships();
        showDialog("Success", id ? "Internship Updated" : "Internship Added");
    } catch (err) { showDialog("Error", "Operation failed"); }
});

// ==========================================
// 4. DATA FETCHING & RENDER
// ==========================================
async function fetchInternships() {
    try { const res = await fetch('/api/internships'); internshipData = await res.json(); renderInternships(); }
    catch (e) { console.error("Could not fetch data"); }
}

function getDaysLeft(endDateStr) {
    const today = new Date();
    const end = new Date(endDateStr + "-28");
    const diff = end - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function renderInternships() {
    listContainer.innerHTML = '';
    const searchTerm = searchInput.value.toLowerCase();
    const filterVal = statusFilter.value;
    const monthVal = monthFilter.value;
    const today = new Date();

    const filtered = internshipData.filter(item => {
        const daysLeft = getDaysLeft(item.endDate);
        const isExpired = daysLeft < 0;
        const isApplied = currentUser ? currentUser.appliedInternships.includes(item._id) : false;
        
        const matchesSearch = item.company.toLowerCase().includes(searchTerm) || item.role.toLowerCase().includes(searchTerm);
        if(!matchesSearch) return false;

        if(filterVal === 'applied' && !isApplied) return false;
        if(filterVal === 'expired' && !isExpired) return false;
        if(filterVal === 'active' && isExpired) return false;
        
        // Active Month Logic
        if (monthVal) {
            if (monthVal < item.startDate || monthVal > item.endDate) return false;
        }
        return true;
    });

    filtered.sort((a, b) => {
        const daysA = getDaysLeft(a.endDate);
        const daysB = getDaysLeft(b.endDate);
        const appA = currentUser ? currentUser.appliedInternships.includes(a._id) : false;
        const appB = currentUser ? currentUser.appliedInternships.includes(b._id) : false;
        const expA = daysA < 0;
        const expB = daysB < 0;
        let groupA = appA ? 2 : (expA ? 3 : 1);
        let groupB = appB ? 2 : (expB ? 3 : 1);
        if (groupA !== groupB) return groupA - groupB;
        return daysA - daysB;
    });

    if (filtered.length === 0) { listContainer.innerHTML = '<div style="text-align:center;width:100%;color:#888;">No results found.</div>'; return; }

    filtered.forEach(item => {
        const isApplied = currentUser ? currentUser.appliedInternships.includes(item._id) : false;
        const daysLeft = getDaysLeft(item.endDate);
        const start = new Date(item.startDate);
        
        // Date Format: "Month - YYYY"
        const [year, monthNum] = item.endDate.split('-');
        const dateObj = new Date(year, monthNum - 1);
        const formattedDate = `${dateObj.toLocaleString('default', { month: 'long' })} - ${year}`;

        let badgeHTML = '';
        let subTextHTML = '';
        let cardClass = 'card';
        
        if (isApplied) {
            cardClass += ' card-applied';
            badgeHTML = `<span class="status-pill" style="background:#dbeafe; color:#2563eb;">Applied</span>`;
        } else if (daysLeft < 0) {
            badgeHTML = `<span class="status-pill badge-expired">Expired</span>`;
        } else if (today < start) {
            const m = start.toLocaleString('default', { month: 'long' });
            badgeHTML = `<span class="status-pill badge-starts">Starts ${m}</span>`;
        } else if (daysLeft < 30) {
            badgeHTML = `<span class="status-pill badge-ending">Ending Soon</span>`;
        } else {
            badgeHTML = `<span class="status-pill badge-ongoing">Ongoing</span>`;
            // Ongoing Subtext
            const [sYear, sMonth] = item.startDate.split('-');
            const sDate = new Date(sYear, sMonth - 1);
            subTextHTML = `<span class="badge-subtext">Started ${sDate.toLocaleString('default', { month: 'long' })}</span>`;
        }

        const checkDisabled = daysLeft < 0 ? 'disabled' : '';
        const checkLabel = isApplied ? 'Applied' : (daysLeft < 0 ? 'Closed' : 'Mark Apply');
        const linkHTML = (item.link && daysLeft >= 0) ? `<a href="${item.link}" target="_blank" class="btn-apply">Apply ↗</a>` : '';

        let userActionsHTML = `
            <div class="actions-row">
                <div class="user-actions">
                    <label class="checkbox-label">
                        <input type="checkbox" ${isApplied ? 'checked' : ''} ${checkDisabled} onchange="triggerToggleApply('${item._id}', this)">
                        <span>${checkLabel}</span>
                    </label>
                    ${linkHTML}
                </div>
            </div>`;

        let adminActionsHTML = '';
        if (currentUser && currentUser.role === 'admin') {
            const dataStr = encodeURIComponent(JSON.stringify(item));
            adminActionsHTML = `
                <div class="admin-actions">
                    <button class="btn-edit" onclick="triggerEdit('${dataStr}')">Edit</button>
                    <button class="btn-delete" onclick="triggerDelete('${item._id}')">Delete</button>
                </div>`;
        }

        const div = document.createElement('div');
        div.className = cardClass;
        div.innerHTML = `
            <div class="card-header">
                <div>
                    <h2 class="company-name">${item.company}</h2>
                    <div class="role-name">${item.role}</div>
                </div>
                <div class="header-right">
                    ${badgeHTML}
                    ${subTextHTML}
                </div>
            </div>
            <div class="date-display">
                Deadline : <span class="deadline-highlight">${formattedDate}</span>
            </div>
            ${userActionsHTML}
            ${adminActionsHTML}`;
        listContainer.appendChild(div);
    });
}

// ==========================================
// 5. TRIGGERS & LISTENERS
// ==========================================
function triggerToggleApply(id, checkbox) {
    if (!currentUser) { checkbox.checked = false; openAuthModal(); return; }
    checkbox.checked = !checkbox.checked; 
    showConfirmDialog("Confirm Action", "Change application status?", async () => {
        checkbox.checked = !checkbox.checked;
        await fetch(`/api/users/${currentUser.id}/apply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ internshipId: id }) });
        if (currentUser.appliedInternships.includes(id)) currentUser.appliedInternships = currentUser.appliedInternships.filter(x => x !== id);
        else currentUser.appliedInternships.push(id);
        renderInternships();
        showDialog("Success", "Status Updated");
    });
}

function triggerDelete(id) {
    showConfirmDialog("Delete Internship", "Are you sure you want to delete this?", async () => {
        await fetch(`/api/internships/${id}`, { method: 'DELETE' });
        fetchInternships();
        showDialog("Deleted", "Internship removed.");
    });
}

function triggerEdit(dataStr) {
    const data = JSON.parse(decodeURIComponent(dataStr));
    openInternshipModal(true, data);
}

searchInput.addEventListener('input', renderInternships);
statusFilter.addEventListener('change', renderInternships);
monthFilter.addEventListener('change', renderInternships);
if(filterToggleBtn) {
    filterToggleBtn.addEventListener('click', () => { filterMenu.classList.toggle('hidden'); });
}
window.resetFilters = function() {
     searchInput.value = ''; 
     statusFilter.value = 'all'; 
     monthFilter.value = ''; 
     renderInternships(); }

// INITIAL RUN
updateHeaderUI();
fetchInternships();