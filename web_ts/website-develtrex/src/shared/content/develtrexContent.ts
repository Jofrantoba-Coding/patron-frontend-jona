export const develtrexContent = {
  navigation: {
    brand: 'DEVELTREX',
    links: [
      { label: 'Inicio', href: '#inicio' },
      { label: 'Productos', href: '#productos' },
      { label: 'Servicios', href: '#servicios' },
      { label: 'Proceso', href: '#proceso' },
      { label: 'Contacto', href: '#contacto' },
    ],
  },
  hero: {
    eyebrow: 'Ingenieria de software e informacion',
    title: 'Software, datos y automatizacion para empresas que quieren vender mejor',
    summary:
      'Creamos aplicaciones, dashboards y plataformas comerciales para reducir trabajo manual, ordenar operaciones y tomar decisiones con informacion confiable.',
    primaryAction: { label: 'Agendar diagnostico', href: 'https://api.whatsapp.com/send?phone=51929913524' },
    secondaryAction: { label: 'Ver servicios', href: '#servicios' },
  },
  metrics: [
    { value: '+13', label: 'anos liderando proyectos tech y datos' },
    { value: '24/7', label: 'arquitecturas cloud listas para operar' },
    { value: 'BI', label: 'dashboards para decisiones comerciales' },
  ],
  purpose: {
    title: 'Somos Develtrex',
    items: [
      {
        title: 'Proposito',
        description: 'Ofrecer servicios de tecnologia que mejoren la vida de las personas y aumenten la productividad de las empresas.',
      },
      {
        title: 'Mision',
        description: 'Llevar a tu empresa a la transformacion digital con soluciones claras, escalables y mantenibles.',
      },
    ],
  },
  products: [
    {
      name: 'Softcommerce',
      tag: 'ERP + facturacion electronica',
      outcome: 'Factura, controla inventario y gestiona finanzas sin depender de hojas de calculo.',
      description:
        'Software comercial contable para empresas peruanas: facturacion electronica, compras, ventas, inventario, tesoreria, cuentas por cobrar y reportes.',
      highlights: ['Facturacion electronica', 'Kardex y stock', 'Tesoreria y reportes'],
    },
    {
      name: 'OpenData',
      tag: 'dashboards con datos abiertos',
      outcome: 'Convierte informacion publica o interna en tableros ejecutivos para explorar oportunidades.',
      description:
        'Iniciativa de visualizacion de datos para hacer informacion disponible, accesible y facil de analizar.',
      highlights: ['Looker Studio', 'Data storytelling', 'Indicadores publicos'],
    },
    {
      name: 'Master Class',
      tag: 'analitica aplicada',
      outcome: 'Capacita equipos internos para que diseñen y mantengan sus propios tableros.',
      description:
        'Programas practicos sobre herramientas de BI como Looker Studio y FineReport para fortalecer capacidades internas.',
      highlights: ['Looker Studio', 'FineReport', 'Casos reales'],
    },
  ],
  servicesIntro: {
    title: 'Servicios para transformar ventas, operaciones y datos',
    description:
      'Tomamos los servicios del sitio actual y los convertimos en ofertas claras para empresas que necesitan construir, modernizar o escalar tecnologia.',
  },
  services: [
    {
      name: 'Soluciones a medida',
      promise: 'Aplicaciones web, mobile o internas ajustadas al flujo real de tu negocio.',
      proof: 'Ideal para reemplazar archivos dispersos, procesos manuales y sistemas desconectados.',
      visual: 'build',
    },
    {
      name: 'Dashboards y ciencia de datos',
      promise: 'Indicadores comerciales, financieros y operativos para decisiones rapidas.',
      proof: 'Looker Studio, FineReport, fuentes internas y datos abiertos.',
      visual: 'data',
    },
    {
      name: 'Modernizacion y migracion',
      promise: 'Actualizamos aplicaciones, bases de datos e infraestructura sin perder continuidad.',
      proof: 'Arquitectura escalable, integraciones y reduccion de deuda tecnica.',
      visual: 'modern',
    },
    {
      name: 'Cloud, DevOps y soporte',
      promise: 'Infraestructura segura, despliegues repetibles y operacion confiable.',
      proof: 'Gestion cloud, automatizacion, monitoreo, mantenimiento y soporte.',
      visual: 'cloud',
    },
    {
      name: 'E-commerce y productos digitales',
      promise: 'Experiencias comerciales para vender en linea y atender mejor a tus clientes.',
      proof: 'UX, arquitectura de software, integraciones y analitica de conversion.',
      visual: 'commerce',
    },
    {
      name: 'Gestion de bases de datos',
      promise: 'Datos ordenados, respaldados y disponibles para operar sin interrupciones.',
      proof: 'Modelado, consultas, rendimiento, seguridad y gobierno de informacion.',
      visual: 'database',
    },
  ],
  process: [
    {
      title: 'Diagnostico',
      description: 'Revisamos el proceso actual, dolores operativos, datos disponibles y objetivos de negocio.',
    },
    {
      title: 'Propuesta funcional',
      description: 'Priorizamos quick wins, alcance tecnico, arquitectura y entregables medibles.',
    },
    {
      title: 'Implementacion JONA',
      description: 'Construimos por features con contratos claros, vistas puras y componentes del sistema uijona.',
    },
    {
      title: 'Lanzamiento y mejora',
      description: 'Publicamos, medimos adopcion, entrenamos al equipo y dejamos una base mantenible.',
    },
  ],
  offers: [
    'Automatizar facturacion, ventas e inventario',
    'Crear dashboards de gestion para gerencia',
    'Migrar procesos manuales a una app interna',
    'Diseñar una plataforma comercial o e-commerce',
    'Ordenar datos y reportes para tomar decisiones',
    'Mejorar despliegues con cloud y DevOps',
  ],
  contact: {
    title: 'Contactanos',
    subtitle: 'Ventas y proyectos tecnologicos',
    phone: '+51 929 913 524',
    phoneHref: 'tel:+51929913524',
    email: 'team@develtrex.com',
    emailHref: 'mailto:team@develtrex.com',
    whatsappHref: 'https://api.whatsapp.com/send?phone=51929913524',
  },
};

export type DeveltrexContent = typeof develtrexContent;
