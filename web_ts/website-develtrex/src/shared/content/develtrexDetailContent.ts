export interface DetailProcess {
  step: string;
  detail: string;
}

export interface DetailFaq {
  q: string;
  a: string;
}

export interface ProductDetail {
  slug: string;
  intro: string;
  forWho: string;
  benefits: string[];
  process: DetailProcess[];
  deliverables: string[];
  faqs: DetailFaq[];
}

export interface ServiceDetail {
  slug: string;
  intro: string;
  forWho: string;
  benefits: string[];
  approach: string[];
  faqs: DetailFaq[];
}

export const productDetails: ProductDetail[] = [
  {
    slug: 'assessment-ejecutivo',
    intro:
      'Un diagnóstico profundo del estado real de tu arquitectura tecnológica: aplicaciones, APIs, datos, infraestructura, seguridad y operación. El resultado es una línea base objetiva que permite tomar decisiones de inversión basadas en evidencia, priorizar iniciativas de mayor impacto y construir un roadmap de transformación alineado con los objetivos de negocio.',
    forWho:
      'CTOs, CIOs y Gerentes de TI que necesitan claridad sobre el estado real de su tecnología antes de invertir, escalar o transformar. Ideal para organizaciones con sistemas heterogéneos, deuda técnica acumulada, crecimiento acelerado, fusiones o previo a levantamientos de capital.',
    benefits: [
      'Visibilidad completa del mapa de aplicaciones, APIs e infraestructura',
      'Identificación de riesgos críticos de seguridad y puntos únicos de falla',
      'Quick wins priorizados por impacto de negocio y esfuerzo técnico',
      'Roadmap ejecutivo alineado a objetivos estratégicos',
      'Base sólida para decisiones de inversión tecnológica con evidencia',
      'Eliminación de deuda técnica oculta que frena el crecimiento',
    ],
    process: [
      { step: 'Kick-off y definición de alcance', detail: 'Alineamos objetivos, dominios a evaluar, criterios de criticidad y plan de trabajo con stakeholders clave.' },
      { step: 'Inventario y análisis AS-IS', detail: 'Recolectamos información sobre aplicaciones, APIs, infraestructura, datos, seguridad y operación mediante entrevistas, talleres y revisión de artefactos.' },
      { step: 'Evaluación de brechas y riesgos', detail: 'Analizamos riesgos, deuda técnica, dependencias críticas, cumplimiento y capacidades faltantes frente a buenas prácticas.' },
      { step: 'Roadmap y priorización', detail: 'Construimos el mapa de capacidades TO-BE, identificamos quick wins y organizamos iniciativas por impacto, urgencia y costo.' },
      { step: 'Presentación ejecutiva', detail: 'Entregamos resultados con narrativa de negocio clara para tomadores de decisiones, con recomendaciones accionables.' },
    ],
    deliverables: [
      'Mapa de aplicaciones y capacidades (AS-IS)',
      'Matriz de riesgos y dependencias críticas',
      'Catálogo de brechas y deuda técnica priorizado',
      'Roadmap de transformación con iniciativas y esfuerzos estimados',
      'Presentación ejecutiva lista para dirección y directorio',
    ],
    faqs: [
      { q: '¿Qué tan intrusivo es el proceso de assessment?', a: 'Es principalmente observación y entrevistas. No realizamos cambios en sistemas productivos. El impacto operacional es mínimo — estimamos 2 a 4 horas de tiempo de tus especialistas por sesión.' },
      { q: '¿Necesitamos documentación previa?', a: 'No es indispensable. Parte del valor del assessment es descubrir y documentar lo que no está documentado. Trabajamos con la información disponible y la complementamos.' },
      { q: '¿Cómo se diferencia de otros diagnósticos?', a: 'Cubrimos todos los dominios tecnológicos en un solo engagement: apps, APIs, datos, infra, seguridad y operación. El resultado es accionable y presentado en lenguaje ejecutivo, no solo técnico.' },
    ],
  },
  {
    slug: 'api-management-hibrido',
    intro:
      'Diseñamos e implementamos una plataforma de API Management que gobierna el ciclo de vida completo de tus APIs: desde el diseño y publicación hasta la operación, monitoreo y deprecación. Combinamos un Control Plane centralizado con Data Planes distribuidos para dar cobertura a entornos multi-nube y on-premise con una única capa de gobierno.',
    forWho:
      'Empresas con múltiples APIs internas, externas o B2B que necesitan gobierno centralizado, seguridad estandarizada y visibilidad de uso. Ideal para organizaciones en proceso de apertura digital, ecosistemas de partners o que necesitan monetizar sus APIs como producto.',
    benefits: [
      'Control centralizado de todas las APIs desde un único plano de gestión',
      'Seguridad robusta con OAuth2, OIDC, JWT, mTLS, WAF y OWASP API Top 10',
      'Visibilidad end-to-end con métricas, trazas y alertas por API',
      'DevPortal para consumo self-service por equipos internos y partners',
      'API Factory para estandarizar el ciclo de vida de nuevas APIs',
      'Soporte multi-nube y on-premise con Data Planes distribuidos',
    ],
    process: [
      { step: 'Assessment de APIs y ecosistema', detail: 'Inventariamos APIs existentes, patrones de consumo, brechas de seguridad y gobierno actual.' },
      { step: 'Diseño de arquitectura', detail: 'Definimos HLD/LLD, modelo Control Plane/Data Plane, políticas de seguridad y estándar de API Design.' },
      { step: 'Implementación del Control Plane', detail: 'Desplegamos la capa central de gobierno, portal de desarrolladores y catálogo de APIs.' },
      { step: 'Migración de APIs existentes', detail: 'Incorporamos APIs existentes al modelo de gobierno con políticas de seguridad y observabilidad.' },
      { step: 'API Factory y DevSecOps', detail: 'Implementamos pipelines de CI/CD para APIs, análisis de seguridad y proceso de publicación estándar.' },
      { step: 'Go-live y operación', detail: 'Capacitación del equipo, transferencia de conocimiento y acompañamiento en los primeros meses de operación.' },
    ],
    deliverables: [
      'HLD/LLD de arquitectura API Management',
      'Control Plane y Data Planes configurados y operativos',
      'DevPortal con catálogo de APIs publicado',
      'Políticas de seguridad OAuth2, mTLS, rate limiting y WAF',
      'Pipelines API Factory con DevSecOps integrado',
      'Runbooks operativos y documentación técnica',
    ],
    faqs: [
      { q: '¿Qué plataformas de API Management utilizan?', a: 'Trabajamos con las principales plataformas del mercado: Kong, Apigee, AWS API Gateway, Azure APIM y soluciones open-source como Gravitee. La elección depende de tu ecosistema, presupuesto y requisitos.' },
      { q: '¿Pueden migrarse APIs que ya están en producción?', a: 'Sí. Realizamos la migración de forma gradual, con períodos de convivencia, sin afectar la disponibilidad de APIs productivas.' },
      { q: '¿Es necesario cambiar el código de nuestras APIs?', a: 'En la mayoría de los casos no. El API Management actúa como una capa intermedia. Solo pueden requerirse ajustes menores de autenticación según el modelo de seguridad que se adopte.' },
    ],
  },
  {
    slug: 'observabilidad-360',
    intro:
      'Implementamos una plataforma de observabilidad que consolida logs, métricas y trazas de todas tus APIs, servicios, Kubernetes, bases de datos e infraestructura en un único punto de visibilidad. Con SLOs, SLIs y alertas accionables, tus equipos de operaciones pasan de reaccionar a anticipar incidentes antes de que impacten al negocio.',
    forWho:
      'Equipos de operaciones, SRE y plataforma que necesitan visibilidad real sobre sus servicios críticos. Ideal para organizaciones con múltiples servicios distribuidos, alta dependencia de APIs y Kubernetes, o que buscan reducir el tiempo de detección y resolución de incidentes.',
    benefits: [
      'Visibilidad unificada de logs, métricas y trazas en un solo panel',
      'Reducción significativa de MTTD y MTTR en incidentes críticos',
      'SLOs y SLIs definidos con alertas basadas en objetivos de negocio',
      'Trazabilidad end-to-end de solicitudes entre microservicios',
      'Dashboards ejecutivos y operacionales listos para usar',
      'Modelo operativo NOC/SRE con runbooks y escalamiento definido',
    ],
    process: [
      { step: 'Assessment de observabilidad actual', detail: 'Evaluamos herramientas existentes, cobertura de instrumentación, alertas actuales y brechas de visibilidad.' },
      { step: 'Diseño de arquitectura de observabilidad', detail: 'Definimos el stack tecnológico, modelo de datos, retención, alertas y política de SLO.' },
      { step: 'Instrumentación de servicios', detail: 'Instalamos agentes, beats, exporters y SDKs de tracing en APIs, Kubernetes, bases de datos e infraestructura.' },
      { step: 'Dashboards y alertas', detail: 'Construimos dashboards operacionales y ejecutivos, configuramos alertas inteligentes y supresión de ruido.' },
      { step: 'Modelo operativo NOC/SRE', detail: 'Definimos runbooks, flujos de escalamiento, turnos de guardia y proceso de gestión de incidentes.' },
    ],
    deliverables: [
      'Stack Elastic/APM/Kibana o Prometheus/Grafana/Jaeger/Loki operativo',
      'Instrumentación completa de APIs, Kubernetes e infraestructura',
      'SLOs, SLIs y alertas configuradas y documentadas',
      'Dashboards operacionales y ejecutivos',
      'Runbooks de respuesta a incidentes',
      'Modelo operativo NOC/SRE documentado',
    ],
    faqs: [
      { q: '¿Qué herramientas de observabilidad utilizan?', a: 'Trabajamos con Elastic Stack (Elasticsearch, APM, Kibana, Beats), Prometheus, Grafana, Jaeger, OpenTelemetry y Loki. También integramos con Datadog, New Relic u otras herramientas existentes.' },
      { q: '¿Cuánto overhead de rendimiento genera la instrumentación?', a: 'El impacto es típicamente menor al 2-3% en CPU y memoria. Utilizamos sampling inteligente para trazas distribuidas y optimizamos la recolección de métricas para minimizar el overhead.' },
      { q: '¿Puede integrarse con ITSM como ServiceNow o Jira?', a: 'Sí. Integramos alertas con sistemas ITSM para creación automática de tickets, correlación de incidentes y flujos de aprobación.' },
    ],
  },
  {
    slug: 'drp-ciberresiliente',
    intro:
      'Diseñamos e implementamos un plan de recuperación ante desastres que protege tus sistemas críticos frente a fallos, desastres naturales y ataques de ransomware. Combinamos BIA, estrategia DR validada, backup inmutable y cyber recovery para garantizar que tu organización pueda restaurar operaciones dentro de los RTO y RPO comprometidos.',
    forWho:
      'Empresas con sistemas críticos que no pueden permitirse tiempos de inactividad prolongados. Esencial para organizaciones en sectores regulados, con dependencia de sistemas ERP, APIs o plataformas de e-commerce, o que hayan sufrido incidentes de seguridad previos.',
    benefits: [
      'RTO y RPO validados con simulacros reales, no solo documentación',
      'Protección frente a ransomware con backup inmutable y air-gap',
      'Failover automatizado o semi-automatizado para servicios críticos',
      'Runbooks detallados que permiten recuperación sin el equipo técnico original',
      'Cumplimiento con regulaciones de continuidad operativa',
      'Reducción del riesgo reputacional y financiero ante incidentes',
    ],
    process: [
      { step: 'BIA y análisis de criticidad', detail: 'Identificamos procesos críticos, dependencias tecnológicas, impacto por hora de inactividad y umbrales de RTO/RPO aceptables.' },
      { step: 'Estrategia de DR', detail: 'Definimos la arquitectura DR apropiada: pilot light, warm standby o active/passive según criticidad, costo y tiempo de recuperación.' },
      { step: 'Implementación de infraestructura DR', detail: 'Desplegamos la arquitectura de recuperación, configuramos replicación de datos y automatizamos procedimientos de failover.' },
      { step: 'Backup inmutable y cyber recovery', detail: 'Implementamos backup con protección ante ransomware, retención inmutable y procedimientos de cyber recovery validados.' },
      { step: 'Simulacros y validación', detail: 'Ejecutamos pruebas de failover y failback, medimos RTO/RPO reales y ajustamos runbooks según resultados.' },
    ],
    deliverables: [
      'BIA completo con análisis de criticidad e impacto económico',
      'Arquitectura DR diseñada e implementada',
      'Backup inmutable operativo con retención configurada',
      'Runbooks de failover, failback y cyber recovery',
      'Resultados documentados de simulacros con RTO/RPO medidos',
      'Plan de DR gestionado con calendario de pruebas periódicas',
    ],
    faqs: [
      { q: '¿Cuánto cuesta mantener la infraestructura de DR?', a: 'Depende de la estrategia. Un pilot light puede costar un 10-20% de la infraestructura de producción. Un warm standby entre 40-60%. Optimizamos costos con FinOps para que el DR sea económicamente sostenible.' },
      { q: '¿Qué es el cyber recovery y por qué es diferente al DR tradicional?', a: 'El DR tradicional recupera frente a fallos de hardware o desastres. El cyber recovery añade la capacidad de recuperar ante ransomware o destrucción intencional de datos, con backups aislados (air-gap) que no pueden ser cifrados por atacantes.' },
      { q: '¿Con qué frecuencia se deben hacer los simulacros?', a: 'Recomendamos al menos dos simulacros al año para sistemas críticos. Incluimos un calendario de pruebas en el servicio de operación DR gestionada.' },
    ],
  },
  {
    slug: 'kubernetes-empresarial',
    intro:
      'Construimos y operamos plataformas Kubernetes de nivel enterprise que soportan cargas productivas críticas. Desde el diseño de arquitectura multicluster hasta la implementación de service mesh, seguridad Zero Trust, GitOps y observabilidad completa. Entregamos una plataforma cloud-native lista para escalar con los más altos estándares de seguridad y operación.',
    forWho:
      'Equipos de plataforma e infraestructura que migran cargas a cloud-native, que buscan estandarizar Kubernetes entre múltiples equipos de desarrollo, o que necesitan operar con mayor seguridad, automatización y observabilidad en sus clusters existentes.',
    benefits: [
      'Plataforma K8S estandarizada y lista para múltiples equipos de desarrollo',
      'Service mesh con Istio y mTLS para comunicación segura entre microservicios',
      'GitOps con ArgoCD para despliegues trazables, auditables y reversibles',
      'Observabilidad nativa con Prometheus, Grafana, Loki y Jaeger',
      'Hardening de seguridad con Vault, Cert-Manager y políticas de red',
      'Soporte para clusters on-premise, cloud e híbridos',
    ],
    process: [
      { step: 'Assessment Kubernetes', detail: 'Evaluamos el estado actual, cargas a migrar, requisitos de seguridad, redes y estrategia de multicluster.' },
      { step: 'Diseño HLD/LLD', detail: 'Diseñamos la arquitectura de clusters, redes, storage, service mesh, seguridad y estrategia de despliegue.' },
      { step: 'Implementación de clusters', detail: 'Desplegamos clusters on-premise, cloud o híbridos con las configuraciones de red, RBAC y políticas definidas.' },
      { step: 'Service mesh y seguridad', detail: 'Implementamos Istio, mTLS, Vault para secretos, Cert-Manager y Zero Trust entre servicios.' },
      { step: 'GitOps y observabilidad', detail: 'Configuramos ArgoCD para GitOps, instrumentamos con Prometheus, Grafana, Loki y Jaeger.' },
      { step: 'Hardening y transferencia', detail: 'Aplicamos hardening CIS, políticas de red, auditoría y capacitamos al equipo en la operación diaria.' },
    ],
    deliverables: [
      'Clusters Kubernetes productivos configurados y documentados',
      'Service mesh con Istio y mTLS operativo',
      'GitOps con ArgoCD para todos los despliegues',
      'Stack de observabilidad Prometheus/Grafana/Loki/Jaeger',
      'Políticas de seguridad, RBAC y hardening CIS documentados',
      'Runbooks operativos y capacitación al equipo',
    ],
    faqs: [
      { q: '¿Qué distribución de Kubernetes utilizan?', a: 'Dependiendo del entorno: EKS (AWS), GKE (GCP), AKS (Azure), OpenShift o RKE2/K3s para on-premise. La elección se basa en tu infraestructura actual, requisitos y equipo.' },
      { q: '¿Pueden migrar aplicaciones legacy a Kubernetes?', a: 'Sí. Realizamos containerización y adaptación de aplicaciones. No todas las aplicaciones son candidatas ideales para K8S — parte del assessment es determinar qué se mueve y qué no.' },
      { q: '¿Qué pasa con el soporte después de la implementación?', a: 'Ofrecemos el servicio de Managed Services / DevSecOps Gestionado para operar la plataforma K8S con SLA, monitoreo y mejora continua.' },
    ],
  },
  {
    slug: 'devsecops-managed',
    intro:
      'Acompañamos a tu organización en la operación continua de APIs, Kubernetes, observabilidad, DRP y despliegues con prácticas SRE, ITIL y FinOps. Actuamos como extensión de tu equipo de plataforma, asegurando que tus capacidades tecnológicas críticas funcionen con gobierno, trazabilidad y mejora continua.',
    forWho:
      'Empresas que han implementado capacidades cloud-native y necesitan operarlas sin construir un equipo SRE interno completo. Ideal para organizaciones con presupuesto limitado para operaciones, que quieren SLA garantizados y mejora continua sin contratar un equipo grande.',
    benefits: [
      'Operación gestionada con SLA y tiempos de respuesta comprometidos',
      'Métricas DORA para medir y mejorar la velocidad de entrega',
      'FinOps para optimizar costos cloud sin sacrificar rendimiento',
      'Capacity planning para anticipar crecimientos antes de que sean crisis',
      'Pipelines CI/CD con controles de seguridad SAST/DAST/SCA integrados',
      'Informes mensuales de operación, capacidad y mejoras realizadas',
    ],
    process: [
      { step: 'Assessment de madurez DevSecOps', detail: 'Evaluamos pipelines, procesos, herramientas, métricas DORA actuales y brechas de seguridad en el ciclo de entrega.' },
      { step: 'Implementación de pipelines', detail: 'Construimos o mejoramos pipelines CI/CD con análisis de seguridad SAST/DAST, escaneo de contenedores y GitOps.' },
      { step: 'Modelo operativo', detail: 'Definimos el modelo de operación: SLA, turnos, canales de atención, escalamiento y proceso de gestión de incidentes.' },
      { step: 'Onboarding y transferencia', detail: 'Incorporamos el inventario de plataformas, monitoreamos línea base y establecemos dashboards operacionales.' },
      { step: 'Operación continua y mejora', detail: 'Operamos con cadencia mensual de revisión de métricas, capacity planning, FinOps y roadmap de mejoras.' },
    ],
    deliverables: [
      'Pipelines CI/CD con seguridad integrada (SAST, DAST, SCA)',
      'Modelo operativo documentado con SLA y escalamiento',
      'Dashboard de métricas DORA y operacionales',
      'Informes mensuales de operación y FinOps',
      'Capacity planning y recomendaciones proactivas',
      'Runbooks actualizados y gestión de conocimiento',
    ],
    faqs: [
      { q: '¿Cuántas personas de su equipo trabajan en nuestro servicio?', a: 'Asignamos un equipo dedicado según el alcance: mínimo un SRE senior responsable y respaldo del equipo de plataforma. No es un servicio de call center — conocen tu ambiente en profundidad.' },
      { q: '¿Qué métricas DORA miden?', a: 'Las cuatro métricas clave: frecuencia de despliegue, tiempo de entrega de cambios (lead time), tasa de fallo de cambios y tiempo de recuperación (MTTR). Estas muestran objetivamente si tu equipo mejora en el tiempo.' },
      { q: '¿Podemos cancelar el servicio si no estamos satisfechos?', a: 'El servicio tiene un período mínimo de 3 meses para que los resultados sean medibles. Después, el contrato es mensual. Incluimos un proceso de offboarding ordenado si deciden terminar.' },
    ],
  },
  {
    slug: 'softcommerce-erp',
    intro:
      'Softcommerce es un ERP diseñado específicamente para empresas peruanas que necesitan emitir comprobantes electrónicos certificados ante SUNAT y gestionar en un solo sistema su contabilidad, inventario, tesorería y reportes financieros. Disponible como servicio cloud o instalación inhouse, con soporte local y actualizaciones ante cambios de la SUNAT.',
    forWho:
      'Empresas peruanas de cualquier tamaño que emiten facturas, boletas, notas de crédito y débito electrónicas; que gestionan inventario con múltiples almacenes; y que necesitan visibilidad financiera en tiempo real sin depender de hojas de cálculo o sistemas desconectados.',
    benefits: [
      'Facturación electrónica certificada SUNAT — 100% conforme con normativa vigente',
      'Inventario Kardex con promedio ponderado, PEPS y múltiples almacenes',
      'Contabilidad integrada con asientos automáticos por cada transacción',
      'Tesorería: flujo de caja, cuentas por cobrar y pagar con aging',
      'Reportes financieros en tiempo real: PYG, balance, sunat',
      'Notificaciones automáticas de vencimientos y deudas pendientes',
    ],
    process: [
      { step: 'Configuración inicial', detail: 'Configuramos la empresa, plan de cuentas, series de comprobantes, almacenes y catálogo de productos/servicios.' },
      { step: 'Migración de datos', detail: 'Importamos saldos iniciales, inventario, clientes, proveedores y cuentas por cobrar/pagar desde el sistema anterior.' },
      { step: 'Capacitación del equipo', detail: 'Capacitamos a los usuarios en facturación, inventario, tesorería y generación de reportes según su rol.' },
      { step: 'Período de convivencia', detail: 'Operamos en paralelo con el sistema anterior durante 2 semanas para validar consistencia de datos.' },
      { step: 'Go-live y soporte', detail: 'Activamos el sistema en producción con acompañamiento intensivo durante el primer mes y soporte continuo.' },
    ],
    deliverables: [
      'Sistema configurado y operativo en cloud o inhouse',
      'Integración SUNAT activada y certificada',
      'Migración de datos históricos validada',
      'Usuarios capacitados por rol (administrador, vendedor, almacén, contabilidad)',
      'Manual de usuario y guías de procesos',
      'Soporte técnico incluido (cloud) o por contrato (inhouse)',
    ],
    faqs: [
      { q: '¿Cuál es la diferencia entre la modalidad Cloud e Inhouse?', a: 'Cloud (S/ 1,200/mes) incluye hosting, actualizaciones y soporte — sin inversión inicial. Inhouse (S/ 5,990 pago único) se instala en tus servidores; el mantenimiento anual es adicional. La modalidad cloud es recomendada para la mayoría de empresas por simplicidad y costo total menor.' },
      { q: '¿Está actualizado con los cambios de SUNAT?', a: 'Sí. Incluimos actualizaciones automáticas ante cambios normativos de SUNAT sin costo adicional en la modalidad cloud.' },
      { q: '¿Puede integrarse con mi tienda online o marketplace?', a: 'Tenemos APIs de integración disponibles para e-commerce y marketplaces. El alcance depende de la plataforma que uses — consúltanos para evaluar la integración específica.' },
    ],
  },
];


