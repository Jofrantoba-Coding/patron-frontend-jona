export const develtrexContent = {
  navigation: {
    brand: 'DEVELTREX',
    links: [
      { label: 'Inicio', href: '/' },
      { label: 'Contacto', href: '/contacto' },
    ],
  },
  hero: {
    eyebrow: 'Arquitectura · Cloud · APIs · Seguridad · Datos',
    title: 'De la app al cloud, del dato a la decisión',
    summary:
      'Diseñamos, implementamos y acompañamos plataformas tecnológicas críticas, escalables, seguras y gobernadas — desde la arquitectura hasta la operación, en entornos AWS, GCP, on-premise e híbridos.',
    primaryAction: { label: 'Ver servicios', href: '/#servicios' },
    secondaryAction: { label: 'Agendar diagnóstico', href: 'https://api.whatsapp.com/send?phone=51929913524' },
  },
  metrics: [
    { value: '+50', label: 'proyectos entregados en banca, fintech, iGaming, gobierno y cloud enterprise' },
    { value: '16', label: 'servicios especializados de arquitectura, cloud, APIs, seguridad, datos y talento' },
    { value: '30 min', label: 'diagnóstico ejecutivo sin costo para evaluar tu arquitectura actual' },
  ],
  purpose: {
    title: 'Por qué Develtrex',
    items: [
      {
        title: 'De la arquitectura al modelo de datos, un solo socio',
        description:
          'Diseñamos desde la arquitectura empresarial hasta el modelo de datos, la integración y la operación: menos fricción, un interlocutor que domina todo el stack y decisiones técnicas coherentes de punta a punta.',
      },
      {
        title: 'Plataformas críticas, seguras y gobernadas',
        description:
          'Experiencia en entornos regulados de banca, fintech y gaming: seguridad por diseño, trazabilidad, alta disponibilidad y entregables ejecutivos, técnicos y operativos — no presentaciones.',
      },
    ],
  },
  products: [
    {
      slug: 'softcommerce-erp',
      name: 'ERP Softcommerce',
      tag: 'Cloud · InHouse',
      outcome: 'Automatiza facturación SUNAT, contabilidad, inventario y tesorería en un solo sistema integrado.',
      description:
        'ERP diseñado para empresas peruanas. Emite comprobantes electrónicos certificados ante SUNAT, gestiona contabilidad, cuentas por cobrar/pagar, inventario con Kardex y reportes financieros en tiempo real.',
      highlights: [
        'Facturación electrónica certificada SUNAT',
        'Inventario y Kardex con promedio móvil',
        'Tesorería, cuentas por cobrar y pagar',
        'Cloud S/ 1,200/mes · InHouse S/ 5,990',
      ],
    },
  ],
  servicesIntro: {
    title: 'Servicios especializados para plataformas críticas',
    description:
      'Arquitectura, cloud, Kubernetes, API Management, desarrollo empresarial, DevSecOps, datos e IA e integración financiera — para organizaciones que evolucionan hacia plataformas modernas, híbridas y orientadas a microservicios.',
  },
  services: [
    // ── Arquitectura & Cloud ─────────────────────────────────────────────
    {
      slug: 'arquitectura-software',
      category: 'Arquitectura & Cloud',
      name: 'Arquitectura de software empresarial',
      promise: 'Diagnóstico, diseño y gobierno de arquitecturas críticas: microservicios, cloud-native, C4 y estándares.',
      proof: 'Alinea negocio y tecnología con arquitectura de referencia, roadmap de modernización y lineamientos gobernados.',
      visual: 'build',
    },
    {
      slug: 'cloud-hibrido',
      category: 'Arquitectura & Cloud',
      name: 'Cloud, híbrido y on-premise',
      promise: 'Landing zones, redes cloud y arquitecturas multiambiente en AWS, GCP, Azure y on-premise.',
      proof: 'Alta disponibilidad, segmentación de red y optimización de costos con diseño multi-cuenta y conectividad híbrida.',
      visual: 'cloud',
    },
    // ── Desarrollo ───────────────────────────────────────────────────────
    {
      slug: 'backend-enterprise',
      category: 'Desarrollo',
      name: 'Backend empresarial',
      promise: 'Microservicios, APIs REST y servicios reactivos con Java, Spring Boot y arquitectura hexagonal.',
      proof: 'Servicios transaccionales, seguros y trazables, con integración a bases relacionales y NoSQL.',
      visual: 'build',
    },
    {
      slug: 'frontend-microfrontends',
      category: 'Desarrollo',
      name: 'Frontend y microfrontends',
      promise: 'Aplicaciones web modernas, microfrontends y SSR con React, Angular, Vue y TypeScript.',
      proof: 'Interfaces empresariales responsivas, integradas a BFF y APIs, con componentes estandarizados.',
      visual: 'modern',
    },
    // ── APIs & Integración ───────────────────────────────────────────────
    {
      slug: 'api-management',
      category: 'APIs & Integración',
      name: 'API Management e integración',
      promise: 'Gobierno, seguridad e integración híbrida de APIs con Kong, Apigee, MuleSoft, webMethods y AWS API Gateway.',
      proof: 'API First con OAuth2/OIDC/JWT/mTLS, Developer Portal y evaluación comparativa de plataformas.',
      visual: 'data',
    },
    {
      slug: 'integraciones-h2h',
      category: 'APIs & Integración',
      name: 'Integraciones financieras H2H',
      promise: 'Canales bancarios Host-to-Host seguros con SFTP, XML/TXT, ISO 20022 y cifrado PGP/GPG.',
      proof: 'Trazabilidad, conciliación e idempotencia para operaciones y pagos masivos regulados.',
      visual: 'data',
    },
    // ── Plataforma & DevSecOps ───────────────────────────────────────────
    {
      slug: 'kubernetes',
      category: 'Plataforma & DevSecOps',
      name: 'Kubernetes y multicluster',
      promise: 'Diseño e implementación de plataformas Kubernetes empresariales, multicluster y service mesh.',
      proof: 'RBAC, network policies, mTLS, ingress y GitOps con HLD/LLD y operación gobernada.',
      visual: 'modern',
    },
    {
      slug: 'devops-cicd',
      category: 'Plataforma & DevSecOps',
      name: 'DevOps, CI/CD y automatización',
      promise: 'Pipelines CI/CD, GitOps e Infraestructura como Código con Terraform, Helm y Kubernetes.',
      proof: 'Despliegues automatizados, versionamiento y gobierno de artefactos con templates reutilizables.',
      visual: 'database',
    },
    {
      slug: 'devsecops',
      category: 'Plataforma & DevSecOps',
      name: 'Seguridad aplicativa y DevSecOps',
      promise: 'Seguridad por diseño: OAuth2/OIDC, Keycloak/Entra ID, mTLS, Vault y gestión de secretos.',
      proof: 'Hardening de apps y contenedores, RBAC, network policies y auditoría alineada a DevSecOps.',
      visual: 'commerce',
    },
    {
      slug: 'observabilidad',
      category: 'Plataforma & DevSecOps',
      name: 'Observabilidad y monitoreo',
      promise: 'Visibilidad integral de APIs, Kubernetes e infraestructura con logs, métricas y trazas.',
      proof: 'Dashboards, alertas y trazabilidad distribuida con CloudWatch, Prometheus, Grafana y OpenTelemetry.',
      visual: 'data',
    },
    // ── Datos & IA ───────────────────────────────────────────────────────
    {
      slug: 'bases-datos',
      category: 'Datos & IA',
      name: 'Bases de datos e ingeniería de información',
      promise: 'Modelado, optimización y gobierno de datos en PostgreSQL, Oracle, SQL Server, DynamoDB y Firestore.',
      proof: 'Modelos transaccionales y financieros, particionamiento, concurrencia y roadmap de motores.',
      visual: 'database',
    },
    {
      slug: 'data-bi-ia',
      category: 'Datos & IA',
      name: 'Data Engineering, BI e IA',
      promise: 'Plataformas de datos, ETL/ELT, analítica e IA aplicada con BigQuery, Dataflow y LLMs.',
      proof: 'Data lake, tableros BI, indicadores de negocio y casos de uso de inteligencia artificial.',
      visual: 'data',
    },
    // ── Soluciones de negocio ────────────────────────────────────────────
    {
      slug: 'fintech-pagos',
      category: 'Soluciones de negocio',
      name: 'Arquitectura fintech y pagos',
      promise: 'Core transaccional, ledger de doble partida, conciliación y arquitectura de pagos de alta disponibilidad.',
      proof: 'Trazabilidad financiera, controles de consistencia y APIs financieras sobre AWS y Kubernetes.',
      visual: 'commerce',
    },
    {
      slug: 'igaming',
      category: 'Soluciones de negocio',
      name: 'iGaming y motores promocionales',
      promise: 'Motores de promociones, misiones, retos, ruletas y multiplicadores con reglas configurables.',
      proof: 'Campañas en tiempo real, audiencias y trazabilidad con arquitectura event-driven y streaming.',
      visual: 'modern',
    },
    {
      slug: 'consultoria-capacitacion',
      category: 'Soluciones de negocio',
      name: 'Consultoría y capacitación',
      promise: 'Talleres y acompañamiento en arquitectura, Kubernetes, API Management y DevSecOps.',
      proof: 'Transferencia de conocimiento, pruebas de concepto, manuales técnicos y soporte post-implementación.',
      visual: 'data',
    },
    // ── Talento ──────────────────────────────────────────────────────────
    {
      slug: 'staffing',
      category: 'Talento',
      name: 'Staffing y aumento de equipo',
      promise: 'Perfiles senior en arquitectura, cloud, backend, DevSecOps y datos para reforzar tu equipo — nearshore y productivos desde el día uno.',
      proof: 'Escala tu capacidad sin la fricción del ciclo de contratación, con talento senior evaluado que ya domina el stack crítico.',
      visual: 'modern',
    },
  ],
  process: [
    {
      title: 'Diagnóstico y arquitectura objetivo',
      description:
        'Evaluamos la arquitectura actual, definimos arquetipos, estándares, modelo C4 y un roadmap de modernización alineado al negocio.',
    },
    {
      title: 'Diseño detallado y gobierno',
      description:
        'Definimos HLD/LLD, modelos de seguridad, API governance, data governance, redes cloud y lineamientos de despliegue.',
    },
    {
      title: 'Implementación por capacidades',
      description:
        'Aterrizamos Kubernetes, API Management, backend empresarial, integraciones H2H, observabilidad y CI/CD seguro.',
    },
    {
      title: 'Operación, soporte y transferencia',
      description:
        'Acompañamos con hardening, monitoreo, capacitación, manuales técnicos y transferencia de conocimiento al equipo.',
    },
  ],
  offers: [
    'Arquitectura de software empresarial y modelado C4',
    'Cloud AWS/GCP/Azure, híbrido y on-premise',
    'Plataforma Kubernetes empresarial y multicluster',
    'API Management híbrido con Kong, Apigee, MuleSoft y webMethods',
    'Integraciones bancarias H2H con SFTP, ISO 20022 y PGP/GPG',
    'Backend Java/Spring Boot y microservicios reactivos',
    'Frontend y microfrontends con React, Angular y Vue',
    'Seguridad aplicativa, OAuth2/mTLS, Keycloak y Vault',
    'DevSecOps, CI/CD, GitOps e Infraestructura como Código',
    'Observabilidad con Prometheus, Grafana y OpenTelemetry',
    'Bases de datos PostgreSQL, Oracle, SQL Server y NoSQL',
    'Data Engineering, BI e IA con BigQuery, Dataflow y LLMs',
    'Arquitectura fintech, ledger contable y plataformas de pagos',
    'Motores promocionales e iGaming en tiempo real',
    'Consultoría, talleres y transferencia de conocimiento',
    'Staffing y aumento de equipo con talento senior nearshore',
  ],
  contact: {
    title: '¿Listo para ordenar tu tecnología?',
    subtitle: 'Conversemos 30 minutos. Sin costo, sin compromiso. Evaluamos tu situación actual y te decimos qué haríamos primero.',
    phone: '+51 929 913 524',
    phoneHref: 'tel:+51929913524',
    email: 'team@develtrex.com',
    emailHref: 'mailto:team@develtrex.com',
    whatsappHref: 'https://api.whatsapp.com/send?phone=51929913524',
  },
};

export type DeveltrexContent = typeof develtrexContent;
export type DeveltrexProduct = DeveltrexContent['products'][number];
export type DeveltrexService = DeveltrexContent['services'][number];
