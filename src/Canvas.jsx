import { useState, useRef, useEffect, useCallback } from "react";

// ─── Google Fonts loader ───────────────────────────────────────────────
const FONTS = [
  "Playfair Display","Oswald","Raleway","Montserrat","Lobster",
  "Pacifico","Dancing Script","Bebas Neue","Abril Fatface","Comfortaa",
  "Righteous","Satisfy","Permanent Marker","Black Han Sans","Cinzel",
  "Syne","DM Sans","Space Mono","Orbitron","Caveat"
];
const loadFonts = () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?${FONTS.map(f=>`family=${f.replace(/ /g,"+")}:wght@400;700`).join("&")}&display=swap`;
  document.head.appendChild(link);
};

// ─── SVG Shape Paths ───────────────────────────────────────────────────
const SHAPE_DEFS = {
  rect:     { label:"Rectangle",  icon:"▭" },
  rounded:  { label:"Rounded",    icon:"▢" },
  circle:   { label:"Circle",     icon:"○" },
  triangle: { label:"Triangle",   icon:"△" },
  star:     { label:"Star",       icon:"★" },
  heart:    { label:"Heart",      icon:"♥" },
  arrow:    { label:"Arrow",      icon:"→" },
  diamond:  { label:"Diamond",    icon:"◇" },
  hexagon:  { label:"Hexagon",    icon:"⬡" },
  cross:    { label:"Cross",      icon:"✚" },
  speech:   { label:"Speech",     icon:"💬" },
  cloud:    { label:"Cloud",      icon:"☁" },
};

function renderShape(type, w=100, h=100, fill="#6366f1", stroke="none", sw=0, radius=12) {
  const r = sw > 0 ? stroke : "none";
  switch(type) {
    case "rect":     return <rect x={sw} y={sw} width={w-sw*2} height={h-sw*2} fill={fill} stroke={r} strokeWidth={sw}/>;
    case "rounded":  return <rect x={sw} y={sw} width={w-sw*2} height={h-sw*2} rx={radius} ry={radius} fill={fill} stroke={r} strokeWidth={sw}/>;
    case "circle":   return <ellipse cx={w/2} cy={h/2} rx={w/2-sw} ry={h/2-sw} fill={fill} stroke={r} strokeWidth={sw}/>;
    case "triangle": return <polygon points={`${w/2},${sw} ${w-sw},${h-sw} ${sw},${h-sw}`} fill={fill} stroke={r} strokeWidth={sw}/>;
    case "star": {
      const pts=[]; const or=Math.min(w,h)/2-sw, ir=or*0.4, cx=w/2, cy=h/2;
      for(let i=0;i<10;i++){const a=Math.PI/5*i-Math.PI/2;const rad=i%2===0?or:ir;pts.push(`${cx+rad*Math.cos(a)},${cy+rad*Math.sin(a)}`);}
      return <polygon points={pts.join(" ")} fill={fill} stroke={r} strokeWidth={sw}/>;
    }
    case "heart": return <path d={`M${w/2},${h*0.85} C${w*0.1},${h*0.55} ${w*-0.05},${h*0.3} ${w/2},${h*0.25} C${w*1.05},${h*0.3} ${w*0.9},${h*0.55} ${w/2},${h*0.85}Z`} fill={fill} stroke={r} strokeWidth={sw}/>;
    case "arrow": return <polygon points={`${sw},${h*0.3} ${w*0.55},${h*0.3} ${w*0.55},${sw} ${w-sw},${h/2} ${w*0.55},${h-sw} ${w*0.55},${h*0.7} ${sw},${h*0.7}`} fill={fill} stroke={r} strokeWidth={sw}/>;
    case "diamond": return <polygon points={`${w/2},${sw} ${w-sw},${h/2} ${w/2},${h-sw} ${sw},${h/2}`} fill={fill} stroke={r} strokeWidth={sw}/>;
    case "hexagon": {
      const pts2=[]; const rad=Math.min(w,h)/2-sw; const cx=w/2,cy=h/2;
      for(let i=0;i<6;i++){const a=Math.PI/3*i-Math.PI/6;pts2.push(`${cx+rad*Math.cos(a)},${cy+rad*Math.sin(a)}`);}
      return <polygon points={pts2.join(" ")} fill={fill} stroke={r} strokeWidth={sw}/>;
    }
    case "cross": return <path d={`M${w*0.35},${sw} H${w*0.65} V${h*0.35} H${w-sw} V${h*0.65} H${w*0.65} V${h-sw} H${w*0.35} V${h*0.65} H${sw} V${h*0.35} H${w*0.35}Z`} fill={fill} stroke={r} strokeWidth={sw}/>;
    case "speech": return <path d={`M${sw},${sw} Q${sw},${h*0.7} ${w*0.3},${h*0.7} L${w*0.2},${h-sw} L${w*0.5},${h*0.7} Q${w-sw},${h*0.7} ${w-sw},${sw}Z`} fill={fill} stroke={r} strokeWidth={sw}/>;
    case "cloud": return <path d={`M${w*0.2},${h*0.7} Q${w*0.05},${h*0.7} ${w*0.1},${h*0.5} Q${w*0.1},${h*0.3} ${w*0.3},${h*0.35} Q${w*0.3},${h*0.15} ${w*0.5},${h*0.2} Q${w*0.65},${h*0.1} ${w*0.75},${h*0.25} Q${w*0.95},${h*0.2} ${w*0.95},${h*0.45} Q${w},${h*0.6} ${w*0.85},${h*0.7}Z`} fill={fill} stroke={r} strokeWidth={sw}/>;
    default: return <rect x={sw} y={sw} width={w-sw*2} height={h-sw*2} fill={fill} stroke={r} strokeWidth={sw}/>;
  }
}

// ─── Gradient Presets ──────────────────────────────────────────────────
const GRADIENTS = [
  { id:"g1", label:"Violet", colors:["#8b5cf6","#6366f1"] },
  { id:"g2", label:"Sunset", colors:["#f97316","#ec4899"] },
  { id:"g3", label:"Ocean",  colors:["#06b6d4","#3b82f6"] },
  { id:"g4", label:"Forest", colors:["#22c55e","#059669"] },
  { id:"g5", label:"Fire",   colors:["#ef4444","#f97316"] },
  { id:"g6", label:"Night",  colors:["#1e1b4b","#312e81"] },
];

const SWATCHES = [
  "#ffffff","#000000","#1e1b4b","#6366f1","#8b5cf6","#ec4899",
  "#f97316","#22c55e","#06b6d4","#f59e0b","#ef4444","#64748b",
  "#fef3c7","#d1fae5","#dbeafe","#fce7f3"
];

let _eid = 0;
const uid = () => `el_${++_eid}_${Date.now()}`;

// ─── Main App ──────────────────────────────────────────────────────────
export default function CanvasFlow() {
  useEffect(() => { loadFonts(); }, []);

  const [elements, setElements] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tool, setTool] = useState("select");
  const [zoom, setZoomVal] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ w: 960, h: 640 });
  const [canvasBg, setCanvasBg] = useState("#ffffff");
  const [canvasBgType, setCanvasBgType] = useState("solid"); // solid|gradient
  const [canvasBgGradient, setCanvasBgGradient] = useState(GRADIENTS[0]);
  const [drawColor, setDrawColor] = useState("#6366f1");
  const [drawSize, setDrawSize] = useState(4);
  const [drawOpacity, setDrawOpacity] = useState(1);
  const [leftTab, setLeftTab] = useState("tools"); // tools|shapes|text
  const [rightTab, setRightTab] = useState("properties"); // properties|layers
  const [history, setHistory] = useState([[]]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [toast, setToast] = useState("");
  const [shapeImageMode, setShapeImageMode] = useState(false); // fill shape with image
  const [clipImageSrc, setClipImageSrc] = useState(null);

  const canvasRef = useRef(null);
  const drawCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const shapeImageInputRef = useRef(null);
  const clipInputRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPosRef = useRef({ x:0, y:0 });
  const toastTimer = useRef(null);

  const selectedEl = elements.find(e => e.id === selected);

  // ── Toast ──────────────────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  };

  // ── History ────────────────────────────────────────────────────────
  const saveHistory = useCallback((els) => {
    setHistory(h => {
      const trimmed = h.slice(0, historyIdx + 1);
      return [...trimmed, JSON.parse(JSON.stringify(els))];
    });
    setHistoryIdx(i => i + 1);
  }, [historyIdx]);

  const undo = () => {
    if (historyIdx <= 0) return showToast("Nothing to undo");
    const prev = history[historyIdx - 1];
    setElements(JSON.parse(JSON.stringify(prev)));
    setHistoryIdx(i => i - 1);
    setSelected(null);
    showToast("Undo");
  };
  const redo = () => {
    if (historyIdx >= history.length - 1) return showToast("Nothing to redo");
    const next = history[historyIdx + 1];
    setElements(JSON.parse(JSON.stringify(next)));
    setHistoryIdx(i => i + 1);
    showToast("Redo");
  };

  // ── Add Elements ───────────────────────────────────────────────────
  const addElement = (el) => {
    setElements(prev => {
      const next = [...prev, el];
      saveHistory(next);
      return next;
    });
    setSelected(el.id);
    setTool("select");
  };

  const updateElement = (id, patch) => {
    setElements(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e));
  };

  const updateAndSave = (id, patch) => {
    setElements(prev => {
      const next = prev.map(e => e.id === id ? { ...e, ...patch } : e);
      saveHistory(next);
      return next;
    });
  };

  const removeElement = (id) => {
    setElements(prev => {
      const next = prev.filter(e => e.id !== id);
      saveHistory(next);
      return next;
    });
    setSelected(null);
    showToast("Deleted");
  };

  const duplicateElement = (id) => {
    const el = elements.find(e => e.id === id);
    if (!el) return;
    const newEl = { ...JSON.parse(JSON.stringify(el)), id: uid(), x: el.x + 20, y: el.y + 20 };
    addElement(newEl);
    showToast("Duplicated");
  };

  // ── Layering ───────────────────────────────────────────────────────
  const bringForward = (id) => {
    setElements(prev => {
      const idx = prev.findIndex(e => e.id === id);
      if (idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx+1]] = [next[idx+1], next[idx]];
      saveHistory(next);
      return next;
    });
  };
  const sendBackward = (id) => {
    setElements(prev => {
      const idx = prev.findIndex(e => e.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx], next[idx-1]] = [next[idx-1], next[idx]];
      saveHistory(next);
      return next;
    });
  };

  // ── Add Text ───────────────────────────────────────────────────────
  const addText = () => {
    addElement({
      id: uid(), type: "text",
      x: 120, y: 100, w: 280, h: 60,
      text: "Double-click to edit",
      fontSize: 28, fontFamily: "Playfair Display",
      fontWeight: "normal", fontStyle: "normal",
      textDecoration: "none", textAlign: "left",
      color: "#1e1b4b", opacity: 1, rotation: 0,
      letterSpacing: 0, lineHeight: 1.3,
      shadow: false, shadowColor: "#000000", shadowBlur: 4,
    });
  };

  // ── Add Shape ──────────────────────────────────────────────────────
  const addShape = (type) => {
    addElement({
      id: uid(), type: "shape",
      shapeType: type,
      x: 150, y: 140, w: 150, h: 120,
      fill: "#6366f1", stroke: "#4338ca", strokeWidth: 0,
      opacity: 1, rotation: 0,
      radius: 12,
      useImageFill: false, imageSrc: null,
      shadow: false, shadowColor: "#000000", shadowBlur: 8,
    });
  };

  // ── Upload Image ───────────────────────────────────────────────────
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      addElement({
        id: uid(), type: "image",
        x: 100, y: 80, w: 240, h: 180,
        src: ev.target.result,
        opacity: 1, rotation: 0,
        flipX: false, flipY: false,
        radius: 0,
        shadow: false, shadowColor: "#000000", shadowBlur: 8,
        filter: "none",
      });
      showToast("Image added!");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ── Shape with Image Fill ──────────────────────────────────────────
  const handleShapeImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (selectedEl && selectedEl.type === "shape") {
        updateAndSave(selectedEl.id, { useImageFill: true, imageSrc: ev.target.result });
        showToast("Image fill applied to shape!");
      } else {
        setClipImageSrc(ev.target.result);
        showToast("Select a shape first, then apply image fill.");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ── Canvas background ──────────────────────────────────────────────
  const canvasBgStyle = () => {
    if (canvasBgType === "gradient") {
      return { background: `linear-gradient(135deg, ${canvasBgGradient.colors[0]}, ${canvasBgGradient.colors[1]})` };
    }
    return { background: canvasBg };
  };

  // ── Drawing ────────────────────────────────────────────────────────
  const getDrawPos = (e) => {
    const rect = drawCanvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    };
  };
  const onDrawStart = (e) => {
    if (tool !== "draw" && tool !== "erase") return;
    drawingRef.current = true;
    const pos = getDrawPos(e);
    lastPosRef.current = pos;
    const ctx = drawCanvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, (tool==="erase"?drawSize*3:drawSize)/2, 0, Math.PI*2);
    if (tool === "erase") { ctx.globalCompositeOperation = "destination-out"; ctx.fill(); ctx.globalCompositeOperation = "source-over"; }
    else { ctx.fillStyle = drawColor; ctx.fill(); }
  };
  const onDrawMove = (e) => {
    if (!drawingRef.current) return;
    const ctx = drawCanvasRef.current.getContext("2d");
    const pos = getDrawPos(e);
    ctx.lineWidth = tool === "erase" ? drawSize * 3 : drawSize;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (tool === "erase") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = drawOpacity;
      ctx.strokeStyle = drawColor;
    }
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    lastPosRef.current = pos;
  };
  const onDrawEnd = () => { drawingRef.current = false; };

  // ── Drag Move ──────────────────────────────────────────────────────
  const onElMouseDown = (e, id) => {
    if (tool !== "select") return;
    e.stopPropagation();
    setSelected(id);
    const el = elements.find(e2 => e2.id === id);
    if (!el) return;
    const startX = e.clientX, startY = e.clientY;
    const ox = el.x, oy = el.y;
    const onMove = (mv) => {
      const dx = (mv.clientX - startX) / zoom;
      const dy = (mv.clientY - startY) / zoom;
      updateElement(id, { x: Math.max(0, ox + dx), y: Math.max(0, oy + dy) });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      setElements(prev => { saveHistory(prev); return prev; });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // ── Resize ────────────────────────────────────────────────────────
  const onResizeMouseDown = (e, id, handle) => {
    e.stopPropagation(); e.preventDefault();
    const el = elements.find(e2 => e2.id === id);
    if (!el) return;
    const startX = e.clientX, startY = e.clientY;
    const { x:ox, y:oy, w:ow, h:oh } = el;
    const onMove = (mv) => {
      const dx = (mv.clientX - startX) / zoom;
      const dy = (mv.clientY - startY) / zoom;
      let patch = {};
      if (handle.includes("e")) patch.w = Math.max(30, ow + dx);
      if (handle.includes("s")) patch.h = Math.max(20, oh + dy);
      if (handle.includes("w")) { patch.x = ox + dx; patch.w = Math.max(30, ow - dx); }
      if (handle.includes("n")) { patch.y = oy + dy; patch.h = Math.max(20, oh - dy); }
      updateElement(id, patch);
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      setElements(prev => { saveHistory(prev); return prev; });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // ── Keyboard shortcuts ────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.contentEditable === "true") return;
      if (e.key === "v") setTool("select");
      if (e.key === "p") setTool("draw");
      if (e.key === "e") setTool("erase");
      if (e.key === "t") addText();
      if ((e.metaKey || e.ctrlKey) && e.key === "z") { e.preventDefault(); undo(); }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") { e.preventDefault(); redo(); }
      if ((e.metaKey || e.ctrlKey) && e.key === "d") { e.preventDefault(); if (selected) duplicateElement(selected); }
      if (e.key === "Delete" || e.key === "Backspace") { if (selected) removeElement(selected); }
      if (e.key === "=" || e.key === "+") setZoomVal(z => Math.min(4, +(z + 0.1).toFixed(1)));
      if (e.key === "-") setZoomVal(z => Math.max(0.1, +(z - 0.1).toFixed(1)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, elements, historyIdx]);

  // ── Export PNG ────────────────────────────────────────────────────
  const exportPNG = () => {
    const exp = document.createElement("canvas");
    exp.width = canvasSize.w; exp.height = canvasSize.h;
    const ec = exp.getContext("2d");
    if (canvasBgType === "gradient") {
      const g = ec.createLinearGradient(0,0,canvasSize.w,canvasSize.h);
      g.addColorStop(0, canvasBgGradient.colors[0]);
      g.addColorStop(1, canvasBgGradient.colors[1]);
      ec.fillStyle = g;
    } else {
      ec.fillStyle = canvasBg;
    }
    ec.fillRect(0, 0, canvasSize.w, canvasSize.h);
    // Draw freehand
    ec.drawImage(drawCanvasRef.current, 0, 0);
    // Draw elements
    const drawPromises = elements.map(el => new Promise(res => {
      ec.save();
      ec.globalAlpha = el.opacity ?? 1;
      const cx = el.x + el.w/2, cy = el.y + el.h/2;
      ec.translate(cx, cy);
      ec.rotate(((el.rotation||0) * Math.PI)/180);
      ec.translate(-cx, -cy);
      if (el.type === "image") {
        const img = new Image();
        img.onload = () => {
          if (el.radius > 0) {
            ec.save();
            ec.beginPath();
            ec.roundRect(el.x, el.y, el.w, el.h, el.radius);
            ec.clip();
          }
          ec.drawImage(img, el.x, el.y, el.w, el.h);
          if (el.radius > 0) ec.restore();
          ec.restore();
          res();
        };
        img.src = el.src;
      } else if (el.type === "text") {
        ec.font = `${el.fontStyle||"normal"} ${el.fontWeight||"normal"} ${el.fontSize||24}px ${el.fontFamily||"sans-serif"}`;
        ec.fillStyle = el.color || "#000";
        ec.fillText(el.text || "", el.x, el.y + el.fontSize);
        ec.restore();
        res();
      } else {
        ec.restore();
        res();
      }
    }));
    Promise.all(drawPromises).then(() => {
      const a = document.createElement("a");
      a.download = "canvasflow.png";
      a.href = exp.toDataURL("image/png");
      a.click();
      showToast("Exported!");
    });
  };

  // ── Resize handles config ─────────────────────────────────────────
  const HANDLES = [
    { id:"nw", cursor:"nw-resize", style:{ top:-5, left:-5 } },
    { id:"n",  cursor:"n-resize",  style:{ top:-5, left:"50%", transform:"translateX(-50%)" } },
    { id:"ne", cursor:"ne-resize", style:{ top:-5, right:-5 } },
    { id:"e",  cursor:"e-resize",  style:{ top:"50%", right:-5, transform:"translateY(-50%)" } },
    { id:"se", cursor:"se-resize", style:{ bottom:-5, right:-5 } },
    { id:"s",  cursor:"s-resize",  style:{ bottom:-5, left:"50%", transform:"translateX(-50%)" } },
    { id:"sw", cursor:"sw-resize", style:{ bottom:-5, left:-5 } },
    { id:"w",  cursor:"w-resize",  style:{ top:"50%", left:-5, transform:"translateY(-50%)" } },
  ];

  // ─────────────────────────────────────────────────────────────────
  // ── RENDER ───────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:"#0a0a0f", color:"#e2e2f0", fontFamily:"'DM Sans', sans-serif", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#2a2a3f; border-radius:4px; }
        input[type=range] { -webkit-appearance:none; width:100%; height:4px; background:#2a2a3f; border-radius:4px; outline:none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; background:#6366f1; border-radius:50%; cursor:pointer; }
        input[type=color] { -webkit-appearance:none; padding:0; border:none; cursor:pointer; width:100%; height:100%; background:transparent; }
        input[type=color]::-webkit-color-swatch-wrapper { padding:0; }
        input[type=color]::-webkit-color-swatch { border:none; border-radius:6px; }
        .cf-btn { transition: all .15s ease; }
        .cf-btn:hover { transform: translateY(-1px); }
        .cf-btn:active { transform: translateY(0); }
        .tool-active { background: rgba(99,102,241,.2) !important; color: #818cf8 !important; border-color: rgba(99,102,241,.5) !important; }
        .swatch-grid { display:grid; grid-template-columns:repeat(8,1fr); gap:4px; }
      `}</style>

      {/* ── TOP BAR ───────────────────────────────────────────── */}
      <div style={{ height:52, background:"#12121a", borderBottom:"1px solid #1e1e2e", display:"flex", alignItems:"center", padding:"0 16px", gap:10, flexShrink:0, zIndex:100 }}>
        <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, background:"linear-gradient(135deg,#818cf8,#c084fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginRight:6 }}>CanvasFlow</span>
        <div style={{ width:1, height:24, background:"#1e1e2e" }}/>
        {[
          { label:"↩", title:"Undo (Ctrl+Z)", action:undo },
          { label:"↪", title:"Redo (Ctrl+Y)", action:redo },
        ].map(b => (
          <button key={b.label} className="cf-btn" title={b.title} onClick={b.action} style={{ height:30, padding:"0 10px", background:"transparent", border:"1px solid #1e1e2e", borderRadius:7, color:"#a0a0c0", fontSize:13, cursor:"pointer" }}>{b.label}</button>
        ))}
        <div style={{ width:1, height:24, background:"#1e1e2e" }}/>
        <TopBtn label="＋ Text" onClick={addText}/>
        <TopBtn label="⬆ Image" onClick={() => fileInputRef.current?.click()}/>
        <div style={{ flex:1 }}/>
        {/* Zoom */}
        <button className="cf-btn" onClick={() => setZoomVal(z => Math.max(0.1,+(z-.1).toFixed(1)))} style={topBtnStyle}>−</button>
        <span style={{ fontSize:12, color:"#6b6b8f", minWidth:44, textAlign:"center" }}>{Math.round(zoom*100)}%</span>
        <button className="cf-btn" onClick={() => setZoomVal(z => Math.min(4,+(z+.1).toFixed(1)))} style={topBtnStyle}>＋</button>
        <button className="cf-btn" onClick={() => setZoomVal(1)} style={topBtnStyle}>1:1</button>
        <div style={{ width:1, height:24, background:"#1e1e2e" }}/>
        <button className="cf-btn" onClick={exportPNG} style={{ height:32, padding:"0 16px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:8, color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer" }}>⬇ Export PNG</button>
      </div>

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        {/* ── LEFT PANEL ────────────────────────────────────────── */}
        <div style={{ width:220, background:"#12121a", borderRight:"1px solid #1e1e2e", display:"flex", flexDirection:"column", overflow:"hidden", flexShrink:0 }}>
          {/* Tabs */}
          <div style={{ display:"flex", borderBottom:"1px solid #1e1e2e" }}>
            {["tools","shapes","text"].map(tab => (
              <button key={tab} onClick={() => setLeftTab(tab)} style={{ flex:1, height:38, background:leftTab===tab?"#1a1a28":"transparent", border:"none", color:leftTab===tab?"#818cf8":"#6b6b8f", fontSize:11, fontWeight:600, cursor:"pointer", textTransform:"uppercase", letterSpacing:"0.8px", borderBottom:leftTab===tab?"2px solid #6366f1":"2px solid transparent" }}>
                {tab}
              </button>
            ))}
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:12 }}>
            {/* TOOLS TAB */}
            {leftTab === "tools" && (
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <SectionLabel>Tools</SectionLabel>
                {[
                  { id:"select", label:"◎ Select", key:"V" },
                  { id:"draw",   label:"✏ Draw",   key:"P" },
                  { id:"erase",  label:"⬜ Eraser", key:"E" },
                ].map(t => (
                  <button key={t.id} className={`cf-btn ${tool===t.id?"tool-active":""}`} onClick={() => setTool(t.id)} style={{ ...toolBtnStyle, justifyContent:"space-between" }}>
                    <span>{t.label}</span>
                    <span style={{ fontSize:10, color:"#4a4a6a" }}>{t.key}</span>
                  </button>
                ))}

                {(tool === "draw" || tool === "erase") && (
                  <div style={{ marginTop:8 }}>
                    <SectionLabel>Brush</SectionLabel>
                    <PropRow label="Color">
                      <ColorInput value={drawColor} onChange={setDrawColor}/>
                    </PropRow>
                    <PropRow label="Size">
                      <input type="range" min={1} max={60} value={drawSize} onChange={e => setDrawSize(+e.target.value)}/>
                      <span style={{ fontSize:11, color:"#6b6b8f", marginLeft:6, minWidth:20 }}>{drawSize}</span>
                    </PropRow>
                    <PropRow label="Opacity">
                      <input type="range" min={0.05} max={1} step={0.05} value={drawOpacity} onChange={e => setDrawOpacity(+e.target.value)}/>
                    </PropRow>
                    <SectionLabel style={{ marginTop:8 }}>Swatches</SectionLabel>
                    <div className="swatch-grid" style={{ marginTop:4 }}>
                      {SWATCHES.map(c => (
                        <div key={c} onClick={() => setDrawColor(c)} style={{ width:"100%", aspectRatio:"1", borderRadius:5, background:c, cursor:"pointer", border:drawColor===c?"2px solid #818cf8":"2px solid transparent", transition:"transform .1s" }}/>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginTop:8 }}><SectionLabel>Canvas</SectionLabel></div>
                <PropRow label="W">
                  <input className="pInput" type="number" value={canvasSize.w} onChange={e => setCanvasSize(s=>({...s,w:+e.target.value}))} style={inputStyle}/>
                </PropRow>
                <PropRow label="H">
                  <input className="pInput" type="number" value={canvasSize.h} onChange={e => setCanvasSize(s=>({...s,h:+e.target.value}))} style={inputStyle}/>
                </PropRow>
                <PropRow label="BG">
                  <div style={{ display:"flex", gap:6, flex:1 }}>
                    <button onClick={() => setCanvasBgType("solid")} style={{ ...miniBtn, ...(canvasBgType==="solid"?activeMiniBtn:{}) }}>Solid</button>
                    <button onClick={() => setCanvasBgType("gradient")} style={{ ...miniBtn, ...(canvasBgType==="gradient"?activeMiniBtn:{}) }}>Grad</button>
                  </div>
                </PropRow>
                {canvasBgType === "solid" && (
                  <PropRow label="Color">
                    <ColorInput value={canvasBg} onChange={setCanvasBg}/>
                  </PropRow>
                )}
                {canvasBgType === "gradient" && (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, marginTop:4 }}>
                    {GRADIENTS.map(g => (
                      <button key={g.id} onClick={() => setCanvasBgGradient(g)} style={{ height:28, borderRadius:6, background:`linear-gradient(135deg,${g.colors[0]},${g.colors[1]})`, border:canvasBgGradient.id===g.id?"2px solid #818cf8":"2px solid transparent", cursor:"pointer", fontSize:10, color:"#fff", fontWeight:600 }}>{g.label}</button>
                    ))}
                  </div>
                )}
                <SectionLabel style={{marginTop:8}}>Presets</SectionLabel>
                {[{label:"Instagram Post",w:1080,h:1080},{label:"Presentation",w:1280,h:720},{label:"A4 Portrait",w:794,h:1123},{label:"Banner",w:1200,h:400}].map(p=>(
                  <button key={p.label} onClick={()=>setCanvasSize({w:p.w,h:p.h})} style={toolBtnStyle}>{p.label}</button>
                ))}
              </div>
            )}

            {/* SHAPES TAB */}
            {leftTab === "shapes" && (
              <div>
                <SectionLabel>Shapes</SectionLabel>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginBottom:12 }}>
                  {Object.entries(SHAPE_DEFS).map(([key, def]) => (
                    <button key={key} className="cf-btn" onClick={() => addShape(key)} title={def.label} style={{ aspectRatio:"1", background:"#1a1a28", border:"1px solid #2a2a3f", borderRadius:10, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, color:"#a0a0c0", fontSize:20 }}>
                      <span>{def.icon}</span>
                      <span style={{ fontSize:9 }}>{def.label}</span>
                    </button>
                  ))}
                </div>
                <SectionLabel>Image in Shape</SectionLabel>
                <p style={{ fontSize:11, color:"#6b6b8f", marginBottom:8, lineHeight:1.5 }}>Select a shape, then click to fill it with an image.</p>
                <button className="cf-btn" onClick={() => shapeImageInputRef.current?.click()} style={{ ...toolBtnStyle, background:"rgba(99,102,241,.15)", color:"#818cf8", border:"1px dashed rgba(99,102,241,.4)" }}>
                  🖼 Fill Shape with Image
                </button>
                <input ref={shapeImageInputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleShapeImageUpload}/>
              </div>
            )}

            {/* TEXT TAB */}
            {leftTab === "text" && (
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <button className="cf-btn" onClick={addText} style={{ ...toolBtnStyle, background:"rgba(99,102,241,.15)", color:"#818cf8", border:"1px dashed rgba(99,102,241,.4)", padding:"12px 0", fontSize:14, fontWeight:600 }}>＋ Add Text</button>
                <SectionLabel style={{marginTop:4}}>Presets</SectionLabel>
                {[
                  { label:"Heading", fs:48, fw:"bold", ff:"Playfair Display" },
                  { label:"Subheading", fs:32, fw:"600", ff:"Syne" },
                  { label:"Body Text", fs:16, fw:"normal", ff:"DM Sans" },
                  { label:"Caption", fs:12, fw:"normal", ff:"DM Sans" },
                  { label:"Display", fs:64, fw:"bold", ff:"Bebas Neue" },
                  { label:"Handwritten", fs:36, fw:"normal", ff:"Caveat" },
                ].map(p => (
                  <button key={p.label} className="cf-btn" onClick={() => addElement({ id:uid(), type:"text", x:80, y:80, w:300, h:p.fs+20, text:p.label, fontSize:p.fs, fontFamily:p.ff, fontWeight:p.fw, fontStyle:"normal", textDecoration:"none", textAlign:"left", color:"#1e1b4b", opacity:1, rotation:0, letterSpacing:0, lineHeight:1.3, shadow:false, shadowColor:"#000000", shadowBlur:4 })} style={{ ...toolBtnStyle, textAlign:"left", fontFamily:p.ff, fontSize:Math.min(p.fs,18) }}>
                    {p.label}
                  </button>
                ))}
                <SectionLabel style={{marginTop:8}}>Font Gallery</SectionLabel>
                <div style={{ display:"flex", flexDirection:"column", gap:3, maxHeight:200, overflowY:"auto" }}>
                  {FONTS.map(f => (
                    <button key={f} onClick={() => { if (selectedEl?.type==="text") updateAndSave(selectedEl.id, { fontFamily:f }); else addElement({ id:uid(), type:"text", x:80,y:80,w:300,h:50,text:"Sample Text",fontSize:24,fontFamily:f,fontWeight:"normal",fontStyle:"normal",textDecoration:"none",textAlign:"left",color:"#1e1b4b",opacity:1,rotation:0,letterSpacing:0,lineHeight:1.3,shadow:false,shadowColor:"#000000",shadowBlur:4 }); }} style={{ height:32, background:"transparent", border:"1px solid #1e1e2e", borderRadius:6, color:"#a0a0c0", fontSize:14, cursor:"pointer", fontFamily:f, textAlign:"left", paddingLeft:10 }}>{f}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── CANVAS AREA ──────────────────────────────────────── */}
        <div style={{ flex:1, overflow:"auto", background:"#070710", position:"relative", display:"flex", alignItems:"flex-start", justifyContent:"flex-start", padding:48 }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          {/* Dot grid */}
          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle, #1e1e30 1px, transparent 1px)", backgroundSize:"28px 28px", pointerEvents:"none" }}/>
          {/* Canvas */}
          <div style={{ position:"relative", flexShrink:0, transform:`scale(${zoom})`, transformOrigin:"top left", ...canvasBgStyle(), boxShadow:"0 40px 120px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.05)", width:canvasSize.w, height:canvasSize.h }}
            onClick={(e) => { if (e.target === e.currentTarget || e.target === canvasRef.current || e.target === drawCanvasRef.current) setSelected(null); }}
            ref={canvasRef}>
            {/* Elements */}
            {elements.map(el => (
              <CanvasElement key={el.id} el={el} selected={selected===el.id} tool={tool}
                onMouseDown={onElMouseDown} onResizeMouseDown={onResizeMouseDown}
                onDoubleClick={(id) => {
                  if (el.type === "text") {
                    const node = document.getElementById("text_"+id);
                    if (node) { node.focus(); const r = document.createRange(); r.selectNodeContents(node); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
                  }
                }}
                onTextChange={(id, val) => updateElement(id, { text: val })}
                onTextBlur={(id) => setElements(prev => { saveHistory(prev); return prev; })}
                HANDLES={HANDLES}
              />
            ))}
            {/* Draw canvas */}
            <canvas ref={drawCanvasRef} width={canvasSize.w} height={canvasSize.h}
              style={{ position:"absolute", inset:0, pointerEvents:(tool==="draw"||tool==="erase")?"all":"none", zIndex:50, cursor:(tool==="draw"||tool==="erase")?"crosshair":"default" }}
              onMouseDown={onDrawStart} onMouseMove={onDrawMove} onMouseUp={onDrawEnd} onMouseLeave={onDrawEnd}/>
          </div>
        </div>

        {/* ── RIGHT PANEL ──────────────────────────────────────── */}
        <div style={{ width:240, background:"#12121a", borderLeft:"1px solid #1e1e2e", display:"flex", flexDirection:"column", overflow:"hidden", flexShrink:0 }}>
          {/* Tabs */}
          <div style={{ display:"flex", borderBottom:"1px solid #1e1e2e" }}>
            {["properties","layers"].map(tab => (
              <button key={tab} onClick={() => setRightTab(tab)} style={{ flex:1, height:38, background:rightTab===tab?"#1a1a28":"transparent", border:"none", color:rightTab===tab?"#818cf8":"#6b6b8f", fontSize:11, fontWeight:600, cursor:"pointer", textTransform:"uppercase", letterSpacing:"0.8px", borderBottom:rightTab===tab?"2px solid #6366f1":"2px solid transparent" }}>
                {tab}
              </button>
            ))}
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:12 }}>
            {rightTab === "properties" && (
              selectedEl ? <PropertiesPanel el={selectedEl} updateEl={(patch) => updateElement(selectedEl.id, patch)} updateAndSave={(patch) => updateAndSave(selectedEl.id, patch)} FONTS={FONTS} SWATCHES={SWATCHES} bringForward={() => bringForward(selectedEl.id)} sendBackward={() => sendBackward(selectedEl.id)} duplicate={() => duplicateElement(selectedEl.id)} remove={() => removeElement(selectedEl.id)} shapeImageInputRef={shapeImageInputRef}/>
              : <EmptyProperties/>
            )}
            {rightTab === "layers" && (
              <LayersPanel elements={elements} selected={selected} setSelected={setSelected} setElements={setElements} saveHistory={saveHistory}/>
            )}
          </div>
        </div>
      </div>

      {/* Hidden inputs */}
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleImageUpload}/>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:"#1a1a28", border:"1px solid #2a2a3f", borderRadius:10, padding:"10px 20px", fontSize:13, color:"#e2e2f0", zIndex:9999, pointerEvents:"none", whiteSpace:"nowrap", boxShadow:"0 8px 32px rgba(0,0,0,.6)" }}>
          {toast}
        </div>
      )}

      {/* Keyboard hints */}
      <div style={{ position:"fixed", bottom:8, right:12, fontSize:10, color:"#2a2a4f", userSelect:"none" }}>
        V:Select · P:Draw · E:Erase · T:Text · Del:Delete · Ctrl+Z/Y:Undo/Redo
      </div>
    </div>
  );
}

