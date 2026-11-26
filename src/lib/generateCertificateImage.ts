/**
 * generateCertificateImage.ts
 * Renders a professional Certificate of Currency as a PNG image using Canvas API.
 */

export interface CertificateData {
  policyNumber: string;
  insurer: string;
  policyType: string;
  buildingSumInsuredCents: number;
  premiumCents: number;
  startDate: string;
  expiryDate: string;
  status: string;
}

function fmt(cents: number, decimals = 0) {
  return '$' + (cents / 100).toLocaleString('en-AU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function generateCertificateImage(policy: CertificateData): void {
  const W = 900;
  const H = 640;

  const canvas = document.createElement('canvas');
  // Retina / high-DPI
  const dpr = window.devicePixelRatio || 2;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;

  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);

  /* ── Palette ─────────────────────────────────────────── */
  const NAVY   = '#102747';
  const TEAL   = '#00B5A4';
  const LIGHT  = '#F8FAFC';
  const BORDER = '#D5E5F2';
  const MUTED  = '#71849A';
  const WHITE  = '#FFFFFF';
  const GREEN  = '#10B981'; // verified badge

  /* ── Background ──────────────────────────────────────── */
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, W, H);

  /* ── Top header bar ──────────────────────────────────── */
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, W, 90);

  // Teal accent stripe
  ctx.fillStyle = TEAL;
  ctx.fillRect(0, 90, W, 5);

  /* ── Org logo placeholder (circle + initials) ────────── */
  const logoX = 44, logoY = 45, logoR = 26;
  ctx.save();
  ctx.beginPath();
  ctx.arc(logoX, logoY, logoR, 0, Math.PI * 2);
  ctx.fillStyle = TEAL;
  ctx.fill();
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SP', logoX, logoY);
  ctx.restore();

  /* ── Header text ─────────────────────────────────────── */
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('CERTIFICATE OF CURRENCY', 84, 36);

  ctx.font = '12px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.fillText('Strata Insurance  ·  Strata Plan SP 52891  ·  142 Pacific Highway, Chatswood NSW 2067', 84, 60);

  /* ── "VERIFIED" pill on top-right ────────────────────── */
  const pillX = W - 150, pillY = 30, pillW = 118, pillH = 32, pillR = 8;
  ctx.beginPath();
  ctx.moveTo(pillX + pillR, pillY);
  ctx.arcTo(pillX + pillW, pillY, pillX + pillW, pillY + pillH, pillR);
  ctx.arcTo(pillX + pillW, pillY + pillH, pillX, pillY + pillH, pillR);
  ctx.arcTo(pillX, pillY + pillH, pillX, pillY, pillR);
  ctx.arcTo(pillX, pillY, pillX + pillW, pillY, pillR);
  ctx.closePath();
  ctx.fillStyle = GREEN;
  ctx.fill();

  // Check mark
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✓  VERIFIED', pillX + pillW / 2, pillY + pillH / 2);

  /* ── Policy number large display ─────────────────────── */
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('POLICY NUMBER', 44, 112);

  ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.fillStyle = NAVY;
  ctx.fillText(policy.policyNumber, 44, 130);

  /* ── Status badge ────────────────────────────────────── */
  const badgeText = 'CURRENT & IN FORCE';
  ctx.font = 'bold 11px system-ui, sans-serif';
  const bW = ctx.measureText(badgeText).width + 24;
  const bX = 44, bY = 170, bH = 24;
  const bR = 6;
  ctx.beginPath();
  ctx.moveTo(bX + bR, bY);
  ctx.arcTo(bX + bW, bY, bX + bW, bY + bH, bR);
  ctx.arcTo(bX + bW, bY + bH, bX, bY + bH, bR);
  ctx.arcTo(bX, bY + bH, bX, bY, bR);
  ctx.arcTo(bX, bY, bX + bW, bY, bR);
  ctx.closePath();
  ctx.fillStyle = '#DCFCE7';
  ctx.fill();
  ctx.strokeStyle = '#86EFAC';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#166534';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(badgeText, bX + 12, bY + bH / 2);

  /* ── Divider ─────────────────────────────────────────── */
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(44, 208);
  ctx.lineTo(W - 44, 208);
  ctx.stroke();

  /* ── Info grid (2 columns × 4 rows) ─────────────────── */
  const fields: [string, string][] = [
    ['Insurer / Underwriter', policy.insurer],
    ['Cover Type', policy.policyType],
    ['Insured', 'The Owners – Strata Plan SP 52891'],
    ['Risk Address', '142 Pacific Highway, Chatswood NSW 2067'],
    ['Sum Insured', fmt(policy.buildingSumInsuredCents)],
    ['Annual Premium', fmt(policy.premiumCents, 2)],
    ['Period of Cover (From)', policy.startDate],
    ['Period of Cover (To)', policy.expiryDate],
  ];

  const colW = (W - 88) / 2;
  const rowH = 52;
  const startY = 220;

  fields.forEach(([label, value], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 44 + col * colW;
    const y = startY + row * rowH;

    // Cell background
    const pad = 8;
    ctx.fillStyle = LIGHT;
    ctx.beginPath();
    const cr = 6;
    ctx.moveTo(x + pad + cr, y + pad);
    ctx.arcTo(x + colW - pad * 1.5, y + pad, x + colW - pad * 1.5, y + rowH - pad, cr);
    ctx.arcTo(x + colW - pad * 1.5, y + rowH - pad, x + pad, y + rowH - pad, cr);
    ctx.arcTo(x + pad, y + rowH - pad, x + pad, y + pad, cr);
    ctx.arcTo(x + pad, y + pad, x + colW - pad * 1.5, y + pad, cr);
    ctx.closePath();
    ctx.fill();

    // Label
    ctx.font = '10px system-ui, sans-serif';
    ctx.fillStyle = MUTED;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(label.toUpperCase(), x + pad + 8, y + pad + 7);

    // Value
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillStyle = NAVY;
    ctx.fillText(value, x + pad + 8, y + pad + 22);
  });

  /* ── Statutory notice ────────────────────────────────── */
  const noticeY = startY + 4 * rowH + 12;
  ctx.fillStyle = '#EFF6FF';
  ctx.strokeStyle = '#BFDBFE';
  ctx.lineWidth = 1;
  roundRect(ctx, 44, noticeY, W - 88, 38, 8);
  ctx.fill();
  ctx.stroke();
  ctx.font = '10.5px system-ui, sans-serif';
  ctx.fillStyle = '#1E3A8A';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    'Issued under s.160 Strata Schemes Management Act 2015 (NSW) · This certificate is computer-generated and does not require a physical signature.',
    58,
    noticeY + 19,
  );

  /* ── Footer ──────────────────────────────────────────── */
  const footerY = H - 46;
  ctx.fillStyle = LIGHT;
  ctx.fillRect(0, footerY, W, 46);
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, footerY);
  ctx.lineTo(W, footerY);
  ctx.stroke();

  // Teal left accent
  ctx.fillStyle = TEAL;
  ctx.fillRect(0, footerY, 4, 46);

  ctx.font = '10px system-ui, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`Generated: ${new Date().toLocaleString('en-AU', { dateStyle: 'long', timeStyle: 'short' })}`, 20, footerY + 23);

  ctx.textAlign = 'right';
  ctx.fillText('StrataManager Pro  ·  Authorised Strata Management Platform', W - 44, footerY + 23);

  /* ── Watermark diagonal "OFFICIAL" ──────────────────── */
  ctx.save();
  ctx.globalAlpha = 0.035;
  ctx.font = 'bold 90px system-ui, sans-serif';
  ctx.fillStyle = NAVY;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.translate(W / 2, H / 2 - 20);
  ctx.rotate(-Math.PI / 8);
  ctx.fillText('OFFICIAL', 0, 0);
  ctx.restore();

  /* ── Download ────────────────────────────────────────── */
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificate_of_Currency_${policy.policyNumber}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }, 'image/png');
}

/* helper */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
