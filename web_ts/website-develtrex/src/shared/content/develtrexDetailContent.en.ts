import type { ProductDetail, ServiceDetail } from './develtrexDetailContent';

export const productDetailsEn: ProductDetail[] = [
  {
    slug: 'assessment-ejecutivo',
    intro:
      'An in-depth diagnostic of the real state of your technology architecture: applications, APIs, data, infrastructure, security, and operations. The outcome is an objective baseline that lets you make investment decisions grounded in evidence, prioritize the highest-impact initiatives, and build a transformation roadmap aligned with your business goals.',
    forWho:
      'CTOs, CIOs, and IT managers who need clarity on the true state of their technology before investing, scaling, or transforming. Ideal for organizations with heterogeneous systems, accumulated technical debt, rapid growth, mergers, or those preparing for a capital raise.',
    benefits: [
      'Complete visibility into your map of applications, APIs, and infrastructure',
      'Identification of critical security risks and single points of failure',
      'Quick wins prioritized by business impact and technical effort',
      'An executive roadmap aligned with strategic objectives',
      'A solid, evidence-based foundation for technology investment decisions',
      'Elimination of hidden technical debt that slows growth',
    ],
    process: [
      { step: 'Kick-off and scope definition', detail: 'We align objectives, the domains to be evaluated, criticality criteria, and the work plan with key stakeholders.' },
      { step: 'Inventory and AS-IS analysis', detail: 'We gather information on applications, APIs, infrastructure, data, security, and operations through interviews, workshops, and review of existing artifacts.' },
      { step: 'Gap and risk assessment', detail: 'We analyze risks, technical debt, critical dependencies, compliance, and missing capabilities against best practices.' },
      { step: 'Roadmap and prioritization', detail: 'We build the TO-BE capability map, identify quick wins, and organize initiatives by impact, urgency, and cost.' },
      { step: 'Executive presentation', detail: 'We deliver the results with a clear business narrative for decision-makers, along with actionable recommendations.' },
    ],
    deliverables: [
      'Application and capability map (AS-IS)',
      'Risk matrix and critical dependencies',
      'Prioritized catalog of gaps and technical debt',
      'Transformation roadmap with initiatives and estimated effort',
      'Executive presentation ready for leadership and the board',
    ],
    faqs: [
      { q: 'How intrusive is the assessment process?', a: 'It is primarily observation and interviews. We make no changes to production systems. The operational impact is minimal — we estimate 2 to 4 hours of your specialists\' time per session.' },
      { q: 'Do we need existing documentation?', a: 'It is not essential. Part of the value of the assessment is discovering and documenting what has not been documented. We work with the information available and fill in the gaps.' },
      { q: 'How is this different from other diagnostics?', a: 'We cover every technology domain in a single engagement: apps, APIs, data, infrastructure, security, and operations. The result is actionable and presented in executive language, not just technical detail.' },
    ],
  },
  {
    slug: 'api-management-hibrido',
    intro:
      'We design and implement an API Management platform that governs the full lifecycle of your APIs: from design and publishing through operation, monitoring, and deprecation. We combine a centralized Control Plane with distributed Data Planes to cover multi-cloud and on-premise environments under a single governance layer.',
    forWho:
      'Companies with multiple internal, external, or B2B APIs that need centralized governance, standardized security, and usage visibility. Ideal for organizations opening up digitally, building partner ecosystems, or looking to monetize their APIs as a product.',
    benefits: [
      'Centralized control of all your APIs from a single management plane',
      'Robust security with OAuth2, OIDC, JWT, mTLS, WAF, and OWASP API Top 10',
      'End-to-end visibility with per-API metrics, traces, and alerts',
      'A DevPortal for self-service consumption by internal teams and partners',
      'An API Factory to standardize the lifecycle of new APIs',
      'Multi-cloud and on-premise support with distributed Data Planes',
    ],
    process: [
      { step: 'API and ecosystem assessment', detail: 'We inventory existing APIs, consumption patterns, security gaps, and current governance.' },
      { step: 'Architecture design', detail: 'We define the HLD/LLD, the Control Plane/Data Plane model, security policies, and the API Design standard.' },
      { step: 'Control Plane implementation', detail: 'We deploy the central governance layer, the developer portal, and the API catalog.' },
      { step: 'Migration of existing APIs', detail: 'We onboard existing APIs into the governance model with security policies and observability.' },
      { step: 'API Factory and DevSecOps', detail: 'We implement CI/CD pipelines for APIs, security analysis, and a standard publishing process.' },
      { step: 'Go-live and operation', detail: 'Team training, knowledge transfer, and support during the first months of operation.' },
    ],
    deliverables: [
      'API Management architecture HLD/LLD',
      'Configured, operational Control Plane and Data Planes',
      'DevPortal with a published API catalog',
      'OAuth2, mTLS, rate limiting, and WAF security policies',
      'API Factory pipelines with integrated DevSecOps',
      'Operational runbooks and technical documentation',
    ],
    faqs: [
      { q: 'Which API Management platforms do you use?', a: 'We work with the leading platforms on the market: Kong, Apigee, AWS API Gateway, Azure APIM, and open-source solutions such as Gravitee. The choice depends on your ecosystem, budget, and requirements.' },
      { q: 'Can APIs already in production be migrated?', a: 'Yes. We carry out the migration gradually, with coexistence periods, without affecting the availability of production APIs.' },
      { q: 'Do we need to change the code of our APIs?', a: 'In most cases, no. API Management acts as an intermediary layer. Only minor authentication adjustments may be required, depending on the security model adopted.' },
    ],
  },
  {
    slug: 'observabilidad-360',
    intro:
      'We implement an observability platform that consolidates logs, metrics, and traces from all your APIs, services, Kubernetes, databases, and infrastructure into a single point of visibility. With SLOs, SLIs, and actionable alerts, your operations teams move from reacting to anticipating incidents before they impact the business.',
    forWho:
      'Operations, SRE, and platform teams that need real visibility into their critical services. Ideal for organizations with multiple distributed services, heavy reliance on APIs and Kubernetes, or those looking to reduce incident detection and resolution time.',
    benefits: [
      'Unified visibility of logs, metrics, and traces in a single pane',
      'A significant reduction in MTTD and MTTR for critical incidents',
      'SLOs and SLIs defined with alerts based on business objectives',
      'End-to-end traceability of requests across microservices',
      'Executive and operational dashboards ready to use',
      'An NOC/SRE operating model with runbooks and defined escalation',
    ],
    process: [
      { step: 'Assessment of current observability', detail: 'We evaluate existing tools, instrumentation coverage, current alerts, and visibility gaps.' },
      { step: 'Observability architecture design', detail: 'We define the technology stack, data model, retention, alerting, and SLO policy.' },
      { step: 'Service instrumentation', detail: 'We install agents, beats, exporters, and tracing SDKs across APIs, Kubernetes, databases, and infrastructure.' },
      { step: 'Dashboards and alerts', detail: 'We build operational and executive dashboards, and configure intelligent alerting and noise suppression.' },
      { step: 'NOC/SRE operating model', detail: 'We define runbooks, escalation flows, on-call rotations, and the incident management process.' },
    ],
    deliverables: [
      'An operational Elastic/APM/Kibana or Prometheus/Grafana/Jaeger/Loki stack',
      'Complete instrumentation of APIs, Kubernetes, and infrastructure',
      'Configured and documented SLOs, SLIs, and alerts',
      'Operational and executive dashboards',
      'Incident response runbooks',
      'A documented NOC/SRE operating model',
    ],
    faqs: [
      { q: 'Which observability tools do you use?', a: 'We work with the Elastic Stack (Elasticsearch, APM, Kibana, Beats), Prometheus, Grafana, Jaeger, OpenTelemetry, and Loki. We also integrate with Datadog, New Relic, and other existing tools.' },
      { q: 'How much performance overhead does the instrumentation add?', a: 'The impact is typically under 2-3% of CPU and memory. We use intelligent sampling for distributed traces and optimize metric collection to minimize overhead.' },
      { q: 'Can it integrate with ITSM tools like ServiceNow or Jira?', a: 'Yes. We integrate alerts with ITSM systems for automatic ticket creation, incident correlation, and approval workflows.' },
    ],
  },
  {
    slug: 'drp-ciberresiliente',
    intro:
      'We design and implement a disaster recovery plan that protects your critical systems against failures, natural disasters, and ransomware attacks. We combine a BIA, a validated DR strategy, immutable backup, and cyber recovery to ensure your organization can restore operations within the committed RTO and RPO.',
    forWho:
      'Companies with critical systems that cannot afford prolonged downtime. Essential for organizations in regulated sectors, those dependent on ERP systems, APIs, or e-commerce platforms, or those that have suffered previous security incidents.',
    benefits: [
      'RTO and RPO validated through real drills, not just documentation',
      'Protection against ransomware with immutable, air-gapped backup',
      'Automated or semi-automated failover for critical services',
      'Detailed runbooks that enable recovery without the original technical team',
      'Compliance with operational continuity regulations',
      'Reduced reputational and financial risk in the event of incidents',
    ],
    process: [
      { step: 'BIA and criticality analysis', detail: 'We identify critical processes, technology dependencies, the impact per hour of downtime, and acceptable RTO/RPO thresholds.' },
      { step: 'DR strategy', detail: 'We define the appropriate DR architecture — pilot light, warm standby, or active/passive — based on criticality, cost, and recovery time.' },
      { step: 'DR infrastructure implementation', detail: 'We deploy the recovery architecture, configure data replication, and automate failover procedures.' },
      { step: 'Immutable backup and cyber recovery', detail: 'We implement backup with ransomware protection, immutable retention, and validated cyber recovery procedures.' },
      { step: 'Drills and validation', detail: 'We run failover and failback tests, measure actual RTO/RPO, and adjust runbooks based on the results.' },
    ],
    deliverables: [
      'A complete BIA with criticality and financial impact analysis',
      'A designed and implemented DR architecture',
      'Operational immutable backup with configured retention',
      'Failover, failback, and cyber recovery runbooks',
      'Documented drill results with measured RTO/RPO',
      'A managed DR plan with a schedule of periodic tests',
    ],
    faqs: [
      { q: 'How much does it cost to maintain the DR infrastructure?', a: 'It depends on the strategy. A pilot light can cost 10-20% of your production infrastructure; a warm standby, 40-60%. We optimize costs with FinOps so that DR is economically sustainable.' },
      { q: 'What is cyber recovery, and how does it differ from traditional DR?', a: 'Traditional DR recovers from hardware failures or disasters. Cyber recovery adds the ability to recover from ransomware or the intentional destruction of data, using isolated (air-gapped) backups that attackers cannot encrypt.' },
      { q: 'How often should drills be run?', a: 'We recommend at least two drills per year for critical systems. We include a testing schedule in the managed DR operations service.' },
    ],
  },
  {
    slug: 'kubernetes-empresarial',
    intro:
      'We build and operate enterprise-grade Kubernetes platforms that support critical production workloads. From multicluster architecture design through service mesh implementation, Zero Trust security, GitOps, and full observability. We deliver a cloud-native platform ready to scale, built to the highest security and operational standards.',
    forWho:
      'Platform and infrastructure teams migrating workloads to cloud-native, looking to standardize Kubernetes across multiple development teams, or seeking greater security, automation, and observability in their existing clusters.',
    benefits: [
      'A standardized K8S platform ready for multiple development teams',
      'A service mesh with Istio and mTLS for secure communication between microservices',
      'GitOps with ArgoCD for traceable, auditable, and reversible deployments',
      'Native observability with Prometheus, Grafana, Loki, and Jaeger',
      'Security hardening with Vault, Cert-Manager, and network policies',
      'Support for on-premise, cloud, and hybrid clusters',
    ],
    process: [
      { step: 'Kubernetes assessment', detail: 'We evaluate the current state, workloads to migrate, security and networking requirements, and the multicluster strategy.' },
      { step: 'HLD/LLD design', detail: 'We design the cluster, network, storage, service mesh, security, and deployment strategy architecture.' },
      { step: 'Cluster implementation', detail: 'We deploy on-premise, cloud, or hybrid clusters with the defined networking, RBAC, and policy configurations.' },
      { step: 'Service mesh and security', detail: 'We implement Istio, mTLS, Vault for secrets, Cert-Manager, and Zero Trust between services.' },
      { step: 'GitOps and observability', detail: 'We configure ArgoCD for GitOps and instrument with Prometheus, Grafana, Loki, and Jaeger.' },
      { step: 'Hardening and handover', detail: 'We apply CIS hardening, network policies, and auditing, and train the team on day-to-day operations.' },
    ],
    deliverables: [
      'Production Kubernetes clusters, configured and documented',
      'An operational service mesh with Istio and mTLS',
      'GitOps with ArgoCD for all deployments',
      'A Prometheus/Grafana/Loki/Jaeger observability stack',
      'Documented security policies, RBAC, and CIS hardening',
      'Operational runbooks and team training',
    ],
    faqs: [
      { q: 'Which Kubernetes distribution do you use?', a: 'It depends on the environment: EKS (AWS), GKE (GCP), AKS (Azure), OpenShift, or RKE2/K3s for on-premise. The choice is based on your current infrastructure, requirements, and team.' },
      { q: 'Can you migrate legacy applications to Kubernetes?', a: 'Yes. We handle containerization and application adaptation. Not every application is an ideal candidate for K8S — part of the assessment is determining what to move and what not to.' },
      { q: 'What about support after implementation?', a: 'We offer our Managed Services / Managed DevSecOps to operate the K8S platform with an SLA, monitoring, and continuous improvement.' },
    ],
  },
  {
    slug: 'devsecops-managed',
    intro:
      'We support your organization in the continuous operation of APIs, Kubernetes, observability, DRP, and deployments using SRE, ITIL, and FinOps practices. We act as an extension of your platform team, ensuring your critical technology capabilities run with governance, traceability, and continuous improvement.',
    forWho:
      'Companies that have implemented cloud-native capabilities and need to operate them without building a full in-house SRE team. Ideal for organizations with a limited operations budget that want guaranteed SLAs and continuous improvement without hiring a large team.',
    benefits: [
      'Managed operation with committed SLAs and response times',
      'DORA metrics to measure and improve delivery speed',
      'FinOps to optimize cloud costs without sacrificing performance',
      'Capacity planning to anticipate growth before it becomes a crisis',
      'CI/CD pipelines with integrated SAST/DAST/SCA security controls',
      'Monthly reports on operations, capacity, and improvements delivered',
    ],
    process: [
      { step: 'DevSecOps maturity assessment', detail: 'We evaluate pipelines, processes, tools, current DORA metrics, and security gaps in the delivery cycle.' },
      { step: 'Pipeline implementation', detail: 'We build or improve CI/CD pipelines with SAST/DAST security analysis, container scanning, and GitOps.' },
      { step: 'Operating model', detail: 'We define the operating model: SLAs, shifts, support channels, escalation, and the incident management process.' },
      { step: 'Onboarding and handover', detail: 'We onboard the platform inventory, establish a monitoring baseline, and set up operational dashboards.' },
      { step: 'Continuous operation and improvement', detail: 'We operate on a monthly cadence of metrics review, capacity planning, FinOps, and an improvement roadmap.' },
    ],
    deliverables: [
      'CI/CD pipelines with integrated security (SAST, DAST, SCA)',
      'A documented operating model with SLAs and escalation',
      'A dashboard of DORA and operational metrics',
      'Monthly operations and FinOps reports',
      'Capacity planning and proactive recommendations',
      'Up-to-date runbooks and knowledge management',
    ],
    faqs: [
      { q: 'How many of your team members work on our service?', a: 'We assign a dedicated team based on scope: at minimum, a responsible senior SRE with backing from the platform team. This is not a call-center service — they know your environment in depth.' },
      { q: 'Which DORA metrics do you measure?', a: 'The four key metrics: deployment frequency, change lead time, change failure rate, and time to recovery (MTTR). Together they objectively show whether your team is improving over time.' },
      { q: 'Can we cancel the service if we are not satisfied?', a: 'The service has a minimum term of 3 months so that results are measurable. After that, the contract is monthly. We include an orderly offboarding process if you decide to end it.' },
    ],
  },
  {
    slug: 'softcommerce-erp',
    intro:
      'Softcommerce is an ERP designed specifically for Peruvian companies that need to issue SUNAT-certified electronic invoices and manage their accounting, inventory, treasury, and financial reporting in a single system. Available as a cloud service or an in-house installation, with local support and updates whenever SUNAT regulations change.',
    forWho:
      'Peruvian companies of any size that issue electronic invoices, receipts, and credit and debit notes; that manage inventory across multiple warehouses; and that need real-time financial visibility without relying on spreadsheets or disconnected systems.',
    benefits: [
      'SUNAT-certified electronic invoicing — 100% compliant with current regulations',
      'Kardex inventory with weighted average, FIFO, and multiple warehouses',
      'Integrated accounting with automatic journal entries for every transaction',
      'Treasury: cash flow, accounts receivable and payable with aging',
      'Real-time financial reports: P&L, balance sheet, SUNAT',
      'Automatic notifications of due dates and outstanding debts',
    ],
    process: [
      { step: 'Initial setup', detail: 'We configure the company, chart of accounts, document series, warehouses, and product/service catalog.' },
      { step: 'Data migration', detail: 'We import opening balances, inventory, customers, suppliers, and accounts receivable/payable from the previous system.' },
      { step: 'Team training', detail: 'We train users on invoicing, inventory, treasury, and report generation according to their role.' },
      { step: 'Coexistence period', detail: 'We run in parallel with the previous system for 2 weeks to validate data consistency.' },
      { step: 'Go-live and support', detail: 'We activate the system in production with intensive support during the first month and ongoing support thereafter.' },
    ],
    deliverables: [
      'A configured, operational system in the cloud or in-house',
      'Activated and certified SUNAT integration',
      'Validated migration of historical data',
      'Users trained by role (administrator, salesperson, warehouse, accounting)',
      'A user manual and process guides',
      'Technical support included (cloud) or by contract (in-house)',
    ],
    faqs: [
      { q: 'What is the difference between the Cloud and In-house options?', a: 'Cloud (S/ 1,200/month) includes hosting, updates, and support — with no upfront investment. In-house (S/ 5,990 one-time payment) is installed on your servers; annual maintenance is charged separately. The cloud option is recommended for most companies for its simplicity and lower total cost.' },
      { q: 'Is it kept up to date with SUNAT changes?', a: 'Yes. We include automatic updates for SUNAT regulatory changes at no additional cost on the cloud option.' },
      { q: 'Can it integrate with my online store or marketplace?', a: 'We have integration APIs available for e-commerce and marketplaces. The scope depends on the platform you use — contact us to assess the specific integration.' },
    ],
  },
];


