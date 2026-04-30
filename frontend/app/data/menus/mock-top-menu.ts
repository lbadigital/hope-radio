// Miroir exact de la réponse WPGraphQL pour GET_TOP_MENU.
// Shape : { menuItems: { nodes: TopMenuItem[] } }
import type { GetTopMenuData } from '@/graphql/menus';

export const MOCK_TOP_MENU: GetTopMenuData = {
  menuItems: {
    nodes: [
      {
        id: 'top-item-1',
        label: 'Contact',
        url: '/contact',
        topMenuIcon: { sourceUrl: null, altText: 'Contact' },
      },
      {
        id: 'top-item-2',
        label: 'Newsletter',
        url: '/newsletter',
        topMenuIcon: { sourceUrl: null, altText: 'Newsletter' },
      },
      {
        id: 'top-item-3',
        label: 'Faire un don',
        url: '/don',
        topMenuIcon: { sourceUrl: null, altText: 'Faire un don' },
      },
    ],
  },
};
