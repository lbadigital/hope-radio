// Miroir exact de la réponse WPGraphQL pour GET_ACTUALITES.
//
// !! Ne pas modifier la structure sans mettre à jour la query dans graphql/actualites.ts.

import type { GetActualitesData } from '@/graphql/actualites';

export const MOCK_ACTUALITES: GetActualitesData = {
  posts: {
    nodes: [
      {
        title:   'Grand concert de gospel au Zénith : une soirée inoubliable',
        excerpt: '<p>La salle était comble pour cet événement exceptionnel qui a réuni plus de cinq mille spectateurs venus célébrer la musique gospel.</p>',
        slug:    'grand-concert-gospel-zenith',
        uri:     '/actualites/grand-concert-gospel-zenith/',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+1',
            altText:   'Grand concert de gospel au Zénith',
          },
        },
        categories: {
          nodes: [{ name: 'Musique', slug: 'musique' }],
        },
      },
      {
        title:   'Hope Radio partenaire officiel du festival de musique urbaine',
        excerpt: '<p>Hope Radio renforce son ancrage culturel en devenant partenaire officiel du plus grand festival de musique urbaine de la région.</p>',
        slug:    'hope-radio-partenaire-festival-musique-urbaine',
        uri:     '/actualites/hope-radio-partenaire-festival-musique-urbaine/',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+2',
            altText:   'Festival de musique urbaine',
          },
        },
        categories: {
          nodes: [
            { name: 'Musique', slug: 'musique' },
            { name: 'Culture', slug: 'culture' },
          ],
        },
      },
      {
        title:   'Rencontre avec les animateurs : les coulisses de Hope Radio',
        excerpt: '<p>Plongez dans les coulisses de votre radio préférée et découvrez le quotidien de vos animateurs favoris.</p>',
        slug:    'coulisses-hope-radio',
        uri:     '/actualites/coulisses-hope-radio/',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+3',
            altText:   'Coulisses de Hope Radio',
          },
        },
        categories: {
          nodes: [{ name: 'Culture', slug: 'culture' }],
        },
      },
      {
        title:   'Journée mondiale de la paix : Hope Radio mobilise ses auditeurs',
        excerpt: '<p>À l\'occasion de la journée mondiale de la paix, Hope Radio lance une initiative citoyenne pour sensibiliser les communautés locales.</p>',
        slug:    'journee-mondiale-paix-hope-radio',
        uri:     '/actualites/journee-mondiale-paix-hope-radio/',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+4',
            altText:   'Journée mondiale de la paix',
          },
        },
        categories: {
          nodes: [{ name: 'Société', slug: 'societe' }],
        },
      },
      {
        title:   'Les résultats du championnat régional de football commentés en direct',
        excerpt: '<p>Hope Radio était en direct pour commenter les résultats du championnat régional de football, avec des analyses en plateau.</p>',
        slug:    'championnat-regional-football-direct',
        uri:     '/actualites/championnat-regional-football-direct/',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+5',
            altText:   'Championnat régional de football',
          },
        },
        categories: {
          nodes: [{ name: 'Sport', slug: 'sport' }],
        },
      },
      {
        title:   'Nouveau programme : "Culture Vivante" débarque sur Hope Radio',
        excerpt: '<p>Dès le lundi prochain, une nouvelle émission consacrée à la culture locale fera son apparition dans la grille de Hope Radio.</p>',
        slug:    'nouveau-programme-culture-vivante',
        uri:     '/actualites/nouveau-programme-culture-vivante/',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+6',
            altText:   'Culture Vivante sur Hope Radio',
          },
        },
        categories: {
          nodes: [{ name: 'Culture', slug: 'culture' }],
        },
      },
      {
        title:   'Interview exclusive : la chanteuse Éléonore parle de son nouvel album',
        excerpt: '<p>Éléonore était l\'invitée de Hope Radio pour présenter son tout premier album studio dans un entretien sincère et touchant.</p>',
        slug:    'interview-eleonore-nouvel-album',
        uri:     '/actualites/interview-eleonore-nouvel-album/',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+7',
            altText:   'Interview Éléonore',
          },
        },
        categories: {
          nodes: [
            { name: 'Musique', slug: 'musique' },
            { name: 'Culture', slug: 'culture' },
          ],
        },
      },
      {
        title:   'Bilan de la saison sportive : les clubs locaux à l\'honneur',
        excerpt: '<p>La saison sportive touche à sa fin et Hope Radio dresse un bilan des performances des clubs locaux dans toutes les disciplines.</p>',
        slug:    'bilan-saison-sportive-clubs-locaux',
        uri:     '/actualites/bilan-saison-sportive-clubs-locaux/',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+8',
            altText:   'Bilan saison sportive',
          },
        },
        categories: {
          nodes: [{ name: 'Sport', slug: 'sport' }],
        },
      },
      {
        title:   'Solidarité : collecte de dons organisée avec le soutien de Hope Radio',
        excerpt: '<p>Hope Radio s\'associe à une grande collecte de dons au bénéfice des familles en difficulté de la région.</p>',
        slug:    'collecte-dons-hope-radio',
        uri:     '/actualites/collecte-dons-hope-radio/',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+9',
            altText:   'Collecte de dons Hope Radio',
          },
        },
        categories: {
          nodes: [{ name: 'Société', slug: 'societe' }],
        },
      },
      {
        title:   'Découverte : le marché artisanal qui fait revivre les traditions',
        excerpt: '<p>Un marché artisanal pas comme les autres a ouvert ses portes en plein cœur de la ville, mettant à l\'honneur le savoir-faire local.</p>',
        slug:    'marche-artisanal-traditions',
        uri:     '/actualites/marche-artisanal-traditions/',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+10',
            altText:   'Marché artisanal',
          },
        },
        categories: {
          nodes: [
            { name: 'Culture', slug: 'culture' },
            { name: 'Société', slug: 'societe' },
          ],
        },
      },
      {
        title:   'Musique gospel : retour sur les plus beaux moments de l\'année',
        excerpt: '<p>Hope Radio revient sur les temps forts de la scène gospel régionale qui ont marqué les esprits au cours des douze derniers mois.</p>',
        slug:    'bilan-gospel-annee',
        uri:     '/actualites/bilan-gospel-annee/',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+11',
            altText:   'Musique gospel bilan annuel',
          },
        },
        categories: {
          nodes: [{ name: 'Musique', slug: 'musique' }],
        },
      },
      {
        title:   'Éducation : Hope Radio soutient les jeunes talents de la région',
        excerpt: '<p>Hope Radio lance un programme de soutien aux jeunes talents artistiques et sportifs en partenariat avec les établissements scolaires.</p>',
        slug:    'hope-radio-soutien-jeunes-talents',
        uri:     '/actualites/hope-radio-soutien-jeunes-talents/',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+12',
            altText:   'Soutien jeunes talents',
          },
        },
        categories: {
          nodes: [{ name: 'Société', slug: 'societe' }],
        },
      },
      {
        title:   'Agenda culturel : les événements à ne pas manquer ce mois-ci',
        excerpt: '<p>Hope Radio vous présente sa sélection des événements culturels incontournables : concerts, expositions, spectacles et rencontres.</p>',
        slug:    'agenda-culturel-mensuel',
        uri:     '/actualites/agenda-culturel-mensuel/',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+13',
            altText:   'Agenda culturel du mois',
          },
        },
        categories: {
          nodes: [{ name: 'Événements', slug: 'evenements' }],
        },
      },
      {
        title:   'Santé et bien-être : Hope Radio accueille une nutritionniste en plateau',
        excerpt: '<p>Hope Radio reçoit une nutritionniste reconnue pour répondre aux questions des auditeurs sur l\'alimentation équilibrée.</p>',
        slug:    'sante-nutritionniste-hope-radio',
        uri:     '/actualites/sante-nutritionniste-hope-radio/',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+14',
            altText:   'Nutritionniste en plateau',
          },
        },
        categories: {
          nodes: [{ name: 'Société', slug: 'societe' }],
        },
      },
      {
        title:   'Environnement : les initiatives vertes soutenues par Hope Radio',
        excerpt: '<p>Hope Radio met en lumière les initiatives locales qui œuvrent pour un avenir plus durable et responsable.</p>',
        slug:    'initiatives-vertes-hope-radio',
        uri:     '/actualites/initiatives-vertes-hope-radio/',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+15',
            altText:   'Initiatives environnementales',
          },
        },
        categories: {
          nodes: [{ name: 'Société', slug: 'societe' }],
        },
      },
      {
        title:   'Basketball : victoire éclatante de l\'équipe locale en finale régionale',
        excerpt: '<p>L\'équipe locale de basketball a remporté une victoire historique lors de la finale régionale, sous les vivats d\'un public enthousiaste.</p>',
        slug:    'basketball-victoire-finale-regionale',
        uri:     '/actualites/basketball-victoire-finale-regionale/',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+16',
            altText:   'Victoire basketball finale régionale',
          },
        },
        categories: {
          nodes: [{ name: 'Sport', slug: 'sport' }],
        },
      },
      {
        title:   'Podcast de la semaine : "Voix d\'Afrique" cartonne sur toutes les plateformes',
        excerpt: '<p>Le podcast "Voix d\'Afrique" produit par Hope Radio connaît un succès retentissant avec plus de cinquante mille écoutes en une semaine.</p>',
        slug:    'podcast-voix-afrique-succes',
        uri:     '/actualites/podcast-voix-afrique-succes/',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+17',
            altText:   'Podcast Voix d\'Afrique',
          },
        },
        categories: {
          nodes: [{ name: 'Culture', slug: 'culture' }],
        },
      },
      {
        title:   'Fête de la musique : Hope Radio diffuse en live depuis la place centrale',
        excerpt: '<p>Pour la Fête de la Musique, Hope Radio sera en direct depuis la place centrale pour vous faire vivre les concerts en temps réel.</p>',
        slug:    'fete-musique-hope-radio-live',
        uri:     '/actualites/fete-musique-hope-radio-live/',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+18',
            altText:   'Fête de la Musique Hope Radio',
          },
        },
        categories: {
          nodes: [
            { name: 'Musique', slug: 'musique' },
            { name: 'Événements', slug: 'evenements' },
          ],
        },
      },
      {
        title:   'Reportage : les femmes entrepreneures qui changent la donne',
        excerpt: '<p>Hope Radio consacre un grand reportage aux femmes entrepreneures de la région qui font bouger les lignes dans des secteurs masculins.</p>',
        slug:    'femmes-entrepreneures-reportage',
        uri:     '/actualites/femmes-entrepreneures-reportage/',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+19',
            altText:   'Femmes entrepreneures',
          },
        },
        categories: {
          nodes: [{ name: 'Société', slug: 'societe' }],
        },
      },
      {
        title:   'Noël solidaire : Hope Radio collecte des jouets pour les enfants défavorisés',
        excerpt: '<p>À l\'approche des fêtes, Hope Radio organise une grande collecte de jouets destinés aux enfants les moins favorisés de la région.</p>',
        slug:    'noel-solidaire-collecte-jouets',
        uri:     '/actualites/noel-solidaire-collecte-jouets/',
        featuredImage: {
          node: {
            sourceUrl: 'https://placehold.co/744x380/E35711/FFFFFF?text=Actualite+20',
            altText:   'Noël solidaire Hope Radio',
          },
        },
        categories: {
          nodes: [
            { name: 'Société', slug: 'societe' },
            { name: 'Événements', slug: 'evenements' },
          ],
        },
      },
    ],
  },
};