// ─── Canvas Element ────────────────────────────────────────────────────
function CanvasElement({ el, selected, tool, onMouseDown, onResizeMouseDown, onDoubleClick, onTextChange, onTextBlur, HANDLES }) {
  const isSelected = selected;
  const filterStr = el.filter && el.filter !== "none" ? (() => {
    switch(el.filter) {
      case "grayscale": return "grayscale(100%)";
      case "sepia": return "sepia(80%)";
      case "blur": return "blur(3px)";
      case "brightness": return "brightness(1.4)";
      case "contrast": return "contrast(1.5)";
      case "saturate": return "saturate(2)";
      case "invert": return "invert(100%)";
      default: return "none";
    }
  })() : "none";

  const shadowStr = el.shadow ? `drop-shadow(0 4px ${el.shadowBlur||8}px ${el.shadowColor||"#000"})` : "none";

  return (
    <div
      onMouseDown={(e) => onMouseDown(e, el.id)}
      onDoubleClick={() => onDoubleClick(el.id)}
      style={{
        position:"absolute", left:el.x, top:el.y, width:el.w, height:el.h,
        opacity:el.opacity??1,
        transform:`rotate(${el.rotation||0}deg)`,
        cursor: tool === "select" ? "move" : "default",
        userSelect:"none",
        outline: isSelected ? "2px solid #6366f1" : "none",
        outlineOffset: 2,
        zIndex: isSelected ? 100 : "auto",
        filter: [filterStr, shadowStr].filter(f=>f!=="none").join(" ") || "none",
      }}>

      {/* Image element */}
      {el.type === "image" && (
        <img src={el.src} draggable={false} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", borderRadius:el.radius||0, transform:`scaleX(${el.flipX?-1:1}) scaleY(${el.flipY?-1:1})` }}/>
      )}

      {/* Text element */}
      {el.type === "text" && (
        <div
          id={"text_"+el.id}
          contentEditable={tool==="select"}
          suppressContentEditableWarning
          onInput={(e) => onTextChange(el.id, e.currentTarget.textContent)}
          onBlur={() => onTextBlur(el.id)}
          onMouseDown={(e) => { if (tool==="select") e.stopPropagation(); }}
          style={{
            width:"100%", height:"100%", outline:"none",
            fontSize:el.fontSize||24, fontFamily:el.fontFamily||"sans-serif",
            fontWeight:el.fontWeight||"normal", fontStyle:el.fontStyle||"normal",
            textDecoration:el.textDecoration||"none", textAlign:el.textAlign||"left",
            color:el.color||"#000", lineHeight:el.lineHeight||1.3,
            letterSpacing:`${el.letterSpacing||0}px`,
            whiteSpace:"pre-wrap", wordBreak:"break-word", cursor:"text",
            padding:4,
          }}>
          {el.text}
        </div>
      )}

      {/* Shape element */}
      {el.type === "shape" && (
        <svg width="100%" height="100%" viewBox={`0 0 ${el.w} ${el.h}`} xmlns="http://www.w3.org/2000/svg" style={{ overflow:"visible" }}>
          {el.useImageFill && el.imageSrc ? (
            <>
              <defs>
                <pattern id={`img_${el.id}`} patternUnits="objectBoundingBox" width="1" height="1">
                  <image href={el.imageSrc} x="0" y="0" width={el.w} height={el.h} preserveAspectRatio="xMidYMid slice"/>
                </pattern>
              </defs>
              {renderShape(el.shapeType, el.w, el.h, `url(#img_${el.id})`, el.stroke, el.strokeWidth||0, el.radius||12)}
            </>
          ) : (
            renderShape(el.shapeType, el.w, el.h, el.fill||"#6366f1", el.stroke||"none", el.strokeWidth||0, el.radius||12)
          )}
        </svg>
      )}

      {/* Selection handles */}
      {isSelected && (
        <>
          {HANDLES.map(h => (
            <div key={h.id} onMouseDown={(e) => onResizeMouseDown(e, el.id, h.id)} style={{ position:"absolute", width:10, height:10, background:"#6366f1", border:"2px solid #fff", borderRadius:3, cursor:h.cursor, zIndex:200, ...h.style }}/>
          ))}
        </>
      )}
    </div>
  );
}

