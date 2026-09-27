const tbody = document.querySelector('#tickets');
const owner = document.querySelector('#owner');
const assign = document.querySelector('#assign');
const message = document.querySelector('#message');
const selection = new Set();
let busy = false;
function sync() {
  document.querySelector('#selected-count').textContent = `${selection.size} selected`;
  assign.disabled = busy || !selection.size || !owner.value;
}
function cell(text, className) {
  const element = document.createElement('td');
  element.textContent = text;
  if (className) element.className = className;
  return element;
}
function render(tickets) {
  tbody.replaceChildren();
  for (const ticket of tickets) {
    const row = document.createElement('tr');
    const checkboxCell = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.setAttribute('aria-label', `Select ${ticket.id}`);
    checkbox.checked = selection.has(ticket.id);
    checkbox.disabled = busy;
    row.classList.toggle('selected', checkbox.checked);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) selection.add(ticket.id); else selection.delete(ticket.id);
      row.classList.toggle('selected', checkbox.checked);
      sync();
    });
    checkboxCell.append(checkbox);
    const subject = document.createElement('th');
    subject.scope = 'row';
    const id = document.createElement('span'); id.className = 'ticket-id'; id.textContent = ticket.id;
    const title = document.createElement('strong'); title.textContent = ticket.subject;
    const customer = document.createElement('small'); customer.textContent = ticket.customer;
    subject.append(id, title, customer);
    row.append(checkboxCell, subject, cell(ticket.priority, `priority ${ticket.priority.toLowerCase()}`), cell(ticket.owner, 'owner'), cell(ticket.status, 'status'));
    tbody.append(row);
  }
  sync();
}
async function request(path, body) {
  const response = await fetch(path, body === undefined ? {} : {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error);
  return result;
}
async function load() {
  try {
    const result = await request('/api/tickets');
    for (const name of result.owners) owner.add(new Option(name, name));
    render(result.tickets);
    message.textContent = 'Select tickets to assign them to a teammate.';
  } catch (error) { message.textContent = error.message; }
}
owner.addEventListener('change', sync);
document.querySelector('#assign-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (assign.disabled) return;
  busy = true; sync();
  const target = owner.value;
  try {
    const result = await request('/api/assign', { ids: [...selection], owner: target });
    selection.clear();
    busy = false; render(result.tickets);
    message.textContent = `${result.count} tickets assigned to ${target}.`;
  } catch (error) { message.textContent = error.message; }
  finally { busy = false; sync(); }
});
document.querySelector('#reset').addEventListener('click', async () => {
  try {
    const result = await request('/api/reset', {});
    selection.clear(); owner.value = ''; render(result.tickets);
    message.textContent = 'Demo data restored.';
  } catch (error) { message.textContent = error.message; }
});
load();
