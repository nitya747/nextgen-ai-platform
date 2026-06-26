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

  // Loader timing sequence (Phase 1)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer);
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
          <div className="container hero-content">
            <h1 className="hero-title text-gradient">Power your future<br />with AI automation</h1>
            <p className="hero-description">
              Unleash autonomous workflows, scale-free database indexing, and hardware-accelerated agent pipelines built on top of our enterprise-grade security substrate.
            </p>
            <div className="hero-ctas">
              <button className="btn-primary" type="button">
                <span>Start Free Trial</span>
                <svg className="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button className="btn-secondary" type="button">Request Demo</button>
            </div>
          </div>

          {/* Client Marquee */}
          <div className="client-marquee">
            <div className="container">
              <div className="marquee-title">Trusted by industry scale leaders</div>
              <div className="marquee-track">
                {['Aetna', 'Cigna', 'Anthem', 'UnitedHealth', 'Humana', 'BlueCross', 'Aetna', 'Cigna', 'Anthem', 'UnitedHealth', 'Humana', 'BlueCross'].map((name, idx) => (
                  <div key={idx} className="marquee-item">{name}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 001 Neural Engines (Bento Grid) */}
        <section id="features" className="bento-section">
          <div className="container">
            <div className="section-header">
              <span className="section-code">001 / Neural Engines</span>
              <h2 className="section-title text-gradient">Architected for extreme scale</h2>
              <p className="section-subtitle">
                Deploy customized core engines optimized for low-latency task resolution and automated orchestration.
              </p>
            </div>

            {/* Desktop Bento Grid */}
            <div className="bento-grid">
              {FEATURES.map((feat, idx) => {
                let cardClass = "bento-card";
                if (idx === 0) cardClass += " bento-card-large";
                else if (idx === 1) cardClass += " bento-card-medium";
                else if (idx === 2) cardClass += " bento-card-small-1";
                else if (idx === 3) cardClass += " bento-card-small-2";

                return (
                  <div
                    key={feat.id}
                    ref={el => bentoCardRefs.current[idx] = el}
                    className={`${cardClass} ${idx === 0 ? 'active' : ''}`}
                    onMouseEnter={() => handleBentoHover(idx)}
                    onMouseMove={(e) => handleBentoMouseMove(e, idx)}
                  >
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
              <span className="section-code">002 / Case Studies</span>
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
              <span className="section-code">003 / Vector Field</span>
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
              <span className="section-code">004 / Telemetry</span>
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
              <span className="section-code">005 / Our Approach</span>
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
              <span className="section-code">006 / Autonomy Scorecard</span>
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
              <span className="section-code">007 / Integrations</span>
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
              <span className="section-code">012 / Pricing Matrix</span>
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
              <span className="section-code">008 / Endorsements</span>
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
              <span className="section-code">009 / Insights</span>
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
              <span className="section-code">010 / FAQ</span>
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
