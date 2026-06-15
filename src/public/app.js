const state = {
    token: localStorage.getItem('agenda_token') || '',
    customers: [],
    spaces: [],
    users: [],
    events: []
};

const setupTypes = ['buffet', 'coquetel', 'a_la_carte', 'reuniao', 'auditorio', 'pendente'];
const eventStatuses = ['confirmado', 'nao_confirmado'];

const elements = {
    authStatus: document.querySelector('#authStatus'),
    logoutButton: document.querySelector('#logoutButton'),
    loginForm: document.querySelector('#loginForm'),
    registerForm: document.querySelector('#registerForm'),
    customerForm: document.querySelector('#customerForm'),
    eventForm: document.querySelector('#eventForm'),
    customersList: document.querySelector('#customersList'),
    eventsList: document.querySelector('#eventsList'),
    spacesList: document.querySelector('#spacesList'),
    usersList: document.querySelector('#usersList'),
    customerSearch: document.querySelector('#customerSearch'),
    eventSearch: document.querySelector('#eventSearch'),
    toast: document.querySelector('#toast')
};

function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add('visible');
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => {
        elements.toast.classList.remove('visible');
    }, 3600);
}

function setLoading(button, isLoading, label) {
    if (!button) return;
    if (isLoading) {
        button.dataset.originalText = button.textContent;
        button.textContent = label || 'Aguarde...';
        button.disabled = true;
    } else {
        button.textContent = button.dataset.originalText || button.textContent;
        button.disabled = false;
    }
}

function formToObject(form) {
    const data = new FormData(form);
    return Object.fromEntries(data.entries());
}

