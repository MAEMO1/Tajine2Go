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
    const WALL_DARK = "#D8C8AC";
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

    function clear() {
      cx.clearRect(0, 0, W, H);
      cx.fillStyle = CREAM;
      cx.fillRect(0, 0, W, H);
    }

    /* ── Geometric Moroccan Arabesque ── */

    function draw8Star(x: number, y: number, r: number, color: string) {
      // 8-pointed star: two overlapping squares rotated 22.5°
      const outerPts: [number, number][] = [];
      const innerR = r * 0.42;
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2 - Math.PI / 2;
        const rad = i % 2 === 0 ? r : innerR;
        outerPts.push([x + Math.cos(angle) * rad, y + Math.sin(angle) * rad]);
      }
      rc.polygon(outerPts, {
        fill: color,
        fillStyle: "solid",
        stroke: color,
        strokeWidth: 0.3,
        roughness: 0.12,
      });
      // Center rosette
      rc.circle(x, y, r * 0.22, {
        fill: TILE_LIGHT,
        fillStyle: "solid",
        stroke: "none",
        strokeWidth: 0,
        roughness: 0.1,
      });
    }

    function drawDiamond(x: number, y: number, w: number, h: number, color: string) {
      rc.polygon(
        [[x, y - h / 2], [x + w / 2, y], [x, y + h / 2], [x - w / 2, y]],
        { fill: color, fillStyle: "solid", stroke: color, strokeWidth: 0.2, roughness: 0.15 }
      );
    }

    function drawHexConnector(x: number, y: number, s: number, color: string) {
      const pts: [number, number][] = [];
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        pts.push([x + Math.cos(a) * s, y + Math.sin(a) * s]);
      }
      rc.polygon(pts, {
        fill: color,
        fillStyle: "solid",
        stroke: color,
        strokeWidth: 0.2,
        roughness: 0.15,
      });
    }

    function fillArabesque(bx: number, by: number, bw: number, bh: number) {
      cx.save();
      cx.beginPath();
      cx.rect(bx, by, bw, bh);
      cx.clip();

      // Background
      cx.fillStyle = WALL_DARK;
      cx.fillRect(bx, by, bw, bh);

      // Grid parameters for 8-point star lattice
      const spacing = 32;
      const starR = spacing * 0.38;
      const starColors = [BLUE, GREEN, GOLD, RED];
      const connectorColors = [GREEN, BLUE, RED, GOLD];

      let colorIdx = 0;

      // Layer 1: Primary 8-point star grid
      for (let row = 0; ; row++) {
        const yy = by + row * spacing;
        if (yy > by + bh + spacing) break;
        for (let col = 0; ; col++) {
          const xx = bx + col * spacing + (row % 2 === 1 ? spacing / 2 : 0);
          if (xx > bx + bw + spacing) break;

          const starColor = starColors[(row + col) % starColors.length];
          draw8Star(xx, yy, starR, starColor);
          colorIdx++;
        }
      }

      // Layer 2: Diamond connectors between stars
      for (let row = 0; ; row++) {
        const yy = by + row * spacing + spacing / 2;
        if (yy > by + bh + spacing) break;
        for (let col = 0; ; col++) {
          const offset = row % 2 === 0 ? spacing / 2 : 0;
          const xx = bx + col * spacing + offset;
          if (xx > bx + bw + spacing) break;

          const dc = connectorColors[(row + col + 1) % connectorColors.length];
          drawDiamond(xx, yy, spacing * 0.26, spacing * 0.26, dc);
        }
      }

      // Layer 3: Small hexagonal fill in remaining gaps
      for (let row = 0; ; row++) {
        const yy = by + spacing * 0.25 + row * spacing;
        if (yy > by + bh + spacing) break;
        for (let col = 0; ; col++) {
          const offset = row % 2 === 1 ? spacing * 0.75 : spacing * 0.25;
          const xx = bx + col * spacing + offset;
          if (xx > bx + bw + spacing) break;

          drawHexConnector(xx, yy, spacing * 0.08, TILE_LIGHT);
        }
      }

      // Layer 4: Fine interlocking lines (girih network)
      cx.strokeStyle = LINE_MED;
      cx.lineWidth = 0.4;
      cx.globalAlpha = 0.35;
      for (let row = 0; ; row++) {
        const yy = by + row * spacing;
        if (yy > by + bh + spacing) break;
        for (let col = 0; ; col++) {
          const xx = bx + col * spacing + (row % 2 === 1 ? spacing / 2 : 0);
          if (xx > bx + bw + spacing) break;

          // Draw connecting lines to neighbors (girih grid)
          for (let a = 0; a < 8; a++) {
            const angle = (a / 8) * Math.PI * 2;
            const endX = xx + Math.cos(angle) * spacing * 0.48;
            const endY = yy + Math.sin(angle) * spacing * 0.48;
            cx.beginPath();
            cx.moveTo(xx + Math.cos(angle) * starR * 0.9, yy + Math.sin(angle) * starR * 0.9);
            cx.lineTo(endX, endY);
            cx.stroke();
          }
        }
      }
      cx.globalAlpha = 1;

      // Frame border
      cx.strokeStyle = LINE_DARK;
      cx.lineWidth = 1.8;
      cx.strokeRect(bx, by, bw, bh);
      cx.lineWidth = 0.5;
      cx.strokeRect(bx + 4, by + 4, bw - 8, bh - 8);

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
      // Layer 1: Geometric Moroccan arabesque
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
        // Legs
        [[-24, 0], [24, 0], [0, 5]].forEach(([ox, oy]) => {
          rc.path(`M${tx + ox} ${ty + 10 + oy} Q${tx + ox + (ox || 3)} ${ty + 24 + oy} ${tx + ox + (ox > 0 ? 6 : ox < 0 ? -6 : 0)} ${ty + 42 + oy}`, { stroke: LINE_MED, strokeWidth: 2, roughness: 0.4, fill: "none" });
          rc.circle(tx + ox + (ox > 0 ? 6 : ox < 0 ? -6 : 0), ty + 44 + oy, 3, { fill: LINE_MED, fillStyle: "solid", stroke: LINE_DARK, strokeWidth: 0.5, roughness: 0.3 });
        });
        // Tajine body
        rc.ellipse(tx - 12, ty - 8, 44, 11, { fill: "#C88525", fillStyle: "solid", stroke: LINE_DARK, strokeWidth: 1.3, roughness: 0.7 });
        rc.polygon([[tx - 12, ty - 28], [tx - 32, ty - 12], [tx + 8, ty - 12]], { fill: "#DCA038", fillStyle: "solid", stroke: LINE_DARK, strokeWidth: 1.3, roughness: 0.9 });
        rc.ellipse(tx - 12, ty - 29, 9, 6, { fill: "#B07020", fillStyle: "solid", stroke: LINE_DARK, strokeWidth: 1, roughness: 0.5 });
        // Zigzag pattern on tajine
        for (let i = 0; i < 7; i++) {
          const zx = tx - 28 + i * 5;
          const u = i % 2 === 0;
          rc.line(zx, u ? ty - 18 : ty - 14, zx + 5, u ? ty - 14 : ty - 18, { stroke: LINE_DARK, strokeWidth: 0.4, roughness: 0.3 });
        }
        // Steam
        rc.path(`M${tx - 16} ${ty - 34} C${tx - 18} ${ty - 44} ${tx - 14} ${ty - 52} ${tx - 17} ${ty - 62}`, { stroke: LINE_DARK, strokeWidth: 0.9, roughness: 1.2, fill: "none" });
        rc.path(`M${tx - 8} ${ty - 33} C${tx - 6} ${ty - 42} ${tx - 10} ${ty - 50} ${tx - 7} ${ty - 60}`, { stroke: LINE_DARK, strokeWidth: 0.7, roughness: 1.2, fill: "none" });
        // Tea glass
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

    // Draw progressively, layer by layer
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
