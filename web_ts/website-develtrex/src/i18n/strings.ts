import type { ReactNode } from 'react';
import type { Locale } from './LocaleProvider';

export interface IndustryItem { name: string; desc: string; icon?: ReactNode }
export interface CaseItem { sector: string; title: string; outcome: string; tags: string[] }
export interface ContactMethod { icon: string; label: string; description: string; action: string; primary?: boolean }
export interface StepItem { num: string; title: string; body: string }

export interface UiStrings {
  nav: { products: string; services: string; book: string; bookDiagnostic: string };
  hero: { buildingPrefix: string; rotating: string[] };
  stackLabel: string;
  servicesEyebrow: string;
  products: {
    eyebrow: string;
    heading: string;
    description: string;
    panelTitle: string;
    panelBadge: string;
    rows: { label: string; value: string }[];
  };
  industries: { eyebrow: string; heading: string; description: string; items: IndustryItem[] };
  cases: { eyebrow: string; heading: string; description: string; items: CaseItem[] };
  process: { eyebrow: string; heading: string };
  contactPage: {
    eyebrow: string;
    stepsEyebrow: string;
    stepsHeading: string;
    methods: ContactMethod[];
    steps: StepItem[];
  };
  detail: {
    backProducts: string; backServices: string;
    primaryCta: string; secondaryCta: string; requestDemo: string; viewDetails: string;
    descripcion: string; deQueSeTrata: string; paraQuien: string; aQuienLeSirve: string;
    beneficios: string; queObtienes: string; proceso: string; comoTrabajamos: string;
    metodologia: string; comoLoHacemos: string; entregables: string; queRecibes: string;
    caracteristicas: string; highlights: string; faq: string; preguntasFrecuentes: string;
    relacionadosEyebrow: string; relacionadosHeading: string;
  };
  cta: { whatsapp: string };
  footerRights: string;
  /** Etiqueta traducida por clave de categoría (la clave es el string español estable). */
  categoryLabels: Record<string, string>;
}