function authHeaders() {
    return state.token ? { Authorization: `Bearer ${state.token}` } : {};
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

async function apiFetch(path, options = {}) {
    const config = {
        ...options,
        headers: {
            Accept: 'application/json',
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...authHeaders(),
            ...(options.headers || {})
        }
    };

    const response = await fetch(path, config);
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json() : null;

    if (!response.ok) {
        const message = payload?.error || payload?.message || `Erro HTTP ${response.status}`;
        throw new Error(message);
    }

    return payload;
}

function updateAuthStatus() {
    if (state.token) {
        elements.authStatus.textContent = 'Token ativo';
        elements.authStatus.className = 'status-pill success';
        elements.logoutButton.disabled = false;
        return;
    }

    elements.authStatus.textContent = 'Sem token';
    elements.authStatus.className = 'status-pill muted';
    elements.logoutButton.disabled = true;
}

function optionList(items, valueKey, labelKey, placeholder) {
    const empty = `<option value="">${placeholder}</option>`;
    return empty + items.map((item) => {
        const value = item[valueKey];
        const label = item[labelKey] || item.name || item.email || value;
        return `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;
    }).join('');
}

function fillSelects() {
    const customerSelect = elements.eventForm.elements.customer_id;
    const spaceSelect = elements.eventForm.elements.space_id;
    const userSelect = elements.eventForm.elements.user_id;

    customerSelect.innerHTML = optionList(state.customers, 'id', 'name', 'Selecione o cliente');
    spaceSelect.innerHTML = optionList(state.spaces, 'id', 'name', 'Selecione o ambiente');
    userSelect.innerHTML = optionList(state.users, 'id', 'name', 'Selecione o responsavel');
}

function renderSpaces() {
    if (!state.spaces.length) {
        elements.spacesList.innerHTML = '<div class="empty">Nenhum ambiente carregado.</div>';
        return;
    }

    elements.spacesList.innerHTML = state.spaces.map((space) => `
        <article class="item">
            <div class="item-header">
                <div>
                    <div class="item-title">${escapeHtml(space.name)}</div>
                    <div class="item-meta"><span>ID ${escapeHtml(space.id)}</span></div>
                </div>
            </div>
        </article>
    `).join('');
}

function renderUsers() {
    if (!state.users.length) {
        elements.usersList.innerHTML = '<div class="empty">Nenhum usuario carregado.</div>';
        return;
    }

    elements.usersList.innerHTML = state.users.map((user) => `
        <article class="item">
            <div class="item-header">
                <div>
                    <div class="item-title">${escapeHtml(user.name)}</div>
                    <div class="item-meta">
                        <span>${escapeHtml(user.email)}</span>
                        <span>${escapeHtml(user.phone_number || 'sem telefone')}</span>
                        <span>${escapeHtml(user.role)}</span>
                    </div>
                </div>
            </div>
        </article>
    `).join('');
}

function renderCustomers(customers = state.customers) {
    if (!customers.length) {
        elements.customersList.innerHTML = '<div class="empty">Nenhum cliente encontrado.</div>';
        return;
    }

    elements.customersList.innerHTML = customers.map((customer) => `
        <article class="item">
            <div class="item-header">
                <div>
                    <div class="item-title">${escapeHtml(customer.name)}</div>
                    <div class="item-meta">
                        <span>${escapeHtml(customer.phone_number)}</span>
                        <span>${escapeHtml(customer.email || 'sem email')}</span>
                        <span>${escapeHtml(customer.cpf || 'sem CPF')}</span>
                    </div>
                </div>
            </div>
            <div class="item-meta">${escapeHtml(customer.address || 'sem endereco')}</div>
            <div class="item-actions">
                <button type="button" data-action="edit-customer" data-id="${customer.id}">Editar</button>
                <button class="danger-button" type="button" data-action="delete-customer" data-id="${customer.id}">Excluir</button>
            </div>
        </article>
    `).join('');
}

function statusClass(status) {
    return status === 'confirmado' ? 'success' : 'warning';
}

function formatDate(dateValue) {
    if (!dateValue) return '';
    return String(dateValue).slice(0, 10);
}

function formatEventStart(eventStart) {
    if (!eventStart) return '';
    return String(eventStart).replace('T', ' ').slice(0, 16);
}

function findName(items, id) {
    const item = items.find((current) => Number(current.id) === Number(id));
    return item?.name || `ID ${id}`;
}

function renderEvents(events = state.events) {
    if (!events.length) {
        elements.eventsList.innerHTML = '<div class="empty">Nenhum evento encontrado.</div>';
        return;
    }

    elements.eventsList.innerHTML = events.map((event) => `
        <article class="item">
            <div class="item-header">
                <div>
                    <div class="item-title">${escapeHtml(event.event_name)}</div>
                    <div class="item-meta">
                        <span>${escapeHtml(formatDate(event.event_date))}</span>
                        <span>${escapeHtml(formatEventStart(event.event_start))}</span>
                        <span>${escapeHtml(event.seats_count)} lugares</span>
                    </div>
                </div>
                <span class="status-pill ${statusClass(event.event_status)}">${escapeHtml(event.event_status)}</span>
            </div>
            <div class="item-meta">
                <span>Cliente: ${escapeHtml(findName(state.customers, event.customer_id))}</span>
                <span>Ambiente: ${escapeHtml(findName(state.spaces, event.space_id))}</span>
                <span>Tipo: ${escapeHtml(event.setup_type)}</span>
            </div>
            <div>${escapeHtml(event.event_description || '')}</div>
            <div class="item-actions">
                <button type="button" data-action="edit-event" data-id="${event.id}">Editar</button>
                <button type="button" data-action="confirm-event" data-id="${event.id}">Confirmar</button>
                <button type="button" data-action="unconfirm-event" data-id="${event.id}">Nao confirmar</button>
                <button class="danger-button" type="button" data-action="delete-event" data-id="${event.id}">Excluir</button>
            </div>
        </article>
    `).join('');
}

function filterCustomers() {
    const term = elements.customerSearch.value.trim().toLowerCase();
    const filtered = term
        ? state.customers.filter((customer) => customer.name.toLowerCase().includes(term))
        : state.customers;
    renderCustomers(filtered);
}

function filterEvents() {
    const term = elements.eventSearch.value.trim().toLowerCase();
    const filtered = term
        ? state.events.filter((event) => event.event_name.toLowerCase().includes(term))
        : state.events;
    renderEvents(filtered);
}

async function loadCustomers() {
    state.customers = await apiFetch('/customers');
    renderCustomers();
    fillSelects();
}

async function loadSpaces() {
    state.spaces = await apiFetch('/spaces');
    renderSpaces();
    fillSelects();
}

async function loadUsers() {
    state.users = await apiFetch('/users');
    renderUsers();
    fillSelects();
}

async function loadEvents() {
    if (!state.token) {
        state.events = [];
        renderEvents();
        return;
    }

    state.events = await apiFetch('/events');
    renderEvents();
}

async function refreshAll() {
    try {
        await Promise.all([loadCustomers(), loadSpaces(), loadUsers()]);
        await loadEvents();
    } catch (error) {
        showToast(error.message);
    }
}

function clearCustomerForm() {
    elements.customerForm.reset();
    elements.customerForm.elements.id.value = '';
}

function clearEventForm() {
    elements.eventForm.reset();
    elements.eventForm.elements.id.value = '';
}

function customerPayload(form) {
    const data = formToObject(form);
    return {
        name: data.name,
        phone_number: data.phone_number,
        email: data.email || null,
        cpf: data.cpf || null,
        address: data.address || null
    };
}

function eventPayload(form) {
    const data = formToObject(form);
    return {
        user_id: Number(data.user_id),
        space_id: Number(data.space_id),
        customer_id: Number(data.customer_id),
        event_name: data.event_name,
        event_description: data.event_description || null,
        event_date: data.event_date,
        event_start: `${data.event_date} ${data.event_time}:00`,
        seats_count: Number(data.seats_count),
        setup_type: setupTypes.includes(data.setup_type) ? data.setup_type : 'pendente',
        event_status: eventStatuses.includes(data.event_status) ? data.event_status : 'nao_confirmado',
        uploads_url: data.uploads_url || null
    };
}

function editCustomer(id) {
    const customer = state.customers.find((item) => Number(item.id) === Number(id));
    if (!customer) return;

    elements.customerForm.elements.id.value = customer.id;
    elements.customerForm.elements.name.value = customer.name || '';
    elements.customerForm.elements.phone_number.value = customer.phone_number || '';
    elements.customerForm.elements.email.value = customer.email || '';
    elements.customerForm.elements.cpf.value = customer.cpf || '';
    elements.customerForm.elements.address.value = customer.address || '';
    document.querySelector('[data-tab="customers"]').click();
}

function editEvent(id) {
    const event = state.events.find((item) => Number(item.id) === Number(id));
    if (!event) return;

    const eventDate = formatDate(event.event_date);
    const eventStart = formatEventStart(event.event_start);
    const time = eventStart.includes(' ') ? eventStart.split(' ')[1] : '';

    elements.eventForm.elements.id.value = event.id;
    elements.eventForm.elements.event_name.value = event.event_name || '';
    elements.eventForm.elements.customer_id.value = event.customer_id || '';
    elements.eventForm.elements.space_id.value = event.space_id || '';
    elements.eventForm.elements.user_id.value = event.user_id || '';
    elements.eventForm.elements.event_date.value = eventDate;
    elements.eventForm.elements.event_time.value = time;
    elements.eventForm.elements.seats_count.value = event.seats_count || '';
    elements.eventForm.elements.setup_type.value = event.setup_type || 'pendente';
    elements.eventForm.elements.event_status.value = event.event_status || 'nao_confirmado';
    elements.eventForm.elements.event_description.value = event.event_description || '';
    elements.eventForm.elements.uploads_url.value = event.uploads_url || '';
    document.querySelector('[data-tab="events"]').click();
}

async function deleteCustomer(id) {
    if (!window.confirm('Excluir este cliente?')) return;
    await apiFetch(`/customers/${id}`, { method: 'DELETE' });
    showToast('Cliente excluido.');
    await loadCustomers();
    await loadEvents();
}

async function deleteEvent(id) {
    if (!window.confirm('Excluir este evento?')) return;
    await apiFetch(`/events/${id}`, { method: 'DELETE' });
    showToast('Evento excluido.');
    await loadEvents();
}

async function updateEventStatus(id, event_status) {
    await apiFetch(`/events/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ event_status })
    });
    showToast('Status atualizado.');
    await loadEvents();
}

