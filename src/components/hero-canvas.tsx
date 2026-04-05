"use client";

import { useRef, useEffect } from "react";
import rough from "roughjs";

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;

    const context = cv.getContext("2d");
    if (!context) return;
    const cx = context;

    const rc = rough.canvas(cv);
    const W = 1100, H = 560;
    const WL = 70, WR = 1030, WT = 42, WB = 412, WMID = 228;

    /* ── Color palette ── */
    const CREAM = "#FFF8EE";
    const WALL = "#E4D4BC";
    const LINE_DARK = "#3A2010";
    const LINE_MED = "#6B4828";
    const LINE_LIGHT = "#9A7A58";
    const GOLD = "#C08818";
    const BLUE = "#14355A";
    const GREEN = "#1A6045";
    const RED = "#983020";
    const TEAL = "#0E2A48";
    const TILE_BG = "#EDE0CC";
    const TILE_LIGHT = "#F0E8D8";

    /* ── Gebs (carved plaster) colors — monochrome relief ── */
    const GEBS_BG = "#F0E8D8";       // warm plaster base
    const GEBS_GROOVE = "#B8A488";    // carved groove (main lines)
    const GEBS_SHADOW = "#A08868";    // shadow side of groove (depth)
    const GEBS_HIGHLIGHT = "#FBF6EE"; // light side of groove (raised edge)
    const GEBS_DEEP = "#9A8468";      // deeper carved detail
    const GEBS_FINE = "#C8B898";      // fine detail lines

    function clear() {
      cx.clearRect(0, 0, W, H);
      cx.fillStyle = CREAM;
      cx.fillRect(0, 0, W, H);
    }

    /* ── Gebs carved plaster — geometric interlace ──
       Based on actual Moroccan gebs panels (marrakechdesigns.com):
       - Deeply recessed background (dark shadow)
       - Raised interlacing bands forming 12-point star rosettes
       - Pointed petal voids between the bands
       - Thick raised bands that weave over/under each other
       - All monochrome white/cream with depth from shadow */

    // Recessed background color (the carved-away areas)
    const GEBS_RECESS = "#D0C4B0";
    // Raised band color (the plaster that remains)
    const GEBS_RAISED = "#F5EFE5";
    const GEBS_BAND_EDGE = "#C8B8A0";
    const GEBS_BAND_SHADOW = "#B0A088";

    /* ── Draw a raised band (thick line with shadow for depth) ── */

    function gebsBand(x1: number, y1: number, x2: number, y2: number, w: number) {
      // Shadow offset
      cx.strokeStyle = GEBS_BAND_SHADOW;
      cx.lineWidth = w + 1;
      cx.lineCap = "round";
      cx.beginPath();
      cx.moveTo(x1 + 1, y1 + 1);
      cx.lineTo(x2 + 1, y2 + 1);
      cx.stroke();

      // Main raised band
      cx.strokeStyle = GEBS_RAISED;
      cx.lineWidth = w;
      cx.beginPath();
      cx.moveTo(x1, y1);
      cx.lineTo(x2, y2);
      cx.stroke();

      // Edge highlight
      cx.strokeStyle = GEBS_BAND_EDGE;
      cx.lineWidth = 0.4;
      cx.beginPath();
      cx.moveTo(x1, y1);
      cx.lineTo(x2, y2);
      cx.stroke();
    }

    /* ── 12-point star rosette (interlacing bands) ──
       The iconic Moroccan gebs motif: a 12-pointed star
       formed by overlapping raised bands. The bands weave
       over/under creating the interlace illusion. */

    function drawGebsStar(centerX: number, centerY: number, outerR: number) {
      const n = 12;
      const innerR = outerR * 0.48;
      const bandW = outerR * 0.18;

      // Outer points and inner notches
      const outerPts: [number, number][] = [];
      const innerPts: [number, number][] = [];
      for (let i = 0; i < n; i++) {
        const aOuter = (i / n) * Math.PI * 2 - Math.PI / 2;
        const aInner = ((i + 0.5) / n) * Math.PI * 2 - Math.PI / 2;
        outerPts.push([
          centerX + Math.cos(aOuter) * outerR,
          centerY + Math.sin(aOuter) * outerR
        ]);
        innerPts.push([
          centerX + Math.cos(aInner) * innerR,
          centerY + Math.sin(aInner) * innerR
        ]);
      }

      // Draw interlacing bands: each band goes outer[i] → inner[i] → outer[i+1]
      for (let i = 0; i < n; i++) {
        const next = (i + 1) % n;
        // Band from outer point to inner notch
        gebsBand(outerPts[i][0], outerPts[i][1], innerPts[i][0], innerPts[i][1], bandW);
        // Band from inner notch to next outer point
        gebsBand(innerPts[i][0], innerPts[i][1], outerPts[next][0], outerPts[next][1], bandW);
      }

      // Center rosette circle (raised)
      cx.beginPath();
      cx.arc(centerX, centerY, innerR * 0.45, 0, Math.PI * 2);
      cx.fillStyle = GEBS_RAISED;
      cx.fill();
      cx.strokeStyle = GEBS_BAND_EDGE;
      cx.lineWidth = 0.6;
      cx.stroke();

      // Inner ring
      cx.beginPath();
      cx.arc(centerX, centerY, innerR * 0.25, 0, Math.PI * 2);
      cx.strokeStyle = GEBS_BAND_EDGE;
      cx.lineWidth = 0.5;
      cx.stroke();
    }

    /* ── Pointed petal void (the leaf-shaped openings between stars) ── */

    function drawPetalVoid(x: number, y: number, w: number, h: number, angle: number) {
      cx.save();
      cx.translate(x, y);
      cx.rotate(angle);

      // The petal is a pointed oval / vesica shape
      // Draw it as the RAISED border around a void
      const p = new Path2D();
      p.moveTo(0, -h / 2);
      p.bezierCurveTo(w * 0.6, -h * 0.3, w * 0.6, h * 0.3, 0, h / 2);
      p.bezierCurveTo(-w * 0.6, h * 0.3, -w * 0.6, -h * 0.3, 0, -h / 2);

      // Shadow
      cx.save();
      cx.translate(0.8, 0.8);
      cx.strokeStyle = GEBS_BAND_SHADOW;
      cx.lineWidth = 2.2;
      cx.stroke(p);
      cx.restore();

      // Raised border
      cx.strokeStyle = GEBS_RAISED;
      cx.lineWidth = 2;
      cx.stroke(p);

      // Edge detail
      cx.strokeStyle = GEBS_BAND_EDGE;
      cx.lineWidth = 0.4;
      cx.stroke(p);

      cx.restore();
    }

    /* ── Connecting bands between adjacent stars ── */

    function drawStarConnectors(
      cx1: number, cy1: number,
      cx2: number, cy2: number,
      r: number
    ) {
      const angle = Math.atan2(cy2 - cy1, cx2 - cx1);
      const dist = Math.sqrt((cx2 - cx1) ** 2 + (cy2 - cy1) ** 2);
      const midX = (cx1 + cx2) / 2;
      const midY = (cy1 + cy2) / 2;
      const bandW = r * 0.16;

      // Connecting bands at the midpoint
      const perpAngle = angle + Math.PI / 2;
      const spread = r * 0.3;

      for (let s = -1; s <= 1; s += 2) {
        const sx = midX + Math.cos(perpAngle) * spread * s;
        const sy = midY + Math.sin(perpAngle) * spread * s;
        gebsBand(
          sx - Math.cos(angle) * r * 0.4,
          sy - Math.sin(angle) * r * 0.4,
          sx + Math.cos(angle) * r * 0.4,
          sy + Math.sin(angle) * r * 0.4,
          bandW
        );
      }

      // Petal void at midpoint
      drawPetalVoid(midX, midY, r * 0.25, dist * 0.35, angle);
    }

    /* ── Main gebs arabesque fill ── */

    function fillArabesque(bx: number, by: number, bw: number, bh: number) {
      cx.save();
      cx.beginPath();
      cx.rect(bx, by, bw, bh);
      cx.clip();

      // Deeply recessed background (the carved-away plaster)
      cx.fillStyle = GEBS_RECESS;
      cx.fillRect(bx, by, bw, bh);

      // Subtle texture on recessed areas
      cx.globalAlpha = 0.08;
      cx.fillStyle = GEBS_DEEP;
      for (let ty = by; ty < by + bh; ty += 2) {
        for (let tx = bx; tx < bx + bw; tx += 2) {
          if (Math.random() > 0.6) cx.fillRect(tx, ty, 1, 1);
        }
      }
      cx.globalAlpha = 1;

      // Grid of 12-point star rosettes
      const spacing = 52;
      const starR = spacing * 0.42;

      // Calculate grid positions
      const stars: [number, number][] = [];
      for (let row = 0; ; row++) {
        const yy = by + spacing * 0.55 + row * spacing;
        if (yy > by + bh + starR) break;
        for (let col = 0; ; col++) {
          const xx = bx + spacing * 0.55 + col * spacing + (row % 2 === 1 ? spacing / 2 : 0);
          if (xx > bx + bw + starR) break;
          stars.push([xx, yy]);
        }
      }

      // Draw connecting bands between adjacent stars first (underneath)
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[j][0] - stars[i][0];
          const dy = stars[j][1] - stars[i][1];
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < spacing * 1.2) {
            drawStarConnectors(stars[i][0], stars[i][1], stars[j][0], stars[j][1], starR);
          }
        }
      }

      // Draw star rosettes on top
      for (const [sx, sy] of stars) {
        drawGebsStar(sx, sy, starR);
      }

      // Petal voids in remaining gaps
      for (let row = 0; ; row++) {
        const yy = by + spacing * 0.55 + spacing / 2 + row * spacing;
        if (yy > by + bh) break;
        for (let col = 0; ; col++) {
          const xx = bx + spacing * 0.55 + col * spacing + (row % 2 === 0 ? spacing / 2 : 0);
          if (xx > bx + bw) break;

          // Small petal voids at 45° angles
          for (let a = 0; a < 4; a++) {
            const angle = (a / 4) * Math.PI * 2 + Math.PI / 4;
            const px = xx + Math.cos(angle) * spacing * 0.12;
            const py = yy + Math.sin(angle) * spacing * 0.12;
            drawPetalVoid(px, py, starR * 0.2, starR * 0.35, angle);
          }
        }
      }

      // Outer frame — raised molding border
      // Thick raised frame
      cx.strokeStyle = GEBS_RAISED;
      cx.lineWidth = 4;
      cx.strokeRect(bx + 2, by + 2, bw - 4, bh - 4);
      // Shadow on frame
      cx.strokeStyle = GEBS_BAND_SHADOW;
      cx.lineWidth = 0.8;
      cx.strokeRect(bx + 4, by + 4, bw - 8, bh - 8);
      // Outer edge
      cx.strokeStyle = LINE_DARK;
      cx.lineWidth = 1.5;
      cx.strokeRect(bx, by, bw, bh);

      cx.restore();
    }

    /* ── Muqarnas (stalactite arches) ── */

    function muqarnas(x: number, y: number, w: number) {
      for (let row = 0; row < 3; row++) {
        const sw = 11 - row * 2.5;
        const yy = y + row * 8;
        cx.strokeStyle = row === 0 ? LINE_DARK : LINE_LIGHT;
        cx.lineWidth = 1 - row * 0.25;
        cx.beginPath();
        for (let i = 0; i < Math.floor(w / sw); i++) {
          cx.moveTo(x + i * sw, yy);
          cx.quadraticCurveTo(x + i * sw + sw / 2, yy + 7 - row, x + (i + 1) * sw, yy);
        }
        cx.stroke();
      }
    }

    /* ── Zellige helpers ── */

    function zel8(x2: number, y2: number, r: number, col: string) {
      const pts: [number, number][] = [];
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
        const rr = i % 2 === 0 ? r : r * 0.52;
        pts.push([x2 + Math.cos(a) * rr, y2 + Math.sin(a) * rr]);
      }
      rc.polygon(pts, { fill: col, fillStyle: "solid", stroke: col, strokeWidth: 0.2, roughness: 0.15 });
      rc.circle(x2, y2, r * 0.25, { fill: TILE_LIGHT, fillStyle: "solid", stroke: "none", strokeWidth: 0, roughness: 0.1 });
    }

    function zelC(x2: number, y2: number, s: number) {
      const cols = [BLUE, GREEN, GOLD, RED, BLUE, BLUE, GREEN, TEAL];
      const col = cols[Math.floor(Math.random() * cols.length)];
      const t = Math.floor(Math.random() * 4);
      const r = s * 0.38;
      if (t === 0) zel8(x2, y2, r, col);
      else if (t === 1) {
        rc.polygon([[x2, y2 - r], [x2 + r, y2], [x2, y2 + r], [x2 - r, y2]], { fill: col, fillStyle: "solid", stroke: col, strokeWidth: 0.2, roughness: 0.18 });
        rc.circle(x2, y2, s * 0.1, { fill: TILE_LIGHT, fillStyle: "solid", stroke: "none", strokeWidth: 0, roughness: 0.1 });
      } else if (t === 2) {
        rc.circle(x2, y2, s * 0.34, { fill: col, fillStyle: "solid", stroke: col, strokeWidth: 0.2, roughness: 0.18 });
      } else {
        const pts: [number, number][] = [];
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          const rr = i % 2 === 0 ? r : r * 0.5;
          pts.push([x2 + Math.cos(a) * rr, y2 + Math.sin(a) * rr]);
        }
        rc.polygon(pts, { fill: col, fillStyle: "solid", stroke: col, strokeWidth: 0.2, roughness: 0.15 });
      }
    }

    function zelB(x: number, y: number, w: number, h: number) {
      rc.rectangle(x, y, w, h, { fill: TILE_BG, fillStyle: "solid", stroke: "none", strokeWidth: 0, roughness: 0.3 });
      const c = 11, nc = Math.floor(w / c), nr = Math.floor(h / c);
      for (let r = 0; r < nr; r++)
        for (let i = 0; i < nc; i++)
          zelC(x + i * c + c / 2, y + r * c + c / 2, c);
    }

    function zelTri(x: number, y: number, w: number) {
      const tw = 9, n = Math.floor(w / tw);
      const cols = [BLUE, GREEN, GOLD];
      for (let i = 0; i < n; i++) {
        const tx = x + i * tw;
        const u = i % 2 === 0;
        const col = cols[i % 3];
        rc.polygon(
          u ? [[tx, y + 8], [tx + tw, y + 8], [tx + tw / 2, y]] : [[tx, y], [tx + tw, y], [tx + tw / 2, y + 8]],
          { fill: col, fillStyle: "solid", stroke: col, strokeWidth: 0.2, roughness: 0.2 }
        );
      }
    }

    function zelBlue(x: number, y: number, w: number) {
      rc.rectangle(x, y, w, 12, { fill: TEAL, fillStyle: "solid", stroke: "none", strokeWidth: 0, roughness: 0.2 });
      const dw = 12, n = Math.floor(w / dw);
      for (let i = 0; i < n; i++) {
        const dx = x + i * dw + dw / 2;
        rc.polygon([[dx, y + 1.5], [dx + 4, y + 6], [dx, y + 10.5], [dx - 4, y + 6]], { fill: TILE_LIGHT, fillStyle: "solid", stroke: TILE_LIGHT, strokeWidth: 0.2, roughness: 0.12 });
      }
    }

    /* ── Build drawing layers ── */

    const layers = [
      // Layer 0: Floor + wall frame
      () => {
        rc.rectangle(0, WB, W, H - WB, { fill: "#E0D4C0", fillStyle: "solid", stroke: "none", strokeWidth: 0, roughness: 0.3 });
        cx.strokeStyle = "#C8B8A0"; cx.lineWidth = 0.4; cx.globalAlpha = 0.3;
        for (let y = WB + 15; y < H; y += 30)
          for (let x = 0; x < W; x += 35)
            cx.strokeRect(x + (Math.floor(y / 30) % 2) * 17, y, 35, 30);
        cx.globalAlpha = 1;
        rc.line(0, WB, W, WB, { stroke: LINE_DARK, strokeWidth: 2.2, roughness: 1 });
        rc.rectangle(WL, WT, WR - WL, WB - WT, { fill: WALL, fillStyle: "solid", stroke: LINE_DARK, strokeWidth: 2.5, roughness: 1.2 });
      },
      // Layer 1: Carved plaster arabesque (gebs)
      () => {
        fillArabesque(WL + 2, WT + 2, WR - WL - 4, WMID - WT - 4);
        muqarnas(WL + 4, WMID - 20, WR - WL - 8);
      },
      // Layer 2: Zellige transition border
      () => {
        rc.line(WL, WMID, WR, WMID, { stroke: LINE_MED, strokeWidth: 2, roughness: 0.5 });
        zelTri(WL + 2, WMID + 2, WR - WL - 4);
        const hw = (WR - WL - 4) / 2 - 78;
        zelBlue(WL + 2, WMID + 11, hw);
        zelBlue(WL + 2 + hw + 156, WMID + 11, hw);
      },
      // Layer 3: Zellige side panels
      () => {
        const hw = (WR - WL - 4) / 2 - 78;
        zelB(WL + 2, WMID + 25, hw, WB - WMID - 27);
        zelB(WL + 2 + hw + 156, WMID + 25, hw, WB - WMID - 27);
      },
      // Layer 4: Arched doorway
      () => {
        const acx = 550, aw = 260, aT = WB - 248;
        rc.path(`M${acx - aw / 2} ${WB} L${acx - aw / 2} ${aT + 70} Q${acx - aw / 2} ${aT + 12} ${acx - 22} ${aT - 10} L${acx} ${aT - 22} L${acx + 22} ${aT - 10} Q${acx + aw / 2} ${aT + 12} ${acx + aw / 2} ${aT + 70} L${acx + aw / 2} ${WB} Z`, { fill: "#5C3820", fillStyle: "solid", stroke: LINE_DARK, strokeWidth: 3, roughness: 1 });
        [0, 7, 14].forEach((o) => {
          const fw = aw - o * 2;
          rc.path(`M${acx - fw / 2} ${WB} L${acx - fw / 2} ${aT + 70 + o * 0.3} Q${acx - fw / 2} ${aT + 12 + o} ${acx - 20 + o / 3} ${aT - 8 + o} L${acx} ${aT - 20 + o} L${acx + 20 - o / 3} ${aT - 8 + o} Q${acx + fw / 2} ${aT + 12 + o} ${acx + fw / 2} ${aT + 70 + o * 0.3} L${acx + fw / 2} ${WB}`, { stroke: LINE_MED, strokeWidth: 0.6, roughness: 0.4, fill: "none" });
        });
        zelB(acx - aw / 2 + 8, aT + 50, aw - 16, 22);

        const dL = acx - aw / 2 + 20, dW = (aw - 46) / 2, dT = aT + 76;
        rc.rectangle(dL, dT, dW, WB - dT, { fill: "#7A5030", fillStyle: "cross-hatch", stroke: LINE_DARK, strokeWidth: 1.8, roughness: 0.7, hachureGap: 2.8, hachureAngle: 84, fillWeight: 0.65 });
        rc.rectangle(dL + dW + 6, dT, dW, WB - dT, { fill: "#7A5030", fillStyle: "cross-hatch", stroke: LINE_DARK, strokeWidth: 1.8, roughness: 0.7, hachureGap: 2.8, hachureAngle: 96, fillWeight: 0.65 });

        // Door knocker
        rc.circle(acx, 320, 14, { stroke: "#B89030", strokeWidth: 2.5, roughness: 0.5, fill: "none" });
        rc.circle(acx, 307, 5, { fill: "#B89030", fillStyle: "solid", stroke: "#8A6820", strokeWidth: 0.5, roughness: 0.3 });
        rc.rectangle(acx - 5, 330, 10, 18, { fill: "#B89030", fillStyle: "solid", stroke: "#8A6820", strokeWidth: 0.5, roughness: 0.3 });
      },
      // Layer 5: Tajine on floor
      () => {
        const tx = 230, ty = 440;
        rc.ellipse(tx, ty, 85, 22, { fill: "#A08030", fillStyle: "solid", stroke: LINE_DARK, strokeWidth: 1.3, roughness: 0.7 });
        rc.ellipse(tx, ty - 2, 78, 18, { stroke: LINE_MED, strokeWidth: 0.5, roughness: 0.4, fill: "none" });
        [[-24, 0], [24, 0], [0, 5]].forEach(([ox, oy]) => {
          rc.path(`M${tx + ox} ${ty + 10 + oy} Q${tx + ox + (ox || 3)} ${ty + 24 + oy} ${tx + ox + (ox > 0 ? 6 : ox < 0 ? -6 : 0)} ${ty + 42 + oy}`, { stroke: LINE_MED, strokeWidth: 2, roughness: 0.4, fill: "none" });
          rc.circle(tx + ox + (ox > 0 ? 6 : ox < 0 ? -6 : 0), ty + 44 + oy, 3, { fill: LINE_MED, fillStyle: "solid", stroke: LINE_DARK, strokeWidth: 0.5, roughness: 0.3 });
        });
        rc.ellipse(tx - 12, ty - 8, 44, 11, { fill: "#C88525", fillStyle: "solid", stroke: LINE_DARK, strokeWidth: 1.3, roughness: 0.7 });
        rc.polygon([[tx - 12, ty - 28], [tx - 32, ty - 12], [tx + 8, ty - 12]], { fill: "#DCA038", fillStyle: "solid", stroke: LINE_DARK, strokeWidth: 1.3, roughness: 0.9 });
        rc.ellipse(tx - 12, ty - 29, 9, 6, { fill: "#B07020", fillStyle: "solid", stroke: LINE_DARK, strokeWidth: 1, roughness: 0.5 });
        for (let i = 0; i < 7; i++) {
          const zx = tx - 28 + i * 5;
          const u = i % 2 === 0;
          rc.line(zx, u ? ty - 18 : ty - 14, zx + 5, u ? ty - 14 : ty - 18, { stroke: LINE_DARK, strokeWidth: 0.4, roughness: 0.3 });
        }
        rc.path(`M${tx - 16} ${ty - 34} C${tx - 18} ${ty - 44} ${tx - 14} ${ty - 52} ${tx - 17} ${ty - 62}`, { stroke: LINE_DARK, strokeWidth: 0.9, roughness: 1.2, fill: "none" });
        rc.path(`M${tx - 8} ${ty - 33} C${tx - 6} ${ty - 42} ${tx - 10} ${ty - 50} ${tx - 7} ${ty - 60}`, { stroke: LINE_DARK, strokeWidth: 0.7, roughness: 1.2, fill: "none" });
        rc.ellipse(tx + 22, ty - 10, 18, 12, { fill: "#B09048", fillStyle: "solid", stroke: LINE_DARK, strokeWidth: 0.9, roughness: 0.6 });
        rc.ellipse(tx + 22, ty - 15, 10, 5, { fill: "#B09048", fillStyle: "solid", stroke: LINE_DARK, strokeWidth: 0.7, roughness: 0.4 });
        rc.rectangle(tx + 35, ty - 12, 5, 8, { fill: "#B0D0A8", fillStyle: "solid", stroke: LINE_DARK, strokeWidth: 0.6, roughness: 0.4 });
      },
      // Layer 6: Vase
      () => {
        const vx = 942, vy = 378;
        rc.path(`M${vx - 22} ${vy + 32} Q${vx - 28} ${vy - 2} ${vx - 16} ${vy - 28} Q${vx - 9} ${vy - 42} ${vx} ${vy - 48} Q${vx + 9} ${vy - 42} ${vx + 16} ${vy - 28} Q${vx + 28} ${vy - 2} ${vx + 22} ${vy + 32} Z`, { fill: "#907428", fillStyle: "cross-hatch", stroke: LINE_DARK, strokeWidth: 1.5, roughness: 0.8, hachureGap: 2.2, hachureAngle: 50, fillWeight: 0.5 });
        rc.ellipse(vx, vy - 48, 24, 10, { fill: "#A08030", fillStyle: "solid", stroke: LINE_DARK, strokeWidth: 1, roughness: 0.6 });
        [-10, 6, 18].forEach((o) => {
          rc.line(vx - 25 + Math.abs(o) * 0.3, vy + o, vx + 25 - Math.abs(o) * 0.3, vy + o, { stroke: LINE_MED, strokeWidth: 0.7, roughness: 0.3 });
        });
      },
      // Layer 7: Flower pots
      () => {
        [[345, WB], [755, WB]].forEach(([px, py]) => {
          rc.path(`M${px - 16} ${py} L${px - 18} ${py + 28} L${px + 18} ${py + 28} L${px + 16} ${py} Z`, { fill: "#A04828", fillStyle: "solid", stroke: LINE_DARK, strokeWidth: 1.3, roughness: 0.7 });
          rc.line(px - 17, py + 5, px + 17, py + 5, { stroke: LINE_DARK, strokeWidth: 0.5, roughness: 0.3 });
          for (let i = -2; i <= 2; i++) {
            const sx = px + i * 7;
            const bend = (Math.random() - 0.5) * 10;
            const h = 30 + Math.abs(i) * 4 + Math.random() * 6;
            rc.path(`M${sx} ${py} C${sx + bend} ${py - h * 0.35} ${sx - bend} ${py - h * 0.7} ${sx + bend * 0.3} ${py - h}`, { stroke: "#2A5818", strokeWidth: 1.6 + Math.random() * 0.4, roughness: 0.6, fill: "none" });
            rc.circle(sx + bend * 0.3, py - h, 9 + Math.random() * 5, { fill: "#2A5818", fillStyle: "solid", stroke: "#2A5818", strokeWidth: 0.3, roughness: 0.5 });
          }
        });
      },
      // Layer 8: Side wall shadows
      () => {
        cx.globalAlpha = 0.07;
        rc.path("M0 412 L0 80 L70 55", { stroke: LINE_DARK, strokeWidth: 1, roughness: 1.5, fill: "none" });
        [148, 218, 295].forEach((y) => {
          rc.rectangle(12, y, 22, 36, { stroke: LINE_DARK, strokeWidth: 0.7, roughness: 1, fill: "none" });
        });
        rc.path("M1100 412 L1100 80 L1030 55", { stroke: LINE_DARK, strokeWidth: 1, roughness: 1.5, fill: "none" });
        [148, 218, 295].forEach((y) => {
          rc.rectangle(1064, y, 22, 36, { stroke: LINE_DARK, strokeWidth: 0.7, roughness: 1, fill: "none" });
        });
        cx.globalAlpha = 1;
      },
    ];

    clear();
    let li = 0;
    function anim() {
      if (li < layers.length) {
        layers[li]();
        li++;
        setTimeout(anim, 250);
      }
    }
    anim();
  }, []);

  return (
    <div className="w-full overflow-hidden bg-[#FFF8EE]">
      <canvas
        ref={canvasRef}
        width={1100}
        height={560}
        className="mx-auto block h-auto w-full max-w-[1100px]"
      />
    </div>
  );
}
