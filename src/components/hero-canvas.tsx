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

    function clear() {
      cx.clearRect(0, 0, W, H);
      cx.fillStyle = "#FFF8EE";
      cx.fillRect(0, 0, W, H);
    }

    function fillArabesque(bx: number, by: number, bw: number, bh: number) {
      cx.save();
      cx.beginPath();
      cx.rect(bx, by, bw, bh);
      cx.clip();
      cx.fillStyle = "#EDE4D4";
      cx.fillRect(bx, by, bw, bh);
      const sp = 30;

      // Wavy horizontal lines
      cx.strokeStyle = "#907050";
      cx.lineWidth = 0.7;
      for (let yy = by - sp; yy < by + bh + sp; yy += sp) {
        cx.beginPath();
        for (let xx = bx - 10; xx < bx + bw + 10; xx += 3) {
          const w = Math.sin(xx * 0.04 + yy * 0.02) * sp * 0.22 + Math.sin(xx * 0.09) * sp * 0.1;
          xx === bx - 10 ? cx.moveTo(xx, yy + w) : cx.lineTo(xx, yy + w);
        }
        cx.stroke();
      }

      // Wavy vertical lines
      for (let xx = bx - sp; xx < bx + bw + sp; xx += sp) {
        cx.beginPath();
        for (let yy2 = by - 10; yy2 < by + bh + 10; yy2 += 3) {
          const w = Math.sin(yy2 * 0.04 + xx * 0.02) * sp * 0.22 + Math.sin(yy2 * 0.09) * sp * 0.1;
          yy2 === by - 10 ? cx.moveTo(xx + w, yy2) : cx.lineTo(xx + w, yy2);
        }
        cx.stroke();
      }

      // Flower petals
      cx.strokeStyle = "#7A5838";
      cx.lineWidth = 0.55;
      for (let yy = by; yy < by + bh; yy += sp) {
        for (let xx = bx; xx < bx + bw; xx += sp) {
          const fx = xx + sp / 2 + Math.sin(yy * 0.1) * 3;
          const fy = yy + sp / 2 + Math.cos(xx * 0.1) * 3;
          const pr = sp * 0.34;
          for (let p = 0; p < 6; p++) {
            const a = (p / 6) * Math.PI * 2;
            const tx = fx + Math.cos(a) * pr;
            const ty = fy + Math.sin(a) * pr;
            cx.beginPath();
            cx.moveTo(fx + Math.cos(a) * pr * 0.12, fy + Math.sin(a) * pr * 0.12);
            cx.bezierCurveTo(fx + Math.cos(a - 0.5) * pr * 0.6, fy + Math.sin(a - 0.5) * pr * 0.6, fx + Math.cos(a - 0.2) * pr * 1.05, fy + Math.sin(a - 0.2) * pr * 1.05, tx, ty);
            cx.bezierCurveTo(fx + Math.cos(a + 0.2) * pr * 1.05, fy + Math.sin(a + 0.2) * pr * 1.05, fx + Math.cos(a + 0.5) * pr * 0.6, fy + Math.sin(a + 0.5) * pr * 0.6, fx + Math.cos(a) * pr * 0.12, fy + Math.sin(a) * pr * 0.12);
            cx.stroke();
            cx.beginPath();
            cx.moveTo(fx + Math.cos(a) * pr * 0.12, fy + Math.sin(a) * pr * 0.12);
            cx.lineTo(tx, ty);
            cx.stroke();
          }
          cx.beginPath(); cx.arc(fx, fy, sp * 0.05, 0, Math.PI * 2); cx.stroke();
          cx.beginPath(); cx.arc(fx, fy, sp * 0.11, 0, Math.PI * 2); cx.stroke();
        }
      }

      // Spirals
      cx.strokeStyle = "#8A6A48";
      cx.lineWidth = 0.35;
      for (let yy = by; yy < by + bh; yy += sp / 2) {
        for (let xx = bx; xx < bx + bw; xx += sp / 2) {
          const sx = xx + Math.sin(yy * 0.15) * 5;
          const sy = yy + Math.cos(xx * 0.15) * 5;
          const dir = (xx + yy) % 2 === 0 ? 1 : -1;
          cx.beginPath();
          for (let t = 0; t < Math.PI * 1.4; t += 0.18) {
            const rr = sp * 0.1 * (1 - t / (Math.PI * 2));
            const px = sx + Math.cos(t * dir + xx * 0.04) * rr;
            const py = sy + Math.sin(t * dir + yy * 0.04) * rr;
            t === 0 ? cx.moveTo(px, py) : cx.lineTo(px, py);
          }
          cx.stroke();
        }
      }

      // Tiny leaves
      cx.strokeStyle = "#7A5838";
      cx.lineWidth = 0.3;
      for (let yy = by; yy < by + bh; yy += sp * 0.65) {
        for (let xx = bx; xx < bx + bw; xx += sp * 0.65) {
          const la = Math.sin(xx * 0.07 + yy * 0.05) * Math.PI;
          const lx = xx + Math.cos(la) * 2;
          const ly = yy + Math.sin(la) * 2;
          const ls = sp * 0.13;
          const tpx = lx + Math.cos(la) * ls;
          const tpy = ly + Math.sin(la) * ls;
          cx.beginPath();
          cx.moveTo(lx, ly);
          cx.quadraticCurveTo(lx + Math.cos(la - 0.7) * ls * 0.5, ly + Math.sin(la - 0.7) * ls * 0.5, tpx, tpy);
          cx.quadraticCurveTo(lx + Math.cos(la + 0.7) * ls * 0.5, ly + Math.sin(la + 0.7) * ls * 0.5, lx, ly);
          cx.stroke();
        }
      }

      // Dots
      cx.strokeStyle = "#B09870";
      cx.lineWidth = 0.2;
      cx.globalAlpha = 0.45;
      for (let yy = by + sp / 4; yy < by + bh; yy += sp / 2) {
        cx.beginPath();
        for (let xx = bx; xx < bx + bw; xx += 3) {
          const w = Math.sin(xx * 0.06 + yy * 0.03) * sp * 0.12 + Math.cos(xx * 0.11 + yy * 0.04) * sp * 0.06;
          xx === bx ? cx.moveTo(xx, yy + w) : cx.lineTo(xx, yy + w);
        }
        cx.stroke();
      }
      cx.globalAlpha = 1;

      cx.fillStyle = "#6A5038";
      cx.globalAlpha = 0.25;
      for (let yy = by; yy < by + bh; yy += sp / 3) {
        for (let xx = bx; xx < bx + bw; xx += sp / 3) {
          cx.beginPath();
          cx.arc(xx + Math.random() * 3 - 1.5, yy + Math.random() * 3 - 1.5, 0.7, 0, Math.PI * 2);
          cx.fill();
        }
      }
      cx.globalAlpha = 1;
      cx.restore();

      cx.strokeStyle = "#6A4828";
      cx.lineWidth = 1.6;
      cx.strokeRect(bx, by, bw, bh);
      cx.lineWidth = 0.5;
      cx.strokeRect(bx + 4, by + 4, bw - 8, bh - 8);
    }

    function muqarnas(x: number, y: number, w: number) {
      for (let row = 0; row < 3; row++) {
        const sw = 11 - row * 2.5;
        const yy = y + row * 8;
        cx.strokeStyle = row === 0 ? "#6A4828" : "#9A7A58";
        cx.lineWidth = 1 - row * 0.25;
        cx.beginPath();
        for (let i = 0; i < Math.floor(w / sw); i++) {
          cx.moveTo(x + i * sw, yy);
          cx.quadraticCurveTo(x + i * sw + sw / 2, yy + 7 - row, x + (i + 1) * sw, yy);
        }
        cx.stroke();
      }
    }

    function zel8(x2: number, y2: number, r: number, col: string) {
      const pts: [number, number][] = [];
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
        const rr = i % 2 === 0 ? r : r * 0.52;
        pts.push([x2 + Math.cos(a) * rr, y2 + Math.sin(a) * rr]);
      }
      rc.polygon(pts, { fill: col, fillStyle: "solid", stroke: col, strokeWidth: 0.2, roughness: 0.15 });
      rc.circle(x2, y2, r * 0.25, { fill: "#F0E8D8", fillStyle: "solid", stroke: "none", strokeWidth: 0, roughness: 0.1 });
    }

    function zelC(x2: number, y2: number, s: number) {
      const cols = ["#14355A", "#1A6045", "#C08818", "#983020", "#14355A", "#14355A", "#1A6045", "#0E2A48"];
      const col = cols[Math.floor(Math.random() * cols.length)];
      const t = Math.floor(Math.random() * 4);
      const r = s * 0.38;
      if (t === 0) zel8(x2, y2, r, col);
      else if (t === 1) {
        rc.polygon([[x2, y2 - r], [x2 + r, y2], [x2, y2 + r], [x2 - r, y2]], { fill: col, fillStyle: "solid", stroke: col, strokeWidth: 0.2, roughness: 0.18 });
        rc.circle(x2, y2, s * 0.1, { fill: "#F0E8D8", fillStyle: "solid", stroke: "none", strokeWidth: 0, roughness: 0.1 });
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
      rc.rectangle(x, y, w, h, { fill: "#EDE0CC", fillStyle: "solid", stroke: "none", strokeWidth: 0, roughness: 0.3 });
      const c = 11, nc = Math.floor(w / c), nr = Math.floor(h / c);
      for (let r = 0; r < nr; r++)
        for (let i = 0; i < nc; i++)
          zelC(x + i * c + c / 2, y + r * c + c / 2, c);
    }

    function zelTri(x: number, y: number, w: number) {
      const tw = 9, n = Math.floor(w / tw);
      const cols = ["#14355A", "#1A6045", "#C08818"];
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
      rc.rectangle(x, y, w, 12, { fill: "#0E2A48", fillStyle: "solid", stroke: "none", strokeWidth: 0, roughness: 0.2 });
      const dw = 12, n = Math.floor(w / dw);
      for (let i = 0; i < n; i++) {
        const dx = x + i * dw + dw / 2;
        rc.polygon([[dx, y + 1.5], [dx + 4, y + 6], [dx, y + 10.5], [dx - 4, y + 6]], { fill: "#F0E8D8", fillStyle: "solid", stroke: "#F0E8D8", strokeWidth: 0.2, roughness: 0.12 });
      }
    }

    // Build drawing layers
    const layers = [
      // Layer 0: Floor + wall frame
      () => {
        rc.rectangle(0, WB, W, H - WB, { fill: "#E0D4C0", fillStyle: "solid", stroke: "none", strokeWidth: 0, roughness: 0.3 });
        cx.strokeStyle = "#C8B8A0"; cx.lineWidth = 0.4; cx.globalAlpha = 0.3;
        for (let y = WB + 15; y < H; y += 30)
          for (let x = 0; x < W; x += 35)
            cx.strokeRect(x + (Math.floor(y / 30) % 2) * 17, y, 35, 30);
        cx.globalAlpha = 1;
        rc.line(0, WB, W, WB, { stroke: "#3A2010", strokeWidth: 2.2, roughness: 1 });
        rc.rectangle(WL, WT, WR - WL, WB - WT, { fill: "#E4D4BC", fillStyle: "solid", stroke: "#3A2010", strokeWidth: 2.5, roughness: 1.2 });
      },
      // Layer 1: Arabesque pattern
      () => {
        fillArabesque(WL + 2, WT + 2, WR - WL - 4, WMID - WT - 4);
        muqarnas(WL + 4, WMID - 20, WR - WL - 8);
      },
      // Layer 2: Zellige border
      () => {
        rc.line(WL, WMID, WR, WMID, { stroke: "#6B4828", strokeWidth: 2, roughness: 0.5 });
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
        rc.path(`M${acx - aw / 2} ${WB} L${acx - aw / 2} ${aT + 70} Q${acx - aw / 2} ${aT + 12} ${acx - 22} ${aT - 10} L${acx} ${aT - 22} L${acx + 22} ${aT - 10} Q${acx + aw / 2} ${aT + 12} ${acx + aw / 2} ${aT + 70} L${acx + aw / 2} ${WB} Z`, { fill: "#5C3820", fillStyle: "solid", stroke: "#3A2010", strokeWidth: 3, roughness: 1 });
        [0, 7, 14].forEach((o) => {
          const fw = aw - o * 2;
          rc.path(`M${acx - fw / 2} ${WB} L${acx - fw / 2} ${aT + 70 + o * 0.3} Q${acx - fw / 2} ${aT + 12 + o} ${acx - 20 + o / 3} ${aT - 8 + o} L${acx} ${aT - 20 + o} L${acx + 20 - o / 3} ${aT - 8 + o} Q${acx + fw / 2} ${aT + 12 + o} ${acx + fw / 2} ${aT + 70 + o * 0.3} L${acx + fw / 2} ${WB}`, { stroke: "#6B4828", strokeWidth: 0.6, roughness: 0.4, fill: "none" });
        });
        zelB(acx - aw / 2 + 8, aT + 50, aw - 16, 22);

        const dL = acx - aw / 2 + 20, dW = (aw - 46) / 2, dT = aT + 76;
        rc.rectangle(dL, dT, dW, WB - dT, { fill: "#7A5030", fillStyle: "cross-hatch", stroke: "#3A2010", strokeWidth: 1.8, roughness: 0.7, hachureGap: 2.8, hachureAngle: 84, fillWeight: 0.65 });
        rc.rectangle(dL + dW + 6, dT, dW, WB - dT, { fill: "#7A5030", fillStyle: "cross-hatch", stroke: "#3A2010", strokeWidth: 1.8, roughness: 0.7, hachureGap: 2.8, hachureAngle: 96, fillWeight: 0.65 });

        // Door knocker
        rc.circle(acx, 320, 14, { stroke: "#B89030", strokeWidth: 2.5, roughness: 0.5, fill: "none" });
        rc.circle(acx, 307, 5, { fill: "#B89030", fillStyle: "solid", stroke: "#8A6820", strokeWidth: 0.5, roughness: 0.3 });
        rc.rectangle(acx - 5, 330, 10, 18, { fill: "#B89030", fillStyle: "solid", stroke: "#8A6820", strokeWidth: 0.5, roughness: 0.3 });
      },
      // Layer 5: Tajine on floor
      () => {
        const tx = 230, ty = 440;
        rc.ellipse(tx, ty, 85, 22, { fill: "#A08030", fillStyle: "solid", stroke: "#3A2010", strokeWidth: 1.3, roughness: 0.7 });
        rc.ellipse(tx, ty - 2, 78, 18, { stroke: "#6B4828", strokeWidth: 0.5, roughness: 0.4, fill: "none" });
        // Legs
        [[-24, 0], [24, 0], [0, 5]].forEach(([ox, oy]) => {
          rc.path(`M${tx + ox} ${ty + 10 + oy} Q${tx + ox + (ox || 3)} ${ty + 24 + oy} ${tx + ox + (ox > 0 ? 6 : ox < 0 ? -6 : 0)} ${ty + 42 + oy}`, { stroke: "#6B4828", strokeWidth: 2, roughness: 0.4, fill: "none" });
          rc.circle(tx + ox + (ox > 0 ? 6 : ox < 0 ? -6 : 0), ty + 44 + oy, 3, { fill: "#6B4828", fillStyle: "solid", stroke: "#3A2010", strokeWidth: 0.5, roughness: 0.3 });
        });
        // Tajine body
        rc.ellipse(tx - 12, ty - 8, 44, 11, { fill: "#C88525", fillStyle: "solid", stroke: "#3A2010", strokeWidth: 1.3, roughness: 0.7 });
        rc.polygon([[tx - 12, ty - 28], [tx - 32, ty - 12], [tx + 8, ty - 12]], { fill: "#DCA038", fillStyle: "solid", stroke: "#3A2010", strokeWidth: 1.3, roughness: 0.9 });
        rc.ellipse(tx - 12, ty - 29, 9, 6, { fill: "#B07020", fillStyle: "solid", stroke: "#3A2010", strokeWidth: 1, roughness: 0.5 });
        // Zigzag
        for (let i = 0; i < 7; i++) {
          const zx = tx - 28 + i * 5;
          const u = i % 2 === 0;
          rc.line(zx, u ? ty - 18 : ty - 14, zx + 5, u ? ty - 14 : ty - 18, { stroke: "#3A2010", strokeWidth: 0.4, roughness: 0.3 });
        }
        // Steam
        rc.path(`M${tx - 16} ${ty - 34} C${tx - 18} ${ty - 44} ${tx - 14} ${ty - 52} ${tx - 17} ${ty - 62}`, { stroke: "#3A2010", strokeWidth: 0.9, roughness: 1.2, fill: "none" });
        rc.path(`M${tx - 8} ${ty - 33} C${tx - 6} ${ty - 42} ${tx - 10} ${ty - 50} ${tx - 7} ${ty - 60}`, { stroke: "#3A2010", strokeWidth: 0.7, roughness: 1.2, fill: "none" });
        // Tea glass
        rc.ellipse(tx + 22, ty - 10, 18, 12, { fill: "#B09048", fillStyle: "solid", stroke: "#3A2010", strokeWidth: 0.9, roughness: 0.6 });
        rc.ellipse(tx + 22, ty - 15, 10, 5, { fill: "#B09048", fillStyle: "solid", stroke: "#3A2010", strokeWidth: 0.7, roughness: 0.4 });
        rc.rectangle(tx + 35, ty - 12, 5, 8, { fill: "#B0D0A8", fillStyle: "solid", stroke: "#3A2010", strokeWidth: 0.6, roughness: 0.4 });
      },
      // Layer 6: Vase
      () => {
        const vx = 942, vy = 378;
        rc.path(`M${vx - 22} ${vy + 32} Q${vx - 28} ${vy - 2} ${vx - 16} ${vy - 28} Q${vx - 9} ${vy - 42} ${vx} ${vy - 48} Q${vx + 9} ${vy - 42} ${vx + 16} ${vy - 28} Q${vx + 28} ${vy - 2} ${vx + 22} ${vy + 32} Z`, { fill: "#907428", fillStyle: "cross-hatch", stroke: "#3A2010", strokeWidth: 1.5, roughness: 0.8, hachureGap: 2.2, hachureAngle: 50, fillWeight: 0.5 });
        rc.ellipse(vx, vy - 48, 24, 10, { fill: "#A08030", fillStyle: "solid", stroke: "#3A2010", strokeWidth: 1, roughness: 0.6 });
        [-10, 6, 18].forEach((o) => {
          rc.line(vx - 25 + Math.abs(o) * 0.3, vy + o, vx + 25 - Math.abs(o) * 0.3, vy + o, { stroke: "#6B4828", strokeWidth: 0.7, roughness: 0.3 });
        });
      },
      // Layer 7: Flower pots
      () => {
        [[345, WB], [755, WB]].forEach(([px, py]) => {
          rc.path(`M${px - 16} ${py} L${px - 18} ${py + 28} L${px + 18} ${py + 28} L${px + 16} ${py} Z`, { fill: "#A04828", fillStyle: "solid", stroke: "#3A2010", strokeWidth: 1.3, roughness: 0.7 });
          rc.line(px - 17, py + 5, px + 17, py + 5, { stroke: "#3A2010", strokeWidth: 0.5, roughness: 0.3 });
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
        rc.path("M0 412 L0 80 L70 55", { stroke: "#3A2010", strokeWidth: 1, roughness: 1.5, fill: "none" });
        [148, 218, 295].forEach((y) => {
          rc.rectangle(12, y, 22, 36, { stroke: "#3A2010", strokeWidth: 0.7, roughness: 1, fill: "none" });
        });
        rc.path("M1100 412 L1100 80 L1030 55", { stroke: "#3A2010", strokeWidth: 1, roughness: 1.5, fill: "none" });
        [148, 218, 295].forEach((y) => {
          rc.rectangle(1064, y, 22, 36, { stroke: "#3A2010", strokeWidth: 0.7, roughness: 1, fill: "none" });
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