elements.loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = event.submitter;
    setLoading(button, true, 'Entrando...');

    try {
        const result = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify(formToObject(elements.loginForm))
        });
        state.token = result.token;
        localStorage.setItem('agenda_token', state.token);
        updateAuthStatus();
        showToast('Login realizado.');
        await loadEvents();
    } catch (error) {
        showToast(error.message);
    } finally {
        setLoading(button, false);
    }
});

elements.registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = event.submitter;
    setLoading(button, true, 'Cadastrando...');

    try {
        await apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify(formToObject(elements.registerForm))
        });
        elements.registerForm.reset();
        showToast('Usuario cadastrado.');
        await loadUsers();
    } catch (error) {
        showToast(error.message);
    } finally {
        setLoading(button, false);
    }
});

elements.logoutButton.addEventListener('click', async () => {
    state.token = '';
    localStorage.removeItem('agenda_token');
    updateAuthStatus();
    await loadEvents();
    showToast('Token removido.');
});

elements.customerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = event.submitter;
    const id = elements.customerForm.elements.id.value;
    const method = id ? 'PUT' : 'POST';
    const path = id ? `/customers/${id}` : '/customers';

    setLoading(button, true, 'Salvando...');

    try {
        await apiFetch(path, {
            method,
            body: JSON.stringify(customerPayload(elements.customerForm))
        });
        clearCustomerForm();
        showToast('Cliente salvo.');
        await loadCustomers();
    } catch (error) {
        showToast(error.message);
    } finally {
        setLoading(button, false);
    }
});

