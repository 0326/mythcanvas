import type { UiMessages } from './types';

const messages = {
  brand: {
    name: 'MythCanvas',
    tagline: 'Reimagina la mitología con IA. Explora dioses, reinos y mundos legendarios.',
  },
  nav: {
    home: 'Inicio',
    explore: 'Explorar',
    characters: 'Deidades',
    worlds: 'Reinos',
    mythology: 'Mitología',
    create: 'Crear con IA',
    my: 'Mi Universo',
  },
  action: {
    search: 'Buscar',
    language: 'Cambiar idioma',
  },
  account: {
    entry: 'Iniciar sesión o ver Mi Universo',
    signedInPrefix: 'Sesión iniciada',
    myUniverse: 'Ver Mi Universo',
  },
  footer: {
    description: 'Reimagina la mitología con IA. Explora dioses, reinos y mundos legendarios.',
    legalAria: 'Legal y políticas',
    navAria: 'Navegación del pie de página',
    privacy: 'Privacidad',
    terms: 'Términos',
    copyright: 'Derechos de autor',
    meta: 'Arquetipos míticos · Visuales originales · Reinterpretación con IA',
  },
} satisfies UiMessages;

export default messages;
