import type { UiMessages } from './types';

const messages = {
  brand: {
    name: 'MythCanvas',
    tagline: 'Reimagine mythology with AI. Explore gods, realms, and legendary visual worlds.',
  },
  nav: {
    home: 'Home',
    explore: 'Explore',
    characters: 'Deities',
    worlds: 'Realms',
    mythology: 'Mythology',
    create: 'AI Create',
    my: 'My Universe',
  },
  action: {
    search: 'Search',
  },
  account: {
    entry: 'Sign in or view My Universe',
    signedInPrefix: 'Signed in',
    myUniverse: 'View My Universe',
  },
  footer: {
    description: 'Reimagine mythology with AI. Explore gods, realms, and legendary visual worlds.',
    legalAria: 'Legal and policies',
    navAria: 'Footer navigation',
    privacy: 'Privacy',
    terms: 'Terms',
    copyright: 'Copyright',
    meta: 'Mythic archetypes · Original visuals · AI reinterpretation',
  },
} satisfies UiMessages;

export default messages;