// ─── Properties Panel ─────────────────────────────────────────────────
function PropertiesPanel({ el, updateEl, updateAndSave, FONTS, SWATCHES, bringForward, sendBackward, duplicate, remove, shapeImageInputRef }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
      {/* Transform */}
      <SectionLabel>Transform</SectionLabel>
      <PropRow label="X"><input type="number" value={Math.round(el.x)} onChange={e=>updateAndSave({x:+e.target.value})} style={inputStyle}/></PropRow>
      <PropRow label="Y"><input type="number" value={Math.round(el.y)} onChange={e=>updateAndSave({y:+e.target.value})} style={inputStyle}/></PropRow>
      <PropRow label="W"><input type="number" value={Math.round(el.w)} onChange={e=>updateAndSave({w:+e.target.value})} style={inputStyle}/></PropRow>
      <PropRow label="H"><input type="number" value={Math.round(el.h)} onChange={e=>updateAndSave({h:+e.target.value})} style={inputStyle}/></PropRow>
      <PropRow label="Rot"><input type="number" value={el.rotation||0} onChange={e=>updateEl({rotation:+e.target.value})} style={inputStyle}/><span style={{fontSize:10,color:"#4a4a6a",marginLeft:4}}>°</span></PropRow>
      <PropRow label="Opacity"><input type="range" min={0.05} max={1} step={0.05} value={el.opacity??1} onChange={e=>updateEl({opacity:+e.target.value})}/></PropRow>

      {/* Text props */}
      {el.type === "text" && <>
        <SectionLabel style={{marginTop:8}}>Typography</SectionLabel>
        <PropRow label="Font">
          <select value={el.fontFamily} onChange={e=>updateEl({fontFamily:e.target.value})} style={{...inputStyle, fontFamily:el.fontFamily}}>
            {FONTS.map(f=><option key={f} value={f} style={{fontFamily:f}}>{f}</option>)}
          </select>
        </PropRow>
        <PropRow label="Size"><input type="number" value={el.fontSize||24} onChange={e=>updateEl({fontSize:+e.target.value})} style={inputStyle}/></PropRow>
        <PropRow label="Color"><ColorInput value={el.color||"#000"} onChange={v=>updateEl({color:v})}/></PropRow>
        <PropRow label="Align">
          <div style={{display:"flex",gap:4,flex:1}}>
            {["left","center","right"].map(a=>(
              <button key={a} onClick={()=>updateEl({textAlign:a})} style={{...miniBtn,...(el.textAlign===a?activeMiniBtn:{})}}>{a[0].toUpperCase()}</button>
            ))}
          </div>
        </PropRow>
        <PropRow label="Style">
          <div style={{display:"flex",gap:4,flex:1}}>
            <button onClick={()=>updateEl({fontWeight:el.fontWeight==="bold"?"normal":"bold"})} style={{...miniBtn,...(el.fontWeight==="bold"?activeMiniBtn:{})}}><b>B</b></button>
            <button onClick={()=>updateEl({fontStyle:el.fontStyle==="italic"?"normal":"italic"})} style={{...miniBtn,...(el.fontStyle==="italic"?activeMiniBtn:{})}}><i>I</i></button>
            <button onClick={()=>updateEl({textDecoration:el.textDecoration==="underline"?"none":"underline"})} style={{...miniBtn,...(el.textDecoration==="underline"?activeMiniBtn:{})}}><u>U</u></button>
          </div>
        </PropRow>
        <PropRow label="Spacing"><input type="number" value={el.letterSpacing||0} onChange={e=>updateEl({letterSpacing:+e.target.value})} style={inputStyle}/></PropRow>
        <PropRow label="Leading"><input type="number" step={0.1} value={el.lineHeight||1.3} onChange={e=>updateEl({lineHeight:+e.target.value})} style={inputStyle}/></PropRow>
        <SectionLabel style={{marginTop:4}}>Color Swatches</SectionLabel>
        <div className="swatch-grid" style={{marginBottom:8}}>
          {SWATCHES.map(c=>(
            <div key={c} onClick={()=>updateEl({color:c})} style={{width:"100%",aspectRatio:"1",borderRadius:4,background:c,cursor:"pointer",border:el.color===c?"2px solid #818cf8":"2px solid transparent"}}/>
          ))}
        </div>
      </>}

      {/* Shape props */}
      {el.type === "shape" && <>
        <SectionLabel style={{marginTop:8}}>Shape Style</SectionLabel>
        <PropRow label="Fill"><ColorInput value={el.fill||"#6366f1"} onChange={v=>updateEl({fill:v})}/></PropRow>
        <PropRow label="Stroke"><ColorInput value={el.stroke||"#4338ca"} onChange={v=>updateEl({stroke:v})}/></PropRow>
        <PropRow label="SW"><input type="number" min={0} max={20} value={el.strokeWidth||0} onChange={e=>updateEl({strokeWidth:+e.target.value})} style={inputStyle}/></PropRow>
        <PropRow label="Radius"><input type="number" min={0} max={100} value={el.radius||0} onChange={e=>updateEl({radius:+e.target.value})} style={inputStyle}/></PropRow>
        <SectionLabel style={{marginTop:4}}>Fill Swatches</SectionLabel>
        <div className="swatch-grid" style={{marginBottom:4}}>
          {SWATCHES.map(c=>(
            <div key={c} onClick={()=>updateEl({fill:c,useImageFill:false})} style={{width:"100%",aspectRatio:"1",borderRadius:4,background:c,cursor:"pointer",border:el.fill===c?"2px solid #818cf8":"2px solid transparent"}}/>
          ))}
        </div>
        <SectionLabel>Gradient Fill</SectionLabel>
        {GRADIENTS.map(g=>(
          <button key={g.id} onClick={()=>updateEl({fill:`url(#grad_${g.id})`,_gradColors:g.colors,useImageFill:false})} style={{height:26,marginBottom:3,borderRadius:6,background:`linear-gradient(135deg,${g.colors[0]},${g.colors[1]})`,border:"1px solid transparent",cursor:"pointer",fontSize:11,color:"#fff",fontWeight:600,width:"100%"}}>{g.label}</button>
        ))}
        <button className="cf-btn" onClick={()=>shapeImageInputRef.current?.click()} style={{...toolBtnStyle,marginTop:4,background:"rgba(99,102,241,.15)",color:"#818cf8",border:"1px dashed rgba(99,102,241,.4)"}}>🖼 Fill with Image</button>
        {el.useImageFill && <button className="cf-btn" onClick={()=>updateEl({useImageFill:false,imageSrc:null})} style={{...toolBtnStyle,color:"#f87171"}}>✕ Remove Image Fill</button>}
      </>}

      {/* Image props */}
      {el.type === "image" && <>
        <SectionLabel style={{marginTop:8}}>Image</SectionLabel>
        <PropRow label="Radius"><input type="number" min={0} max={500} value={el.radius||0} onChange={e=>updateEl({radius:+e.target.value})} style={inputStyle}/></PropRow>
        <PropRow label="Flip">
          <div style={{display:"flex",gap:4,flex:1}}>
            <button onClick={()=>updateEl({flipX:!el.flipX})} style={{...miniBtn,...(el.flipX?activeMiniBtn:{})}}>↔ H</button>
            <button onClick={()=>updateEl({flipY:!el.flipY})} style={{...miniBtn,...(el.flipY?activeMiniBtn:{})}}>↕ V</button>
          </div>
        </PropRow>
        <SectionLabel style={{marginTop:4}}>Filter</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:8}}>
          {["none","grayscale","sepia","blur","brightness","contrast","saturate","invert"].map(f=>(
            <button key={f} onClick={()=>updateEl({filter:f})} style={{height:26,borderRadius:6,background:el.filter===f?"rgba(99,102,241,.3)":"#1a1a28",border:`1px solid ${el.filter===f?"#6366f1":"#2a2a3f"}`,color:el.filter===f?"#818cf8":"#6b6b8f",fontSize:11,cursor:"pointer",textTransform:"capitalize"}}>{f}</button>
          ))}
        </div>
      </>}

      {/* Shadow */}
      <SectionLabel style={{marginTop:4}}>Shadow</SectionLabel>
      <PropRow label="On">
        <button onClick={()=>updateEl({shadow:!el.shadow})} style={{...miniBtn,...(el.shadow?activeMiniBtn:{})}}>Shadow</button>
      </PropRow>
      {el.shadow && <>
        <PropRow label="Color"><ColorInput value={el.shadowColor||"#000000"} onChange={v=>updateEl({shadowColor:v})}/></PropRow>
        <PropRow label="Blur"><input type="range" min={0} max={40} value={el.shadowBlur||8} onChange={e=>updateEl({shadowBlur:+e.target.value})}/></PropRow>
      </>}

      {/* Layer & Actions */}
      <SectionLabel style={{marginTop:8}}>Layer</SectionLabel>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:8}}>
        <button className="cf-btn" onClick={bringForward} style={toolBtnStyle}>↑ Forward</button>
        <button className="cf-btn" onClick={sendBackward} style={toolBtnStyle}>↓ Backward</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
        <button className="cf-btn" onClick={duplicate} style={{...toolBtnStyle,color:"#818cf8"}}>⎘ Duplicate</button>
        <button className="cf-btn" onClick={remove} style={{...toolBtnStyle,color:"#f87171",borderColor:"rgba(248,113,113,.3)"}}>🗑 Delete</button>
      </div>
    </div>
  );
}