elements.eventForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = event.submitter;
    const id = elements.eventForm.elements.id.value;
    const method = id ? 'PUT' : 'POST';
    const path = id ? `/events/${id}` : '/events';

    setLoading(button, true, 'Salvando...');

    try {
        await apiFetch(path, {
            method,
            body: JSON.stringify(eventPayload(elements.eventForm))
        });
        clearEventForm();
        showToast('Evento salvo.');
        await loadEvents();
    } catch (error) {
        showToast(error.message);
    } finally {
        setLoading(button, false);
    }
});

document.querySelector('#clearCustomerForm').addEventListener('click', clearCustomerForm);
document.querySelector('#clearEventForm').addEventListener('click', clearEventForm);
document.querySelector('#refreshCustomers').addEventListener('click', () => loadCustomers().catch((error) => showToast(error.message)));
document.querySelector('#refreshSpaces').addEventListener('click', () => loadSpaces().catch((error) => showToast(error.message)));
document.querySelector('#refreshUsers').addEventListener('click', () => loadUsers().catch((error) => showToast(error.message)));
document.querySelector('#refreshEvents').addEventListener('click', () => loadEvents().catch((error) => showToast(error.message)));
elements.customerSearch.addEventListener('input', filterCustomers);
elements.eventSearch.addEventListener('input', filterEvents);

document.querySelectorAll('.tab-button').forEach((button) => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-button').forEach((tab) => tab.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.remove('active'));
        button.classList.add('active');
        document.querySelector(`#${button.dataset.tab}Tab`).classList.add('active');
    });
});

document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;

    const { action, id } = button.dataset;
    setLoading(button, true);

    try {
        if (action === 'edit-customer') editCustomer(id);
        if (action === 'delete-customer') await deleteCustomer(id);
        if (action === 'edit-event') editEvent(id);
        if (action === 'delete-event') await deleteEvent(id);
        if (action === 'confirm-event') await updateEventStatus(id, 'confirmado');
        if (action === 'unconfirm-event') await updateEventStatus(id, 'nao_confirmado');
    } catch (error) {
        showToast(error.message);
    } finally {
        setLoading(button, false);
    }
});

updateAuthStatus();
refreshAll();
