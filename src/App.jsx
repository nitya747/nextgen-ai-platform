import { useState, useEffect, useRef } from 'react';
import './App.css';

const PRICING_MATRIX = {
  currencies: {
    USD: { symbol: '$', rate: 1.0, tariff: 1.0 },
    EUR: { symbol: '€', rate: 0.9, tariff: 0.95 },
    INR: { symbol: '₹', rate: 80.0, tariff: 0.85 }
  },
  tiers: {
    starter: { baseMonthly: 29 },
    pro: { baseMonthly: 79 },
    enterprise: { baseMonthly: 249 }
  },
  discount: 0.20 // 20% annual discount
};

const FEATURES = [
  {
    id: 0,
    code: 'SEC-01',
    title: 'Secure Guardrails',
    desc: 'Real-time privacy and security layers with zero data retention. Prevents exfiltration of sensitive telemetry data.',
    tags: ['Zero Retention', 'PII Redaction', 'AES-256'],
    icon: 'icon-secure-guard'
  },
  {
    id: 1,
    code: 'AGT-02',
    title: 'Agent Build Pipeline',
    desc: 'Multi-agent orchestration engine. Construct, test, and deploy autonomous workflows with state-preserving execution paths.',
    tags: ['State Preservation', 'Visual Builder', 'Handoffs'],
    icon: 'icon-agent-build'
  },
  {
    id: 2,
    code: 'CLD-03',
    title: 'Cloud Scale Scheduler',
    desc: 'Distributed cluster scheduling and dynamic task allocation. Auto-scales processing capacity based on model execution load.',
    tags: ['Dynamic Scaling', 'Load Balancer', 'Auto-failover'],
    icon: 'icon-cloud-scale'
  },
  {
    id: 3,
    code: 'DTA-04',
    title: 'Data Mining Pipeline',
    desc: 'Automated data ingestion, extraction, and indexing. Synthesizes unstructured multi-modal streams into clean semantic stores.',
    tags: ['Multi-modal', 'Vector Indexing', 'Semantic Search'],
    icon: 'icon-data-mining'
  }
];

const CASE_STUDIES = [
  {
    id: 0,
    client: 'Cigna Health',
    metric: '99.9% Telemetry Accuracy',
    title: 'Automating multi-modal claim streams',
    desc: 'Cigna utilized Armory to analyze unstructured documents, reducing verification latency from hours to milliseconds while maintaining perfect HIPAA compliance.',
    graphicType: 'claims'
  },
  {
    id: 1,
    client: 'Aetna Group',
    metric: '12x Processing Velocity',
    title: 'Scaling dynamic task allocation',
    desc: 'By implementing the Cloud Scale Scheduler, Aetna scaled its active pipeline throughput to 1.2M events/sec during enrollment periods without any component reflows.',
    graphicType: 'scheduler'
  },
  {
    id: 2,
    client: 'Anthem Inc',
    metric: '0.0% PII Exfiltration Rate',
    title: 'Enforcing real-time privacy guards',
    desc: 'Anthem deployed Secure Guardrails across all regional databases, scrubbing PII at the edge before data ingestion into their main telemetry models.',
    graphicType: 'guardrails'
  }
];

const AUTONOMY_TABS = {
  DISCOVERY: {
    title: 'Autonomous DB Scanning',
    subtitle: 'Extract schemas and identify relationship metrics without manual schema declarations.',
    metric: '98% Auto-Classification',
    details: 'Our engine performs zero-knowledge database walks, mapping column dependencies, and auto-detecting indices.',
    percent: 98
  },
  ANALYSIS: {
    title: 'Real-time Correlation Engine',
    subtitle: 'Track query behavior and model usage patterns dynamically at the edge.',
    metric: '1.2M queries/sec analyzed',
    details: 'Generates real-time metrics for CPU usage, token throughput, and query-to-index matching confidence.',
    percent: 85
  },
  TRAINING: {
    title: 'Edge-aligned Reinforcement',
    subtitle: 'Optimize execution steps on-the-fly based on execution feedback.',
    metric: '0.2s optimization loop',
    details: 'Refines scheduler priority weights using policy gradients, adjusting queue sizes without main thread pauses.',
    percent: 92
  },
  DEPLOY: {
    title: 'Instant Cluster Spawning',
    subtitle: 'Provision compute layers instantly near the data source.',
    metric: '150ms Cold Start Time',
    details: 'Spins up tiny sandboxed runtime environments that execute tasks and teardown dynamically, preserving memory.',
    percent: 99
  }
};

const FAQ_CATEGORIES = ['Overview', 'Security', 'Protocols', 'Licensing'];

const FAQ_ITEMS = {
  Overview: [
    { q: 'What is Armory?', a: 'Armory is a premium Next-Generation AI platform designed for low-latency data automation, secure agent execution, and dynamic task scheduling.' },
    { q: 'How does the pricing switcher work without re-renders?', a: 'By bypassing standard React rendering flows, our pricing component mutates DOM text nodes directly using refs, ensuring zero page reflows or performance degradation.' }
  ],
  Security: [
    { q: 'Is Armory HIPAA and SOC-2 compliant?', a: 'Yes. Secure Guardrails runs inline on all pipelines, scrubbing PII at the edge and employing AES-256 state encryption with zero persistent retention.' },
    { q: 'Do you store query telemetry?', a: 'Telemetry is processed in-memory. Under our Zero Retention policy, all task logs are scrubbed as soon as the execution state is written.' }
  ],
  Protocols: [
    { q: 'What agent protocols are supported?', a: 'We support standard persistent agents, transactional sagas, and collaborative multi-agent handoffs using specialized JSON communication contracts.' }
  ],
  Licensing: [
    { q: 'Are regional rates adjusted?', a: 'Yes. Our pricing engine factors in regional tariffs dynamically: INR receives a 15% discount tariff, EUR a 5% discount tariff, computed in real-time.' }
  ]
};