// ─── Layers Panel ──────────────────────────────────────────────────────
function LayersPanel({ elements, selected, setSelected, setElements, saveHistory }) {
  const typeColors = { text:"#f472b6", image:"#34d399", shape:"#818cf8" };
  const typeIcons  = { text:"T", image:"🖼", shape:"▣" };
  return (
    <div>
      <SectionLabel>Layers ({elements.length})</SectionLabel>
      {[...elements].reverse().map((el, i) => (
        <div key={el.id} onClick={() => setSelected(el.id)} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px", borderRadius:7, marginBottom:3, background:selected===el.id?"rgba(99,102,241,.2)":"transparent", border:`1px solid ${selected===el.id?"rgba(99,102,241,.4)":"transparent"}`, cursor:"pointer" }}>
          <span style={{ width:20, height:20, borderRadius:5, background:typeColors[el.type]||"#888", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, flexShrink:0 }}>{typeIcons[el.type]}</span>
          <span style={{ flex:1, fontSize:12, color:selected===el.id?"#818cf8":"#a0a0c0", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {el.type==="text" ? (el.text?.slice(0,20)||"Text") : `${el.shapeType||el.type} ${elements.length - i}`}
          </span>
          <button onClick={e=>{e.stopPropagation();setElements(prev=>{const next=prev.filter(e2=>e2.id!==el.id);saveHistory(next);return next;});if(selected===el.id)setSelected(null);}} style={{background:"transparent",border:"none",color:"#6b6b8f",cursor:"pointer",fontSize:14,padding:"0 2px"}}>✕</button>
        </div>
      ))}
      {elements.length === 0 && <p style={{ fontSize:12, color:"#4a4a6a", textAlign:"center", marginTop:20 }}>No elements yet.<br/>Add text, shapes, or images.</p>}
    </div>
  );
}

function EmptyProperties() {
  return (
    <div style={{ textAlign:"center", marginTop:40 }}>
      <div style={{ fontSize:32, marginBottom:12 }}>☝️</div>
      <p style={{ fontSize:13, color:"#4a4a6a", lineHeight:1.6 }}>Select an element<br/>to edit its properties</p>
    </div>
  );
}

// ─── Small Components ──────────────────────────────────────────────────
function SectionLabel({ children, style }) {
  return <div style={{ fontSize:10, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", color:"#4a4a6a", marginTop:4, marginBottom:6, ...style }}>{children}</div>;
}
function PropRow({ label, children }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
      <span style={{ fontSize:10, color:"#6b6b8f", width:38, flexShrink:0 }}>{label}</span>
      <div style={{ flex:1, display:"flex", alignItems:"center" }}>{children}</div>
    </div>
  );
}
function ColorInput({ value, onChange }) {
  return (
    <div style={{ width:"100%", height:28, borderRadius:7, overflow:"hidden", border:"1px solid #2a2a3f", background:value, cursor:"pointer", position:"relative" }}>
      <input type="color" value={value} onChange={e=>onChange(e.target.value)} style={{ position:"absolute", inset:-4, opacity:0.01, cursor:"pointer", width:"calc(100%+8px)", height:"calc(100%+8px)" }}/>
      <div style={{ position:"absolute", inset:0, background:value, borderRadius:6 }}/>
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:6 }}>
        <span style={{ fontSize:10, color:"rgba(255,255,255,.6)", fontFamily:"monospace" }}>{value}</span>
      </div>
      <input type="color" value={value} onChange={e=>onChange(e.target.value)} style={{ position:"absolute", inset:0, opacity:0, cursor:"pointer", width:"100%", height:"100%" }}/>
    </div>
  );
}
function TopBtn({ label, onClick }) {
  return <button className="cf-btn" onClick={onClick} style={topBtnStyle}>{label}</button>;
}

// ─── Styles ────────────────────────────────────────────────────────────
const topBtnStyle = { height:30, padding:"0 10px", background:"transparent", border:"1px solid #1e1e2e", borderRadius:7, color:"#a0a0c0", fontSize:12, cursor:"pointer", whiteSpace:"nowrap" };
const toolBtnStyle = { width:"100%", height:34, background:"#1a1a28", border:"1px solid #2a2a3f", borderRadius:8, color:"#a0a0c0", fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"flex-start", paddingLeft:10, gap:6, marginBottom:3 };
const inputStyle = { flex:1, height:28, background:"#1a1a28", border:"1px solid #2a2a3f", borderRadius:6, color:"#e2e2f0", fontSize:12, padding:"0 8px", outline:"none", width:"100%" };
const miniBtn = { flex:1, height:26, background:"#1a1a28", border:"1px solid #2a2a3f", borderRadius:6, color:"#6b6b8f", fontSize:11, cursor:"pointer" };
const activeMiniBtn = { background:"rgba(99,102,241,.2)", borderColor:"rgba(99,102,241,.5)", color:"#818cf8" };