const es: UiStrings = {
  nav: { products: 'Productos', services: 'Servicios', book: 'Agendar', bookDiagnostic: 'Agendar diagnóstico' },
  hero: {
    buildingPrefix: 'Hoy construimos',
    rotating: ['software a medida', 'arquitectura cloud', 'plataformas seguras', 'APIs & integración', 'IA & automatización', 'equipos de talento'],
  },
  stackLabel: 'El stack que dominamos',
  servicesEyebrow: 'Portafolio',
  products: {
    eyebrow: 'Producto propio',
    heading: 'Software diseñado para el mercado peruano',
    description: 'Desarrollamos y operamos nuestro propio ERP con certificación SUNAT. Una solución lista para usar, con soporte local y sin costo de licencias de terceros.',
    panelTitle: 'Panel ERP',
    panelBadge: 'SUNAT ✓',
    rows: [
      { label: 'Facturación electrónica', value: 'Certificada' },
      { label: 'Inventario · Kardex', value: 'Tiempo real' },
      { label: 'Cuentas por cobrar', value: 'S/ 128,400' },
      { label: 'Tesorería', value: 'Conciliada' },
    ],
  },
  industries: {
    eyebrow: 'Industrias',
    heading: 'Sectores donde generamos impacto',
    description: 'Experiencia en plataformas críticas, reguladas y de alta disponibilidad.',
    items: [
      { name: 'Fintech', desc: 'Pagos, ledger contable, conciliación e idempotencia transaccional.' },
      { name: 'Banca', desc: 'Integración H2H, ISO 20022 y operaciones críticas reguladas.' },
      { name: 'iGaming', desc: 'Motores promocionales, misiones y campañas en tiempo real.' },
      { name: 'Gobierno', desc: 'Plataformas críticas con gobierno, seguridad y trazabilidad.' },
      { name: 'Retail', desc: 'E-commerce, catálogos e integración omnicanal.' },
      { name: 'Seguros', desc: 'Core transaccional y modernización de sistemas legacy.' },
    ],
  },
  cases: {
    eyebrow: 'Casos de éxito',
    heading: 'Resultados en plataformas críticas',
    description: 'Proyectos reales en fintech, banca, iGaming y cloud enterprise — arquitectura, integración y alta disponibilidad.',
    items: [
      { sector: 'Fintech · Pagos', title: 'Plataforma de pagos cloud-native', outcome: 'Arquitectura de pagos sobre AWS: microservicios, API Gateway y alta disponibilidad multi-cuenta.', tags: ['AWS', 'Kubernetes', 'API Gateway', 'PostgreSQL'] },
      { sector: 'Banca', title: 'Integración bancaria Host-to-Host', outcome: 'Canal H2H seguro con cifrado PGP/GPG, SFTP e ISO 20022 para operaciones y pagos masivos.', tags: ['H2H', 'SFTP', 'PGP/GPG', 'ISO 20022'] },
      { sector: 'iGaming', title: 'Motor promocional en tiempo real', outcome: 'Misiones, retos, ruletas y multiplicadores con reglas configurables y eventos en tiempo real.', tags: ['Java', 'Spring Boot', 'Kafka'] },
      { sector: 'Enterprise', title: 'API Management híbrido Zero Trust', outcome: 'Control plane centralizado y data planes distribuidos con OAuth2, mTLS y observabilidad de APIs.', tags: ['Kong', 'OAuth2', 'mTLS', 'API Governance'] },
      { sector: 'Cloud', title: 'Segmentación de red en AWS', outcome: 'Networking cloud avanzado con Transit Gateway, PrivateLink y CloudWAN en entornos multi-cuenta.', tags: ['VPC', 'Transit Gateway', 'PrivateLink'] },
      { sector: 'iGaming · Marketing', title: 'Plataforma de campañas y audiencias', outcome: 'Reglas promocionales, segmentación de audiencias y campañas con trazabilidad completa.', tags: ['Campañas', 'Audiencias', 'Reglas'] },
    ],
  },
  process: { eyebrow: 'Cómo trabajamos', heading: 'De diagnóstico a operación gestionada' },
  contactPage: {
    eyebrow: 'Contacto',
    stepsEyebrow: 'Qué esperar',
    stepsHeading: 'Así empieza la conversación',
    methods: [
      { icon: '💬', label: 'WhatsApp', description: 'La forma más rápida. Respondemos en menos de 2 horas en horario laboral.', action: 'Abrir WhatsApp', primary: true },
      { icon: '📞', label: 'Teléfono', description: 'Llámanos directamente para una conversación inmediata.', action: '' },
      { icon: '✉️', label: 'Email', description: 'Para consultas detalladas o documentación. Respondemos el mismo día.', action: '' },
    ],
    steps: [
      { num: '01', title: 'Cuéntanos tu situación', body: 'En 30 minutos nos describes tu contexto, los problemas que enfrentas y tus objetivos de negocio.' },
      { num: '02', title: 'Diagnóstico sin costo', body: 'Evaluamos tu arquitectura actual, identificamos las principales brechas y riesgos, y priorizamos junto a ti.' },
      { num: '03', title: 'Propuesta concreta', body: 'Recibes una propuesta con alcance, entregables, equipo y cronograma — sin compromisos previos.' },
    ],
  },
  detail: {
    backProducts: '← Productos', backServices: '← Todos los servicios',
    primaryCta: 'Solicitar información', secondaryCta: 'Escribirnos', requestDemo: 'Solicitar demo', viewDetails: 'Ver detalles completos →',
    descripcion: 'Descripción', deQueSeTrata: '¿De qué se trata?', paraQuien: 'Para quién', aQuienLeSirve: '¿A quién le sirve?',
    beneficios: 'Beneficios', queObtienes: '¿Qué obtienes?', proceso: 'Proceso', comoTrabajamos: '¿Cómo trabajamos?',
    metodologia: 'Metodología', comoLoHacemos: '¿Cómo lo hacemos?', entregables: 'Entregables', queRecibes: '¿Qué recibes?',
    caracteristicas: 'Características', highlights: 'Highlights técnicos', faq: 'FAQ', preguntasFrecuentes: 'Preguntas frecuentes',
    relacionadosEyebrow: 'También en', relacionadosHeading: 'Servicios relacionados',
  },
  cta: { whatsapp: 'Agendar por WhatsApp' },
  footerRights: 'Todos los derechos reservados.',
  categoryLabels: {
    'Arquitectura & Cloud': 'Arquitectura & Cloud',
    'Desarrollo': 'Desarrollo',
    'APIs & Integración': 'APIs & Integración',
    'Plataforma & DevSecOps': 'Plataforma & DevSecOps',
    'Datos & IA': 'Datos & IA',
    'Soluciones de negocio': 'Soluciones de negocio',
    'Talento': 'Talento',
  },
};