export const serviceDetailsEn: ServiceDetail[] = [
  {
    slug: 'arquitectura-software',
    intro:
      'We define, design, document, and govern software architectures for critical enterprise systems. From diagnosing the current architecture to designing the target state based on microservices and cloud-native principles, with C4 modeling and standards that make technology evolution sustainable.',
    forWho:
      'CTOs, architects, and technical leaders who need to organize and modernize heterogeneous platforms, reduce technical debt, and align business and technology before scaling or transforming.',
    benefits: [
      'A clear, documented reference architecture with a C4 model',
      'A modernization roadmap prioritized by impact and effort',
      'Standards, integration patterns, and performance and security guidelines',
      'Architecture governance that prevents inconsistent decisions',
      'A technical risk matrix with evolution recommendations',
    ],
    approach: [
      'Diagnosis of the current architecture (AS-IS)',
      'Design of the target architecture and software archetypes',
      'C4 modeling and definition of standards',
      'Modernization roadmap and risk matrix',
      'Technical review and ongoing governance',
    ],
    faqs: [
      { q: 'Do you work on existing architectures or only new ones?', a: 'Both. We start from a diagnosis of what you already have and design the evolution toward the target state without disrupting operations.' },
      { q: 'What deliverables do I receive?', a: 'A diagnostic report, reference architecture, C4 diagrams, a modernization roadmap, guidelines, and a technical risk matrix.' },
    ],
  },
  {
    slug: 'cloud-hibrido',
    intro:
      'We design and implement modern technology infrastructure on AWS, GCP, Azure, and on-premise environments. Landing zones, network segmentation, multi-environment architectures (DEV/QA/STG/PRD), high availability, and hybrid connectivity, with a focus on security and cost optimization.',
    forWho:
      'Organizations that are migrating to or growing in the cloud, need to integrate on-premise with the cloud, or require a secure, resilient infrastructure foundation with costs under control.',
    benefits: [
      'Landing zones and a well-governed account/VPC structure',
      'Network segmentation and hybrid connectivity (Transit Gateway, PrivateLink, CloudWAN)',
      'Multi-environment architectures with high availability and resilience',
      'An egress/ingress strategy and cloud security',
      'Cloud cost optimization and estimation',
    ],
    approach: [
      'Assessment of requirements and workload domains',
      'Design of landing zone, networks, and segmentation',
      'Definition of environments and high availability',
      'Integration with managed services and security',
      'Implementation roadmap and cost estimation',
    ],
    faqs: [
      { q: 'AWS only, or GCP and Azure as well?', a: 'We design on AWS, GCP, and Azure, as well as on-premise and hybrid. We recommend the best option per domain based on criticality, security, and cost.' },
      { q: 'Does it include cost estimation?', a: 'Yes. We deliver a cost estimate and optimization recommendations as part of the design.' },
    ],
  },
  {
    slug: 'backend-enterprise',
    intro:
      'We design, build, and modernize enterprise backend services: microservices, REST APIs, and reactive services with Java, Spring Boot, and hexagonal architecture. Transactional, auditable, and traceable services, integrated with relational and NoSQL databases and with external systems.',
    forWho:
      'Companies that need a robust backend for banking, insurance, government, retail, gaming, or fintech, or that are looking to refactor and modernize legacy applications.',
    benefits: [
      'Well-designed, well-documented microservices and REST APIs',
      'A maintainable, testable hexagonal architecture',
      'Transactional services with auditing and traceability',
      'Integrated authentication and authorization (Keycloak, OAuth2)',
      'Integration with relational and NoSQL databases',
    ],
    approach: [
      'Layer design and hexagonal architecture',
      'Development of microservices and APIs',
      'Implementation of security, auditing, and traceability',
      'Functional and non-functional testing',
      'Technical documentation and legacy modernization',
    ],
    faqs: [
      { q: 'What stack do you use on the backend?', a: 'Primarily Java, Spring Boot, Spring Cloud, and WebFlux, as well as Node.js and Quarkus depending on the case, with PostgreSQL, Oracle, SQL Server, MySQL, and Redis.' },
      { q: 'Can you modernize legacy applications?', a: 'Yes. We refactor and modernize existing applications toward microservices without disrupting operations.' },
    ],
  },
  {
    slug: 'frontend-microfrontends',
    intro:
      'We design and build modern web applications, enterprise interfaces, and digital channels with React, Angular, Vue, and TypeScript. Microfrontends, SSR, integration with BFF and APIs, and component standardization to accelerate delivery.',
    forWho:
      'Organizations that need high-quality digital channels, enterprise portals, or to migrate monolithic frontends toward scalable microfrontends.',
    benefits: [
      'Modern, responsive web applications',
      'Microfrontends that scale by team and domain',
      'SSR for performance and SEO',
      'Clean integration with BFF and APIs',
      'Standardized components and frontend guidelines',
    ],
    approach: [
      'Definition of frontend and microfrontend architecture',
      'Design of experience and responsive interfaces',
      'Integration with BFF/APIs and SSR',
      'Standardization of UI components',
      'Deployment documentation',
    ],
    faqs: [
      { q: 'React, Angular, or Vue?', a: 'We work with all three, as well as TypeScript, SSR, and microfrontends. We recommend the most suitable one based on your team and context.' },
      { q: 'What are microfrontends, and when do they make sense?', a: 'They let you split a large web app into independent parts by team or domain. They make sense when several teams evolve the same site in parallel.' },
    ],
  },
  {
    slug: 'api-management',
    intro:
      'We design, evaluate, govern, and implement API Management and enterprise integration platforms. API First architecture, API governance, public and private gateways, BFF, security with OAuth2/OIDC/JWT/mTLS, and hybrid cloud/on-premise integration.',
    forWho:
      'Companies that expose internal, external, or B2B APIs and need to govern and secure them, or to evaluate or modernize their integration platform.',
    benefits: [
      'Comparative evaluation of API Management platforms',
      'API First architecture and API governance',
      'API security with OAuth2, OIDC, JWT, and mTLS',
      'Developer Portal and API lifecycle',
      'Hybrid integration with backends on Kubernetes and VMs',
    ],
    approach: [
      'Platform evaluation and target architecture',
      'API First design and governance model',
      'Design of gateways, BFF, and OpenAPI contracts',
      'Implementation of API security and observability',
      'Developer Portal and publishing standards',
    ],
    faqs: [
      { q: 'Which platforms do you work with?', a: 'Kong Konnect, IBM webMethods/IWHI, MuleSoft Anypoint, Apigee Hybrid, and AWS API Gateway, among others. We help you evaluate which one fits best.' },
      { q: 'Can you integrate cloud and on-premise?', a: 'Yes. We design hybrid integration with a centralized control plane and distributed data planes.' },
    ],
  },
  {
    slug: 'integraciones-h2h',
    intro:
      'We design and implement secure, traceable banking integrations: Host-to-Host channels with SFTP, XML/TXT exchange, ISO 20022, file encryption and signing with PGP/GPG, reconciliation, bank parameterization, and idempotency controls.',
    forWho:
      'Fintechs, banks, and companies that operate mass payments, collections, and transfers with financial institutions and require critical, regulated integrations.',
    benefits: [
      'A secure H2H channel with SFTP and PGP/GPG encryption',
      'Standardized XML/TXT and ISO 20022 exchange',
      'Operational traceability and reconciliation',
      'Idempotency and consistency controls',
      'Temporary and definitive accounting models',
    ],
    approach: [
      'Design of the H2H channel and file security model',
      'Definition of payment flows and supported operations',
      'Implementation of encryption, signing, and transfer',
      'Design of reconciliation and traceability',
      'H2H operations guide and testing',
    ],
    faqs: [
      { q: 'Which institutions or formats do you support?', a: 'We work with banking standards such as SFTP, XML/TXT, ISO 20022, and PGP/GPG, adapting to each institution\'s parameterization.' },
      { q: 'How do you ensure operations are not duplicated?', a: 'We design idempotency and consistency controls, along with end-to-end traceability and reconciliation.' },
    ],
  },
  {
    slug: 'kubernetes',
    intro:
      'We design, implement, and govern enterprise Kubernetes platforms, in the cloud and on-premise. Multicluster architecture by domain and environment, namespaces, RBAC, network policies, service mesh, mTLS communication, ingress, and operation integrated with observability and DevSecOps.',
    forWho:
      'Organizations adopting containers at scale, that need governed multicluster setups, or that want a secure, operable cloud-native platform.',
    benefits: [
      'Multicluster architecture by domain, environment, and workload',
      'Well-defined RBAC, quotas, and network policies',
      'Service mesh and secure communication with mTLS',
      'Ingress and L2/L3/L7 load balancing',
      'Operation integrated with observability and GitOps',
    ],
    approach: [
      'Assessment and platform design (HLD/LLD)',
      'Cluster implementation and namespace model',
      'Configuration of RBAC, policies, and service mesh',
      'Integration with observability and DevSecOps',
      'Operations guidelines and handover',
    ],
    faqs: [
      { q: 'Cloud, on-premise, or both?', a: 'We design Kubernetes on EKS and other cloud environments, on-premise, and hybrid, with a multicluster approach.' },
      { q: 'Does it include service mesh and security?', a: 'Yes. We design service mesh, mTLS, RBAC, and network policies, integrated with Vault, Cert-Manager, and Keycloak as appropriate.' },
    ],
  },
  {
    slug: 'devops-cicd',
    intro:
      'We automate the development, deployment, and operations lifecycle. CI/CD pipelines, GitOps, Infrastructure as Code with Terraform, deployments on Kubernetes with Helm, branching strategy, environment automation, and artifact governance.',
    forWho:
      'Teams that deploy manually or inconsistently and need speed, traceability, and repeatable, governed deployments.',
    benefits: [
      'Standardized, repeatable CI/CD pipelines',
      'GitOps and Infrastructure as Code with Terraform',
      'Deployments on Kubernetes with Helm',
      'Automation of environments and testing',
      'Versioning and artifact governance',
    ],
    approach: [
      'Design of pipelines and branching strategy',
      'Implementation of CI/CD and GitOps',
      'Infrastructure as code and templates',
      'Automation of environments and deployments',
      'Deployment and operations guides',
    ],
    faqs: [
      { q: 'What tools do you use?', a: 'Git, GitHub/GitLab, Jenkins, Docker, Kubernetes, Helm, and Terraform, with a GitOps approach and reusable templates.' },
      { q: 'Does it integrate with my current workflow?', a: 'Yes. We adapt the strategy to your current repositories, environments, and practices, elevating them incrementally.' },
    ],
  },
  {
    slug: 'devsecops',
    intro:
      'We embed security into design, development, deployment, and operations. OAuth2/OIDC, Keycloak and Microsoft Entra ID, JWT token handling, mTLS, secrets and certificate management with Vault, app and container hardening, security in APIs and Kubernetes, and auditing.',
    forWho:
      'Organizations in regulated sectors or with sensitive data that need security by architecture, not as a last-minute patch.',
    benefits: [
      'A security-by-architecture model and a controls matrix',
      'Authentication and authorization with OAuth2/OIDC and Keycloak/Entra ID',
      'mTLS, secrets, and certificate management with Vault',
      'Hardening of applications and containers',
      'Auditing, traceability, and RBAC/network policies',
    ],
    approach: [
      'Security-by-architecture design',
      'Implementation of identity, tokens, and mTLS',
      'Secrets and certificate management',
      'Hardening and security in APIs and Kubernetes',
      'Auditing and DevSecOps guidelines',
    ],
    faqs: [
      { q: 'Do you use Keycloak or Entra ID?', a: 'Both, depending on your ecosystem. We integrate OAuth2/OIDC, JWT, and mTLS with Keycloak or Microsoft Entra ID.' },
      { q: 'How do you manage secrets and certificates?', a: 'With Vault and Cert-Manager, defining secrets management models and the certificate lifecycle.' },
    ],
  },
  {
    slug: 'observabilidad',
    intro:
      'We give platforms, microservices, APIs, and infrastructure both technical and operational visibility. Log centralization, infrastructure and application metrics, distributed tracing, monitoring of APIs, Kubernetes, and databases, dashboards, and actionable alerts.',
    forWho:
      'Teams that operate critical services and need to detect and resolve incidents quickly, with evidence and end-to-end traceability.',
    benefits: [
      'A comprehensive observability model (logs, metrics, traces)',
      'Distributed tracing across APIs and microservices',
      'Monitoring of Kubernetes, infrastructure, and databases',
      'Dashboards and actionable alerts',
      'Reduced incident detection and resolution time',
    ],
    approach: [
      'Design of the observability model',
      'Centralization of logs and metrics',
      'Instrumentation of distributed tracing',
      'Dashboards, alerts, and metrics matrices',
      'Monitoring and troubleshooting guides',
    ],
    faqs: [
      { q: 'Which observability tools do you use?', a: 'CloudWatch, X-Ray, Prometheus, Grafana, and OpenTelemetry, depending on your cloud and on-premise stack.' },
      { q: 'Does it help reduce incident time?', a: 'Yes. The goal is to reduce detection and resolution time with well-defined traceability, dashboards, and alerts.' },
    ],
  },
  {
    slug: 'bases-datos',
    intro:
      'We design, optimize, and govern enterprise data models. Transactional and financial models, catalogs and parameterization, JSONB, auditing and traceability, query optimization, partitioning, concurrency strategies, and engine migration.',
    forWho:
      'Organizations with critical databases that require performance, integrity, and a solid data model for transactional and financial operations.',
    benefits: [
      'Well-designed logical and physical models',
      'Query optimization and partitioning',
      'Concurrency and integrity strategies',
      'A data dictionary and naming guidelines',
      'A roadmap and evaluation of database engines',
    ],
    approach: [
      'Design of transactional and financial models',
      'Optimization, partitioning, and concurrency',
      'Auditing, traceability, and JSONB where applicable',
      'DDL/DML scripts and data dictionary',
      'Roadmap and engine migration',
    ],
    faqs: [
      { q: 'Which engines do you handle?', a: 'PostgreSQL (including 18 and Aurora), SQL Server, Oracle, MySQL, DynamoDB, Firestore, and Redis.' },
      { q: 'Can you migrate or modernize my database?', a: 'Yes. We evaluate the current engine, design the target, and execute the migration with a low-risk roadmap.' },
    ],
  },
  {
    slug: 'data-bi-ia',
    intro:
      'We harness data, analytics, business intelligence, and applied artificial intelligence. Design of data platforms and data lakes, ETL/ELT processes, analytical modeling, KPIs, data lineage, Big Data integration, and AI and automation use cases.',
    forWho:
      'Organizations that need to turn critical data into decisions: reporting, KPIs, data governance, and applied AI.',
    benefits: [
      'Data architecture and data lake',
      'ETL/ELT processes and analytical modeling',
      'BI dashboards and business KPIs',
      'Data lineage and governance',
      'AI and automation use cases with LLMs',
    ],
    approach: [
      'Design of the data platform and data lake',
      'Data integration from transactional systems',
      'ETL/ELT processes and analytical modeling',
      'BI dashboards and KPIs',
      'AI use cases and governance recommendations',
    ],
    faqs: [
      { q: 'Which data technologies do you use?', a: 'BigQuery, Pub/Sub, Dataflow, Looker Studio, and Firestore, as well as Big Data platforms and AI/LLM models.' },
      { q: 'Does AI apply to my business?', a: 'We evaluate concrete use cases (automation, analytics, LLMs) with measurable impact, without generic promises.' },
    ],
  },
  {
    slug: 'fintech-pagos',
    intro:
      'We design financial platforms, wallets, payments, reconciliation, and accounting ledgers. Transactional core, double-entry ledger, fee engine, issuance and movements, highly available payment architecture, financial traceability, and financial APIs.',
    forWho:
      'Fintechs and companies building or modernizing payment platforms, wallets, and financial operations that demand consistency and high availability.',
    benefits: [
      'Transactional core and double-entry ledger',
      'Reconciliation and consistency controls',
      'Highly available payment architecture',
      'End-to-end financial traceability',
      'Financial APIs and data models',
    ],
    approach: [
      'Design of the transactional core and ledger',
      'Operations and reconciliation model',
      'Payment architecture and high availability',
      'Design of financial APIs',
      'Roadmap, backlog, and estimation',
    ],
    faqs: [
      { q: 'What is a double-entry ledger, and why does it matter?', a: 'It is an accounting model that guarantees consistency and financial integrity in every operation. It is the foundation of a reliable payment platform.' },
      { q: 'What infrastructure do you deploy it on?', a: 'Typically AWS and Kubernetes, with PostgreSQL/RDS, Redis, Kafka, API Gateway, and Keycloak, designed for high availability.' },
    ],
  },
  {
    slug: 'igaming',
    intro:
      'We design promotional platforms for online casino, gaming, and iGaming. Promotional engines, missions, challenges and quests, audiences, prizes, wheels, multipliers, scorecards, business rules, per-guest traceability, and an architecture for real-time campaigns.',
    forWho:
      'iGaming and online casino operators that need flexible promotion engines, real-time campaigns, and configurable business rules.',
    benefits: [
      'A promotional engine with configurable rules',
      'Missions, challenges, wheels, and multipliers',
      'Audience segmentation and prizes',
      'Per-guest traceability',
      'An event-driven architecture for real time',
    ],
    approach: [
      'Functional document and market benchmark',
      'Design of the promotional engine and rules model',
      'Prizes, audiences, and traceability model',
      'Batch and streaming architecture',
      'MVP roadmap and functional backlog',
    ],
    faqs: [
      { q: 'Does it integrate with my gaming platform?', a: 'We design the engine with APIs and an event-driven architecture to integrate with your platform and event sources.' },
      { q: 'Does it support real-time campaigns?', a: 'Yes. The architecture accounts for batch and streaming processing for real-time campaigns and rules.' },
    ],
  },
  {
    slug: 'consultoria-capacitacion',
    intro:
      'We support technical teams in adopting new architectures, platforms, and practices. Technical and functional training, workshops on architecture, Kubernetes, API Management, and DevSecOps, support during proofs of concept and deployments, and knowledge transfer.',
    forWho:
      'IT teams adopting new platforms that want genuine autonomy, with knowledge transferred and support throughout adoption.',
    benefits: [
      'Hands-on workshops and learning paths',
      'Support during proofs of concept and deployments',
      'Documented knowledge transfer',
      'Technical and operations manuals',
      'Support and assistance with questions after implementation',
    ],
    approach: [
      'Training plan and materials',
      'Workshops on architecture, Kubernetes, APIs, and DevSecOps',
      'Support during PoCs and deployments',
      'Minutes and record of transfer',
      'Support and follow-up afterward',
    ],
    faqs: [
      { q: 'Are the workshops tailored?', a: 'Yes. We design the plan based on your team\'s level and the technologies they are adopting.' },
      { q: 'Do you provide support after the training?', a: 'Yes. We offer post-implementation support and assistance with technical questions.' },
    ],
  },
  {
    slug: 'staffing',
    intro:
      'We strengthen your team with senior profiles vetted in architecture, cloud, Java/Spring backend, DevSecOps, Kubernetes, API Management, and data. A nearshore model, with fast onboarding and talent that already masters the critical stack — by project, by squad, or full dedication.',
    forWho:
      'Companies and product teams that need to scale capacity quickly without the friction of the hiring cycle, fill hard-to-find profiles, or accelerate delivery with genuine seniority.',
    benefits: [
      'Vetted senior profiles, productive from day one',
      'A nearshore model with aligned time zones and communication',
      'No lengthy recruitment cycles or hiring costs',
      'Flexibility: by project, dedicated squad, or full dedication',
      'Genuine command of the stack: AWS, Kubernetes, Java/Spring, APIs, security, and data',
      'Knowledge transfer to your internal team',
    ],
    approach: [
      'Definition of profile, seniority, and objectives',
      'A shortlist of technically vetted candidates',
      'Interviews and validation with your team',
      'Fast onboarding and integration into the workflow',
      'Follow-up, quality, and continuous adjustment',
    ],
    faqs: [
      { q: 'How long does it take to onboard a profile?', a: 'Depending on the profile, we present a curated shortlist within a few days, and onboarding is usually completed in 1 to 2 weeks.' },
      { q: 'Does the talent work with my team and tools?', a: 'Yes. They integrate into your workflow, repositories, ceremonies, and stack. A nearshore model enables real-time collaboration.' },
    ],
  },
];
