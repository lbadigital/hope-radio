// Miroir exact de la réponse WPGraphQL pour GET_MAIN_MENU.
// Shape : { menuItems: { nodes: MenuItem[] } }
import type { GetMainMenuData } from '@/graphql/menus';

export const MOCK_MAIN_MENU: GetMainMenuData = {
  menuItems: {
    nodes: [
      { id: 'menu-item-1', label: 'Accueil',    url: '/'           },
      { id: 'menu-item-2', label: 'Actualités', url: '/actualites' },
      { id: 'menu-item-3', label: 'Émissions',  url: '/emissions'  },
      { id: 'menu-item-4', label: 'Podcasts',   url: '/podcasts'   },
      { id: 'menu-item-5', label: 'Agenda',     url: '/agenda'     },
      { id: 'menu-item-6', label: 'La grille',  url: '/grille'     },
      { id: 'menu-item-7', label: 'La radio',   url: '/radio'      },
    ],
  },
};
