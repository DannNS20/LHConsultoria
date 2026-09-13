import type { CategorySlug } from './types';

// Contenido de la maqueta. Los datos marcados como "por confirmar" se reemplazan con la información real del despacho.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const site = {
  name: 'LH Consultores',
  tagline: 'Nuestro balance, tu tranquilidad.',
  description:
    'Despacho contable en México: contabilidad, impuestos, nómina y atención ante el SAT para personas físicas y empresas, explicados en lenguaje claro.',
  owner: {
    name: 'Luis Héctor Contreras',
    role: 'Contador Público · Director',
  },
  contact: {
    phone: '33 0000 0000', // por confirmar
    email: 'contacto@lhconsultores.mx', // por confirmar
    address: 'Guadalajara, Jalisco', // por confirmar
    hours: 'Lunes a viernes · 9:00 a 18:00',
    whatsappNumber: '', // por confirmar, formato 52XXXXXXXXXX
    whatsappMessage: 'Hola, me gustaría agendar una asesoría con LH Consultores.',
  },
};

export function whatsappLink(message = site.contact.whatsappMessage): string {
  return `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const nav = [
  { href: '/#nosotros', label: 'Nosotros' },
  { href: '/#servicios', label: 'Servicios' },
  { href: '/blog', label: 'Blog' },
  { href: '/#contacto', label: 'Contacto' },
];

export const services = [
  {
    title: 'Contabilidad para negocios',
    description: 'Registros contables mensuales, estados financieros y reportes que entiendes y te sirven para decidir.',
    icon: 'ledger',
  },
  {
    title: 'Declaraciones e impuestos',
    description: 'Declaraciones mensuales y anuales en tiempo, aprovechando las deducciones que te corresponden.',
    icon: 'receipt',
  },
  {
    title: 'Nómina e IMSS',
    description: 'Cálculo y timbrado de nómina, altas y bajas ante el IMSS y cumplimiento del impuesto estatal.',
    icon: 'people',
  },
  {
    title: 'Atención ante el SAT',
    description: 'Respuesta a requerimientos, cartas invitación, buzón tributario y regularización de pendientes.',
    icon: 'shield',
  },
  {
    title: 'Constitución de empresas',
    description: 'Te acompañamos a elegir el régimen adecuado y a arrancar tu empresa en orden desde el primer día.',
    icon: 'building',
  },
  {
    title: 'Asesoría fiscal personalizada',
    description: 'Sesiones para resolver dudas puntuales y planear tus impuestos antes de que sea tarde.',
    icon: 'chat',
  },
] as const;

export const reasons = [
  {
    title: 'Hablamos claro',
    description: 'Te explicamos tu situación fiscal sin tecnicismos, para que sepas exactamente qué pagas y por qué.',
  },
  {
    title: 'Te avisamos antes',
    description: 'Recordatorios de fechas límite y obligaciones para que nunca te enteres de un problema cuando ya es tarde.',
  },
  {
    title: 'Trato directo',
    description: 'Trabajas con el titular del despacho, no con un número de ticket.',
  },
  {
    title: 'Todo documentado',
    description: 'Acuses, declaraciones y reportes ordenados y disponibles cuando los necesites.',
  },
];

// Cifras de ejemplo: por confirmar con el despacho antes de publicar.
export const stats = [
  { value: 12, suffix: '+', label: 'años de experiencia' },
  { value: 150, suffix: '+', label: 'clientes atendidos' },
  { value: 100, suffix: '%', label: 'declaraciones en tiempo' },
];

export const steps = [
  { title: 'Diagnóstico', description: 'Revisamos tu situación actual ante el SAT y detectamos pendientes u oportunidades.' },
  { title: 'Plan de trabajo', description: 'Te proponemos un plan claro con obligaciones, fechas y costos definidos.' },
  { title: 'Acompañamiento', description: 'Nos encargamos del cumplimiento mes a mes y te mantenemos informado.' },
];

export const categoryNames: Record<CategorySlug, string> = {
  impuestos: 'Impuestos',
  sat: 'SAT',
  nomina: 'Nómina',
  empresas: 'Empresas',
  'finanzas-personales': 'Finanzas personales',
};

export function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}
