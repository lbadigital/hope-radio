#!/bin/bash
# install-wordpress.sh — Installation initiale de WordPress en local
# Usage : docker compose --profile tools run wpcli bash /scripts/install-wordpress.sh

set -e

WP="wp --allow-root --path=/var/www/html"

echo "⏳ Attente de WordPress..."
until $WP core is-installed 2>/dev/null; do
  sleep 2
done

echo "✅ WordPress détecté, configuration en cours..."

# ── Installation de base ──────────────────────────────────────────────────────
$WP core install \
  --url="http://localhost:8080" \
  --title="Radio - Dev" \
  --admin_user="admin" \
  --admin_password="admin" \
  --admin_email="dev@radio.local" \
  --skip-email

# ── Langue ────────────────────────────────────────────────────────────────────
$WP language core install fr_FR
$WP site switch-language fr_FR

# ── Thème ─────────────────────────────────────────────────────────────────────
$WP theme activate hope-radio

# ── Réglages WordPress ────────────────────────────────────────────────────────
echo "⚙️  Configuration des réglages..."

# Permaliens : structure propre pour l'API
$WP rewrite structure '/%postname%/'
$WP rewrite flush

# Désactiver les commentaires (inutiles pour une radio)
$WP option update default_comment_status closed
$WP option update default_ping_status closed

# Fuseau horaire
$WP option update timezone_string "Europe/Paris"

# ── Contenu de démonstration ──────────────────────────────────────────────────
echo "📝 Création de contenu de démo..."

# Page d'accueil
$WP post create \
  --post_type=page \
  --post_title="Accueil" \
  --post_status=publish \
  --post_content="Page d'accueil de la radio."

# Quelques émissions de test
for title in "Le Morning" "L'Après-midi" "La Soirée"; do
  $WP post create \
    --post_type=emission \
    --post_title="$title" \
    --post_status=publish \
    --post_content="Description de l'émission $title."
done

echo ""
echo "🎉 WordPress installé !"
echo ""
echo "  WordPress admin : http://localhost:8080/wp-admin"
echo "  Login           : admin / admin"
echo ""
echo "  → Lance ensuite : docker compose --profile tools run wpcli bash /scripts/install-plugins.sh"
echo ""