// 1. Secure Guardrails Visualizer
function SecureGuardrailsVisual() {
  const [logs, setLogs] = useState([
    { id: 1, text: 'INGESTING TELEMETRY STREAM...', status: 'info' },
    { id: 2, text: 'SCANNING FOR PII ENTIRES...', status: 'scan' },
    { id: 3, text: 'SECURE ENVELOPE ACTIVATED', status: 'success' },
  ]);
  const [redactedCount, setRedactedCount] = useState(12);

  useEffect(() => {
    const rawTexts = [
      'RESOLVING IP: 192.168.1.92',
      'USER_DATA: email=ceo@company.com',
      'PAYLOAD: key_token=amry_8f3a92',
      'TELEMETRY: ssn=***-**-****',
      'DB_QUERY: select * from users where ssn=***-**-****',
      'EXPORTING STRIPPED DATA PACKETS',
    ];
    let logCounter = 4;
    const interval = setInterval(() => {
      const randomText = rawTexts[Math.floor(Math.random() * rawTexts.length)];
      let processedText = randomText;
      let redacted = false;
      if (randomText.includes('email=ceo@company.com')) {
        processedText = 'USER_DATA: email=c***@*******.com [REDACTED]';
        redacted = true;
      } else if (randomText.includes('key_token=')) {
        processedText = 'PAYLOAD: key_token=********* [REDACTED]';
        redacted = true;
      } else if (randomText.includes('ssn=')) {
        processedText = 'TELEMETRY: ssn=***-**-**** [ENCRYPTED]';
        redacted = true;
      }
      
      setLogs((prev) => {
        const next = [...prev, { id: logCounter++, text: processedText, status: redacted ? 'redacted' : 'info' }];
        if (next.length > 4) next.shift();
        return next;
      });
      if (redacted) {
        setRedactedCount((c) => c + 1);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="visual-guardrails">
      <div className="console-header">
        <div className="console-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <div className="console-title">guardrails.log</div>
        <div className="console-badge">{redactedCount} Sanitized</div>
      </div>
      <div className="console-body">
        {logs.map((log) => (
          <div key={log.id} className={`console-line ${log.status}`}>
            <span className="line-prompt">&gt;</span>
            <span className="line-text">{log.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Agent Build Visualizer
function AgentBuildVisual() {
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="visual-agent-build">
      <div className="node-wrapper">
        <div className={`node node-1 ${activeNode === 0 ? 'active' : ''}`}>
          <div className="node-icon">⚡</div>
          <span className="node-label">Trigger</span>
        </div>
        <div className="node-connector">
          <div className="connector-dot connector-dot-1"></div>
        </div>
        <div className={`node node-2 ${activeNode === 1 ? 'active' : ''}`}>
          <div className="node-icon">🧠</div>
          <span className="node-label">Model</span>
        </div>
        <div className="node-connector">
          <div className="connector-dot connector-dot-2"></div>
        </div>
        <div className={`node node-3 ${activeNode === 2 ? 'active' : ''}`}>
          <div className="node-icon">🚀</div>
          <span className="node-label">Action</span>
        </div>
      </div>
    </div>
  );
}

// 3. Cloud Scale Visualizer
function CloudScaleVisual() {
  const [load, setLoad] = useState(74.8);
  const [heights, setHeights] = useState([50, 75, 40, 85]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoad((prev) => {
        const diff = (Math.random() - 0.5) * 6;
        const next = prev + diff;
        return Math.max(60, Math.min(98, next));
      });
      setHeights(Array.from({ length: 4 }, () => Math.floor(Math.random() * 50) + 40));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="visual-cloud-scale">
      <div className="scaler-header">
        <div className="scaler-title">Cluster Load</div>
        <div className="scaler-value">{load.toFixed(1)}%</div>
      </div>
      <div className="scaler-bars">
        {heights.map((h, i) => (
          <div key={i} className="scaler-bar-item">
            <div className="scaler-bar-fill" style={{ height: `${h}%` }}></div>
            <span className="scaler-bar-label">Node {String.fromCharCode(65 + i)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Data Mining Visualizer
function DataMiningVisual() {
  const [searchState, setSearchState] = useState('searching');
  const [queryText, setQueryText] = useState('claims.db');

  useEffect(() => {
    const states = [
      { text: 'claims.db', state: 'searching' },
      { text: 'claims.db', state: 'indexing' },
      { text: 'telemetry_pack', state: 'searching' },
      { text: 'telemetry_pack', state: 'indexing' },
    ];
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % states.length;
      setQueryText(states[step].text);
      setSearchState(states[step].state);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="visual-data-mining">
      <div className="mining-search">
        <span className="search-icon">🔍</span>
        <div className="search-input">
          {queryText}
          <span className="caret">|</span>
        </div>
      </div>
      <div className="mining-results">
        <div className={`result-row ${searchState === 'indexing' ? 'matched' : ''}`}>
          <span className="doc-id">DOC-9021</span>
          <span className="doc-desc">Claims vectorized</span>
          <span className="doc-score">99.4%</span>
        </div>
        <div className={`result-row ${searchState === 'indexing' ? 'matched' : ''}`} style={{ transitionDelay: '0.1s' }}>
          <span className="doc-id">DOC-3829</span>
          <span className="doc-desc">EHR payload mapped</span>
          <span className="doc-score">88.2%</span>
        </div>
        <div className={`result-row ${searchState === 'indexing' ? 'matched' : ''}`} style={{ transitionDelay: '0.2s' }}>
          <span className="doc-id">DOC-1204</span>
          <span className="doc-desc">Billing schema parsed</span>
          <span className="doc-score">76.1%</span>
        </div>
      </div>
    </div>
  );
}

// Helper to find y coordinate on an SVG path for a given x coordinate using binary search
const getPointAtX = (pathEl, targetX) => {
  if (!pathEl) return { x: 0, y: 0 };
  try {
    const totalLength = pathEl.getTotalLength();
    let start = 0;
    let end = totalLength;
    let precision = 8;
    
    while (precision > 0) {
      const mid = (start + end) / 2;
      const pt = pathEl.getPointAtLength(mid);
      if (Math.abs(pt.x - targetX) < 0.5) {
        return pt;
      }
      if (pt.x < targetX) {
        start = mid;
      } else {
        end = mid;
      }
      precision--;
    }
    return pathEl.getPointAtLength((start + end) / 2);
  } catch {
    return { x: targetX, y: 50 }; // Fallback in case of error
  }
};

function App() {
  // Global States
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Feature States
  const [accordionIndex, setAccordionIndex] = useState(0);
  const [activeCaseStudy, setActiveCaseStudy] = useState(0);
  const [activeAutonomyTab, setActiveAutonomyTab] = useState('DISCOVERY');
  const [activeFaqCategory, setActiveFaqCategory] = useState('Overview');
  const [faqOpenIndex, setFaqOpenIndex] = useState(0);
  const [slaSlaSlider, setSlaSlider] = useState(85);
  const [isVideoActive, setIsVideoActive] = useState(false);

  // Telemetry Dashboard States
  const [computeLoad, setComputeLoad] = useState(42);
  const [activeNodes, setActiveNodes] = useState(14);
  const [coreTemp, setCoreTemp] = useState(45);
  const [slaValues, setSlaValues] = useState([65, 80, 50, 95, 70, 85]);
  const [discoveryPct, setDiscoveryPct] = useState(70);
  const [hoveredTokenSegment, setHoveredTokenSegment] = useState(null); // 'discovery' | 'analysis' | null
  const [hoverPoint, setHoverPoint] = useState(null); // { x: number, y: number } or null
  const pathRef = useRef(null);

  // Refs for Pricing Performance Isolation (Feature 1)
  const billingRef = useRef('monthly');
  const currencyRef = useRef('USD');
  const priceRefs = useRef({ starter: null, pro: null, enterprise: null });
  const periodRefs = useRef({ starter: null, pro: null, enterprise: null });

  // Refs for Bento Hover Tracking (Feature 2)
  const activeIndexRef = useRef(0);
  const bentoCardRefs = useRef([]);

  // Canvas elements refs for Phase 4
  const canvasSphereRef = useRef(null);
  const matrixCanvasRef = useRef(null);
  const statsWaveRef = useRef(null);
  const heroWaveCanvasRef = useRef(null);
  const videoHoverRef = useRef(false);

  // Loader timing sequence (Phase 1)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  // Real-time Telemetry Data Stream Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate Compute Load between 38% and 46%
      setComputeLoad(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next >= 38 && next <= 46 ? next : prev;
      });

      // Fluctuate Core Temperature between 42°C and 48°C
      setCoreTemp(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next >= 42 && next <= 48 ? next : prev;
      });

      // Active Nodes: fluctuate active count between 12 and 16
      setActiveNodes(prev => {
        const delta = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const next = prev + delta;
        return next >= 12 && next <= 16 ? next : prev;
      });

      // Fluctuate SLA history values slightly (D1-D6)
      setSlaValues(prev => prev.map(val => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = val + delta * Math.floor(Math.random() * 3);
        return next >= 40 && next <= 100 ? next : val;
      }));

      // Fluctuate Token Distribution: Discovery between 67% and 73%
      setDiscoveryPct(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next >= 67 && next <= 73 ? next : prev;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Growth Vector interactive hover tracking
  const handleMouseMove = (e) => {
    if (!pathRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 200; // viewBox width = 200
    
    // Constrain mouseX to path bounds
    const x = Math.max(0, Math.min(200, mouseX));
    const pt = getPointAtX(pathRef.current, x);
    setHoverPoint({ x: pt.x, y: pt.y });
  };

  const handleMouseLeave = () => {
    setHoverPoint(null);
  };

  // Scroll handler for Header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bento-to-Accordion Context Sync (Feature 2)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResizeChange = (e) => {
      if (e.matches) {
        setAccordionIndex(activeIndexRef.current);
      }
    };

    if (mediaQuery.matches) {
      setAccordionIndex(activeIndexRef.current);
    }

    mediaQuery.addEventListener('change', handleResizeChange);
    return () => mediaQuery.removeEventListener('change', handleResizeChange);
  }, []);

  // Initial Price population
  useEffect(() => {
    updatePrices();
  }, []);

  // 3D Interactive Hero Wave Canvas
  useEffect(() => {
    const canvas = heroWaveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.active = false;
    };

    const section = canvas.closest('.hero-section') || canvas.parentElement || document.body;
    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', handleMouseLeave);

    // Grid size parameters optimized for fullscreen layout with reduced density
    const numCols = 34;
    const numRows = 24;
    const spacing = 45;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      } else {
        mouse.x += (-1000 - mouse.x) * 0.08;
        mouse.y += (-1000 - mouse.y) * 0.08;
      }

      const centerX = width / 2;
      const centerY = height / 2;
      const rotY = -0.5 + (mouse.x - centerX) * 0.0004;
      const rotX = 0.8 + (mouse.y - centerY) * 0.0004;

      const points = [];
      const cx = width / 2;
      const cy = height / 2 + 120; // Shift down slightly to emphasize the perspective plane

      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const rx = (c - numCols / 2) * spacing;
          const ry = (r - numRows / 2) * spacing;
          
          // Use indices for distance to keep wave scale independent of spacing size
          const gc = c - numCols / 2;
          const gr = r - numRows / 2;
          const dGrid = Math.hypot(gc, gr);

          let rz = Math.sin(dGrid * 0.28 - time * 0.02) * 42;
          rz += Math.cos(gc * 0.16 + time * 0.015) * 14;
          rz += Math.sin(gr * 0.2 - time * 0.01) * 8;

          let x1 = rx * Math.cos(rotY) - rz * Math.sin(rotY);
          let z1 = rx * Math.sin(rotY) + rz * Math.cos(rotY);
          let y1 = ry;

          let y2 = y1 * Math.cos(rotX) - z1 * Math.sin(rotX);
          let z2 = y1 * Math.sin(rotX) + z1 * Math.cos(rotX);
          let x2 = x1;

          const fov = 450;
          const scale = fov / (fov + z2);
          const px = x2 * scale + cx;
          const py = y2 * scale + cy;

          let dx = 0;
          let dy = 0;
          if (mouse.active) {
            const distMouse = Math.hypot(px - mouse.x, py - mouse.y);
            if (distMouse < 180) {
              const force = (180 - distMouse) / 180;
              dy = force * force * -32 * Math.sin(time * 0.05 + distMouse * 0.03);
              dx = force * force * 14 * Math.cos(time * 0.05 + distMouse * 0.03);
            }
          }

          points.push({ x: px + dx, y: py + dy, z: z2 });
        }
      }

      ctx.lineWidth = 1.0;

      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const idx = r * numCols + c;
          const p = points[idx];

          if (c < numCols - 1) {
            const pRight = points[idx + 1];
            const avgZ = (p.z + pRight.z) / 2;
            const alpha = Math.max(0.01, Math.min(0.35, (450 - avgZ) / 900));
            ctx.strokeStyle = `rgba(217, 232, 226, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pRight.x, pRight.y);
            ctx.stroke();
          }

          if (r < numRows - 1) {
            const pDown = points[idx + numCols];
            const avgZ = (p.z + pDown.z) / 2;
            const alpha = Math.max(0.01, Math.min(0.35, (450 - avgZ) / 900));
            ctx.strokeStyle = `rgba(217, 232, 226, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pDown.x, pDown.y);
            ctx.stroke();
          }
        }
      }

      if (mouse.active) {
        points.forEach(p => {
          const distMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (distMouse < 80) {
            const ratio = 1 - distMouse / 80;
            ctx.fillStyle = `rgba(255, 200, 1, ${ratio * 0.8})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.8 * ratio, 0, 2 * Math.PI);
            ctx.fill();
          }
        });
      }

      time += 1;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Statistics Wave Animation (Phase 4)
  useEffect(() => {
    const canvas = statsWaveRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    let currentAmplitudeMultiplier = 1;
    let targetAmplitudeMultiplier = 1;
    let currentSpeedMultiplier = 1;
    let targetSpeedMultiplier = 1;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1.5;

      // Smoothly interpolate multipliers
      targetAmplitudeMultiplier = videoHoverRef.current ? 1.5 : 1.0;
      targetSpeedMultiplier = videoHoverRef.current ? 1.8 : 1.0;

      currentAmplitudeMultiplier += (targetAmplitudeMultiplier - currentAmplitudeMultiplier) * 0.1;
      currentSpeedMultiplier += (targetSpeedMultiplier - currentSpeedMultiplier) * 0.1;

      for (let w = 0; w < 3; w++) {
        ctx.beginPath();
        const amplitude = (30 + w * 10) * currentAmplitudeMultiplier;
        const frequency = 0.003 - w * 0.0005;
        const speed = (0.02 + w * 0.01) * currentSpeedMultiplier;
        
        ctx.strokeStyle = w === 0 
          ? 'rgba(217, 232, 226, 0.18)' 
          : w === 1 
          ? 'rgba(17, 76, 90, 0.4)' 
          : 'rgba(255, 200, 1, 0.18)';

        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 + Math.sin(x * frequency + phase * speed) * amplitude * Math.sin(x / canvas.width * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      phase += 1;
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // 3D Interactive Sphere Animation (Phase 4)
  useEffect(() => {
    const canvas = canvasSphereRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.active = false;
    };
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const points = [];
    const numLat = 16;
    const numLon = 24;
    const radius = 120;

    for (let i = 0; i <= numLat; i++) {
      const lat = (i * Math.PI) / numLat - Math.PI / 2;
      for (let j = 0; j < numLon; j++) {
        const lon = (j * 2 * Math.PI) / numLon;
        points.push({
          x: radius * Math.cos(lat) * Math.cos(lon),
          y: radius * Math.sin(lat),
          z: radius * Math.cos(lat) * Math.sin(lon)
        });
      }
    }

    let angleX = 0.003;
    let angleY = 0.005;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      const projected = [];
      const cx = width / 2;
      const cy = height / 2;

      points.forEach((p) => {
        let y1 = p.y * Math.cos(angleX) - p.z * Math.sin(angleX);
        let z1 = p.y * Math.sin(angleX) + p.z * Math.cos(angleX);
        let x1 = p.x;

        let x2 = x1 * Math.cos(angleY) - z1 * Math.sin(angleY);
        let z2 = x1 * Math.sin(angleY) + z1 * Math.cos(angleY);
        let y2 = y1;

        p.x = x2;
        p.y = y2;
        p.z = z2;

        const fov = 400;
        const scale = fov / (fov + p.z);
        const px = p.x * scale + cx;
        const py = p.y * scale + cy;

        let dx = 0;
        let dy = 0;
        if (mouse.active) {
          const distMouse = Math.hypot(px - mouse.x, py - mouse.y);
          if (distMouse < 100) {
            const force = (100 - distMouse) / 100;
            const angle = Math.atan2(py - mouse.y, px - mouse.x);
            dx = Math.cos(angle) * force * 25;
            dy = Math.sin(angle) * force * 25;
          }
        }

        projected.push({ x: px + dx, y: py + dy, z: p.z });
      });

      ctx.lineWidth = 0.8;

      for (let i = 0; i <= numLat; i++) {
        ctx.beginPath();
        for (let j = 0; j < numLon; j++) {
          const idx = i * numLon + j;
          const nextIdx = i * numLon + ((j + 1) % numLon);
          const zDepth = (projected[idx].z + projected[nextIdx].z) / 2;
          const alpha = Math.max(0.02, (120 - zDepth) / 240);
          ctx.strokeStyle = `rgba(217, 232, 226, ${alpha * 0.35})`;
          
          ctx.moveTo(projected[idx].x, projected[idx].y);
          ctx.lineTo(projected[nextIdx].x, projected[nextIdx].y);
        }
        ctx.stroke();
      }

      ctx.beginPath();
      for (let j = 0; j < numLon; j++) {
        for (let i = 0; i < numLat; i++) {
          const idx = i * numLon + j;
          const nextIdx = (i + 1) * numLon + j;
          const zDepth = (projected[idx].z + projected[nextIdx].z) / 2;
          const alpha = Math.max(0.02, (120 - zDepth) / 240);
          ctx.strokeStyle = `rgba(217, 232, 226, ${alpha * 0.35})`;

          ctx.moveTo(projected[idx].x, projected[idx].y);
          ctx.lineTo(projected[nextIdx].x, projected[nextIdx].y);
        }
      }
      ctx.stroke();

      if (mouse.active) {
        projected.forEach(p => {
          const distMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (distMouse < 45) {
            ctx.fillStyle = 'rgba(255, 200, 1, 0.8)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2 * (1 - distMouse / 45), 0, 2 * Math.PI);
            ctx.fill();
          }
        });
      }

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Matrix Digital Rain Eye (Phase 4)
  useEffect(() => {
    const canvas = matrixCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.active = false;
    };
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const fontSize = 12;
    let columns = Math.floor(width / fontSize);
    let drops = Array(columns).fill(0);
    const chars = '01';

    const draw = () => {
      ctx.fillStyle = 'rgba(14, 27, 34, 0.15)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      const newColumns = Math.floor(width / fontSize);
      if (newColumns !== columns) {
        columns = newColumns;
        drops = Array(columns).fill(0).map((_, i) => drops[i] || 0);
      }

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        let highlight = false;
        if (mouse.active) {
          const dist = Math.hypot(x - mouse.x, y - mouse.y);
          if (dist < 80) {
            highlight = true;
          }
        }

        if (highlight) {
          ctx.fillStyle = 'rgba(255, 200, 1, 0.9)';
        } else {
          ctx.fillStyle = 'rgba(217, 232, 226, 0.1)';
        }

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Isolated direct DOM updates for pricing (Feature 1)
  const updatePrices = () => {
    const currencyKey = currencyRef.current;
    const billingCycle = billingRef.current;

    const curr = PRICING_MATRIX.currencies[currencyKey];
    const rate = curr.rate;
    const tariff = curr.tariff;
    const symbol = curr.symbol;

    Object.keys(PRICING_MATRIX.tiers).forEach(tierKey => {
      const tier = PRICING_MATRIX.tiers[tierKey];
      let price = tier.baseMonthly * rate * tariff;

      if (billingCycle === 'annual') {
        price = price * (1 - PRICING_MATRIX.discount);
      }

      // Direct DOM update without triggering React component render
      if (priceRefs.current[tierKey]) {
        priceRefs.current[tierKey].textContent = `${symbol}${Math.round(price)}`;
      }
      if (periodRefs.current[tierKey]) {
        periodRefs.current[tierKey].textContent = billingCycle === 'annual' ? '/mo, billed annually' : '/mo';
      }
    });
  };

  const handleBillingChange = (e) => {
    billingRef.current = e.target.checked ? 'annual' : 'monthly';
    updatePrices();
  };

  const handleCurrencyChange = (e) => {
    currencyRef.current = e.target.value;
    updatePrices();
  };

  // Bento Card hover handlers
  const handleBentoHover = (index) => {
    activeIndexRef.current = index;
    bentoCardRefs.current.forEach((card, idx) => {
      if (card) {
        card.classList.toggle('active', idx === index);
      }
    });
  };

  const handleBentoMouseMove = (e, index) => {
    const card = bentoCardRefs.current[index];
    if (card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }
  };

  const handleAccordionClick = (index) => {
    setAccordionIndex(accordionIndex === index ? -1 : index);
    activeIndexRef.current = index;
  };

  return (
    <>
      {/* Initial Screen Loader Overlay */}
      <div className={`loader-overlay ${!loading ? 'fade-out' : ''}`} aria-hidden={!loading}>
        <div className="loader-logo">ARMORY</div>
        <div className="loader-bar-container">
          <div className="loader-bar"></div>
        </div>
      </div>

      {/* Floating Header */}
      <header className={scrolled ? 'scrolled' : ''}>
        <div className="container header-container">
          <a href="#" className="logo-link">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 2L18 2L14 11L20 11L8 22L10 13L4 13L6 2Z" />
            </svg>
            <span>armory</span>
          </a>
          <nav aria-label="Main Navigation">
            <ul className="nav-links">
              <li><a href="#features" className="nav-link">Features</a></li>
              <li><a href="#case-studies" className="nav-link">Case Studies</a></li>
              <li><a href="#telemetry" className="nav-link">Telemetry</a></li>
              <li><a href="#pricing" className="nav-link">Pricing</a></li>
              <li><a href="#faq" className="nav-link">FAQ</a></li>
            </ul>
          </nav>
          <div className="header-cta">
            <button className="cta-button" type="button">
              <span>Launch Platform</span>
              <svg className="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <button
            className="mobile-toggle"
            type="button"
            aria-label="Toggle Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="mobile-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <span className="drawer-logo">ARMORY</span>
          <button
            className="drawer-close"
            type="button"
            aria-label="Close Menu"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '24px', height: '24px', fill: 'currentColor' }}>
              <use href="/icons.svg#icon-x-mark"></use>
            </svg>
          </button>
        </div>
        <nav className="drawer-nav" aria-label="Mobile Navigation">
          <ul>
            <li><a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a></li>
            <li><a href="#case-studies" onClick={() => setMobileMenuOpen(false)}>Case Studies</a></li>
            <li><a href="#telemetry" onClick={() => setMobileMenuOpen(false)}>Telemetry</a></li>
            <li><a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a></li>
            <li><a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a></li>
          </ul>
        </nav>
      </div>

      <main>
        {/* Hero Section */}
        <section className="hero-section">
          {/* Background 3D Wave Canvas */}
          <div className="hero-canvas-background">
            <canvas ref={heroWaveCanvasRef} className="hero-wave-canvas"></canvas>
          </div>

          <div className="container">
            {/* Split Grid Layout */}
            <div className="hero-split-grid">
              {/* Left Area: Heading, Subheading & CTAs */}
              <div className="hero-left-content">
                <h1 className="hero-title">Power your<br />future with AI</h1>
                <p className="hero-description">
                  Deploy custom enterprise agents and automate complex workflows. Scale your intelligence with Armory today.
                </p>
                <div className="hero-ctas">
                  <button className="cta-build-workflow" type="button">
                    <span className="btn-icon">[::]</span>
                    <span>Build A Workflow</span>
                  </button>
                </div>
              </div>

              {/* Right Area: Pillars & Client Logos */}
              <div className="hero-right-content">
                <div className="hero-pillars-list">
                  <div className="hero-pillar-item">AI Strategy</div>
                  <div className="hero-pillar-item">Custom Agents</div>
                  <div className="hero-pillar-item">Process Automation</div>
                  <div className="hero-pillar-item">Data Intelligence</div>
                </div>

                <div className="hero-client-logos">
                  <div className="client-logo-item" title="Aetna">
                    <svg viewBox="0 0 100 24" className="client-logo-svg" fill="currentColor">
                      <path d="M12 5 C9 2, 5 5.5, 9.5 9.5 L12 12 L14.5 9.5 C19 5.5, 15 2, 12 5 Z" fill="#ffffff" />
                      <text x="22" y="17" fontSize="16" fontWeight="800" fontFamily="var(--font-sans)" fill="#ffffff" letterSpacing="-0.03em">aetna</text>
                    </svg>
                  </div>
                  <div className="client-logo-item" title="Cigna">
                    <svg viewBox="0 0 100 24" className="client-logo-svg" fill="currentColor">
                      <circle cx="10" cy="7" r="2.5" fill="#ffffff" />
                      <path d="M10 10.5 C7 10.5, 5 12.5, 5 15.5 L15 15.5 C15 12.5, 13 10.5, 10 10.5 Z" fill="#ffffff" />
                      <path d="M10 15.5 L10 21" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="22" y="17" fontSize="16" fontWeight="800" fontFamily="var(--font-sans)" fill="#ffffff" letterSpacing="-0.03em">cigna</text>
                    </svg>
                  </div>
                  <div className="client-logo-item" title="Anthem">
                    <svg viewBox="0 0 100 24" className="client-logo-svg" fill="currentColor">
                      <path d="M10 3 L3 19 L8 19 L10 14.5 L15 14.5 L17 19 L22 19 L15 3 Z M12.5 7.5 L14 11.5 L11 11.5 Z" fill="#ffffff" />
                      <text x="26" y="17" fontSize="16" fontWeight="800" fontFamily="var(--font-sans)" fill="#ffffff" letterSpacing="-0.03em">Anthem</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 001 Neural Engines (Bento Grid) */}
        <section id="features" className="bento-section">
          <div className="container">
            <div className="section-header">
              <span className="section-code">Neural Engines</span>
              <h2 className="section-title text-gradient">Architected for extreme scale</h2>
              <p className="section-subtitle">
                Deploy customized core engines optimized for low-latency task resolution and automated orchestration.
              </p>
            </div>

            {/* Desktop Bento Grid */}
            <div className="bento-grid">
              {FEATURES.map((feat, idx) => {
                let cardClass = "bento-card";
                if (idx === 0) cardClass += " bento-card-large-1";
                else if (idx === 1) cardClass += " bento-card-small-1";
                else if (idx === 2) cardClass += " bento-card-small-2";
                else if (idx === 3) cardClass += " bento-card-large-2";

                const isLarge = idx === 0 || idx === 3;

                return (
                  <div
                    key={feat.id}
                    ref={el => bentoCardRefs.current[idx] = el}
                    className={`${cardClass} ${idx === 0 ? 'active' : ''}`}
                    onMouseEnter={() => handleBentoHover(idx)}
                    onMouseMove={(e) => handleBentoMouseMove(e, idx)}
                  >
                    {isLarge ? (
                      <>
                        <div className="bento-card-info">
                          <div className="bento-card-header">
                            <div className="bento-icon-box">
                              <svg className="bento-icon" viewBox="0 0 24 24" aria-hidden="true">
                                <use href={`/icons.svg#${feat.icon}`}></use>
                              </svg>
                            </div>
                            <span className="bento-code">{feat.code}</span>
                          </div>
                          <div className="bento-card-content">
                            <h3 className="bento-title">{feat.title}</h3>
                            <p className="bento-desc">{feat.desc}</p>
                          </div>
                          <div className="bento-card-footer">
                            {feat.tags.map((tag, tIdx) => (
                              <span key={tIdx} className="bento-tag">{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div className="bento-card-visual">
                          {idx === 0 ? <SecureGuardrailsVisual /> : <DataMiningVisual />}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bento-card-visual-small">
                          {idx === 1 ? <AgentBuildVisual /> : <CloudScaleVisual />}
                        </div>
                        <div className="bento-card-info-small">
                          <div className="bento-card-header">
                            <div className="bento-icon-box">
                              <svg className="bento-icon" viewBox="0 0 24 24" aria-hidden="true">
                                <use href={`/icons.svg#${feat.icon}`}></use>
                              </svg>
                            </div>
                            <span className="bento-code">{feat.code}</span>
                          </div>
                          <div className="bento-card-content">
                            <h3 className="bento-title">{feat.title}</h3>
                            <p className="bento-desc">{feat.desc}</p>
                          </div>
                          <div className="bento-card-footer">
                            {feat.tags.map((tag, tIdx) => (
                              <span key={tIdx} className="bento-tag">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Accordion */}
            <div className="mobile-accordion">
              {FEATURES.map((feat, idx) => (
                <div
                  key={feat.id}
                  className={`accordion-item ${accordionIndex === idx ? 'active' : ''}`}
                >
                  <button
                    className="accordion-header"
                    type="button"
                    onClick={() => handleAccordionClick(idx)}
                    aria-expanded={accordionIndex === idx}
                  >
                    <div className="accordion-header-left">
                      <svg className="bento-icon" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }} aria-hidden="true">
                        <use href={`/icons.svg#${feat.icon}`}></use>
                      </svg>
                      <h3>{feat.title}</h3>
                    </div>
                    <svg className="accordion-arrow" viewBox="0 0 24 24" aria-hidden="true">
                      <use href="/icons.svg#icon-chevron-down"></use>
                    </svg>
                  </button>
                  <div className="accordion-collapse">
                    <div className="accordion-content">
                      <div className="accordion-body">
                        <p>{feat.desc}</p>
                        <div className="bento-card-footer" style={{ marginTop: '12px' }}>
                          {feat.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="bento-tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 001 Statistics & Video Showcase */}
        <section id="statistics" className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">12&nbsp;ms</div>
                <div className="stat-label">Average Latency</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">10x</div>
                <div className="stat-label">Pipeline Speedup</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">99.99%</div>
                <div className="stat-label">System Uptime</div>
              </div>
            </div>

            <div className="video-container-wrapper">
              <canvas 
                ref={statsWaveRef} 
                className={`stats-wave-canvas ${isVideoActive ? 'hidden' : ''}`}
              ></canvas>
              <div 
                className={`video-placeholder ${isVideoActive ? 'hidden' : ''}`} 
                onClick={() => setIsVideoActive(true)}
                onMouseEnter={() => { videoHoverRef.current = true; }}
                onMouseLeave={() => { videoHoverRef.current = false; }}
              >
                <div className="video-bg-wave"></div>
                <div className="play-button">
                  <svg className="play-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="video-title">EXPLORE THE ARCHITECTURE</div>
              </div>
              {isVideoActive && (
                <div className="video-player-wrapper">
                  <video
                    src="/demo.mp4"
                    className="architecture-video"
                    controls
                    autoPlay
                  />
                  <button 
                    className="close-video-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsVideoActive(false);
                    }}
                    aria-label="Close video"
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 002 Case Studies Section */}
        <section id="case-studies" className="case-studies-section">
          <div className="container">
            <div className="section-header">
              <span className="section-code">Case Studies</span>
              <h2 className="section-title text-gradient">Proven at enterprise scale</h2>
              <p className="section-subtitle">
                Explore how leading healthcare networks deploy Armory to secure and accelerate data processing.
              </p>
            </div>

            <div className="case-studies-layout">
              {/* Left Side Graphic Swap */}
              <div className="case-graphic-panel">
                <div className={`graphic-box ${activeCaseStudy === 0 ? 'visible' : ''}`}>
                  <div className="abstract-graphic claim-graphic">
                    <div className="node node-1"></div>
                    <div className="node node-2"></div>
                    <div className="node node-3"></div>
                    <svg className="connector-line" viewBox="0 0 200 100">
                      <path d="M20,50 Q100,20 180,50" fill="none" stroke="var(--color-nocturnal-expedition)" strokeWidth="2" strokeDasharray="5,5" />
                      <circle r="4" fill="var(--color-mystic-mint)">
                        <animateMotion dur="3s" repeatCount="indefinite" path="M20,50 Q100,20 180,50" />
                      </circle>
                    </svg>
                    <span className="graphic-label">CLAIM STREAM INGESTION</span>
                  </div>
                </div>
                <div className={`graphic-box ${activeCaseStudy === 1 ? 'visible' : ''}`}>
                  <div className="abstract-graphic scheduler-graphic">
                    <div className="bar bar-1"></div>
                    <div className="bar bar-2"></div>
                    <div className="bar bar-3"></div>
                    <div className="bar bar-4"></div>
                    <span className="graphic-label">TASK CAPACITY LOAD</span>
                  </div>
                </div>
                <div className={`graphic-box ${activeCaseStudy === 2 ? 'visible' : ''}`}>
                  <div className="abstract-graphic guard-graphic">
                    <div className="shield-circle"></div>
                    <div className="scrub-line"></div>
                    <span className="graphic-label">REAL-TIME EDGE SANITIZER</span>
                  </div>
                </div>
              </div>

              {/* Right Side Hover List */}
              <div className="case-list-panel">
                {CASE_STUDIES.map((study, idx) => (
                  <div
                    key={study.id}
                    className={`case-item ${activeCaseStudy === idx ? 'active' : ''}`}
                    onMouseEnter={() => setActiveCaseStudy(idx)}
                  >
                    <div className="case-item-header">
                      <span className="case-client">{study.client}</span>
                      <span className="case-metric accent-text">{study.metric}</span>
                    </div>
                    <h3 className="case-title">{study.title}</h3>
                    <p className="case-desc">{study.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 003 Visual Flow Canvas */}
        <section className="flow-canvas-section">
          <div className="container">
            <div className="section-header">
              <span className="section-code">Vector Field</span>
              <h2 className="section-title text-gradient">Elastic execution topography</h2>
              <p className="section-subtitle">
                Deform the wireframe mesh below with your cursor to test coordinates displacement.
              </p>
            </div>

            <div className="sphere-canvas-container">
              <canvas ref={canvasSphereRef} className="sphere-canvas"></canvas>
            </div>

            <div className="pillars-grid">
              <div className="pillar-card">
                <span className="pillar-num">01</span>
                <h3 className="pillar-title">Infinite Canvas</h3>
                <p className="pillar-desc">Visual execution layout to construct complex agent task pathways.</p>
              </div>
              <div className="pillar-card">
                <span className="pillar-num">02</span>
                <h3 className="pillar-title">Autonomous Exec</h3>
                <p className="pillar-desc">Independent node evaluations with auto-failover cluster triggers.</p>
              </div>
              <div className="pillar-card">
                <span className="pillar-num">03</span>
                <h3 className="pillar-title">Context Handoffs</h3>
                <p className="pillar-desc">Transactional message passing keeping execution states intact.</p>
              </div>
              <div className="pillar-card">
                <span className="pillar-num">04</span>
                <h3 className="pillar-title">Trace Logs</h3>
                <p className="pillar-desc">Sub-millisecond audits mapping execution paths globally.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 004 Telemetry Dashboard */}
        <section id="telemetry" className="telemetry-section">
          <div className="container">
            <div className="section-header">
              <span className="section-code">Telemetry</span>
              <h2 className="section-title text-gradient">Real-time telemetry stream</h2>
              <p className="section-subtitle">
                Observe operational statistics mapping system load, latency metrics, and API tokens.
              </p>
            </div>

            <div className="telemetry-grid">
              {/* Load Tracker Widget */}
              <div className="telemetry-card">
                <h3 className="telemetry-card-title">Compute Cluster Load</h3>
                <div className="load-tracker-visual">
                  <div className="load-ring-wrapper">
                    <svg className="load-ring-svg" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" className="load-ring-bg" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        className="load-ring-fg" 
                        strokeDasharray="251.2" 
                        strokeDashoffset={251.2 - (251.2 * computeLoad) / 100}
                      />
                    </svg>
                    <span className="load-val">{computeLoad}%</span>
                  </div>
                  <div className="load-details">
                    <div className="load-stat"><span className="label">Nodes Active:</span> <span className="val accent-text">{activeNodes} / 32</span></div>
                    <div className="load-stat"><span className="label">Core Temp:</span> <span className="val accent-text">{coreTemp}°C</span></div>
                  </div>
                </div>
              </div>

              {/* SLA Response Bar Chart */}
              <div className="telemetry-card">
                <div className="card-header-flex">
                  <h3 className="telemetry-card-title">SLA Margin Tracker</h3>
                  <span className="slider-val accent-text">{slaSlaSlider}%</span>
                </div>
                <div className="sla-chart-container">
                  <div className="sla-grid-lines">
                    <div className="sla-grid-line"></div>
                    <div className="sla-grid-line"></div>
                    <div className="sla-grid-line"></div>
                    <div className="sla-grid-line"></div>
                  </div>
                  <div className="sla-bars-wrapper">
                    {[...slaValues, slaSlaSlider].map((val, idx) => (
                      <div key={idx} className="sla-bar-col">
                        <div className="sla-bar-value-wrapper">
                          <span className="sla-bar-tooltip">{val}%</span>
                          <div className="sla-bar-value" style={{ height: `${val}%` }}></div>
                        </div>
                        <span className="sla-bar-label">D{idx+1}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="slider-controls">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={slaSlaSlider}
                    onChange={(e) => setSlaSlider(parseInt(e.target.value))}
                    className="telemetry-slider"
                    aria-label="SLA margin selector"
                  />
                </div>
              </div>

              {/* Token Usage Widget */}
              <div className="telemetry-card">
                <h3 className="telemetry-card-title">Token Distribution</h3>
                <div className="token-usage-visual">
                  <div className="donut-chart-wrapper">
                    <svg className="token-pie-svg" viewBox="0 0 100 100">
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="transparent" 
                        stroke="var(--color-nocturnal-expedition)" 
                        strokeWidth="15" 
                        className={`donut-segment segment-analysis ${hoveredTokenSegment === 'analysis' ? 'active' : ''}`}
                        onMouseEnter={() => setHoveredTokenSegment('analysis')}
                        onMouseLeave={() => setHoveredTokenSegment(null)}
                        style={{ '--segment-color': 'var(--color-nocturnal-expedition)' }}
                      />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="transparent" 
                        stroke="var(--color-forsythia)" 
                        strokeWidth="15" 
                        strokeDasharray="251.2" 
                        strokeDashoffset={251.2 - (251.2 * discoveryPct) / 100}
                        className={`donut-segment segment-discovery ${hoveredTokenSegment === 'discovery' ? 'active' : ''}`}
                        onMouseEnter={() => setHoveredTokenSegment('discovery')}
                        onMouseLeave={() => setHoveredTokenSegment(null)}
                        style={{ '--segment-color': 'var(--color-forsythia)' }}
                      />
                    </svg>
                    <div className="donut-center-text">
                      {hoveredTokenSegment === 'discovery' ? (
                        <>
                          <span className="donut-val">{discoveryPct}%</span>
                          <span className="donut-lbl">Discovery</span>
                        </>
                      ) : hoveredTokenSegment === 'analysis' ? (
                        <>
                          <span className="donut-val">{100 - discoveryPct}%</span>
                          <span className="donut-lbl">Analysis</span>
                        </>
                      ) : (
                        <>
                          <span className="donut-val">100%</span>
                          <span className="donut-lbl">Active</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="token-legend">
                    <div 
                      className={`legend-item ${hoveredTokenSegment === 'discovery' ? 'active' : ''}`}
                      onMouseEnter={() => setHoveredTokenSegment('discovery')}
                      onMouseLeave={() => setHoveredTokenSegment(null)}
                    >
                      <span className="dot dot-yellow"></span> 
                      <span>Discovery ({discoveryPct}%)</span>
                    </div>
                    <div 
                      className={`legend-item ${hoveredTokenSegment === 'analysis' ? 'active' : ''}`}
                      onMouseEnter={() => setHoveredTokenSegment('analysis')}
                      onMouseLeave={() => setHoveredTokenSegment(null)}
                    >
                      <span className="dot dot-teal"></span> 
                      <span>Analysis ({100 - discoveryPct}%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Growth Vector Line Chart */}
              <div className="telemetry-card">
                <h3 className="telemetry-card-title">Growth Vector</h3>
                <div className="growth-vector-visual" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                  <svg className="growth-line-svg" viewBox="0 0 200 100">
                    <path 
                      ref={pathRef}
                      d="M 0 90 Q 40 80 80 50 T 160 20 T 200 10" 
                      fill="none" 
                      stroke="var(--color-forsythia)" 
                      strokeWidth="3" 
                      className="animated-path" 
                    />
                    <path d="M 0 90 Q 40 80 80 50 T 160 20 T 200 10 L 200 100 L 0 100 Z" fill="url(#growth-gradient)" opacity="0.1" />
                    
                    {hoverPoint && (
                      <>
                        <line 
                          x1={hoverPoint.x} 
                          y1={hoverPoint.y} 
                          x2={hoverPoint.x} 
                          y2="100" 
                          stroke="rgba(255, 200, 1, 0.3)" 
                          strokeWidth="1" 
                          strokeDasharray="2,2" 
                        />
                        <circle cx={hoverPoint.x} cy={hoverPoint.y} r="8" fill="var(--color-forsythia)" opacity="0.2" />
                        <circle cx={hoverPoint.x} cy={hoverPoint.y} r="4" fill="var(--color-forsythia)" />
                      </>
                    )}
                    
                    {!hoverPoint && (
                      <circle cx="200" cy="10" r="4" fill="var(--color-forsythia)" className="growth-pulse-dot" />
                    )}
                    
                    <defs>
                      <linearGradient id="growth-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-forsythia)" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {hoverPoint && (
                    <div 
                      className="growth-tooltip" 
                      style={{ 
                        left: `${(hoverPoint.x / 200) * 100}%`,
                        top: `${(hoverPoint.y / 100) * 100}%` 
                      }}
                    >
                      +{Math.round(10 + ((90 - hoverPoint.y) / 80) * 235)}%
                    </div>
                  )}
                  
                  <div className="growth-labels">
                    <span className="accent-text">
                      {hoverPoint 
                        ? `+${Math.round(10 + ((90 - hoverPoint.y) / 80) * 235)}% Growth` 
                        : '+245% Year-to-date'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 005 Our Approach Section */}
        <section className="approach-section">
          <div className="container">
            <div className="section-header">
              <span className="section-code">Our Approach</span>
              <h2 className="section-title text-gradient">Safety-first coordination</h2>
              <p className="section-subtitle">
                Aligning state validations and privacy locks at the lowest levels of task orchestration.
              </p>
            </div>

            <div className="approach-layout">
              {/* Matrix Digital Rain Eye */}
              <div className="approach-left">
                <canvas ref={matrixCanvasRef} className="matrix-canvas"></canvas>
              </div>

              {/* Approach Cards */}
              <div className="approach-right">
                <div className="approach-card">
                  <h3 className="approach-card-title">Zero-knowledge Ingestion</h3>
                  <p className="approach-card-desc">
                    Scrub incoming text nodes before dispatching to pipeline schedulers. No PII leaks into network memory weights.
                  </p>
                </div>
                <div className="approach-card">
                  <h3 className="approach-card-title">State Locking Handoffs</h3>
                  <p className="approach-card-desc">
                    Strict transaction synchronization ensures that intermediate failure states rollback completely without database corruption.
                  </p>
                </div>
                <div className="approach-card">
                  <h3 className="approach-card-title">Dynamic Failover Layers</h3>
                  <p className="approach-card-desc">
                    Re-routes scheduler load transparently across secondary compute clusters if node ping latency exceeds 45ms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 006 Autonomy Tabs Section */}
        <section className="autonomy-tabs-section">
          <div className="container">
            <div className="section-header">
              <span className="section-code">Autonomy Scorecard</span>
              <h2 className="section-title text-gradient">Execution lifecycle control</h2>
              <p className="section-subtitle">
                Toggle through execution phases to audit schema scans, training steps, and deployments.
              </p>
            </div>

            {/* Tab Triggers */}
            <div className="autonomy-tabs-wrapper">
              {Object.keys(AUTONOMY_TABS).map((tab) => (
                <button
                  key={tab}
                  className={`autonomy-tab-btn ${activeAutonomyTab === tab ? 'active' : ''}`}
                  type="button"
                  onClick={() => setActiveAutonomyTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Active Scorecard Panel */}
            <div className="autonomy-panel-card">
              <div className="panel-left">
                <h3 className="panel-title">{AUTONOMY_TABS[activeAutonomyTab].title}</h3>
                <p className="panel-subtitle">{AUTONOMY_TABS[activeAutonomyTab].subtitle}</p>
                <p className="panel-details">{AUTONOMY_TABS[activeAutonomyTab].details}</p>
              </div>
              <div className="panel-right">
                <div className="panel-metric-box">
                  <span className="metric-num">{AUTONOMY_TABS[activeAutonomyTab].metric}</span>
                  <div className="panel-progress-bar-container">
                    <div className="panel-progress-bar" style={{ width: `${AUTONOMY_TABS[activeAutonomyTab].percent}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 007 Integrations Logo Grid */}
        <section className="integrations-section">
          <div className="container">
            <div className="section-header">
              <span className="section-code">Integrations</span>
              <h2 className="section-title text-gradient">Seamless cloud cohesion</h2>
              <p className="section-subtitle">
                Connects out-of-the-box with your existing databases, message brokers, and telemetry stacks.
              </p>
            </div>

            <div className="logo-grid-container">
              {['Amazon AWS', 'Google Cloud', 'Microsoft Azure', 'GitHub', 'Slack Link', 'Snowflake', 'Datadog', 'Kafka'].map((brand, idx) => (
                <div key={idx} className="brand-logo-card">
                  <span className="brand-logo-name">{brand}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Matrix */}
        <section id="pricing" className="pricing-section">
          <div className="container">
            <div className="section-header">
              <span className="section-code">Pricing Matrix</span>
              <h2 className="section-title text-gradient">Flexible plans for any workload</h2>
              <p className="section-subtitle">
                Scale your consumption dynamically. Change currencies and billing intervals with zero pipeline interruptions.
              </p>
            </div>

            <div className="pricing-controls">
              <div className="billing-switcher">
                <input
                  type="checkbox"
                  id="billing-toggle"
                  className="billing-checkbox"
                  onChange={handleBillingChange}
                />
                <div className="switcher-bg"></div>
                <label htmlFor="billing-toggle" className="switcher-label monthly">Monthly</label>
                <label htmlFor="billing-toggle" className="switcher-label annual">
                  Annual
                  <span className="discount-badge">Save 20%</span>
                </label>
              </div>

              <div className="currency-selector-wrapper">
                <span className="currency-label">Select Currency:</span>
                <select
                  className="currency-select"
                  onChange={handleCurrencyChange}
                  defaultValue="USD"
                  aria-label="Select Currency"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>

            <div className="pricing-grid">
              <div className="pricing-card">
                <div className="pricing-card-header">
                  <h3 className="tier-name">Starter</h3>
                  <p className="tier-desc">For small automated tasks</p>
                </div>
                <div className="pricing-card-price">
                  <span className="price-val" ref={el => priceRefs.current.starter = el}>$29</span>
                  <span className="price-period" ref={el => periodRefs.current.starter = el}>/mo</span>
                </div>
                <ul className="pricing-features-list">
                  <li className="pricing-feature-item">
                    <svg className="feature-check-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span>Up to 10 active pipelines</span>
                  </li>
                  <li className="pricing-feature-item">
                    <svg className="feature-check-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span>50,000 agent tokens/mo</span>
                  </li>
                  <li className="pricing-feature-item">
                    <svg className="feature-check-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span>Shared secure guardrails</span>
                  </li>
                </ul>
                <button className="btn-pricing" type="button">Deploy Starter</button>
              </div>

              <div className="pricing-card pricing-card-featured">
                <div className="featured-badge">Most Popular</div>
                <div className="pricing-card-header">
                  <h3 className="tier-name">Pro</h3>
                  <p className="tier-desc">For production-ready scale</p>
                </div>
                <div className="pricing-card-price">
                  <span className="price-val" ref={el => priceRefs.current.pro = el}>$79</span>
                  <span className="price-period" ref={el => periodRefs.current.pro = el}>/mo</span>
                </div>
                <ul className="pricing-features-list">
                  <li className="pricing-feature-item">
                    <svg className="feature-check-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span>Unlimited active pipelines</span>
                  </li>
                  <li className="pricing-feature-item">
                    <svg className="feature-check-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span>500,000 agent tokens/mo</span>
                  </li>
                  <li className="pricing-feature-item">
                    <svg className="feature-check-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span>Dedicated secure guardrails</span>
                  </li>
                  <li className="pricing-feature-item">
                    <svg className="feature-check-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span>24/7 priority support</span>
                  </li>
                </ul>
                <button className="btn-pricing" type="button">Deploy Pro</button>
              </div>

              <div className="pricing-card">
                <div className="pricing-card-header">
                  <h3 className="tier-name">Enterprise</h3>
                  <p className="tier-desc">For mission-critical operations</p>
                </div>
                <div className="pricing-card-price">
                  <span className="price-val" ref={el => priceRefs.current.enterprise = el}>$249</span>
                  <span className="price-period" ref={el => periodRefs.current.enterprise = el}>/mo</span>
                </div>
                <ul className="pricing-features-list">
                  <li className="pricing-feature-item">
                    <svg className="feature-check-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span>Custom isolated compute</span>
                  </li>
                  <li className="pricing-feature-item">
                    <svg className="feature-check-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span>Unlimited agent tokens</span>
                  </li>
                  <li className="pricing-feature-item">
                    <svg className="feature-check-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span>Custom compliance modules</span>
                  </li>
                  <li className="pricing-feature-item">
                    <svg className="feature-check-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span>15-min SLA support response</span>
                  </li>
                </ul>
                <button className="btn-pricing" type="button">Deploy Enterprise</button>
              </div>
            </div>
          </div>
        </section>

        {/* 008 Testimonials Section */}
        <section className="testimonials-section">
          <div className="container">
            <div className="section-header">
              <span className="section-code">Endorsements</span>
              <h2 className="section-title text-gradient">Vetted by engineering leads</h2>
              <p className="section-subtitle">
                Read what enterprise software architects say about the latency and reliability of Armory.
              </p>
            </div>

            <div className="testimonials-grid">
              <div className="testimonial-card">
                <p className="quote">
                  “Armory’s direct price updates and bento reflow context locks make it one of the most performance-focused websites we’ve ever audited.”
                </p>
                <div className="author-box">
                  <div className="author-details">
                    <span className="name">Alex Cristache</span>
                    <span className="role">Senior Architect, Cigna</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <p className="quote">
                  “The edge-pii sanitizer saved us months of compliance audits. Our data pipelines are fully secured without manual configuration layers.”
                </p>
                <div className="author-box">
                  <div className="author-details">
                    <span className="name">Sarah Jenkins</span>
                    <span className="role">VP Engineering, Anthem</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 009 Insights Articles */}
        <section className="insights-section">
          <div className="container">
            <div className="section-header">
              <span className="section-code">Insights</span>
              <h2 className="section-title text-gradient">Latest architecture reports</h2>
              <p className="section-subtitle">
                Deep dives into low-latency task scheduling, edge sanitization, and state synchronization.
              </p>
            </div>

            <div className="insights-grid">
              {/* Featured Card */}
              <div className="insight-card featured-insight">
                <span className="date">June 26, 2026</span>
                <h3 className="insight-title">Designing state-isolated currency converters for zero component reflows</h3>
                <p className="insight-desc">
                  Learn how using useRef and direct DOM textNode manipulations achieves paint flashing isolation in modern React applications.
                </p>
                <a href="#" className="insight-link">Read Report</a>
              </div>

              {/* Smaller Stack */}
              <div className="insight-stack">
                <div className="insight-card">
                  <span className="date">June 20, 2026</span>
                  <h3 className="insight-title">Edge sanitizer protocols: Scrubbing telemetry streams</h3>
                  <a href="#" className="insight-link">Read Report</a>
                </div>
                <div className="insight-card">
                  <span className="date">June 15, 2026</span>
                  <h3 className="insight-title">Trigonometric canvas wave animations in dark interfaces</h3>
                  <a href="#" className="insight-link">Read Report</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 010 FAQ Accordion Section */}
        <section id="faq" className="faq-section">
          <div className="container">
            <div className="section-header">
              <span className="section-code">FAQ</span>
              <h2 className="section-title text-gradient">Frequently asked questions</h2>
              <p className="section-subtitle">
                Quick answers regarding security compliance, regional tariff discounts, and performance isolation.
              </p>
            </div>

            <div className="faq-categories-tabs">
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`faq-cat-btn ${activeFaqCategory === cat ? 'active' : ''}`}
                  type="button"
                  onClick={() => {
                    setActiveFaqCategory(cat);
                    setFaqOpenIndex(0);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="faq-accordion-list">
              {FAQ_ITEMS[activeFaqCategory].map((item, idx) => (
                <div
                  key={idx}
                  className={`faq-accordion-item ${faqOpenIndex === idx ? 'active' : ''}`}
                >
                  <button
                    className="faq-accordion-header"
                    type="button"
                    onClick={() => setFaqOpenIndex(faqOpenIndex === idx ? -1 : idx)}
                    aria-expanded={faqOpenIndex === idx}
                  >
                    <span>{item.q}</span>
                    <svg className="accordion-arrow" viewBox="0 0 24 24" aria-hidden="true">
                      <use href="/icons.svg#icon-chevron-down"></use>
                    </svg>
                  </button>
                  <div className="accordion-collapse">
                    <div className="accordion-content">
                      <div className="faq-accordion-body">
                        <p>{item.a}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 011 Newsletter Subscription */}
        <section className="newsletter-section">
          <div className="container">
            <div className="newsletter-card">
              <h2 className="newsletter-title text-gradient">Receive our design reports</h2>
              <p className="newsletter-desc">
                Subscribe to receive technical bulletins covering react-compiler configurations and layout performance.
              </p>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()} aria-label="Newsletter Form">
                <input
                  type="email"
                  name="subscriber-email"
                  placeholder="Enter your work email"
                  required
                  spellCheck={false}
                  autoComplete="email"
                  aria-label="Work Email Address"
                />
                <button type="submit" className="btn-primary">Subscribe</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div className="container footer-container">
          <div className="footer-links-grid">
            <div className="footer-col">
              <span className="col-title">Platform</span>
              <a href="#features">Neural Engines</a>
              <a href="#telemetry">Telemetry</a>
              <a href="#pricing">Pricing Plans</a>
            </div>
            <div className="footer-col">
              <span className="col-title">Security</span>
              <a href="#faq">Compliance</a>
              <a href="#faq">Zero Retention</a>
              <a href="#faq">PII Scrubbing</a>
            </div>
            <div className="footer-col">
              <span className="col-title">Resources</span>
              <a href="#case-studies">Case Studies</a>
              <a href="#faq">General FAQ</a>
              <a href="#">Design tokens</a>
            </div>
          </div>
          <div className="footer-bottom-text">
            <span>© 2026 ARMORY INC. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
        <div className="footer-large-brand">
          <span className="brand-outline">ARMORY</span>
        </div>
      </footer>
    </>
  );
}

export default App;