const en: UiStrings = {
  nav: { products: 'Products', services: 'Services', book: 'Book a call', bookDiagnostic: 'Book a diagnostic' },
  hero: {
    buildingPrefix: 'Today we build',
    rotating: ['custom software', 'cloud architecture', 'secure platforms', 'APIs & integration', 'AI & automation', 'talent teams'],
  },
  stackLabel: 'The stack we master',
  servicesEyebrow: 'Portfolio',
  products: {
    eyebrow: 'Our own product',
    heading: 'Software built for the Peruvian market',
    description: 'We build and operate our own ERP with SUNAT certification. A ready-to-use solution with local support and no third-party license costs.',
    panelTitle: 'ERP Dashboard',
    panelBadge: 'SUNAT ✓',
    rows: [
      { label: 'Electronic invoicing', value: 'Certified' },
      { label: 'Inventory · Kardex', value: 'Real time' },
      { label: 'Accounts receivable', value: 'S/ 128,400' },
      { label: 'Treasury', value: 'Reconciled' },
    ],
  },
  industries: {
    eyebrow: 'Industries',
    heading: 'Sectors where we make an impact',
    description: 'Experience in critical, regulated and high-availability platforms.',
    items: [
      { name: 'Fintech', desc: 'Payments, accounting ledger, reconciliation and transactional idempotency.' },
      { name: 'Banking', desc: 'H2H integration, ISO 20022 and critical regulated operations.' },
      { name: 'iGaming', desc: 'Promotional engines, missions and real-time campaigns.' },
      { name: 'Government', desc: 'Critical platforms with governance, security and traceability.' },
      { name: 'Retail', desc: 'E-commerce, catalogs and omnichannel integration.' },
      { name: 'Insurance', desc: 'Transactional core and legacy systems modernization.' },
    ],
  },
  cases: {
    eyebrow: 'Case studies',
    heading: 'Results on critical platforms',
    description: 'Real projects in fintech, banking, iGaming and cloud enterprise — architecture, integration and high availability.',
    items: [
      { sector: 'Fintech · Payments', title: 'Cloud-native payments platform', outcome: 'Payments architecture on AWS: microservices, API Gateway and multi-account high availability.', tags: ['AWS', 'Kubernetes', 'API Gateway', 'PostgreSQL'] },
      { sector: 'Banking', title: 'Host-to-Host banking integration', outcome: 'Secure H2H channel with PGP/GPG encryption, SFTP and ISO 20022 for operations and mass payments.', tags: ['H2H', 'SFTP', 'PGP/GPG', 'ISO 20022'] },
      { sector: 'iGaming', title: 'Real-time promotional engine', outcome: 'Missions, challenges, wheels and multipliers with configurable rules and real-time events.', tags: ['Java', 'Spring Boot', 'Kafka'] },
      { sector: 'Enterprise', title: 'Hybrid Zero Trust API Management', outcome: 'Centralized control plane and distributed data planes with OAuth2, mTLS and API observability.', tags: ['Kong', 'OAuth2', 'mTLS', 'API Governance'] },
      { sector: 'Cloud', title: 'Network segmentation on AWS', outcome: 'Advanced cloud networking with Transit Gateway, PrivateLink and CloudWAN across multi-account setups.', tags: ['VPC', 'Transit Gateway', 'PrivateLink'] },
      { sector: 'iGaming · Marketing', title: 'Campaigns and audiences platform', outcome: 'Promotional rules, audience segmentation and campaigns with full traceability.', tags: ['Campaigns', 'Audiences', 'Rules'] },
    ],
  },
  process: { eyebrow: 'How we work', heading: 'From diagnosis to managed operation' },
  contactPage: {
    eyebrow: 'Contact',
    stepsEyebrow: 'What to expect',
    stepsHeading: 'This is how the conversation starts',
    methods: [
      { icon: '💬', label: 'WhatsApp', description: 'The fastest way. We reply in under 2 hours during business hours.', action: 'Open WhatsApp', primary: true },
      { icon: '📞', label: 'Phone', description: 'Call us directly for an immediate conversation.', action: '' },
      { icon: '✉️', label: 'Email', description: 'For detailed inquiries or documentation. We reply the same day.', action: '' },
    ],
    steps: [
      { num: '01', title: 'Tell us your situation', body: 'In 30 minutes you describe your context, the problems you face and your business goals.' },
      { num: '02', title: 'Free diagnostic', body: 'We assess your current architecture, identify the main gaps and risks, and prioritize with you.' },
      { num: '03', title: 'Concrete proposal', body: 'You get a proposal with scope, deliverables, team and timeline — with no prior commitment.' },
    ],
  },
  detail: {
    backProducts: '← Products', backServices: '← All services',
    primaryCta: 'Request information', secondaryCta: 'Contact us', requestDemo: 'Request a demo', viewDetails: 'View full details →',
    descripcion: 'Overview', deQueSeTrata: 'What is it about?', paraQuien: 'For whom', aQuienLeSirve: 'Who is it for?',
    beneficios: 'Benefits', queObtienes: 'What you get', proceso: 'Process', comoTrabajamos: 'How we work',
    metodologia: 'Methodology', comoLoHacemos: 'How we do it', entregables: 'Deliverables', queRecibes: 'What you receive',
    caracteristicas: 'Features', highlights: 'Technical highlights', faq: 'FAQ', preguntasFrecuentes: 'Frequently asked questions',
    relacionadosEyebrow: 'Also in', relacionadosHeading: 'Related services',
  },
  cta: { whatsapp: 'Book via WhatsApp' },
  footerRights: 'All rights reserved.',
  categoryLabels: {
    'Arquitectura & Cloud': 'Architecture & Cloud',
    'Desarrollo': 'Development',
    'APIs & Integración': 'APIs & Integration',
    'Plataforma & DevSecOps': 'Platform & DevSecOps',
    'Datos & IA': 'Data & AI',
    'Soluciones de negocio': 'Business solutions',
    'Talento': 'Talent',
  },
};

export const UI_STRINGS: Record<Locale, UiStrings> = { es, en };
