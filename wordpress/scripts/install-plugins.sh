#!/bin/bash
# install-plugins.sh — Installation et configuration des plugins WordPress
# Usage : docker compose --profile tools run wpcli bash /scripts/install-plugins.sh
# Prérequis : install-wordpress.sh doit avoir été exécuté au préalable

set -e

WP="wp --allow-root --path=/var/www/html"

echo "📦 Installation des plugins..."

# WPGraphQL (indispensable pour l'API)
$WP plugin install wp-graphql --activate

# Faust.js plugin (découplage WordPress/Next.js)
$WP plugin install faustwp --activate

# Advanced Custom Fields (pour les métadonnées : flux audio, réseaux sociaux, etc.)
$WP plugin install advanced-custom-fields --activate

# ACF to WPGraphQL (expose les champs ACF dans l'API GraphQL)
$WP plugin install wpgraphql-acf --activate

# Yoast SEO (optionnel mais souvent demandé)
$WP plugin install wordpress-seo --activate

# ── Clé secrète Faust.js ─────────────────────────────────────────────────────
echo "⚙️  Configuration de Faust.js..."
$WP option update faustwp_settings '{"secret_key":"dev-secret-key-change-in-prod","frontend_uri":"http://localhost:3000","menu_locations":""}' --format=json

# ── Réglages WPGraphQL ────────────────────────────────────────────────────────
echo "⚙️  Configuration de WPGraphQL..."
$WP option update graphql_general_settings '{"public_introspection_enabled":"on","batch_queries_enabled":"on","batch_limit":"10","query_depth_enabled":"off"}' --format=json

echo ""
echo "🎉 Plugins installés et configurés !"
echo ""
echo "  GraphQL API : http://localhost:8080/graphql"
echo "  Next.js     : http://localhost:3000"
echo ""
