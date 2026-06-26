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

  // Kashflow Custom Refs
  const titleShifterRef = useRef(null);
  const nodeCountRef = useRef(null);
  const logPanelRef = useRef(null);
  const forecastCanvasRef = useRef(null);
  const runwayValRef = useRef(null);
  const costValRef = useRef(null);
  const aiAdviseRef = useRef(null);
  const sliderAllocationRef = useRef(50);
  const drawChartRef = useRef(null);

  // Loader timing sequence (Phase 1)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  // Spotlight grid coordinates tracking
  useEffect(() => {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    const handleMouseMove = (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      heroSection.style.setProperty('--hero-mouse-x', `${x}px`);
      heroSection.style.setProperty('--hero-mouse-y', `${y}px`);
    };
    heroSection.addEventListener('mousemove', handleMouseMove);
    return () => heroSection.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Headline dynamic text shifter
  useEffect(() => {
    const shifter = titleShifterRef.current;
    if (!shifter) return;
    const words = ["Intelligence.", "Workflows.", "Scale.", "Security."];
    let currentIndex = 0;
    const interval = setInterval(() => {
      shifter.classList.add('fade-out');
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % words.length;
        shifter.textContent = words[currentIndex];
        if (words[currentIndex] === "Intelligence.") {
          shifter.style.color = "var(--color-forsythia)";
        } else if (words[currentIndex] === "Workflows.") {
          shifter.style.color = "var(--color-mystic-mint)";
        } else if (words[currentIndex] === "Scale.") {
          shifter.style.color = "var(--color-deep-saffron)";
        } else if (words[currentIndex] === "Security.") {
          shifter.style.color = "#39e58c";
        }
        shifter.classList.remove('fade-out');
        shifter.classList.add('fade-in');
        setTimeout(() => {
          shifter.classList.remove('fade-in');
        }, 300);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Live node counter fluctuation
  useEffect(() => {
    const textNode = nodeCountRef.current;
    if (!textNode) return;
    let baseCount = 1482;
    const interval = setInterval(() => {
      const diff = Math.floor(Math.random() * 9) - 4;
      baseCount = Math.max(1400, Math.min(1600, baseCount + diff));
      textNode.textContent = `Active Pipeline nodes: ${baseCount.toLocaleString()}`;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Mini HUD log streams feed
  useEffect(() => {
    const logPanel = logPanelRef.current;
    if (!logPanel) return;
    const logs = [
      { text: "CORE-ENGINE >> initializing cluster nodes...", type: "info" },
      { text: "SEC-01 >> Guardrail active: edge PII scrub complete", type: "success" },
      { text: "AGT-02 >> Orchestrating task handoff: Node-14 -> Node-29", type: "info" },
      { text: "CLD-03 >> Scaling Scheduler load: +12% capacity", type: "info" },
      { text: "DTA-04 >> Vector index synced: 1,482 telemetry docs", type: "success" },
      { text: "SYS >> Latency nominal at 12ms", type: "success" },
      { text: "SYS-WARN >> Buffer capacity at 64% - optimizing paths", type: "warning" },
      { text: "CORE-ENGINE >> Recalibrating reinforcement policy weights", type: "info" },
      { text: "SEC-01 >> Telemetry encryption key rotated successfully", type: "success" },
      { text: "CLD-03 >> Node-1482 online: 150ms cold start time", type: "success" }
    ];
    const interval = setInterval(() => {
      const log = logs[Math.floor(Math.random() * logs.length)];
      const line = document.createElement('div');
      line.className = 'hud-log-line';
      const tag = document.createElement('span');
      tag.className = 'hud-log-tag';
      tag.textContent = `[${new Date().toLocaleTimeString()}]`;
      const content = document.createElement('span');
      content.textContent = ` ${log.text}`;
      if (log.type === 'success') content.className = 'hud-log-success';
      if (log.type === 'warning') content.className = 'hud-log-warning';
      line.appendChild(tag);
      line.appendChild(content);
      logPanel.appendChild(line);
      logPanel.scrollTop = logPanel.scrollHeight;
      while (logPanel.childNodes.length > 15) {
        logPanel.removeChild(logPanel.firstChild);
      }
    }, 1800);
    return () => clearInterval(interval);
  }, []);

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

  // Statistics Wave Animation (Phase 4)
  useEffect(() => {
    const canvas = statsWaveRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

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

      for (let w = 0; w < 3; w++) {
        ctx.beginPath();
        const amplitude = 30 + w * 10;
        const frequency = 0.003 - w * 0.0005;
        const speed = 0.02 + w * 0.01;
        
        ctx.strokeStyle = w === 0 
          ? 'rgba(217, 232, 226, 0.03)' 
          : w === 1 
          ? 'rgba(17, 76, 90, 0.08)' 
          : 'rgba(255, 200, 1, 0.03)';

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

  // Kashflow Forecast Chart Canvas Animation
  useEffect(() => {
    const canvas = forecastCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const drawChart = (allocation, mouseX = null) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw background grid lines
      ctx.strokeStyle = 'rgba(217, 232, 226, 0.035)';
      ctx.lineWidth = 1;
      const gridCols = 8;
      const gridRows = 5;
      for (let i = 0; i <= gridCols; i++) {
        const x = (w / gridCols) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h - 20);
        ctx.stroke();
      }
      for (let i = 0; i <= gridRows; i++) {
        const y = ((h - 20) / gridRows) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Y-Axis Labels
      ctx.fillStyle = 'rgba(241, 246, 244, 0.3)';
      ctx.font = '9px monospace';
      ctx.textAlign = 'right';
      const currencySymbol = currencyRef.current === 'EUR' ? '€' : currencyRef.current === 'INR' ? '₹' : '$';
      const multiplier = currencyRef.current === 'INR' ? 80 : currencyRef.current === 'EUR' ? 0.9 : 1.0;

      ctx.fillText(`${currencySymbol}${Math.round(800 * multiplier)}k`, w - 10, 25);
      ctx.fillText(`${currencySymbol}${Math.round(400 * multiplier)}k`, w - 10, (h - 20) / 2 + 5);
      ctx.fillText(`${currencySymbol}0`, w - 10, h - 25);

      // X-Axis Labels (Months)
      ctx.textAlign = 'center';
      ctx.fillText('M-6', 40, h - 5);
      ctx.fillText('M0', w / 3, h - 5);
      ctx.fillText('M12', (w / 3) * 2, h - 5);
      ctx.fillText('M24', w - 50, h - 5);

      // Generate Curve points
      const points = [];
      const numPoints = 100;
      const midX = w / 3;
      const factor = (allocation - 50) / 50; // -1 to +1

      for (let i = 0; i <= numPoints; i++) {
        const pct = i / numPoints;
        const x = pct * w;
        let y;

        if (x < midX) {
          y = (h - 20) * 0.5 + Math.sin(pct * Math.PI * 2) * 15;
        } else {
          const projPct = (x - midX) / (w - midX);
          const baseline = (h - 20) * 0.5 + Math.sin((midX / w) * Math.PI * 2) * 15;
          y = baseline + projPct * 50 * -factor + Math.pow(projPct, 2) * 60 * -factor;
          y = Math.max(15, Math.min(h - 25, y));
        }
        points.push({ x, y });
      }

      // Draw shaded area under historical path
      ctx.beginPath();
      ctx.moveTo(points[0].x, h - 20);
      for (let i = 0; i < points.length; i++) {
        if (points[i].x <= midX) {
          ctx.lineTo(points[i].x, points[i].y);
        }
      }
      ctx.lineTo(midX, h - 20);
      ctx.closePath();
      const histGrad = ctx.createLinearGradient(0, 0, 0, h);
      histGrad.addColorStop(0, 'rgba(217, 232, 226, 0.08)');
      histGrad.addColorStop(1, 'rgba(217, 232, 226, 0)');
      ctx.fillStyle = histGrad;
      ctx.fill();

      // Draw shaded area under projected path
      ctx.beginPath();
      ctx.moveTo(midX, h - 20);
      for (let i = 0; i < points.length; i++) {
        if (points[i].x >= midX) {
          ctx.lineTo(points[i].x, points[i].y);
        }
      }
      ctx.lineTo(w, h - 20);
      ctx.closePath();
      const projGrad = ctx.createLinearGradient(0, 0, 0, h);
      if (factor >= 0) {
        projGrad.addColorStop(0, 'rgba(255, 200, 1, 0.08)');
      } else {
        projGrad.addColorStop(0, 'rgba(255, 153, 50, 0.08)');
      }
      projGrad.addColorStop(1, 'rgba(255, 200, 1, 0)');
      ctx.fillStyle = projGrad;
      ctx.fill();

      // Draw Historical Line (solid mint)
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length; i++) {
        if (points[i].x <= midX) {
          ctx.lineTo(points[i].x, points[i].y);
        }
      }
      ctx.strokeStyle = '#D9E8E2';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw Projected Line (dashed gold/saffron)
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(midX, points[Math.floor(numPoints * (midX / w))].y);
      for (let i = 0; i < points.length; i++) {
        if (points[i].x >= midX) {
          ctx.lineTo(points[i].x, points[i].y);
        }
      }
      ctx.strokeStyle = factor >= 0 ? '#FFC801' : '#FF9932';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.setLineDash([]); // Reset

      // Draw transition node marker at M0
      const m0Pt = points[Math.floor(numPoints * (midX / w))];
      ctx.beginPath();
      ctx.arc(m0Pt.x, m0Pt.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#172B36';
      ctx.fill();
      ctx.strokeStyle = '#FFC801';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Active pulse halo around marker
      ctx.beginPath();
      ctx.arc(m0Pt.x, m0Pt.y, 10, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255, 200, 1, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw vertical tracking cursor line if mouse is over canvas
      if (mouseX !== null && mouseX >= 0 && mouseX <= w) {
        let closestPt = points[0];
        let minDist = Infinity;
        points.forEach(pt => {
          const dist = Math.abs(pt.x - mouseX);
          if (dist < minDist) {
            minDist = dist;
            closestPt = pt;
          }
        });

        ctx.beginPath();
        ctx.moveTo(closestPt.x, 0);
        ctx.lineTo(closestPt.x, h - 20);
        ctx.strokeStyle = 'rgba(217, 232, 226, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(closestPt.x, closestPt.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = closestPt.x < midX ? '#D9E8E2' : '#FFC801';
        ctx.fill();

        const balanceVal = Math.round((1 - closestPt.y / (h - 20)) * 800 * multiplier);
        const isHistorical = closestPt.x < midX;
        const monthNum = Math.round((closestPt.x / w) * 30 - 6);

        ctx.fillStyle = 'rgba(14, 27, 34, 0.9)';
        ctx.strokeStyle = 'rgba(217, 232, 226, 0.12)';
        ctx.lineWidth = 1;

        const boxW = 100;
        const boxH = 34;
        let boxX = closestPt.x - boxW / 2;
        let boxY = closestPt.y - 45;

        boxX = Math.max(10, Math.min(w - boxW - 10, boxX));
        boxY = Math.max(10, boxY);

        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#F1F6F4';
        ctx.font = '9px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`Month: M${monthNum >= 0 ? '+' + monthNum : monthNum}`, boxX + 8, boxY + 12);
        ctx.fillStyle = isHistorical ? '#D9E8E2' : '#FFC801';
        ctx.fillText(`Cash: ${currencySymbol}${balanceVal}k`, boxX + 8, boxY + 24);
      }
    };

    drawChartRef.current = drawChart;

    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = 220;
      drawChart(sliderAllocationRef.current);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      drawChart(sliderAllocationRef.current, mouseX);
    };

    const handleMouseLeave = () => {
      drawChart(sliderAllocationRef.current);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value);
    sliderAllocationRef.current = val;
    const currencyKey = currencyRef.current;
    const rate = PRICING_MATRIX.currencies[currencyKey].rate;
    const symbol = PRICING_MATRIX.currencies[currencyKey].symbol;
    const projectedRunway = Math.round((val - 10) * 0.45 + 6);
    if (runwayValRef.current) {
      runwayValRef.current.textContent = `${projectedRunway} Months`;
    }
    const baseCost = 42.5 - (val - 10) * 0.428;
    const localCost = Math.round(baseCost * rate * 10) / 10;
    if (costValRef.current) {
      costValRef.current.textContent = `${symbol}${localCost}k/mo`;
    }
    if (aiAdviseRef.current) {
      if (val < 35) {
        aiAdviseRef.current.textContent = `SYSTEM ALERT >> High resource footprint detected. Runway compromised. Consider optimizing nodes to reduce cost overhead.`;
        aiAdviseRef.current.style.color = "var(--color-deep-saffron)";
      } else if (val > 65) {
        aiAdviseRef.current.textContent = `AI ADVISOR >> Maximum efficiency configuration active. Telemetry bandwidth optimal. Projected annual savings: ${symbol}${Math.round(180 * rate)}k.`;
        aiAdviseRef.current.style.color = "#39e58c";
      } else {
        aiAdviseRef.current.textContent = `AI ADVISOR >> Performance balanced. Allocation grid running at ${val}% capacity. Telemetry flows nominal.`;
        aiAdviseRef.current.style.color = "var(--color-mystic-mint)";
      }
    }
    if (drawChartRef.current) {
      drawChartRef.current(val);
    }
  };

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

    // Update the cost tile value in the dashboard
    const val = sliderAllocationRef.current;
    const baseCost = 42.5 - (val - 10) * 0.428;
    const localCost = Math.round(baseCost * rate * 10) / 10;
    if (costValRef.current) {
      costValRef.current.textContent = `${symbol}${localCost}k/mo`;
    }
  };

  const handleBillingChange = (e) => {
    billingRef.current = e.target.checked ? 'annual' : 'monthly';
    updatePrices();
    if (drawChartRef.current) {
      drawChartRef.current(sliderAllocationRef.current);
    }
  };

  const handleCurrencyChange = (e) => {
    currencyRef.current = e.target.value;
    updatePrices();
    if (drawChartRef.current) {
      drawChartRef.current(sliderAllocationRef.current);
    }
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
            <svg className="logo-icon" viewBox="0 0 24 24" aria-hidden="true">
              <use href="/icons.svg#icon-cloud-scale"></use>
            </svg>
            <span>ARMORY</span>
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
            <svg className="mobile-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
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
          {/* Spotlight Background Grid Layer */}
          <div className="console-backlight" aria-hidden="true"></div>
          
          <div className="container hero-content-center">
            {/* Live Ticker Status Badge */}
            <div className="hero-badge">
              <span className="badge-pulse"></span>
              <span ref={nodeCountRef} className="badge-text">Active Pipeline nodes: 1,482</span>
            </div>
            
            {/* Animated Text-Shifter Title */}
            <h1 className="hero-title text-gradient">
              Automate Data.<br />
              Orchestrate <span ref={titleShifterRef} className="title-shifted-word">Intelligence.</span>
            </h1>
            
            <p className="hero-description">
              Deploy autonomous AI workflows, scale-free database routing, and hardware-accelerated agent systems with zero component reflows.
            </p>
            
            <div className="hero-ctas">
              <button className="btn-primary-split" type="button">
                <span className="btn-icon-box">
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <span className="btn-text">Build a Workflow</span>
              </button>
              <a href="#pricing" className="btn-secondary-link">
                <span>View Pricing Matrix</span>
              </a>
            </div>

            {/* Glassmorphic Kashflow Command Console */}
            <div className="command-center-console">
              {/* Console Control Header */}
              <div className="console-header">
                <div className="console-header-left">
                  <div className="console-status-pill">
                    <span className="console-status-dot"></span>
                    <span>SYSTEM_OK // v1.0.4</span>
                  </div>
                  <span className="accent-text" style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>LIVE_FEED</span>
                </div>
                
                {/* pricing switches nested here for isolated DOM modifications */}
                <div className="console-header-right">
                  <div className="currency-selector-box" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>CURRENCY:</span>
                    <select 
                      onChange={handleCurrencyChange} 
                      className="currency-select"
                      style={{ 
                        background: 'rgba(8,17,22,0.6)', 
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: '4px',
                        color: 'var(--color-mystic-mint)',
                        fontSize: '0.7rem',
                        padding: '2px 8px',
                        fontFamily: 'var(--font-mono)',
                        cursor: 'pointer'
                      }}
                      aria-label="Select pricing currency"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                  
                  <div className="billing-toggle-box" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>ANNUAL DISCOUNT:</span>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        onChange={handleBillingChange} 
                        aria-label="Toggle annual billing discount"
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Console Main Dashboard */}
              <div className="console-grid">
                {/* Left Area: Canvas Chart */}
                <div className="console-chart-wrapper">
                  <div className="chart-header">
                    <span className="chart-title">CAPITAL RUNWAY FORECAST</span>
                    <div className="chart-legend">
                      <div className="legend-item">
                        <span className="legend-color-mint"></span>
                        <span>HISTORICAL</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color-gold"></span>
                        <span>PROJECTED</span>
                      </div>
                    </div>
                  </div>
                  
                  <canvas ref={forecastCanvasRef} className="console-chart-canvas" />
                  
                  <div className="console-slider-container">
                    <div className="slider-labels">
                      <span>HIGH BURN RATE</span>
                      <span>NOMINAL</span>
                      <span>MAX EFFICIENCY</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="90" 
                      defaultValue="50" 
                      onChange={handleSliderChange}
                      className="console-slider" 
                      aria-label="Engine Allocation Slider"
                    />
                  </div>
                </div>

                {/* Right Area: Metric Grid and Advisory Log */}
                <div className="console-side-panel">
                  {/* Grid Tiles */}
                  <div className="console-metrics-grid">
                    <div className="console-metric-tile">
                      <span className="metric-tile-label">Projected Runway</span>
                      <span ref={runwayValRef} className="metric-tile-value text-gradient">24 Months</span>
                      <span className="metric-tile-trend">▲ Runway Safe</span>
                    </div>
                    <div className="console-metric-tile">
                      <span className="metric-tile-label">Projected Cost</span>
                      <span ref={costValRef} className="metric-tile-value text-gradient">$18.5k/mo</span>
                      <span className="metric-tile-trend neutral">● Edge Optimised</span>
                    </div>
                  </div>

                  {/* AI Advisory Panel */}
                  <div className="console-ai-box">
                    <div className="ai-box-header">
                      <svg className="ai-box-icon" viewBox="0 0 24 24">
                        <use href="/icons.svg#icon-secure-guard"></use>
                      </svg>
                      <span>INTELLIGENT ADVISE //</span>
                    </div>
                     <div ref={aiAdviseRef} className="ai-box-text">
                      {"AI ADVISOR >> Performance balanced. Allocation grid running at 50% capacity. Telemetry flows nominal."}
                    </div>
                  </div>

                  {/* Micro Event trace logger */}
                  <div ref={logPanelRef} className="console-log-feed">
                    <div className="hud-log-line">
                      <span className="hud-log-tag">[SYSTEM]</span>
                      <span>Command center initialized...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seamless Infinite Client Logos Marquee */}
            <div className="hero-brands-marquee">
              <div className="marquee-track">
                {/* Set 1 */}
                <div className="brand-logo-item">
                  <svg className="brand-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span>AETNA</span>
                </div>
                <div className="brand-logo-item">
                  <svg className="brand-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2A10 10 0 0 0 2 12M12 4A8 8 0 0 1 20 12A8 8 0 0 1 12 20A8 8 0 0 1 4 12A8 8 0 0 1 12 4M12 6A6 6 0 0 0 6 12A6 6 0 0 0 12 18A6 6 0 0 0 18 12A6 6 0 0 0 12 6M12 8A4 4 0 0 1 16 12A4 4 0 0 1 12 16A4 4 0 0 1 8 12A4 4 0 0 1 12 8Z"/>
                  </svg>
                  <span>CIGNA</span>
                </div>
                <div className="brand-logo-item">
                  <svg className="brand-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  <span>ANTHEM</span>
                </div>
                {/* Duplicated for Marquee Loop */}
                <div className="brand-logo-item">
                  <svg className="brand-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span>AETNA</span>
                </div>
                <div className="brand-logo-item">
                  <svg className="brand-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2A10 10 0 0 0 2 12M12 4A8 8 0 0 1 20 12A8 8 0 0 1 12 20A8 8 0 0 1 4 12A8 8 0 0 1 12 4M12 6A6 6 0 0 0 6 12A6 6 0 0 0 12 18A6 6 0 0 0 18 12A6 6 0 0 0 12 6M12 8A4 4 0 0 1 16 12A4 4 0 0 1 12 16A4 4 0 0 1 8 12A4 4 0 0 1 12 8Z"/>
                  </svg>
                  <span>CIGNA</span>
                </div>
                <div className="brand-logo-item">
                  <svg className="brand-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  <span>ANTHEM</span>
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
              <canvas ref={statsWaveRef} className="stats-wave-canvas" style={{ display: 'none' }}></canvas>
              <div className="video-placeholder">
                <div className="video-bg-wave"></div>
                <div className="play-button">
                  <svg className="play-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="video-title">EXPLORE THE ARCHITECTURE</div>
              </div>
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
                  <div className="load-ring">
                    <span className="load-val">42%</span>
                  </div>
                  <div className="load-details">
                    <div className="load-stat"><span className="label">Nodes Active:</span> <span className="val accent-text">14 / 32</span></div>
                    <div className="load-stat"><span className="label">Core Temp:</span> <span className="val accent-text">45°C</span></div>
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
                  <div className="sla-bars-wrapper">
                    {[65, 80, 50, 95, 70, 85, slaSlaSlider].map((val, idx) => (
                      <div key={idx} className="sla-bar-col">
                        <div className="sla-bar-value" style={{ height: `${val}%` }}></div>
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
                  <svg className="token-pie-svg" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-nocturnal-expedition)" strokeWidth="15" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-forsythia)" strokeWidth="15" strokeDasharray="251" strokeDashoffset="75" />
                  </svg>
                  <div className="token-legend">
                    <div className="legend-item"><span className="dot dot-yellow"></span> <span>Discovery (70%)</span></div>
                    <div className="legend-item"><span className="dot dot-teal"></span> <span>Analysis (30%)</span></div>
                  </div>
                </div>
              </div>

              {/* Growth Vector Line Chart */}
              <div className="telemetry-card">
                <h3 className="telemetry-card-title">Growth Vector</h3>
                <div className="growth-vector-visual">
                  <svg className="growth-line-svg" viewBox="0 0 200 100">
                    <path d="M 0 90 Q 40 80 80 50 T 160 20 T 200 10" fill="none" stroke="var(--color-forsythia)" strokeWidth="3" className="animated-path" />
                    <path d="M 0 90 Q 40 80 80 50 T 160 20 T 200 10 L 200 100 L 0 100 Z" fill="url(#growth-gradient)" opacity="0.1" />
                    <defs>
                      <linearGradient id="growth-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-forsythia)" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="growth-labels">
                    <span className="accent-text">+245% Year-to-date</span>
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
