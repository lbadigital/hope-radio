// Miroir exact de la réponse WPGraphQL pour GET_SOCIAL_MENU.
// Shape : { menuItems: { nodes: TopMenuItem[] } }
import type { GetSocialMenuData } from '@/graphql/menus';

export const MOCK_SOCIAL_MENU: GetSocialMenuData = {
  menuItems: {
    nodes: [
      {
        id: 'social-item-1',
        label: 'Facebook',
        url: 'https://facebook.com/hoperadio',
        topMenuIcon: { sourceUrl: null, altText: 'Facebook' },
        topMenuIconInterne: null,
      },
      {
        id: 'social-item-2',
        label: 'Instagram',
        url: 'https://instagram.com/hoperadio',
        topMenuIcon: { sourceUrl: null, altText: 'Instagram' },
        topMenuIconInterne: null,
      },
      {
        id: 'social-item-3',
        label: 'YouTube',
        url: 'https://youtube.com/@hoperadio',
        topMenuIcon: { sourceUrl: null, altText: 'YouTube' },
        topMenuIconInterne: null,
      },
    ],
  },
};
