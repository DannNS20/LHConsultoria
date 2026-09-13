import { readingMinutes } from './post-utils';
import type { AuthUser, ContactMessage, Post } from './types';

// Mismas entradas de ejemplo que LHConsultoria-backend (src/posts/posts.seed.ts), para el modo demo.

export const DEMO_USER: AuthUser = { name: 'Luis Héctor Contreras', email: 'demo@lhconsultores.test' };

type SeedPost = Omit<Post, 'id' | 'readingMinutes' | 'createdAt' | 'updatedAt' | 'author' | 'coverUrl'>;

const seed: SeedPost[] = [
  {
    slug: 'errores-que-pueden-costarte-una-multa-del-sat',
    title: '5 errores que pueden costarte una multa del SAT',
    excerpt:
      'La mayoría de las multas no vienen de grandes fraudes, sino de descuidos del día a día. Estos son los más comunes y cómo evitarlos.',
    category: 'sat',
    status: 'published',
    publishedAt: '2026-09-08T15:00:00.000Z',
    blocks: [
      {
        type: 'paragraph',
        text: 'Cuando hablamos con personas que recibieron una multa del SAT, casi siempre escuchamos lo mismo: "no sabía que tenía que hacer eso". La buena noticia es que la mayoría de estos errores se pueden prevenir con orden y un poco de acompañamiento.',
      },
      { type: 'heading', text: '1. Presentar declaraciones fuera de plazo' },
      {
        type: 'paragraph',
        text: 'Aunque no hayas tenido ingresos en el mes, si estás obligado a declarar debes hacerlo. Presentar tarde genera recargos, actualizaciones y, en muchos casos, multas.',
      },
      { type: 'heading', text: '2. Deducir gastos sin factura o pagados en efectivo' },
      {
        type: 'paragraph',
        text: 'Para que un gasto sea deducible necesitas el CFDI correspondiente. Además, los pagos mayores a $2,000 deben hacerse con transferencia, tarjeta o cheque nominativo; si los pagas en efectivo, pierdes la deducción.',
      },
      { type: 'video', url: '' },
      { type: 'heading', text: '3. No revisar el buzón tributario' },
      {
        type: 'paragraph',
        text: 'El buzón tributario es el medio oficial por el que el SAT te notifica. Si no lo tienes activo o no lo revisas, los plazos corren igual y puedes enterarte de un requerimiento cuando ya es tarde.',
      },
      { type: 'heading', text: '4. Tener datos desactualizados' },
      {
        type: 'paragraph',
        text: 'Cambiaste de domicilio, de actividad o de régimen y no lo avisaste. Estos cambios se deben informar ante el SAT; no hacerlo puede afectar tu facturación y tu opinión de cumplimiento.',
      },
      { type: 'heading', text: '5. Facturar con errores y no corregirlos a tiempo' },
      {
        type: 'paragraph',
        text: 'Un CFDI con datos incorrectos del cliente, uso o método de pago equivocado puede generar problemas a ambas partes. Lo mejor es revisar antes de timbrar y cancelar correctamente cuando haga falta.',
      },
      {
        type: 'quote',
        text: 'Ninguno de estos errores requiere conocimientos avanzados para evitarse: requiere constancia. Para eso existe tu contador.',
      },
    ],
  },
  {
    slug: 'que-es-la-opinion-de-cumplimiento',
    title: '¿Qué es la opinión de cumplimiento y por qué te la piden?',
    excerpt:
      'Clientes, bancos y dependencias la solicitan cada vez más. Te explicamos qué significa, cómo se obtiene y qué hacer si sale negativa.',
    category: 'sat',
    status: 'published',
    publishedAt: '2026-09-01T15:00:00.000Z',
    blocks: [
      {
        type: 'paragraph',
        text: 'La opinión de cumplimiento de obligaciones fiscales es un documento que emite el SAT y que indica si estás al corriente con tus obligaciones. Puede salir positiva, negativa, en suspenso o como no inscrito.',
      },
      { type: 'heading', text: '¿Quién te la puede pedir?' },
      {
        type: 'list',
        items: [
          'Empresas que te contratan como proveedor.',
          'Instituciones financieras al solicitar un crédito.',
          'Dependencias de gobierno para licitaciones o apoyos.',
        ],
      },
      { type: 'heading', text: '¿Cómo se obtiene?' },
      {
        type: 'paragraph',
        text: 'Se descarga desde el portal del SAT con tu RFC y contraseña o con tu e.firma. El trámite es inmediato y no tiene costo.',
      },
      { type: 'heading', text: 'Si sale negativa' },
      {
        type: 'paragraph',
        text: 'El mismo documento indica qué obligaciones están pendientes. Lo recomendable es revisarlo con tu contador, regularizar lo necesario y volver a generarla una vez que el SAT registre las correcciones.',
      },
    ],
  },
  {
    slug: 'checklist-declaracion-anual-personas-fisicas',
    title: 'Checklist para tu declaración anual como persona física',
    excerpt:
      'La declaración anual de personas físicas se presenta en abril. Tener todo listo con tiempo te ayuda a aprovechar tus deducciones y evitar prisas.',
    category: 'impuestos',
    status: 'published',
    publishedAt: '2026-08-25T15:00:00.000Z',
    blocks: [
      {
        type: 'paragraph',
        text: 'Cada año, las personas físicas presentan su declaración anual durante el mes de abril. Preparar la información desde antes evita errores y te permite revisar si tienes saldo a favor.',
      },
      { type: 'heading', text: 'Lo que necesitas tener a la mano' },
      {
        type: 'list',
        items: [
          'Tu RFC y contraseña del SAT o e.firma vigente.',
          'Facturas de tus ingresos del año.',
          'Facturas de deducciones personales: gastos médicos, dentales, colegiaturas, intereses hipotecarios, entre otras.',
          'Constancias de retenciones, si trabajas para uno o varios patrones.',
          'Una cuenta CLABE a tu nombre, por si resulta saldo a favor.',
        ],
      },
      { type: 'image', url: '' },
      {
        type: 'paragraph',
        text: 'Recuerda que las deducciones personales deben estar pagadas con medios electrónicos y facturadas a tu RFC para poder aplicarlas.',
      },
    ],
  },
  {
    slug: 'nomina-lo-basico-que-todo-patron-debe-cumplir',
    title: 'Nómina: lo básico que todo patrón debe cumplir',
    excerpt:
      'Contratar a tu primer colaborador implica obligaciones ante el SAT, el IMSS y tu estado. Aquí el resumen para empezar en orden.',
    category: 'nomina',
    status: 'published',
    publishedAt: '2026-08-18T15:00:00.000Z',
    blocks: [
      {
        type: 'paragraph',
        text: 'Tener empleados es una gran señal de crecimiento, pero también trae obligaciones que conviene conocer desde el primer día.',
      },
      {
        type: 'list',
        items: [
          'Registrarte como patrón y dar de alta a tus trabajadores ante el IMSS.',
          'Calcular y pagar las cuotas obrero-patronales.',
          'Emitir el CFDI de nómina por cada pago.',
          'Retener y enterar el ISR de tus trabajadores.',
          'Pagar el impuesto sobre nómina de tu estado.',
        ],
      },
      { type: 'quote', text: 'Una nómina en orden protege a tu negocio y a tu equipo.' },
    ],
  },
  {
    slug: 'resico-te-conviene',
    title: 'RESICO: ¿te conviene este régimen?',
    excerpt: 'Borrador en preparación sobre ventajas y requisitos del Régimen Simplificado de Confianza.',
    category: 'impuestos',
    status: 'draft',
    publishedAt: null,
    blocks: [
      { type: 'paragraph', text: 'Borrador: explicar a quién aplica, ventajas, requisitos y en qué casos no conviene.' },
    ],
  },
];

export function createDemoPosts(): Post[] {
  return seed.map((p, i) => {
    const date = p.publishedAt ?? '2026-09-10T15:00:00.000Z';
    return {
      ...p,
      id: `seed-${i + 1}`,
      author: DEMO_USER.name,
      coverUrl: null,
      readingMinutes: readingMinutes(p.blocks),
      createdAt: date,
      updatedAt: date,
    };
  });
}

export function createDemoMessages(): ContactMessage[] {
  return [
    {
      id: 'seed-1',
      name: 'María Fernanda López',
      email: 'maria.lopez@example.com',
      phone: '33 1234 5678',
      service: 'Contabilidad para negocios',
      message: 'Hola, tengo una tienda en línea y necesito ayuda con mi facturación mensual. ¿Podemos agendar una llamada?',
      read: false,
      createdAt: '2026-09-11T17:20:00.000Z',
    },
  ];
}

export const DEMO_SEED_SLUGS = seed.filter((p) => p.status === 'published').map((p) => p.slug);
