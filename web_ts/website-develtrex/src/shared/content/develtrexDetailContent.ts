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
    slug: 'soluciones-personalizadas',
    intro:
      'Desarrollamos software a medida que se adapta exactamente a los procesos, flujos y reglas de negocio de tu organización. Desde el análisis de requerimientos hasta el despliegue en producción, construimos soluciones que reducen la dependencia de herramientas genéricas y generan ventaja competitiva real.',
    forWho:
      'Empresas con procesos únicos que los ERPs y SaaS genéricos no pueden cubrir. Startups que necesitan un MVP rápido y escalable. Organizaciones que quieren digitalizar procesos manuales con software propio.',
    benefits: [
      'Software diseñado exactamente para tus flujos de negocio, no al revés',
      'Arquitectura escalable desde MVP hasta enterprise sin reescribir',
      'Menor costo total que licencias SaaS a largo plazo',
      'Propiedad total del código fuente y la solución',
      'Integración nativa con tus sistemas existentes',
    ],
    approach: [
      'Análisis de requerimientos y prototipado rápido',
      'Desarrollo iterativo con entregas quincenales visibles',
      'Testing automatizado y revisión de calidad continua',
      'Despliegue en tu infraestructura o cloud preferido',
      'Documentación técnica y capacitación al equipo',
    ],
    faqs: [
      { q: '¿Cuánto tiempo toma desarrollar una solución a medida?', a: 'Un MVP funcional típicamente toma entre 6 y 12 semanas según la complejidad. Definimos el alcance en la fase inicial para darte una estimación precisa.' },
      { q: '¿Qué tecnologías utilizan?', a: 'Nos adaptamos al stack que necesitas: React, Angular, Vue, Node.js, Python, .NET, Java, AWS, GCP, Azure y más. Recomendamos la tecnología más adecuada para cada caso.' },
    ],
  },
  {
    slug: 'apps-nativas',
    intro:
      'Desarrollamos aplicaciones iOS, Android y web con rendimiento nativo, interfaces de alta calidad y arquitecturas modernas que escalan con tu negocio. Nos especializamos en apps con integración a sistemas empresariales, autenticación segura y experiencias de usuario que generan adopción real.',
    forWho:
      'Empresas que quieren llegar a sus clientes o colaboradores con una app propia. Organizaciones con procesos de campo que necesitan apps móviles para operaciones remotas. Startups que buscan lanzar su producto digital.',
    benefits: [
      'Apps nativas iOS y Android con rendimiento y UX superior',
      'PWA y web apps progresivas para cobertura multiplataforma',
      'Integración con APIs empresariales, ERP, CRM y sistemas internos',
      'Autenticación segura con biometría, OAuth2 y SSO',
      'Publicación en App Store y Google Play gestionada',
    ],
    approach: [
      'Research de usuarios y definición de flujos clave',
      'Diseño UX/UI con prototipos validados antes de desarrollar',
      'Desarrollo nativo (Swift, Kotlin) o multiplataforma (React Native, Flutter)',
      'Testing en dispositivos reales y entornos de staging',
      'Publicación, monitoreo de crashes y soporte post-lanzamiento',
    ],
    faqs: [
      { q: '¿Nativo o multiplataforma?', a: 'Para apps con UX compleja o acceso profundo al hardware recomendamos nativo. Para la mayoría de casos de negocio, React Native o Flutter entregan rendimiento suficiente con menor costo de desarrollo.' },
      { q: '¿Incluyen el mantenimiento post-lanzamiento?', a: 'Sí, ofrecemos planes de mantenimiento que incluyen actualizaciones de SO, corrección de bugs y nuevas features.' },
    ],
  },
  {
    slug: 'ecommerce',
    intro:
      'Construimos plataformas de venta digital seguras, rápidas y escalables integradas con tus sistemas de inventario, contabilidad y logística. Desde tiendas B2C hasta marketplaces B2B, diseñamos la experiencia de compra y los flujos operativos completos para que puedas vender más con menos fricción.',
    forWho:
      'Empresas que quieren digitalizar sus ventas o mejorar su tienda online existente. Negocios que necesitan un canal de e-commerce integrado a su ERP o sistema de inventario. Empresas B2B que quieren un portal de pedidos para sus distribuidores.',
    benefits: [
      'Tienda optimizada para conversión con checkout simplificado',
      'Integración con pasarelas de pago: Culqi, PayU, Stripe, Mercado Pago',
      'Catálogo con variantes, precios por lista y descuentos configurables',
      'Gestión de inventario en tiempo real y alertas de stock',
      'SEO técnico optimizado para posicionamiento orgánico',
      'Analytics de conversión y comportamiento del usuario',
    ],
    approach: [
      'Análisis de flujo de compra y competencia',
      'Diseño de UX/UI orientado a conversión',
      'Desarrollo en plataforma apropiada (custom, Shopify, WooCommerce)',
      'Integración con sistemas de inventario, ERP y logística',
      'Configuración de medios de pago y políticas de envío',
      'Lanzamiento, analítica y optimización post-venta',
    ],
    faqs: [
      { q: '¿Shopify, WooCommerce o desarrollo custom?', a: 'Para catálogos estándar y velocidad de lanzamiento, Shopify es excelente. Para integraciones complejas o lógica de negocio específica, desarrollo custom sobre frameworks modernos. Te recomendamos según tu caso.' },
      { q: '¿Pueden migrar mi tienda existente?', a: 'Sí. Migramos catálogos, clientes, historial de pedidos y SEO preservando posicionamiento.' },
    ],
  },
  {
    slug: 'diseno-productos',
    intro:
      'Diseñamos productos digitales centrados en el usuario con metodologías UX/UI probadas: research, wireframes, prototipos interactivos y design systems. Validamos con usuarios reales antes de escribir una línea de código para garantizar que lo que se construye sea lo que los usuarios realmente usan.',
    forWho:
      'Equipos de producto que quieren lanzar con mayor confianza. Empresas con apps existentes que tienen baja adopción o retención. Startups que necesitan un diseño sólido antes de empezar el desarrollo.',
    benefits: [
      'Reducción de reprocesos al validar diseño antes de desarrollar',
      'Design system reutilizable que acelera el desarrollo futuro',
      'Interfaces accesibles (WCAG) que funcionan para todos los usuarios',
      'Prototipos interactivos para pruebas con usuarios reales',
      'Métricas de usabilidad medibles antes y después del rediseño',
    ],
    approach: [
      'Research: entrevistas, encuestas y análisis de datos existentes',
      'Definición de personas, flujos y mapa de experiencia',
      'Wireframes de baja fidelidad para validar estructura',
      'Diseño UI de alta fidelidad con sistema de componentes',
      'Prototipo interactivo y pruebas con usuarios reales',
      'Handoff de diseño listo para desarrollo',
    ],
    faqs: [
      { q: '¿Qué herramientas de diseño utilizan?', a: 'Figma como herramienta principal para diseño y prototipado colaborativo. Entregamos archivos organizados listos para que cualquier equipo de desarrollo los implemente.' },
      { q: '¿Pueden trabajar con nuestro equipo de desarrollo existente?', a: 'Sí. Hacemos handoff detallado con especificaciones, tokens de diseño y guías de implementación para que tu equipo de desarrollo trabaje con máxima eficiencia.' },
    ],
  },
  {
    slug: 'migracion-modernizacion',
    intro:
      'Migramos y modernizamos sistemas legacy a arquitecturas modernas cloud-native o microservicios sin detener la operación del negocio. Utilizamos estrategias de migración gradual (Strangler Fig, CQRS, Event Sourcing) que permiten ir reemplazando componentes sin big bang ni riesgo operacional.',
    forWho:
      'Organizaciones con sistemas legacy que frenan el crecimiento, dificultan el mantenimiento o acumulan deuda técnica. Empresas que quieren mover cargas a cloud sin perder funcionalidad. Equipos de desarrollo que necesitan pasar de monolitos a microservicios.',
    benefits: [
      'Migración gradual sin interrupciones de servicio ni big bang',
      'Reducción de deuda técnica y costos de mantenimiento',
      'Escalabilidad y resiliencia que los sistemas legacy no permiten',
      'Habilitación de DevSecOps y despliegue continuo',
      'Documentación actualizada de la arquitectura resultante',
    ],
    approach: [
      'Assessment del sistema legacy: dependencias, riesgos y candidatos de migración',
      'Estrategia de migración por fases con criterios de éxito',
      'Implementación incremental con períodos de convivencia',
      'Validación funcional y de rendimiento en cada fase',
      'Retiro del sistema legacy con backup histórico',
    ],
    faqs: [
      { q: '¿Pueden migrar sin parar la operación?', a: 'Sí, esa es nuestra premisa de diseño. Utilizamos patrones como Strangler Fig para ir reemplazando funcionalidades sin impacto en producción.' },
      { q: '¿Qué pasa con los datos históricos?', a: 'Los migramos, validamos y preservamos. Diseñamos la estrategia de migración de datos como parte fundamental del proyecto.' },
    ],
  },
  {
    slug: 'integracion-tecnologias',
    intro:
      'Conectamos los sistemas de tu organización — ERPs, CRMs, plataformas de e-commerce, APIs externas y bases de datos — para eliminar silos de información y automatizar flujos entre aplicaciones. Diseñamos las integraciones con robustez, trazabilidad y manejo de errores para que tu operación no dependa de procesos manuales entre sistemas.',
    forWho:
      'Empresas con múltiples sistemas que no se hablan entre sí. Organizaciones con procesos manuales de sincronización de datos. Equipos que necesitan eventos en tiempo real entre plataformas.',
    benefits: [
      'Eliminación de reingreso manual de datos entre sistemas',
      'Sincronización en tiempo real o por lotes según la necesidad',
      'Trazabilidad completa de cada transacción entre sistemas',
      'Manejo robusto de errores con reintentos y alertas',
      'APIs bien documentadas para futuras integraciones',
    ],
    approach: [
      'Mapeo de sistemas, flujos y datos a integrar',
      'Diseño de arquitectura de integración (ESB, API-led, eventos)',
      'Implementación con testing unitario e integración',
      'Monitoreo de salud de integraciones en producción',
      'Documentación de contratos de integración',
    ],
    faqs: [
      { q: '¿Qué plataformas de integración utilizan?', a: 'Según el caso: MuleSoft, Apache Kafka, AWS EventBridge, Azure Service Bus, o desarrollo custom con queues. La elección depende de volumen, latencia y plataformas a integrar.' },
      { q: '¿Pueden integrar con SAP, Oracle u otros ERPs enterprise?', a: 'Sí, tenemos experiencia con las principales APIs y conectores de SAP, Oracle, Microsoft Dynamics y Salesforce.' },
    ],
  },
  {
    slug: 'arquitectura-empresarial',
    intro:
      'Diseñamos y documentamos la arquitectura de tu empresa usando marcos reconocidos como TOGAF, COBIT e ITIL. Desde el diagnóstico AS-IS hasta el diseño TO-BE, definimos principios, estándares, ADRs y un roadmap de transformación que alinea negocio, tecnología, datos y operación.',
    forWho:
      'CTOs y arquitectos que necesitan dar estructura a una organización tecnológica que creció sin arquitectura clara. Empresas en procesos de transformación digital que necesitan un marco de decisión para sus inversiones tecnológicas.',
    benefits: [
      'Marco de decisión claro para inversiones tecnológicas',
      'Principios y estándares que evitan decisiones inconsistentes',
      'ADRs que documentan por qué se tomaron las decisiones arquitecturales',
      'Alineación entre objetivos de negocio y capacidades tecnológicas',
      'Roadmap de transformación con iniciativas priorizadas',
    ],
    approach: [
      'Diagnóstico AS-IS de arquitectura de negocio, aplicaciones, datos e infraestructura',
      'Talleres con stakeholders para definir principios y estándares',
      'Diseño TO-BE con modelo de capacidades objetivo',
      'ADRs y documentación de decisiones arquitecturales',
      'Roadmap de transformación con iniciativas y criterios de éxito',
    ],
    faqs: [
      { q: '¿Trabajan con TOGAF?', a: 'Sí, aplicamos TOGAF ADM como marco metodológico, adaptado al tamaño y madurez de tu organización. No imponemos la metodología al pie de la letra — la adaptamos para entregar valor rápido.' },
      { q: '¿Cuánto tiempo toma definir la arquitectura empresarial?', a: 'Un ciclo inicial de diagnóstico y arquitectura objetivo toma entre 8 y 16 semanas según la complejidad y tamaño de la organización.' },
    ],
  },
  {
    slug: 'cloud-multicloud',
    intro:
      'Diseñamos e implementamos estrategias cloud que colocan cada carga de trabajo en el entorno más adecuado: AWS, GCP, Azure u on-premise, según criticidad, costo, seguridad y continuidad. Implementamos landing zones, FinOps y automatización para que tu infraestructura cloud sea gobernada, optimizada y escalable.',
    forWho:
      'Empresas que migran a cloud o que ya están en cloud pero sin gobierno ni optimización de costos. Organizaciones con cargas distribuidas entre múltiples proveedores que necesitan visibilidad unificada.',
    benefits: [
      'Estrategia cloud por dominio que optimiza costo, rendimiento y continuidad',
      'Landing zones seguras con redes, identidad y cumplimiento desde el inicio',
      'FinOps para visibilidad y optimización del gasto cloud en tiempo real',
      'Automatización de infraestructura con Terraform e IaC',
      'Monitoreo unificado de múltiples nubes y on-premise',
    ],
    approach: [
      'Assessment del portafolio de cargas y criterios de decisión cloud',
      'Diseño de estrategia multicloud y arquitectura de landing zone',
      'Implementación de infraestructura base con IaC (Terraform)',
      'Migración de cargas por fases con validación',
      'Implementación de FinOps y optimización de costos',
    ],
    faqs: [
      { q: '¿Cuánto pueden ahorrar con FinOps?', a: 'En organizaciones sin gobierno cloud, el ahorro típico es entre 20% y 40% del gasto cloud mensual mediante eliminación de recursos sin uso, right-sizing y reservas.' },
      { q: '¿Pueden gestionar nuestra infraestructura cloud existente?', a: 'Sí. Ofrecemos el servicio de Managed Services para operación continua de cloud con SLA y optimización mensual.' },
    ],
  },
  {
    slug: 'api-management-zero-trust',
    intro:
      'Implementamos gobierno completo del ciclo de vida de APIs con modelo Zero Trust: autenticación fuerte en cada capa, políticas de acceso granulares y monitoreo continuo de comportamiento. Cada API interna, externa o B2B pasa por un control centralizado con visibilidad de uso, seguridad y rendimiento.',
    forWho:
      'Organizaciones que exponen APIs a terceros, socios o clientes y necesitan gobierno, seguridad y visibilidad. Empresas que han sufrido incidentes de seguridad en APIs o que necesitan cumplir con regulaciones de protección de datos.',
    benefits: [
      'Eliminación de APIs shadow — visibilidad total del ecosistema de APIs',
      'Modelo Zero Trust con autenticación en cada capa de la arquitectura',
      'Rate limiting, quota y throttling por cliente y plan de acceso',
      'Detección de anomalías y comportamiento inusual en APIs',
      'Portal de desarrolladores para consumo self-service seguro',
    ],
    approach: [
      'Inventario y evaluación de seguridad de APIs existentes',
      'Diseño de modelo de seguridad Zero Trust por capa',
      'Implementación de API Gateway con políticas de control',
      'Configuración de DevPortal y planes de acceso',
      'Monitoreo de seguridad y alertas por comportamiento anómalo',
    ],
    faqs: [
      { q: '¿Cómo se diferencia de un API Gateway estándar?', a: 'Un API Gateway gestiona el tráfico. Zero Trust añade la premisa de que ningún actor es confiable por defecto — cada solicitud se autentica, autoriza y audita independientemente del origen.' },
      { q: '¿Pueden proteger APIs legacy que no tienen seguridad?', a: 'Sí. El API Gateway actúa como proxy que añade seguridad sin modificar el backend. Es uno de los casos de uso más comunes.' },
    ],
  },
  {
    slug: 'kubernetes',
    intro:
      'Implementamos y operamos plataformas Kubernetes de nivel enterprise que estandarizan el despliegue de aplicaciones con máxima seguridad, automatización y observabilidad. Desde clusters de desarrollo hasta producción con cargas críticas, diseñamos la plataforma que tu equipo necesita para operar con confianza.',
    forWho:
      'Equipos de desarrollo que quieren una plataforma de despliegue estandarizada. Organizaciones con múltiples servicios o microservicios. Empresas que ya usan K8S pero sin las mejores prácticas de seguridad y operación.',
    benefits: [
      'Plataforma K8S estandarizada para todos los equipos de desarrollo',
      'Despliegues GitOps trazables y reversibles con ArgoCD',
      'Service mesh con Istio para comunicación segura entre servicios',
      'Auto-scaling horizontal y vertical para manejar picos de carga',
      'Observabilidad nativa sin instrumentación manual por cada servicio',
    ],
    approach: [
      'Assessment de cargas y definición de arquitectura de clusters',
      'Implementación de clusters con configuración base segura',
      'Configuración de redes, storage, RBAC y políticas de seguridad',
      'Implementación de service mesh, GitOps y observabilidad',
      'Hardening, transferencia de conocimiento y soporte inicial',
    ],
    faqs: [
      { q: '¿Cuánto tiempo toma tener Kubernetes en producción?', a: 'Un cluster inicial productivo con las mejores prácticas puede estar listo en 4 a 8 semanas. La complejidad aumenta con multicluster, service mesh y migración de cargas existentes.' },
      { q: '¿Ofrecen soporte continuo de la plataforma K8S?', a: 'Sí, a través del servicio de DevSecOps Managed Services operamos tu plataforma K8S con SLA y mejora continua.' },
    ],
  },
  {
    slug: 'devsecops-gitops-iac',
    intro:
      'Implementamos el ciclo completo de DevSecOps con seguridad integrada en cada etapa del pipeline: análisis de código (SAST), dependencias (SCA), testing dinámico (DAST), escaneo de contenedores y GitOps para despliegues trazables. Estandarizamos la entrega de software con métricas DORA para medir y mejorar continuamente.',
    forWho:
      'Equipos de desarrollo que quieren desplegar más rápido sin sacrificar seguridad. Organizaciones con múltiples equipos que necesitan estandarizar pipelines. Empresas con requisitos de seguridad o cumplimiento que deben demostrar controles en el ciclo de desarrollo.',
    benefits: [
      'Detección de vulnerabilidades antes de llegar a producción',
      'Despliegues automáticos y trazables con GitOps (ArgoCD)',
      'Infraestructura como código con Terraform para reproducibilidad',
      'Métricas DORA para medir velocidad y estabilidad de entregas',
      'Estándares de pipeline compartidos entre todos los equipos',
    ],
    approach: [
      'Evaluación de madurez DevSecOps actual y pipelines existentes',
      'Diseño del pipeline estándar con controles de seguridad',
      'Implementación de análisis SAST, SCA, DAST y escaneo de contenedores',
      'Configuración de GitOps con ArgoCD y políticas de despliegue',
      'Dashboard de métricas DORA y revisión continua',
    ],
    faqs: [
      { q: '¿Pueden trabajar con nuestros pipelines actuales (Jenkins, GitLab, GitHub Actions)?', a: 'Sí. Mejoramos los pipelines existentes en lugar de reemplazarlos, añadiendo controles de seguridad y estándares sin disrupciones.' },
      { q: '¿Cuánto tiempo toma implementar DevSecOps completo?', a: 'Un pipeline estándar con controles básicos puede estar listo en 4 a 6 semanas. DevSecOps completo con todos los controles y GitOps toma entre 10 y 16 semanas.' },
    ],
  },
  {
    slug: 'gobierno-datos-bi-ia',
    intro:
      'Construimos el modelo operativo de datos de tu organización: gobierno, catálogo, calidad, linaje, data lake y plataforma de analítica. Habilitamos BI self-service para que los equipos de negocio accedan a datos confiables sin depender de TI para cada consulta, y aplicamos IA donde genera valor real.',
    forWho:
      'Organizaciones con datos distribuidos en múltiples sistemas sin visibilidad unificada. Empresas que toman decisiones con datos inconsistentes o poco confiables. Equipos de negocio que necesitan reportes actualizados sin depender de TI.',
    benefits: [
      'Datos confiables con calidad validada y linaje documentado',
      'Data lake centralizado con acceso gobernado por dominio',
      'BI self-service para equipos de negocio sin dependencia de TI',
      'Catálogo de datos que reduce el tiempo de búsqueda de información',
      'IA aplicada donde genera impacto: predicción, segmentación, detección de anomalías',
    ],
    approach: [
      'Assessment de fuentes de datos, calidad y modelo de gobierno actual',
      'Diseño del modelo operativo de datos (DAMA-DMBOK)',
      'Implementación de data lake, pipelines de ingesta y calidad',
      'Catálogo de datos con linaje y clasificación',
      'Dashboards BI y habilitación de equipos de negocio',
    ],
    faqs: [
      { q: '¿Qué herramientas de BI utilizan?', a: 'Power BI, Tableau, Looker o Apache Superset según el ecosistema y presupuesto. Priorizamos herramientas que tu equipo pueda operar sin depender siempre de un especialista.' },
      { q: '¿Qué tipo de IA pueden implementar?', a: 'Modelos de predicción, clasificación, detección de anomalías, procesamiento de lenguaje natural y modelos generativos según el caso de uso. Empezamos con casos de negocio concretos, no con IA por moda.' },
    ],
  },
  {
    slug: 'automatizacion-procesos',
    intro:
      'Automatizamos procesos operativos repetitivos con RPA, workflows inteligentes y bots que reducen el error humano y liberan a tu equipo para tareas de mayor valor. Desde la captura de datos en portales hasta la conciliación contable automática, diseñamos automatizaciones robustas que no se rompen con cambios menores.',
    forWho:
      'Equipos con procesos manuales repetitivos que consumen horas de trabajo cada semana. Organizaciones con silos de sistemas que requieren reingreso manual de datos. Empresas que buscan escalar operaciones sin crecer el equipo.',
    benefits: [
      'Eliminación de tareas repetitivas y propensas a error humano',
      'Escalabilidad operativa sin necesidad de contratar más personal',
      'Trazabilidad completa de cada paso del proceso automatizado',
      'Integración con sistemas legacy sin APIs disponibles (via RPA)',
      'Alertas y excepciones manejadas automáticamente',
    ],
    approach: [
      'Mapeo y priorización de procesos a automatizar por impacto y esfuerzo',
      'Diseño del flujo automatizado con manejo de excepciones',
      'Desarrollo e implementación de robots o workflows',
      'Pruebas en ambiente controlado antes de producción',
      'Monitoreo, alertas y soporte post-implementación',
    ],
    faqs: [
      { q: '¿RPA o integración por API — cuándo usar cada uno?', a: 'APIs cuando el sistema las tiene disponibles — es más robusto y mantenible. RPA cuando el sistema no tiene API y solo hay interfaz gráfica. Muchas veces se combinan.' },
      { q: '¿Qué pasa si la interfaz del sistema cambia?', a: 'Los robots RPA pueden romperse con cambios de UI. Los diseñamos para ser resilientes ante cambios menores y documentamos los puntos de fallo para mantenimiento rápido.' },
    ],
  },
  {
    slug: 'capacitacion-talleres',
    intro:
      'Diseñamos y ejecutamos programas de formación técnica para equipos TI en cloud, datos, DevSecOps, arquitectura y transformación digital. No son cursos genéricos — usamos los sistemas, plataformas y contexto real de tu organización para que el aprendizaje sea inmediatamente aplicable.',
    forWho:
      'Equipos de TI que adoptan nuevas tecnologías y necesitan formación práctica. Organizaciones que implementan Kubernetes, DevSecOps o data lake y quieren que su equipo opere con autonomía. Líderes técnicos que necesitan actualizar las capacidades de su equipo.',
    benefits: [
      'Formación práctica con casos reales de tu organización, no ejemplos genéricos',
      'Rutas de aprendizaje progresivas desde fundamentos hasta expertise',
      'Certificaciones reconocidas como objetivo de los programas',
      'Material y laboratorios que el equipo puede reusar después',
      'Reducción de dependencia de consultores externos tras la formación',
    ],
    approach: [
      'Assessment de capacidades actuales del equipo',
      'Diseño del programa de formación y ruta de aprendizaje',
      'Talleres prácticos con laboratorios en entorno real o sandbox',
      'Evaluación de aprendizaje y ajuste de programa',
      'Seguimiento post-formación y soporte de dudas',
    ],
    faqs: [
      { q: '¿Qué temas cubren?', a: 'Cloud (AWS, GCP, Azure), Kubernetes, Docker, DevSecOps, GitOps, Terraform, observabilidad, arquitectura de microservicios, data engineering, Python para datos y más. Diseñamos el programa según tus necesidades.' },
      { q: '¿Pueden preparar al equipo para certificaciones?', a: 'Sí. Diseñamos programas orientados a certificaciones AWS, GCP, Azure, CKA, CKS y otras reconocidas por la industria.' },
    ],
  },
  {
    slug: 'drp-continuidad',
    intro:
      'Diseñamos e implementamos la estrategia completa de continuidad operativa y recuperación ante desastres para tu organización. Combinamos BIA, arquitectura DR, backup inmutable, cyber recovery y simulacros periódicos para garantizar que puedas recuperar operaciones dentro de los umbrales de RTO y RPO comprometidos.',
    forWho:
      'Organizaciones con sistemas críticos que no pueden asumir horas de inactividad. Empresas en sectores regulados con requisitos de continuidad operativa. Organizaciones que han sufrido o quieren prevenir incidentes de ransomware o pérdida de datos.',
    benefits: [
      'Plan de continuidad validado con simulacros reales, no solo documentación',
      'Protección específica ante ransomware con backup inmutable y air-gap',
      'RTO y RPO medidos y comprometidos contractualmente',
      'Runbooks que permiten recuperación sin depender del equipo técnico original',
      'Cumplimiento con regulaciones de continuidad e ISO 22301',
    ],
    approach: [
      'BIA y clasificación de criticidad de sistemas y procesos',
      'Definición de RTO/RPO por sistema y estrategia de DR apropiada',
      'Implementación de infraestructura de recuperación y backup',
      'Desarrollo de runbooks y procedimientos de failover/failback',
      'Simulacros, medición de resultados y mejora continua',
    ],
    faqs: [
      { q: '¿Con qué frecuencia realizan simulacros?', a: 'Recomendamos mínimo dos simulacros anuales para sistemas críticos. Los primeros simulacros suelen revelar brechas importantes que solo se descubren al ejecutar el procedimiento real.' },
      { q: '¿Pueden protegernos ante ransomware?', a: 'Sí. La estrategia de cyber recovery incluye backups inmutables con retención air-gap, segmentación de red y procedimientos específicos de recuperación ante cifrado malicioso.' },
    ],
  },
  {
    slug: 'observabilidad-sre',
    intro:
      'Implementamos la plataforma de observabilidad que unifica logs, métricas y trazas de todos tus servicios, APIs e infraestructura. Con SLOs/SLIs definidos desde la perspectiva del usuario y alertas accionables, tus equipos detectan y resuelven incidentes antes de que impacten la experiencia del cliente.',
    forWho:
      'Equipos de operaciones que trabajan con múltiples servicios distribuidos. Organizaciones que quieren implementar prácticas SRE para reducir MTTD y MTTR. Empresas con Kubernetes y microservicios que perdieron visibilidad de su sistema.',
    benefits: [
      'Visibilidad unificada de logs, métricas y trazas en un panel',
      'SLOs y SLIs definidos con alertas basadas en impacto al usuario',
      'Reducción documentada de MTTD y MTTR tras la implementación',
      'Correlación automática entre síntomas y causas raíz',
      'Dashboards ejecutivos que traducen salud técnica a lenguaje de negocio',
    ],
    approach: [
      'Evaluación de instrumentación actual y brechas de visibilidad',
      'Diseño del stack de observabilidad y política de retención',
      'Instrumentación de servicios, APIs, K8S e infraestructura',
      'Configuración de SLOs, alertas y supresión de ruido',
      'Implementación del modelo operativo NOC/SRE con runbooks',
    ],
    faqs: [
      { q: '¿Cuánto tiempo tarda en verse el valor?', a: 'En las primeras 2 semanas de instrumentación ya se identifican incidentes que antes pasaban desapercibidos. Los SLOs se establecen en semanas 4-6 una vez que hay suficientes datos de baseline.' },
      { q: '¿Puede integrarse con nuestro sistema de tickets?', a: 'Sí. Integramos alertas con Jira, ServiceNow, PagerDuty u otros ITSM para creación automática de tickets y flujos de escalamiento.' },
    ],
  },
  {
    slug: 'ciberseguridad',
    intro:
      'Diseñamos e implementamos arquitecturas de seguridad Zero Trust que protegen tu organización desde las APIs hasta la identidad de usuarios y la prevención de fraude. Evaluamos tu postura de seguridad frente a NIST CSF, implementamos IAM/CIAM, secretos, KYC y controles antifraude adaptados a tu industria.',
    forWho:
      'Organizaciones con datos sensibles, transacciones financieras o información de clientes que necesitan protección robusta. Empresas que quieren implementar Zero Trust. Fintech, banca y comercio digital con requisitos de KYC, AML y prevención de fraude.',
    benefits: [
      'Arquitectura Zero Trust que elimina la confianza implícita por red o ubicación',
      'IAM/CIAM para gestión centralizada de identidades internas y de clientes',
      'Gestión de secretos con Vault para eliminar credenciales hardcoded',
      'KYC y AML integrados para validación de identidad y cumplimiento',
      'Detección de fraude con modelos de comportamiento y reglas de negocio',
    ],
    approach: [
      'Evaluación de postura de seguridad frente a NIST CSF y OWASP',
      'Diseño de arquitectura Zero Trust y modelo de identidad',
      'Implementación de IAM/CIAM, Vault y políticas de acceso',
      'Integración de KYC/AML y controles antifraude',
      'Pruebas de penetración y ajuste de controles',
    ],
    faqs: [
      { q: '¿Realizan pruebas de penetración?', a: 'Sí, como parte del proceso de validación de controles. También coordinamos con proveedores especializados de pentesting para evaluaciones más amplias.' },
      { q: '¿Qué proveedores de KYC/AML trabajan con ustedes?', a: 'Tenemos experiencia con Jumio, Onfido, Truora, Experian y proveedores locales. La elección depende de los países de operación y los requisitos regulatorios.' },
    ],
  },
  {
    slug: 'mantenimiento-soporte',
    intro:
      'Operamos y mantenemos tus sistemas críticos con SLA definidos, monitoreo proactivo y respuesta rápida a incidentes. Actuamos como extensión de tu equipo TI para garantizar disponibilidad, aplicar actualizaciones de seguridad y gestionar incidentes antes de que se conviertan en crisis.',
    forWho:
      'Empresas sin equipo TI interno o con capacidad limitada para operar sistemas críticos 24/7. Organizaciones que quieren externalizar el soporte operativo mientras su equipo se enfoca en desarrollo y nuevas capacidades.',
    benefits: [
      'SLA de respuesta definidos por criticidad (L1, L2, L3)',
      'Monitoreo proactivo que detecta problemas antes de que sean fallas',
      'Actualizaciones de seguridad gestionadas sin impacto en producción',
      'Informes mensuales de disponibilidad, incidentes y mejoras',
      'Escalamiento inmediato ante incidentes críticos',
    ],
    approach: [
      'Onboarding: inventario, accesos y documentación de sistemas',
      'Configuración de monitoreo y alertas proactivas',
      'Establecimiento de canales de atención y SLA por nivel',
      'Operación mensual con revisión de disponibilidad y capacidad',
      'Informe mensual y revisión de mejoras',
    ],
    faqs: [
      { q: '¿Ofrecen soporte 24/7?', a: 'Sí para sistemas críticos (L1). Para sistemas no críticos, ofrecemos soporte en horario extendido o laboral según el nivel de servicio acordado.' },
      { q: '¿Pueden dar soporte a cualquier tecnología?', a: 'Cubrimos el stack web y cloud más común: Linux, Windows Server, bases de datos SQL/NoSQL, APIs REST, Kubernetes, y las principales nubes. Evaluamos tecnologías específicas caso a caso.' },
    ],
  },
];