export const serviceDetails: ServiceDetail[] = [
  {
    slug: 'arquitectura-software',
    intro:
      'Definimos, diseñamos, documentamos y gobernamos arquitecturas de software para sistemas empresariales críticos. Desde el diagnóstico de la arquitectura actual hasta el diseño objetivo basado en microservicios y cloud-native, con modelado C4 y estándares que hacen sostenible la evolución tecnológica.',
    forWho:
      'CTOs, arquitectos y líderes técnicos que necesitan ordenar y modernizar plataformas heterogéneas, reducir deuda técnica y alinear negocio y tecnología antes de escalar o transformar.',
    benefits: [
      'Arquitectura de referencia clara y documentada con modelo C4',
      'Roadmap de modernización priorizado por impacto y esfuerzo',
      'Estándares, patrones de integración y lineamientos de performance y seguridad',
      'Gobierno de arquitectura que evita decisiones inconsistentes',
      'Matriz de riesgos técnicos y recomendaciones de evolución',
    ],
    approach: [
      'Diagnóstico de la arquitectura actual (AS-IS)',
      'Diseño de arquitectura objetivo y arquetipos de software',
      'Modelado C4 y definición de estándares',
      'Roadmap de modernización y matriz de riesgos',
      'Revisión técnica y gobierno continuo',
    ],
    faqs: [
      { q: '¿Trabajan sobre arquitecturas existentes o solo nuevas?', a: 'Ambas. Partimos de un diagnóstico de lo que ya tienes y diseñamos la evolución hacia el estado objetivo sin detener la operación.' },
      { q: '¿Qué entregables recibo?', a: 'Informe de diagnóstico, arquitectura de referencia, diagramas C4, roadmap de modernización, lineamientos y matriz de riesgos técnicos.' },
    ],
  },
  {
    slug: 'cloud-hibrido',
    intro:
      'Diseñamos e implementamos infraestructura tecnológica moderna en AWS, GCP, Azure y entornos on-premise. Landing zones, segmentación de red, arquitecturas multiambiente (DEV/QA/STG/PRD), alta disponibilidad y conectividad híbrida, con foco en seguridad y optimización de costos.',
    forWho:
      'Organizaciones que migran o crecen en cloud, necesitan integrar on-premise con la nube o requieren una base de infraestructura segura, resiliente y con costos bajo control.',
    benefits: [
      'Landing zones y estructura de cuentas/VPC bien gobernada',
      'Segmentación de red y conectividad híbrida (Transit Gateway, PrivateLink, CloudWAN)',
      'Arquitecturas multiambiente con alta disponibilidad y resiliencia',
      'Estrategia de egress/ingress y seguridad cloud',
      'Optimización y estimación de costos cloud',
    ],
    approach: [
      'Evaluación de requerimientos y dominios de carga',
      'Diseño de landing zone, redes y segmentación',
      'Definición de ambientes y alta disponibilidad',
      'Integración con servicios administrados y seguridad',
      'Roadmap de implementación y estimación de costos',
    ],
    faqs: [
      { q: '¿Solo AWS o también GCP y Azure?', a: 'Diseñamos en AWS, GCP y Azure, además de on-premise e híbrido. Recomendamos la mejor opción por dominio, criticidad, seguridad y costo.' },
      { q: '¿Incluye estimación de costos?', a: 'Sí. Entregamos una estimación de costos y recomendaciones de optimización como parte del diseño.' },
    ],
  },
  {
    slug: 'backend-enterprise',
    intro:
      'Diseñamos, construimos y modernizamos servicios backend empresariales: microservicios, APIs REST y servicios reactivos con Java, Spring Boot y arquitectura hexagonal. Servicios transaccionales, auditables y trazables, integrados con bases relacionales y NoSQL y con sistemas externos.',
    forWho:
      'Empresas que necesitan backend robusto para banca, seguros, gobierno, retail, gaming o fintech, o que buscan refactorizar y modernizar aplicaciones legacy.',
    benefits: [
      'Microservicios y APIs REST bien diseñados y documentados',
      'Arquitectura hexagonal mantenible y testeable',
      'Servicios transaccionales con auditoría y trazabilidad',
      'Autenticación y autorización integradas (Keycloak, OAuth2)',
      'Integración con bases de datos relacionales y NoSQL',
    ],
    approach: [
      'Diseño de capas y arquitectura hexagonal',
      'Desarrollo de microservicios y APIs',
      'Implementación de seguridad, auditoría y trazabilidad',
      'Pruebas funcionales y no funcionales',
      'Documentación técnica y modernización de legacy',
    ],
    faqs: [
      { q: '¿Qué stack usan en backend?', a: 'Principalmente Java, Spring Boot, Spring Cloud y WebFlux, además de Node.js y Quarkus según el caso, con PostgreSQL, Oracle, SQL Server, MySQL y Redis.' },
      { q: '¿Pueden modernizar aplicaciones legacy?', a: 'Sí. Refactorizamos y modernizamos aplicaciones existentes hacia microservicios sin detener la operación.' },
    ],
  },
  {
    slug: 'frontend-microfrontends',
    intro:
      'Diseñamos y construimos aplicaciones web modernas, interfaces empresariales y canales digitales con React, Angular, Vue y TypeScript. Microfrontends, SSR, integración con BFF y APIs, y estandarización de componentes para acelerar la entrega.',
    forWho:
      'Organizaciones que necesitan canales digitales de alta calidad, portales empresariales o migrar frontends monolíticos hacia microfrontends escalables.',
    benefits: [
      'Aplicaciones web modernas y responsivas',
      'Microfrontends que escalan por equipo y dominio',
      'SSR para performance y SEO',
      'Integración limpia con BFF y APIs',
      'Componentes estandarizados y lineamientos frontend',
    ],
    approach: [
      'Definición de arquitectura frontend y microfrontends',
      'Diseño de experiencia e interfaces responsivas',
      'Integración con BFF/APIs y SSR',
      'Estandarización de componentes UI',
      'Documentación de despliegue',
    ],
    faqs: [
      { q: '¿React, Angular o Vue?', a: 'Trabajamos con los tres, además de TypeScript, SSR y microfrontends. Recomendamos el más adecuado según tu equipo y contexto.' },
      { q: '¿Qué son los microfrontends y cuándo conviene?', a: 'Permiten dividir una app web grande en partes independientes por equipo o dominio. Convienen cuando varios equipos evolucionan la misma web en paralelo.' },
    ],
  },
  {
    slug: 'api-management',
    intro:
      'Diseñamos, evaluamos, gobernamos e implementamos plataformas de API Management e integración empresarial. Arquitectura API First, gobierno de APIs, gateways público y privado, BFF, seguridad con OAuth2/OIDC/JWT/mTLS e integración híbrida cloud/on-premise.',
    forWho:
      'Empresas que exponen APIs internas, externas o B2B y necesitan gobernarlas, asegurarlas y evaluar o modernizar su plataforma de integración.',
    benefits: [
      'Evaluación comparativa de plataformas de API Management',
      'Arquitectura API First y gobierno de APIs',
      'Seguridad de APIs con OAuth2, OIDC, JWT y mTLS',
      'Developer Portal y ciclo de vida de APIs',
      'Integración híbrida con backends en Kubernetes y VMs',
    ],
    approach: [
      'Evaluación de plataformas y arquitectura objetivo',
      'Diseño API First y modelo de gobierno',
      'Diseño de gateways, BFF y contratos OpenAPI',
      'Implementación de seguridad y observabilidad de APIs',
      'Developer Portal y estándares de publicación',
    ],
    faqs: [
      { q: '¿Con qué plataformas trabajan?', a: 'Kong Konnect, IBM webMethods/IWHI, MuleSoft Anypoint, Apigee Hybrid y AWS API Gateway, entre otras. Ayudamos a evaluar cuál conviene.' },
      { q: '¿Pueden integrar cloud y on-premise?', a: 'Sí. Diseñamos integración híbrida con control plane centralizado y data planes distribuidos.' },
    ],
  },
  {
    slug: 'integraciones-h2h',
    intro:
      'Diseñamos e implementamos integraciones bancarias seguras y trazables: canales Host-to-Host con SFTP, intercambio XML/TXT, ISO 20022, cifrado y firma de archivos con PGP/GPG, conciliación, parametrías bancarias y controles de idempotencia.',
    forWho:
      'Fintechs, bancos y empresas que operan pagos masivos, cobranzas y transferencias con entidades financieras y requieren integraciones críticas y reguladas.',
    benefits: [
      'Canal H2H seguro con SFTP y cifrado PGP/GPG',
      'Intercambio estandarizado XML/TXT e ISO 20022',
      'Trazabilidad operativa y conciliación',
      'Controles de idempotencia y consistencia',
      'Modelos contables temporales y definitivos',
    ],
    approach: [
      'Diseño del canal H2H y modelo de seguridad de archivos',
      'Definición de flujos de pago y operaciones soportadas',
      'Implementación de cifrado, firma y transferencia',
      'Diseño de conciliación y trazabilidad',
      'Guía de operación H2H y pruebas',
    ],
    faqs: [
      { q: '¿Qué entidades o formatos soportan?', a: 'Trabajamos con estándares bancarios como SFTP, XML/TXT, ISO 20022 y PGP/GPG, adaptándonos a la parametría de cada entidad.' },
      { q: '¿Cómo garantizan que no se dupliquen operaciones?', a: 'Diseñamos controles de idempotencia y consistencia, además de trazabilidad y conciliación de punta a punta.' },
    ],
  },
  {
    slug: 'kubernetes',
    intro:
      'Diseñamos, implementamos y gobernamos plataformas Kubernetes empresariales, en cloud y on-premise. Arquitectura multicluster por dominio y ambiente, namespaces, RBAC, network policies, service mesh, comunicación mTLS, ingress y operación integrada con observabilidad y DevSecOps.',
    forWho:
      'Organizaciones que adoptan contenedores a escala, necesitan multicluster gobernado o quieren una plataforma cloud-native segura y operable.',
    benefits: [
      'Arquitectura multicluster por dominio, ambiente y carga',
      'RBAC, quotas y network policies bien definidos',
      'Service mesh y comunicación segura con mTLS',
      'Ingress y balanceo L2/L3/L7',
      'Operación integrada con observabilidad y GitOps',
    ],
    approach: [
      'Assessment y diseño de la plataforma (HLD/LLD)',
      'Implementación de clústeres y modelo de namespaces',
      'Configuración de RBAC, políticas y service mesh',
      'Integración con observabilidad y DevSecOps',
      'Lineamientos de operación y transferencia',
    ],
    faqs: [
      { q: '¿Cloud, on-premise o ambos?', a: 'Diseñamos Kubernetes en EKS y otros entornos cloud, on-premise e híbrido, con enfoque multicluster.' },
      { q: '¿Incluye service mesh y seguridad?', a: 'Sí. Diseñamos service mesh, mTLS, RBAC y network policies, integrados con Vault, Cert-Manager y Keycloak según el caso.' },
    ],
  },
  {
    slug: 'devops-cicd',
    intro:
      'Automatizamos el ciclo de vida de desarrollo, despliegue y operación. Pipelines CI/CD, GitOps, Infraestructura como Código con Terraform, despliegues sobre Kubernetes con Helm, estrategia de branching, automatización de ambientes y gobierno de artefactos.',
    forWho:
      'Equipos que despliegan manualmente o de forma inconsistente y necesitan velocidad, trazabilidad y despliegues repetibles y gobernados.',
    benefits: [
      'Pipelines CI/CD estandarizados y repetibles',
      'GitOps e Infraestructura como Código con Terraform',
      'Despliegues sobre Kubernetes con Helm',
      'Automatización de ambientes y pruebas',
      'Gobierno de versionamiento y artefactos',
    ],
    approach: [
      'Diseño de pipelines y estrategia de branching',
      'Implementación de CI/CD y GitOps',
      'Infraestructura como código y templates',
      'Automatización de ambientes y despliegues',
      'Guías de despliegue y operación',
    ],
    faqs: [
      { q: '¿Qué herramientas usan?', a: 'Git, GitHub/GitLab, Jenkins, Docker, Kubernetes, Helm y Terraform, con enfoque GitOps y templates reutilizables.' },
      { q: '¿Se integra con mi flujo actual?', a: 'Sí. Adaptamos la estrategia a tus repositorios, ambientes y prácticas actuales, elevándolas de forma incremental.' },
    ],
  },
  {
    slug: 'devsecops',
    intro:
      'Incorporamos seguridad desde el diseño, desarrollo, despliegue y operación. OAuth2/OIDC, Keycloak y Microsoft Entra ID, manejo de tokens JWT, mTLS, gestión de secretos y certificados con Vault, hardening de apps y contenedores, seguridad en APIs y Kubernetes, y auditoría.',
    forWho:
      'Organizaciones en sectores regulados o con datos sensibles que necesitan seguridad por arquitectura, no como parche final.',
    benefits: [
      'Modelo de seguridad por arquitectura y matriz de controles',
      'Autenticación y autorización con OAuth2/OIDC y Keycloak/Entra ID',
      'mTLS, gestión de secretos y certificados con Vault',
      'Hardening de aplicaciones y contenedores',
      'Auditoría, trazabilidad y políticas RBAC/network',
    ],
    approach: [
      'Diseño de seguridad por arquitectura',
      'Implementación de identidad, tokens y mTLS',
      'Gestión de secretos y certificados',
      'Hardening y seguridad en APIs y Kubernetes',
      'Auditoría y lineamientos DevSecOps',
    ],
    faqs: [
      { q: '¿Usan Keycloak o Entra ID?', a: 'Ambos, según tu ecosistema. Integramos OAuth2/OIDC, JWT y mTLS con Keycloak o Microsoft Entra ID.' },
      { q: '¿Cómo gestionan secretos y certificados?', a: 'Con Vault y Cert-Manager, definiendo modelos de gestión de secretos y ciclo de vida de certificados.' },
    ],
  },
  {
    slug: 'observabilidad',
    intro:
      'Dotamos de visibilidad técnica y operativa a plataformas, microservicios, APIs e infraestructura. Centralización de logs, métricas de infraestructura y aplicación, trazabilidad distribuida, monitoreo de APIs, Kubernetes y bases de datos, dashboards y alertas accionables.',
    forWho:
      'Equipos que operan servicios críticos y necesitan detectar y resolver incidentes rápido, con evidencia y trazabilidad de punta a punta.',
    benefits: [
      'Modelo de observabilidad integral (logs, métricas, trazas)',
      'Trazabilidad distribuida sobre APIs y microservicios',
      'Monitoreo de Kubernetes, infraestructura y bases de datos',
      'Dashboards y alertas accionables',
      'Menor tiempo de detección y resolución de incidentes',
    ],
    approach: [
      'Diseño del modelo de observabilidad',
      'Centralización de logs y métricas',
      'Instrumentación de trazabilidad distribuida',
      'Dashboards, alertas y matrices de métricas',
      'Guías de monitoreo y troubleshooting',
    ],
    faqs: [
      { q: '¿Qué herramientas de observabilidad usan?', a: 'CloudWatch, X-Ray, Prometheus, Grafana y OpenTelemetry, según tu stack cloud y on-premise.' },
      { q: '¿Ayuda a reducir el tiempo de incidentes?', a: 'Sí. El objetivo es disminuir el tiempo de detección y resolución con trazabilidad, dashboards y alertas bien definidas.' },
    ],
  },
  {
    slug: 'bases-datos',
    intro:
      'Diseñamos, optimizamos y gobernamos modelos de datos empresariales. Modelos transaccionales y financieros, catálogos y parametrías, JSONB, auditoría y trazabilidad, optimización de consultas, particionamiento, estrategias de concurrencia y migración de motores.',
    forWho:
      'Organizaciones con bases de datos críticas que requieren performance, integridad y un modelo de datos sólido para operaciones transaccionales y financieras.',
    benefits: [
      'Modelos lógico y físico bien diseñados',
      'Optimización de consultas y particionamiento',
      'Estrategias de concurrencia e integridad',
      'Diccionario de datos y lineamientos de nomenclatura',
      'Roadmap y evaluación de motores de base de datos',
    ],
    approach: [
      'Diseño de modelos transaccionales y financieros',
      'Optimización, particionamiento y concurrencia',
      'Auditoría, trazabilidad y JSONB donde aplica',
      'Scripts DDL/DML y diccionario de datos',
      'Roadmap y migración de motores',
    ],
    faqs: [
      { q: '¿Qué motores manejan?', a: 'PostgreSQL (incluido 18 y Aurora), SQL Server, Oracle, MySQL, DynamoDB, Firestore y Redis.' },
      { q: '¿Pueden migrar o modernizar mi base de datos?', a: 'Sí. Evaluamos el motor actual, diseñamos el destino y ejecutamos la migración con un roadmap de bajo riesgo.' },
    ],
  },
  {
    slug: 'data-bi-ia',
    intro:
      'Explotamos datos, analítica, inteligencia de negocio e inteligencia artificial aplicada. Diseño de plataformas de datos y data lake, procesos ETL/ELT, modelado analítico, indicadores, trazabilidad de datos, integración Big Data y casos de uso de IA y automatización.',
    forWho:
      'Organizaciones que necesitan convertir datos críticos en decisiones: reporting, indicadores, gobierno de datos e IA aplicada.',
    benefits: [
      'Arquitectura de datos y data lake',
      'Procesos ETL/ELT y modelado analítico',
      'Tableros BI e indicadores de negocio',
      'Trazabilidad y gobierno de datos',
      'Casos de uso de IA y automatización con LLMs',
    ],
    approach: [
      'Diseño de la plataforma de datos y data lake',
      'Integración de datos desde sistemas transaccionales',
      'Procesos ETL/ELT y modelado analítico',
      'Tableros BI e indicadores',
      'Casos de uso de IA y recomendaciones de gobierno',
    ],
    faqs: [
      { q: '¿Qué tecnologías de datos usan?', a: 'BigQuery, Pub/Sub, Dataflow, Looker Studio y Firestore, además de plataformas Big Data y modelos de IA/LLMs.' },
      { q: '¿La IA aplica a mi negocio?', a: 'Evaluamos casos de uso concretos (automatización, análisis, LLMs) con impacto medible, sin promesas genéricas.' },
    ],
  },
  {
    slug: 'fintech-pagos',
    intro:
      'Diseñamos plataformas financieras, billeteras, pagos, conciliación y ledger contable. Core transaccional, ledger de doble partida, motor de tarifas, emisión y movimientos, arquitectura de pagos de alta disponibilidad, trazabilidad financiera y APIs financieras.',
    forWho:
      'Fintechs y empresas que construyen o modernizan plataformas de pagos, billeteras y operaciones financieras que exigen consistencia y alta disponibilidad.',
    benefits: [
      'Core transaccional y ledger de doble partida',
      'Conciliación y controles de consistencia',
      'Arquitectura de pagos de alta disponibilidad',
      'Trazabilidad financiera de punta a punta',
      'APIs y modelos de datos financieros',
    ],
    approach: [
      'Diseño del core transaccional y ledger',
      'Modelo de operaciones y conciliación',
      'Arquitectura de pagos y alta disponibilidad',
      'Diseño de APIs financieras',
      'Roadmap, backlog y estimación',
    ],
    faqs: [
      { q: '¿Qué es un ledger de doble partida y por qué importa?', a: 'Es un modelo contable que garantiza consistencia e integridad financiera en cada operación. Es la base de una plataforma de pagos confiable.' },
      { q: '¿Sobre qué infraestructura lo despliegan?', a: 'Típicamente AWS y Kubernetes, con PostgreSQL/RDS, Redis, Kafka, API Gateway y Keycloak, diseñado para alta disponibilidad.' },
    ],
  },
  {
    slug: 'igaming',
    intro:
      'Diseñamos plataformas promocionales para casino online, gaming e iGaming. Motores promocionales, misiones, retos y desafíos, audiencias, premios, ruletas, multiplicadores, cartillas, reglas de negocio, trazabilidad por invitado y arquitectura para campañas en tiempo real.',
    forWho:
      'Operadores de iGaming y casino online que necesitan motores de promociones flexibles, campañas en tiempo real y reglas de negocio configurables.',
    benefits: [
      'Motor promocional con reglas configurables',
      'Misiones, retos, ruletas y multiplicadores',
      'Segmentación de audiencias y premios',
      'Trazabilidad por invitado',
      'Arquitectura event-driven para tiempo real',
    ],
    approach: [
      'Documento funcional y benchmark de mercado',
      'Diseño del motor promocional y modelo de reglas',
      'Modelo de premios, audiencias y trazabilidad',
      'Arquitectura batch y streaming',
      'Roadmap de MVP y backlog funcional',
    ],
    faqs: [
      { q: '¿Se integra con mi plataforma de gaming?', a: 'Diseñamos el motor con APIs y arquitectura event-driven para integrarse con tu plataforma y fuentes de eventos.' },
      { q: '¿Soporta campañas en tiempo real?', a: 'Sí. La arquitectura contempla procesamiento batch y streaming para campañas y reglas en tiempo real.' },
    ],
  },
  {
    slug: 'consultoria-capacitacion',
    intro:
      'Acompañamos a los equipos técnicos en la adopción de nuevas arquitecturas, plataformas y prácticas. Capacitación técnica y funcional, talleres de arquitectura, Kubernetes, API Management y DevSecOps, acompañamiento en pruebas de concepto y despliegues, y transferencia de conocimiento.',
    forWho:
      'Equipos de TI que adoptan nuevas plataformas y quieren autonomía real, con conocimiento transferido y soporte durante la adopción.',
    benefits: [
      'Talleres prácticos y rutas de aprendizaje',
      'Acompañamiento en pruebas de concepto y despliegues',
      'Transferencia de conocimiento documentada',
      'Manuales técnicos y de operación',
      'Soporte y atención de consultas post-implementación',
    ],
    approach: [
      'Plan de capacitación y material',
      'Talleres de arquitectura, Kubernetes, APIs y DevSecOps',
      'Acompañamiento en PoCs y despliegues',
      'Actas y registro de transferencia',
      'Soporte y acompañamiento posterior',
    ],
    faqs: [
      { q: '¿Los talleres son a medida?', a: 'Sí. Diseñamos el plan según el nivel del equipo y las tecnologías que están adoptando.' },
      { q: '¿Dan soporte después de la capacitación?', a: 'Sí. Ofrecemos acompañamiento post-implementación y atención de consultas técnicas.' },
    ],
  },
  {
    slug: 'staffing',
    intro:
      'Reforzamos tu equipo con perfiles senior evaluados en arquitectura, cloud, backend Java/Spring, DevSecOps, Kubernetes, API Management y datos. Modelo nearshore, con onboarding rápido y talento que ya domina el stack crítico — por proyecto, por squad o dedicación completa.',
    forWho:
      'Empresas y equipos de producto que necesitan escalar capacidad rápido sin la fricción del ciclo de contratación, cubrir perfiles difíciles de encontrar o acelerar entregas con seniority real.',
    benefits: [
      'Perfiles senior evaluados, productivos desde el día uno',
      'Modelo nearshore con zona horaria y comunicación alineadas',
      'Sin ciclos largos de reclutamiento ni costos de contratación',
      'Flexibilidad: por proyecto, squad dedicado o dedicación completa',
      'Dominio real del stack: AWS, Kubernetes, Java/Spring, APIs, seguridad y datos',
      'Transferencia de conocimiento a tu equipo interno',
    ],
    approach: [
      'Definición de perfil, seniority y objetivos',
      'Shortlist de candidatos evaluados técnicamente',
      'Entrevistas y validación con tu equipo',
      'Onboarding rápido e integración al flujo de trabajo',
      'Seguimiento, calidad y ajuste continuo',
    ],
    faqs: [
      { q: '¿Cuánto tarda en incorporarse un perfil?', a: 'Según el perfil, presentamos una shortlist seleccionada en pocos días y el onboarding suele completarse en 1 a 2 semanas.' },
      { q: '¿El talento trabaja con mi equipo y herramientas?', a: 'Sí. Se integra a tu flujo, repositorios, ceremonias y stack. Modelo nearshore para colaboración en tiempo real.' },
    ],
  },
];
