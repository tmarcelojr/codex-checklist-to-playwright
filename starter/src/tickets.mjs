export const owners = ['Alex', 'Maya', 'Sam'];

export function seedTickets() {
  return [
    { id: 'NS-1042', subject: 'Export stalls at the last step', customer: 'Cedar Labs', priority: 'High', owner: 'Alex', status: 'Open' },
    { id: 'NS-1043', subject: 'Invoice email arrives twice', customer: 'Juniper Works', priority: 'High', owner: 'Sam', status: 'Open' },
    { id: 'NS-1044', subject: 'Team invitation has expired', customer: 'Aster Studio', priority: 'Normal', owner: 'Alex', status: 'Pending' },
    { id: 'NS-1045', subject: 'Dashboard totals look delayed', customer: 'Kite Systems', priority: 'Normal', owner: 'Sam', status: 'Open' },
    { id: 'NS-1046', subject: 'Question about workspace roles', customer: 'Maple Digital', priority: 'Low', owner: 'Maya', status: 'Pending' },
    { id: 'NS-1047', subject: 'CSV includes an empty column', customer: 'Elm Software', priority: 'Low', owner: 'Alex', status: 'Open' }
  ];
}

export function assignTickets(tickets, ids, owner) {
  if (!Array.isArray(ids) || ids.length === 0 || ids.length > tickets.length ||
      new Set(ids).size !== ids.length || !ids.every(id => tickets.some(ticket => ticket.id === id)) ||
      !owners.includes(owner)) {
    throw new Error('Choose valid tickets and an owner.');
  }
  return tickets.map(ticket => ids.includes(ticket.id) ? { ...ticket, owner } : ticket);
}
