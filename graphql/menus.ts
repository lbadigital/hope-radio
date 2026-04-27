export interface MenuItem {
  id: string;
  label: string;
  url: string;
}

export interface TopMenuItem extends MenuItem {
  topMenuIcon: {
    icone: {
      node: {
        sourceUrl: string;
        altText: string;
      };
    } | null;
  } | null;
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
          icone {
            node {
              sourceUrl
              altText
            }
          }
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
