import type { DeveltrexContent } from './develtrexContent';

export const develtrexContentEn: DeveltrexContent = {
  navigation: {
    brand: 'DEVELTREX',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Contact', href: '/contacto' },
    ],
  },
  hero: {
    eyebrow: 'Architecture · Cloud · APIs · Security · Data',
    title: 'From app to cloud, from data to decision',
    summary:
      'We design, build and support critical, scalable, secure and governed technology platforms — from architecture to operation, across AWS, GCP, on-premise and hybrid environments.',
    primaryAction: { label: 'View services', href: '/#servicios' },
    secondaryAction: { label: 'Book a diagnostic', href: 'https://api.whatsapp.com/send?phone=51929913524' },
  },
  metrics: [
    { value: '+50', label: 'projects delivered in banking, fintech, iGaming, government and cloud enterprise' },
    { value: '16', label: 'specialized services across architecture, cloud, APIs, security, data and talent' },
    { value: '30 min', label: 'free executive diagnostic to assess your current architecture' },
  ],
  purpose: {
    title: 'Why Develtrex',
    items: [
      {
        title: 'From architecture to data model, one single partner',
        description:
          'We design from enterprise architecture down to the data model, integration and operation: less friction, one partner who masters the whole stack and coherent technical decisions end to end.',
      },
      {
        title: 'Critical, secure and governed platforms',
        description:
          'Experience in regulated banking, fintech and gaming environments: security by design, traceability, high availability and executive, technical and operational deliverables — not slide decks.',
      },
    ],
  },
  products: [
    {
      slug: 'softcommerce-erp',
      name: 'Softcommerce ERP',
      tag: 'Cloud · InHouse',
      outcome: 'Automates SUNAT e-invoicing, accounting, inventory and treasury in a single integrated system.',
      description:
        'ERP designed for Peruvian companies. Issues SUNAT-certified electronic invoices, manages accounting, accounts receivable/payable, inventory with Kardex and real-time financial reports.',
      highlights: [
        'SUNAT-certified electronic invoicing',
        'Inventory and Kardex with moving average',
        'Treasury, accounts receivable and payable',
        'Cloud S/ 1,200/mo · InHouse S/ 5,990',
      ],
    },
  ],
  servicesIntro: {
    title: 'Specialized services for critical platforms',
    description:
      'Architecture, cloud, Kubernetes, API Management, enterprise development, DevSecOps, data & AI and financial integration — for organizations evolving toward modern, hybrid and microservices-oriented platforms.',
  },
  services: [
    {
      slug: 'arquitectura-software',
      category: 'Arquitectura & Cloud',
      name: 'Enterprise software architecture',
      promise: 'Assessment, design and governance of critical architectures: microservices, cloud-native, C4 and standards.',
      proof: 'Aligns business and technology with a reference architecture, modernization roadmap and governed guidelines.',
      visual: 'build',
    },
    {
      slug: 'cloud-hibrido',
      category: 'Arquitectura & Cloud',
      name: 'Cloud, hybrid and on-premise',
      promise: 'Landing zones, cloud networks and multi-environment architectures on AWS, GCP, Azure and on-premise.',
      proof: 'High availability, network segmentation and cost optimization with multi-account design and hybrid connectivity.',
      visual: 'cloud',
    },
    {
      slug: 'backend-enterprise',
      category: 'Desarrollo',
      name: 'Enterprise backend',
      promise: 'Microservices, REST APIs and reactive services with Java, Spring Boot and hexagonal architecture.',
      proof: 'Transactional, secure and traceable services, integrated with relational and NoSQL databases.',
      visual: 'build',
    },
    {
      slug: 'frontend-microfrontends',
      category: 'Desarrollo',
      name: 'Frontend and microfrontends',
      promise: 'Modern web apps, microfrontends and SSR with React, Angular, Vue and TypeScript.',
      proof: 'Responsive enterprise interfaces, integrated with BFF and APIs, with standardized components.',
      visual: 'modern',
    },
    {
      slug: 'api-management',
      category: 'APIs & Integración',
      name: 'API Management and integration',
      promise: 'Governance, security and hybrid integration of APIs with Kong, Apigee, MuleSoft, webMethods and AWS API Gateway.',
      proof: 'API First with OAuth2/OIDC/JWT/mTLS, Developer Portal and platform comparison.',
      visual: 'data',
    },
    {
      slug: 'integraciones-h2h',
      category: 'APIs & Integración',
      name: 'Financial H2H integrations',
      promise: 'Secure Host-to-Host banking channels with SFTP, XML/TXT, ISO 20022 and PGP/GPG encryption.',
      proof: 'Traceability, reconciliation and idempotency for regulated operations and mass payments.',
      visual: 'data',
    },
    {
      slug: 'kubernetes',
      category: 'Plataforma & DevSecOps',
      name: 'Kubernetes and multicluster',
      promise: 'Design and implementation of enterprise, multicluster Kubernetes platforms and service mesh.',
      proof: 'RBAC, network policies, mTLS, ingress and GitOps with HLD/LLD and governed operation.',
      visual: 'modern',
    },
    {
      slug: 'devops-cicd',
      category: 'Plataforma & DevSecOps',
      name: 'DevOps, CI/CD and automation',
      promise: 'CI/CD pipelines, GitOps and Infrastructure as Code with Terraform, Helm and Kubernetes.',
      proof: 'Automated deployments, versioning and artifact governance with reusable templates.',
      visual: 'database',
    },
    {
      slug: 'devsecops',
      category: 'Plataforma & DevSecOps',
      name: 'Application security and DevSecOps',
      promise: 'Security by design: OAuth2/OIDC, Keycloak/Entra ID, mTLS, Vault and secrets management.',
      proof: 'App and container hardening, RBAC, network policies and DevSecOps-aligned auditing.',
      visual: 'commerce',
    },
    {
      slug: 'observabilidad',
      category: 'Plataforma & DevSecOps',
      name: 'Observability and monitoring',
      promise: 'Full visibility of APIs, Kubernetes and infrastructure with logs, metrics and traces.',
      proof: 'Dashboards, alerts and distributed tracing with CloudWatch, Prometheus, Grafana and OpenTelemetry.',
      visual: 'data',
    },
    {
      slug: 'bases-datos',
      category: 'Datos & IA',
      name: 'Databases and information engineering',
      promise: 'Data modeling, optimization and governance in PostgreSQL, Oracle, SQL Server, DynamoDB and Firestore.',
      proof: 'Transactional and financial models, partitioning, concurrency and database engine roadmap.',
      visual: 'database',
    },
    {
      slug: 'data-bi-ia',
      category: 'Datos & IA',
      name: 'Data Engineering, BI and AI',
      promise: 'Data platforms, ETL/ELT, analytics and applied AI with BigQuery, Dataflow and LLMs.',
      proof: 'Data lake, BI dashboards, business KPIs and artificial intelligence use cases.',
      visual: 'data',
    },
    {
      slug: 'fintech-pagos',
      category: 'Soluciones de negocio',
      name: 'Fintech architecture and payments',
      promise: 'Transactional core, double-entry ledger, reconciliation and high-availability payments architecture.',
      proof: 'Financial traceability, consistency controls and financial APIs on AWS and Kubernetes.',
      visual: 'commerce',
    },
    {
      slug: 'igaming',
      category: 'Soluciones de negocio',
      name: 'iGaming and promotional engines',
      promise: 'Promotion engines, missions, challenges, wheels and multipliers with configurable rules.',
      proof: 'Real-time campaigns, audiences and traceability with event-driven architecture and streaming.',
      visual: 'modern',
    },
    {
      slug: 'consultoria-capacitacion',
      category: 'Soluciones de negocio',
      name: 'Consulting and training',
      promise: 'Workshops and hands-on support in architecture, Kubernetes, API Management and DevSecOps.',
      proof: 'Knowledge transfer, proofs of concept, technical manuals and post-implementation support.',
      visual: 'data',
    },
    {
      slug: 'staffing',
      category: 'Talento',
      name: 'Staffing and team augmentation',
      promise: 'Senior profiles in architecture, cloud, backend, DevSecOps and data to reinforce your team — nearshore and productive from day one.',
      proof: 'Scale your capacity without the friction of the hiring cycle, with evaluated talent that already masters the critical stack.',
      visual: 'modern',
    },
  ],
  process: [
    {
      title: 'Diagnosis and target architecture',
      description:
        'We assess the current architecture, define archetypes, standards, the C4 model and a modernization roadmap aligned to the business.',
    },
    {
      title: 'Detailed design and governance',
      description:
        'We define HLD/LLD, security models, API governance, data governance, cloud networks and deployment guidelines.',
    },
    {
      title: 'Capability-based implementation',
      description:
        'We deliver Kubernetes, API Management, enterprise backend, H2H integrations, observability and secure CI/CD.',
    },
    {
      title: 'Operation, support and transfer',
      description:
        'We support with hardening, monitoring, training, technical manuals and knowledge transfer to your team.',
    },
  ],
  offers: [
    'Enterprise software architecture and C4 modeling',
    'AWS/GCP/Azure cloud, hybrid and on-premise',
    'Enterprise, multicluster Kubernetes platform',
    'Hybrid API Management with Kong, Apigee, MuleSoft and webMethods',
    'H2H banking integrations with SFTP, ISO 20022 and PGP/GPG',
    'Java/Spring Boot backend and reactive microservices',
    'Frontend and microfrontends with React, Angular and Vue',
    'Application security, OAuth2/mTLS, Keycloak and Vault',
    'DevSecOps, CI/CD, GitOps and Infrastructure as Code',
    'Observability with Prometheus, Grafana and OpenTelemetry',
    'PostgreSQL, Oracle, SQL Server and NoSQL databases',
    'Data Engineering, BI and AI with BigQuery, Dataflow and LLMs',
    'Fintech architecture, accounting ledger and payment platforms',
    'Real-time promotional engines and iGaming',
    'Consulting, workshops and knowledge transfer',
    'Staffing and team augmentation with senior nearshore talent',
  ],
  contact: {
    title: 'Ready to put your technology in order?',
    subtitle: "Let's talk for 30 minutes. Free, no commitment. We assess your current situation and tell you what we would do first.",
    phone: '+51 929 913 524',
    phoneHref: 'tel:+51929913524',
    email: 'team@develtrex.com',
    emailHref: 'mailto:team@develtrex.com',
    whatsappHref: 'https://api.whatsapp.com/send?phone=51929913524',
  },
};
