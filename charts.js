/* ============================================================
   CHARTS.JS  –  Motor de gráficas con Canvas puro
   ============================================================ */
'use strict';

const Charts = (() => {

  /* ── Paleta de colores ── */
  const PALETTE = [
    '#FF6D00','#1565C0','#2E7D32','#C62828','#6A1B9A',
    '#00838F','#F57F17','#4E342E','#37474F','#AD1457'
  ];

  function hex2rgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  /* ── Utilidades canvas ── */
  function getCtx(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return null;
    canvas.width  = canvas.offsetWidth  || 400;
    canvas.height = canvas.offsetHeight || 240;
    return canvas.getContext('2d');
  }

  function clear(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  /* ── Texto truncado ── */
  function truncate(ctx, text, maxW) {
    let t = String(text);
    while (ctx.measureText(t).width > maxW && t.length > 3)
      t = t.slice(0, -1);
    return t.length < text.length ? t + '…' : t;
  }

  /* ================================================================
     BARRAS HORIZONTALES
  ================================================================ */
  function barH(canvasId, labels, values, opts = {}) {
    const ctx = getCtx(canvasId);
    if (!ctx) return;
    clear(ctx);

    const W       = ctx.canvas.width;
    const H       = ctx.canvas.height;
    const PAD     = { top:16, right:24, bottom:16, left:130 };
    const rows    = labels.length;
    const barH2   = Math.min(28, (H - PAD.top - PAD.bottom) / rows - 6);
    const maxVal  = Math.max(...values, 1);
    const drawW   = W - PAD.left - PAD.right;
    const colors  = opts.colors || PALETTE;

    ctx.font = '12px Segoe UI, sans-serif';
    ctx.fillStyle = '#757575';

    labels.forEach((lbl, i) => {
      const y    = PAD.top + i * (barH2 + 8);
      const val  = values[i] || 0;
      const barW = (val / maxVal) * drawW;
      const color = Array.isArray(colors) ? (colors[i % colors.length]) : colors;

      /* Fondo barra */
      ctx.fillStyle = '#F0F0F0';
      ctx.beginPath();
      ctx.roundRect(PAD.left, y, drawW, barH2, 4);
      ctx.fill();

      /* Barra */
      if (barW > 0) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(PAD.left, y, barW, barH2, 4);
        ctx.fill();
      }

      /* Label izquierda */
      ctx.fillStyle = '#333';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(truncate(ctx, lbl, PAD.left - 8), PAD.left - 6, y + barH2/2);

      /* Valor derecha */
      ctx.fillStyle = '#333';
      ctx.textAlign = 'left';
      ctx.fillText(val, PAD.left + barW + 4, y + barH2/2);
    });
  }

  /* ================================================================
     BARRAS VERTICALES (agrupadas)
  ================================================================ */
  function barV(canvasId, labels, datasets, opts = {}) {
    const ctx = getCtx(canvasId);
    if (!ctx) return;
    clear(ctx);

    const W       = ctx.canvas.width;
    const H       = ctx.canvas.height;
    const PAD     = { top:24, right:16, bottom:48, left:40 };
    const drawW   = W - PAD.left - PAD.right;
    const drawH   = H - PAD.top  - PAD.bottom;
    const groups  = labels.length;
    const dsCount = datasets.length;
    const allVals = datasets.flatMap(ds => ds.data);
    const maxVal  = Math.max(...allVals, 1);
    const groupW  = drawW / groups;
    const barW    = Math.min(28, groupW / (dsCount + 1));

    /* Grid lines */
    ctx.strokeStyle = '#EEEEEE';
    ctx.lineWidth   = 1;
    [0.25, 0.5, 0.75, 1].forEach(frac => {
      const y = PAD.top + drawH - frac * drawH;
      ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(W - PAD.right, y); ctx.stroke();
      ctx.fillStyle   = '#BDBDBD';
      ctx.font        = '10px Segoe UI';
      ctx.textAlign   = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(Math.round(maxVal * frac), PAD.left - 4, y);
    });

    /* Barras */
    datasets.forEach((ds, di) => {
      const color = ds.color || PALETTE[di % PALETTE.length];
      ds.data.forEach((val, gi) => {
        const barH2 = (val / maxVal) * drawH;
        const x = PAD.left + gi * groupW + (groupW - dsCount * barW) / 2 + di * barW;
        const y = PAD.top  + drawH - barH2;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x, y, barW - 2, barH2, [3,3,0,0]);
        ctx.fill();
      });
    });

    /* Labels eje X */
    ctx.fillStyle   = '#555';
    ctx.font        = '11px Segoe UI';
    ctx.textAlign   = 'center';
    ctx.textBaseline = 'top';
    labels.forEach((lbl, i) => {
      const x = PAD.left + i * groupW + groupW / 2;
      ctx.fillText(truncate(ctx, lbl, groupW - 4), x, H - PAD.bottom + 6);
    });

    /* Leyenda */
    if (opts.legend !== false && dsCount > 1) {
      let lx = PAD.left;
      datasets.forEach((ds, di) => {
        const color = ds.color || PALETTE[di % PALETTE.length];
        ctx.fillStyle = color;
        ctx.fillRect(lx, 4, 12, 12);
        ctx.fillStyle = '#555';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = '11px Segoe UI';
        ctx.fillText(ds.label || '', lx + 16, 4);
        lx += ctx.measureText(ds.label || '').width + 36;
      });
    }
  }

  /* ================================================================
     DONA (Donut)
  ================================================================ */
  function donut(canvasId, labels, values, opts = {}) {
    const ctx = getCtx(canvasId);
    if (!ctx) return;
    clear(ctx);

    const W     = ctx.canvas.width;
    const H     = ctx.canvas.height;
    const cx    = W * 0.38;
    const cy    = H / 2;
    const R     = Math.min(cx, cy) - 20;
    const r     = R * 0.55;
    const total = values.reduce((a,b) => a+b, 0) || 1;
    const colors = opts.colors || PALETTE;

    let start = -Math.PI / 2;
    values.forEach((val, i) => {
      const angle = (val / total) * 2 * Math.PI;
      const color = colors[i % colors.length];

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, start, start + angle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#FFF';
      ctx.lineWidth   = 2;
      ctx.stroke();

      start += angle;
    });

    /* Agujero central */
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFF';
    ctx.fill();

    /* Centro texto */
    ctx.fillStyle   = '#212121';
    ctx.font        = 'bold 22px Segoe UI';
    ctx.textAlign   = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(opts.centerText || total, cx, cy - 6);
    ctx.font      = '11px Segoe UI';
    ctx.fillStyle = '#757575';
    ctx.fillText(opts.centerLabel || 'Total', cx, cy + 14);

    /* Leyenda derecha */
    const legendX = W * 0.65;
    let legendY   = (H - labels.length * 22) / 2;

    labels.forEach((lbl, i) => {
      const pct   = ((values[i] / total) * 100).toFixed(1);
      const color = colors[i % colors.length];

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(legendX + 6, legendY + 6, 6, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle   = '#333';
      ctx.font        = '12px Segoe UI';
      ctx.textAlign   = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${lbl}  ${values[i]} (${pct}%)`, legendX + 18, legendY + 6);
      legendY += 22;
    });
  }

  /* ================================================================
     LÍNEA (sparkline / tendencia)
  ================================================================ */
  function line(canvasId, labels, datasets, opts = {}) {
    const ctx = getCtx(canvasId);
    if (!ctx) return;
    clear(ctx);

    const W     = ctx.canvas.width;
    const H     = ctx.canvas.height;
    const PAD   = { top:24, right:20, bottom:44, left:44 };
    const drawW = W - PAD.left - PAD.right;
    const drawH = H - PAD.top  - PAD.bottom;
    const n     = labels.length;
    if (n < 2) return;

    const allVals = datasets.flatMap(ds => ds.data);
    const maxVal  = Math.max(...allVals, 1);

    /* Grid */
    ctx.strokeStyle = '#EEEEEE';
    ctx.lineWidth   = 1;
    [0, 0.25, 0.5, 0.75, 1].forEach(frac => {
      const y = PAD.top + drawH - frac * drawH;
      ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(W - PAD.right, y); ctx.stroke();
      if (frac > 0) {
        ctx.fillStyle   = '#BDBDBD';
        ctx.font        = '10px Segoe UI';
        ctx.textAlign   = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(Math.round(maxVal * frac), PAD.left - 4, y);
      }
    });

    /* Líneas */
    datasets.forEach((ds, di) => {
      const color = ds.color || PALETTE[di % PALETTE.length];
      const pts   = ds.data.map((v, i) => ({
        x: PAD.left + (i / (n-1)) * drawW,
        y: PAD.top  + drawH - (v / maxVal) * drawH
      }));

      /* Área relleno */
      ctx.beginPath();
      ctx.moveTo(pts[0].x, PAD.top + drawH);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(pts[pts.length-1].x, PAD.top + drawH);
      ctx.closePath();
      ctx.fillStyle = hex2rgba(color, 0.12);
      ctx.fill();

      /* Línea */
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = color;
      ctx.lineWidth   = 2.5;
      ctx.lineJoin    = 'round';
      ctx.stroke();

      /* Puntos */
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle   = '#FFF';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth   = 2;
        ctx.stroke();
      });
    });

    /* Labels eje X */
    ctx.fillStyle   = '#555';
    ctx.font        = '10px Segoe UI';
    ctx.textAlign   = 'center';
    ctx.textBaseline = 'top';
    labels.forEach((lbl, i) => {
      const x = PAD.left + (i / (n-1)) * drawW;
      ctx.fillText(truncate(ctx, lbl, drawW/(n-1) - 4), x, H - PAD.bottom + 6);
    });

    /* Leyenda */
    if (datasets.length > 1) {
      let lx = PAD.left;
      datasets.forEach((ds, di) => {
        const color = ds.color || PALETTE[di % PALETTE.length];
        ctx.fillStyle = color;
        ctx.fillRect(lx, 4, 14, 3);
        ctx.fillStyle = '#555';
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.font = '11px Segoe UI';
        ctx.fillText(ds.label || '', lx + 18, 2);
        lx += ctx.measureText(ds.label || '').width + 40;
      });
    }
  }

  /* ================================================================
     GAUGE (velocímetro)
  ================================================================ */
  function gauge(canvasId, value, max, opts = {}) {
    const ctx = getCtx(canvasId);
    if (!ctx) return;
    clear(ctx);

    const W  = ctx.canvas.width;
    const H  = ctx.canvas.height;
    const cx = W / 2;
    const cy = H * 0.72;
    const R  = Math.min(cx, cy) - 16;
    const pct = Math.min(value / max, 1);

    /* Fondo arco */
    ctx.beginPath();
    ctx.arc(cx, cy, R, Math.PI, 2 * Math.PI);
    ctx.strokeStyle = '#EEEEEE';
    ctx.lineWidth   = 18;
    ctx.lineCap     = 'round';
    ctx.stroke();

    /* Arco de valor */
    const grad  = ctx.createLinearGradient(cx - R, cy, cx + R, cy);
    const colors = opts.colors || ['#2E7D32','#F57F17','#C62828'];
    grad.addColorStop(0,   colors[0]);
    grad.addColorStop(0.6, colors[1]);
    grad.addColorStop(1,   colors[2]);

    ctx.beginPath();
    ctx.arc(cx, cy, R, Math.PI, Math.PI + pct * Math.PI);
    ctx.strokeStyle = grad;
    ctx.lineWidth   = 18;
    ctx.lineCap     = 'round';
    ctx.stroke();

    /* Aguja */
    const angle = Math.PI + pct * Math.PI;
    const nx    = cx + (R - 22) * Math.cos(angle);
    const ny    = cy + (R - 22) * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(nx, ny);
    ctx.strokeStyle = '#333';
    ctx.lineWidth   = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();

    /* Texto */
    ctx.fillStyle   = '#212121';
    ctx.font        = `bold ${Math.round(R * 0.38)}px Segoe UI`;
    ctx.textAlign   = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(opts.label || value, cx, cy - R * 0.18);

    ctx.fillStyle = '#757575';
    ctx.font      = '11px Segoe UI';
    ctx.fillText(opts.subLabel || '', cx, cy + 10);

    /* Min/Max */
    ctx.fillStyle = '#BDBDBD';
    ctx.font      = '10px Segoe UI';
    ctx.textAlign = 'left';
    ctx.fillText('0', cx - R - 4, cy + 16);
    ctx.textAlign = 'right';
    ctx.fillText(max, cx + R + 4, cy + 16);
  }

  /* Exportar canvas como imagen PNG */
  function exportPNG(canvasId, filename = 'chart.png') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const a = document.createElement('a');
    a.href     = canvas.toDataURL('image/png');
    a.download = filename;
    a.click();
  }

  return { barH, barV, donut, line, gauge, exportPNG };
})();
