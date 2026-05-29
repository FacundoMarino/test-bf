export type MatchGenderUi = 'male' | 'female' | 'mixed' | null;

export type ParticipantSlot = {
  label: string;
  name: string | null;
  struck?: boolean;
};

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formatEsDate(d: Date): string {
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatEsTime(d: Date): string {
  return d.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Formato monetario alineado con listados del backend (EUR). */
export function formatMoneyEur(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function matchGenderLabel(g: MatchGenderUi): string {
  if (g === 'male') return 'Masculino';
  if (g === 'female') return 'Femenino';
  if (g === 'mixed') return 'Mixto';
  return '—';
}

export function bookingStatusLabel(
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED',
  occupiesSlot: boolean,
): string {
  if (status === 'CONFIRMED' && occupiesSlot) return 'CONFIRMADO';
  return 'PENDIENTE';
}

function clubBlockText(club: {
  name: string;
  address: string;
  email?: string | null;
}): string {
  const contact =
    club.email && club.email.trim().length > 0 ? club.email.trim() : '—';
  return [
    `| Club: | ${club.name} |`,
    `|        Dirección: ${club.address} |`,
    `|        Teléfono / contacto: ${contact} |`,
  ].join('\n');
}

function clubBlockHtml(club: {
  name: string;
  address: string;
  email?: string | null;
}): string {
  const contact =
    club.email && club.email.trim().length > 0 ? esc(club.email.trim()) : '—';
  return `<tr><td colspan="2"><strong>Club:</strong> ${esc(club.name)}<br/><span style="margin-left:1rem">Dirección: ${esc(club.address)}</span><br/><span style="margin-left:1rem">Teléfono / contacto: ${contact}</span></td></tr>`;
}

function participantRowsText(slots: ParticipantSlot[]): string {
  const lines: string[] = [];
  for (const s of slots) {
    const name = s.struck ? `~~${s.name ?? ''}~~` : (s.name ?? '');
    lines.push(`| ${s.label}: | ${name || '  '} |`);
  }
  return lines.join('\n');
}

function participantRowsHtml(slots: ParticipantSlot[]): string {
  return slots
    .map((s) => {
      const raw = s.name ?? '';
      const inner = s.struck ? `<del>${esc(raw)}</del>` : esc(raw);
      return `<tr><td>${esc(s.label)}</td><td>${inner || '&nbsp;'}</td></tr>`;
    })
    .join('');
}

export function closedBookingConfirmationEmail(input: {
  recipientName: string;
  start: Date;
  end: Date;
  totalPrice: number;
  club: { name: string; address: string; email?: string | null };
}) {
  const subject = 'Reserva lista. Solo queda jugar';
  const dateStr = formatEsDate(input.start);
  const timeStr = formatEsTime(input.start);
  const priceStr = formatMoneyEur(input.totalPrice);

  const text = [
    'Tu pista ya está reservada 👌 Todo listo para entrar a la cancha',
    '',
    `| Nombre: | ${input.recipientName} |`,
    `| Fecha: | ${dateStr} |`,
    `| Hora: | ${timeStr} |`,
    `| Precio: | ${priceStr} — Gestiona el pago con el club |`,
    clubBlockText(input.club),
    '',
    '— Puntoo',
  ].join('\n');

  const html = `<div style="font-family:system-ui,Segoe UI,sans-serif;font-size:15px;line-height:1.5;color:#111">
<p>Tu pista ya está reservada 👌 Todo listo para entrar a la cancha</p>
<table cellpadding="6" style="border-collapse:collapse">${[
    `<tr><td>Nombre</td><td>${esc(input.recipientName)}</td></tr>`,
    `<tr><td>Fecha</td><td>${esc(dateStr)}</td></tr>`,
    `<tr><td>Hora</td><td>${esc(timeStr)}</td></tr>`,
    `<tr><td>Precio</td><td>${esc(priceStr)} — Gestiona el pago con el club</td></tr>`,
    clubBlockHtml(input.club),
  ].join('')}</table>
<p style="color:#666;font-size:13px">— Puntoo</p>
</div>`;

  return { subject, text, html };
}

export function openMatchPublishedEmail(input: {
  organizerName: string;
  statusLabel: string;
  level: number | null;
  modality: string;
  start: Date;
  sharePrice: number;
  club: { name: string; address: string; email?: string | null };
}) {
  const subject = 'Tu partido ya está en Puntoo';
  const dateStr = formatEsDate(input.start);
  const timeStr = formatEsTime(input.start);
  const shareStr = formatMoneyEur(input.sharePrice);

  const text = [
    'Tu partido ya está online 🔥',
    'Ahora solo falta que se sumen jugadores. Cuando sean 4… se confirma.',
    '',
    `| Estado: | ${input.statusLabel} |`,
    `| Nivel: | ${input.level ?? '—'} |`,
    `| Modalidad: | ${input.modality} |`,
    `| Organizador: | ${input.organizerName} |`,
    `| Fecha: | ${dateStr} |`,
    `| Hora: | ${timeStr} |`,
    `| Tu parte del pago: | ${shareStr} — Gestiona el pago con el club |`,
    clubBlockText(input.club),
    '',
    '— Puntoo',
  ].join('\n');

  const html = `<div style="font-family:system-ui,Segoe UI,sans-serif;font-size:15px;line-height:1.5;color:#111">
<p>Tu partido ya está online 🔥</p>
<p>Ahora solo falta que se sumen jugadores. Cuando sean 4… se confirma.</p>
<table cellpadding="6" style="border-collapse:collapse">${[
    `<tr><td>Estado</td><td>${esc(input.statusLabel)}</td></tr>`,
    `<tr><td>Nivel</td><td>${esc(String(input.level ?? '—'))}</td></tr>`,
    `<tr><td>Modalidad</td><td>${esc(input.modality)}</td></tr>`,
    `<tr><td>Organizador</td><td>${esc(input.organizerName)}</td></tr>`,
    `<tr><td>Fecha</td><td>${esc(dateStr)}</td></tr>`,
    `<tr><td>Hora</td><td>${esc(timeStr)}</td></tr>`,
    `<tr><td>Tu parte del pago</td><td>${esc(shareStr)} — Gestiona el pago con el club</td></tr>`,
    clubBlockHtml(input.club),
  ].join('')}</table>
<p style="color:#666;font-size:13px">— Puntoo</p>
</div>`;

  return { subject, text, html };
}

export function playerJoinedOrganizerEmail(input: {
  statusLabel: string;
  level: number | null;
  modality: string;
  organizerName: string;
  start: Date;
  sharePrice: number;
  club: { name: string; address: string; email?: string | null };
  playerSlots: ParticipantSlot[];
}) {
  const subject = 'Se sumó un jugador/a a tu partido en Puntoo';
  const dateStr = formatEsDate(input.start);
  const timeStr = formatEsTime(input.start);
  const shareStr = formatMoneyEur(input.sharePrice);

  const text = [
    '¡Se está armando! 💪',
    '',
    'Ya tienes un nuevo jugador/a en tu partido.',
    'Faltan algunos más… y esto se juega.',
    '',
    `| Estado: | ${input.statusLabel} |`,
    `| Nivel: | ${input.level ?? '—'} |`,
    `| Modalidad: | ${input.modality} |`,
    `| Organizador: | ${input.organizerName} |`,
    `| Fecha: | ${dateStr} |`,
    `| Hora: | ${timeStr} |`,
    `| Tu parte del pago: | ${shareStr} — Gestiona el pago con el club |`,
    clubBlockText(input.club),
    '',
    participantRowsText(input.playerSlots),
    '',
    '— Puntoo',
  ].join('\n');

  const html = `<div style="font-family:system-ui,Segoe UI,sans-serif;font-size:15px;line-height:1.5;color:#111">
<p>¡Se está armando! 💪</p>
<p>Ya tienes un nuevo jugador/a en tu partido.<br/>Faltan algunos más… y esto se juega.</p>
<table cellpadding="6" style="border-collapse:collapse">${[
    `<tr><td>Estado</td><td>${esc(input.statusLabel)}</td></tr>`,
    `<tr><td>Nivel</td><td>${esc(String(input.level ?? '—'))}</td></tr>`,
    `<tr><td>Modalidad</td><td>${esc(input.modality)}</td></tr>`,
    `<tr><td>Organizador</td><td>${esc(input.organizerName)}</td></tr>`,
    `<tr><td>Fecha</td><td>${esc(dateStr)}</td></tr>`,
    `<tr><td>Hora</td><td>${esc(timeStr)}</td></tr>`,
    `<tr><td>Tu parte del pago</td><td>${esc(shareStr)} — Gestiona el pago con el club</td></tr>`,
    clubBlockHtml(input.club),
    participantRowsHtml(input.playerSlots),
  ].join('')}</table>
<p style="color:#666;font-size:13px">— Puntoo</p>
</div>`;

  return { subject, text, html };
}

export function playerJoinedSelfEmail(input: {
  statusLabel: string;
  level: number | null;
  modality: string;
  organizerName: string;
  start: Date;
  sharePrice: number;
  club: { name: string; address: string; email?: string | null };
  playerSlots: ParticipantSlot[];
}) {
  const subject = 'Ya estás dentro. Puntoo';
  const dateStr = formatEsDate(input.start);
  const timeStr = formatEsTime(input.start);
  const shareStr = formatMoneyEur(input.sharePrice);

  const text = [
    'Ya estás en el partido 🔥',
    '',
    'En cuanto sean 4… se juega.',
    '',
    `| Estado: | ${input.statusLabel} |`,
    `| Nivel: | ${input.level ?? '—'} |`,
    `| Modalidad: | ${input.modality} |`,
    `| Organizador: | ${input.organizerName} |`,
    `| Fecha: | ${dateStr} |`,
    `| Hora: | ${timeStr} |`,
    `| Tu parte del pago: | ${shareStr} — Gestiona el pago con el club |`,
    clubBlockText(input.club),
    '',
    participantRowsText(input.playerSlots),
    '',
    '— Puntoo',
  ].join('\n');

  const html = `<div style="font-family:system-ui,Segoe UI,sans-serif;font-size:15px;line-height:1.5;color:#111">
<p>Ya estás en el partido 🔥</p>
<p>En cuanto sean 4… se juega.</p>
<table cellpadding="6" style="border-collapse:collapse">${[
    `<tr><td>Estado</td><td>${esc(input.statusLabel)}</td></tr>`,
    `<tr><td>Nivel</td><td>${esc(String(input.level ?? '—'))}</td></tr>`,
    `<tr><td>Modalidad</td><td>${esc(input.modality)}</td></tr>`,
    `<tr><td>Organizador</td><td>${esc(input.organizerName)}</td></tr>`,
    `<tr><td>Fecha</td><td>${esc(dateStr)}</td></tr>`,
    `<tr><td>Hora</td><td>${esc(timeStr)}</td></tr>`,
    `<tr><td>Tu parte del pago</td><td>${esc(shareStr)} — Gestiona el pago con el club</td></tr>`,
    clubBlockHtml(input.club),
    participantRowsHtml(input.playerSlots),
  ].join('')}</table>
<p style="color:#666;font-size:13px">— Puntoo</p>
</div>`;

  return { subject, text, html };
}

export function matchConfirmedAllEmail(input: {
  statusLabel: string;
  level: number | null;
  modality: string;
  organizerName: string;
  start: Date;
  sharePrice: number;
  club: { name: string; address: string; email?: string | null };
  playerSlots: ParticipantSlot[];
}) {
  const subject = 'Partido confirmado en Puntoo';
  const dateStr = formatEsDate(input.start);
  const timeStr = formatEsTime(input.start);
  const shareStr = formatMoneyEur(input.sharePrice);

  const text = [
    '¡Listo! Ya son 4 🙌',
    '',
    'El partido está confirmado.',
    'En Puntoo esto es simple: se completa… y se juega.',
    '',
    `| Estado: | ${input.statusLabel} |`,
    `| Nivel: | ${input.level ?? '—'} |`,
    `| Modalidad: | ${input.modality} |`,
    `| Organizador: | ${input.organizerName} |`,
    `| Fecha: | ${dateStr} |`,
    `| Hora: | ${timeStr} |`,
    `| Tu parte del pago: | ${shareStr} — Gestiona el pago con el club |`,
    clubBlockText(input.club),
    '',
    participantRowsText(input.playerSlots),
    '',
    '— Puntoo',
  ].join('\n');

  const html = `<div style="font-family:system-ui,Segoe UI,sans-serif;font-size:15px;line-height:1.5;color:#111">
<p>¡Listo! Ya son 4 🙌</p>
<p>El partido está confirmado.<br/>En Puntoo esto es simple: se completa… y se juega.</p>
<table cellpadding="6" style="border-collapse:collapse">${[
    `<tr><td>Estado</td><td>${esc(input.statusLabel)}</td></tr>`,
    `<tr><td>Nivel</td><td>${esc(String(input.level ?? '—'))}</td></tr>`,
    `<tr><td>Modalidad</td><td>${esc(input.modality)}</td></tr>`,
    `<tr><td>Organizador</td><td>${esc(input.organizerName)}</td></tr>`,
    `<tr><td>Fecha</td><td>${esc(dateStr)}</td></tr>`,
    `<tr><td>Hora</td><td>${esc(timeStr)}</td></tr>`,
    `<tr><td>Tu parte del pago</td><td>${esc(shareStr)} — Gestiona el pago con el club</td></tr>`,
    clubBlockHtml(input.club),
    participantRowsHtml(input.playerSlots),
  ].join('')}</table>
<p style="color:#666;font-size:13px">— Puntoo</p>
</div>`;

  return { subject, text, html };
}

export function leaveSelfEmail(input: {
  level: number | null;
  modality: string;
  organizerName: string;
  start: Date;
  club: { name: string; address: string; email?: string | null };
}) {
  const subject = 'Saliste del partido en Puntoo';
  const dateStr = formatEsDate(input.start);
  const timeStr = formatEsTime(input.start);

  const text = [
    'Ya no estás en este partido.',
    '',
    'Pero tranquilo…',
    'en Puntoo siempre hay otro punto esperándote 😉',
    '',
    `| Nivel: | ${input.level ?? '—'} |`,
    `| Modalidad: | ${input.modality} |`,
    `| Organizador: | ${input.organizerName} |`,
    `| Fecha: | ${dateStr} |`,
    `| Hora: | ${timeStr} |`,
    clubBlockText(input.club),
    '',
    '— Puntoo',
  ].join('\n');

  const html = `<div style="font-family:system-ui,Segoe UI,sans-serif;font-size:15px;line-height:1.5;color:#111">
<p>Ya no estás en este partido.</p>
<p>Pero tranquilo…<br/>en Puntoo siempre hay otro punto esperándote 😉</p>
<table cellpadding="6" style="border-collapse:collapse">${[
    `<tr><td>Nivel</td><td>${esc(String(input.level ?? '—'))}</td></tr>`,
    `<tr><td>Modalidad</td><td>${esc(input.modality)}</td></tr>`,
    `<tr><td>Organizador</td><td>${esc(input.organizerName)}</td></tr>`,
    `<tr><td>Fecha</td><td>${esc(dateStr)}</td></tr>`,
    `<tr><td>Hora</td><td>${esc(timeStr)}</td></tr>`,
    clubBlockHtml(input.club),
  ].join('')}</table>
<p style="color:#666;font-size:13px">— Puntoo</p>
</div>`;

  return { subject, text, html };
}

export function leaveOrganizerEmail(input: {
  statusLabel: string;
  level: number | null;
  modality: string;
  organizerName: string;
  start: Date;
  sharePrice: number;
  club: { name: string; address: string; email?: string | null };
  playerSlots: ParticipantSlot[];
}) {
  const subject = 'Se bajó un jugador de tu partido';
  const dateStr = formatEsDate(input.start);
  const timeStr = formatEsTime(input.start);
  const shareStr = formatMoneyEur(input.sharePrice);

  const text = [
    'Un jugador se dio de baja 😬',
    '',
    'Pero no te preocupes, En Puntoo, esto se soluciona rápido 💪',
    '',
    `| Estado: | ${input.statusLabel} |`,
    `| Nivel: | ${input.level ?? '—'} |`,
    `| Modalidad: | ${input.modality} |`,
    `| Organizador: | ${input.organizerName} |`,
    `| Fecha: | ${dateStr} |`,
    `| Hora: | ${timeStr} |`,
    `| Tu parte del pago: | ${shareStr} — Gestiona el pago con el club |`,
    clubBlockText(input.club),
    '',
    participantRowsText(input.playerSlots),
    '',
    '— Puntoo',
  ].join('\n');

  const html = `<div style="font-family:system-ui,Segoe UI,sans-serif;font-size:15px;line-height:1.5;color:#111">
<p>Un jugador se dio de baja 😬</p>
<p>Pero no te preocupes, En Puntoo, esto se soluciona rápido 💪</p>
<table cellpadding="6" style="border-collapse:collapse">${[
    `<tr><td>Estado</td><td>${esc(input.statusLabel)}</td></tr>`,
    `<tr><td>Nivel</td><td>${esc(String(input.level ?? '—'))}</td></tr>`,
    `<tr><td>Modalidad</td><td>${esc(input.modality)}</td></tr>`,
    `<tr><td>Organizador</td><td>${esc(input.organizerName)}</td></tr>`,
    `<tr><td>Fecha</td><td>${esc(dateStr)}</td></tr>`,
    `<tr><td>Hora</td><td>${esc(timeStr)}</td></tr>`,
    `<tr><td>Tu parte del pago</td><td>${esc(shareStr)} — Gestiona el pago con el club</td></tr>`,
    clubBlockHtml(input.club),
    participantRowsHtml(input.playerSlots),
  ].join('')}</table>
<p style="color:#666;font-size:13px">— Puntoo</p>
</div>`;

  return { subject, text, html };
}

export function droppedFromFullEmail(input: {
  statusLabel: string;
  level: number | null;
  modality: string;
  organizerName: string;
  start: Date;
  sharePrice: number;
  club: { name: string; address: string; email?: string | null };
  playerSlots: ParticipantSlot[];
}) {
  const subject = 'Falta uno para volver a jugar';
  const dateStr = formatEsDate(input.start);
  const timeStr = formatEsTime(input.start);
  const shareStr = formatMoneyEur(input.sharePrice);

  const text = [
    'Se bajó un jugador 😬',
    '',
    'El partido vuelve a estar pendiente.',
    'Pero en Puntoo ya sabes cómo es…',
    'esto se completa y se juega enseguida.',
    '',
    `| Estado: | ${input.statusLabel} |`,
    `| Nivel: | ${input.level ?? '—'} |`,
    `| Modalidad: | ${input.modality} |`,
    `| Organizador: | ${input.organizerName} |`,
    `| Fecha: | ${dateStr} |`,
    `| Hora: | ${timeStr} |`,
    `| Tu parte del pago: | ${shareStr} — Gestiona el pago con el club |`,
    clubBlockText(input.club),
    '',
    participantRowsText(input.playerSlots),
    '',
    '— Puntoo',
  ].join('\n');

  const html = `<div style="font-family:system-ui,Segoe UI,sans-serif;font-size:15px;line-height:1.5;color:#111">
<p>Se bajó un jugador 😬</p>
<p>El partido vuelve a estar pendiente.<br/>Pero en Puntoo ya sabes cómo es…<br/>esto se completa y se juega enseguida.</p>
<table cellpadding="6" style="border-collapse:collapse">${[
    `<tr><td>Estado</td><td>${esc(input.statusLabel)}</td></tr>`,
    `<tr><td>Nivel</td><td>${esc(String(input.level ?? '—'))}</td></tr>`,
    `<tr><td>Modalidad</td><td>${esc(input.modality)}</td></tr>`,
    `<tr><td>Organizador</td><td>${esc(input.organizerName)}</td></tr>`,
    `<tr><td>Fecha</td><td>${esc(dateStr)}</td></tr>`,
    `<tr><td>Hora</td><td>${esc(timeStr)}</td></tr>`,
    `<tr><td>Tu parte del pago</td><td>${esc(shareStr)} — Gestiona el pago con el club</td></tr>`,
    clubBlockHtml(input.club),
    participantRowsHtml(input.playerSlots),
  ].join('')}</table>
<p style="color:#666;font-size:13px">— Puntoo</p>
</div>`;

  return { subject, text, html };
}
