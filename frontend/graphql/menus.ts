export interface MenuItem {
  id: string;
  label: string;
  url: string;
}

export interface MenuItemIcon {
  sourceUrl: string | null;
  altText: string | null;
}

export interface TopMenuItem extends MenuItem {
  topMenuIcon: MenuItemIcon | null;
  topMenuIconInterne: MenuItemIcon | null;
}

export const GET_MAIN_MENU = /* GraphQL */ `
  query GetMainMenu {
    menuItems(where: { location: MAIN_MENU }) {
      nodes {
        id
        label
        url
      }
    }
  }
`;

export const GET_TOP_MENU = /* GraphQL */ `
  query GetTopMenu {
    menuItems(where: { location: SECONDARY_MENU }) {
      nodes {
        id
        label
        url
        topMenuIcon {
          sourceUrl
          altText
        }
        topMenuIconInterne {
          sourceUrl
          altText
        }
      }
    }
  }
`;

export const GET_SOCIAL_MENU = /* GraphQL */ `
  query GetSocialMenu {
    menuItems(where: { location: RESEAUX_SOCIAUX }) {
      nodes {
        id
        label
        url
        topMenuIcon {
          sourceUrl
          altText
        }
        topMenuIconInterne {
          sourceUrl
          altText
        }
      }
    }
  }
`;

export interface GetMainMenuData {
  menuItems: { nodes: MenuItem[] };
}

export interface GetTopMenuData {
  menuItems: { nodes: TopMenuItem[] };
}

export interface GetSocialMenuData {
  menuItems: { nodes: TopMenuItem[] };
}
