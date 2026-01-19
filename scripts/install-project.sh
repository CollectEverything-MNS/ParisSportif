set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SERVICES_DIR="$ROOT_DIR/services"

if ! command -v yarn >/dev/null 2>&1; then
  echo "yarn n'est pas installé ou introuvable dans le PATH. Installez Yarn d'abord." >&2
  exit 1
fi

echo "🔍 Recherche des services dans: $SERVICES_DIR"
if [ ! -d "$SERVICES_DIR" ]; then
  echo "Le dossier services/ est introuvable: $SERVICES_DIR" >&2
  exit 1
fi

for d in "$SERVICES_DIR"/*/; do
  [ -d "$d" ] || continue
  service_name="$(basename "$d")"
  if [ -f "$d/package.json" ]; then
    echo "\n=== Installation des dépendances pour: $service_name ==="
    yarn --cwd "$d" install || {
      echo "Échec de yarn install dans $service_name" >&2
      exit 1
    }
  else
    echo "Skipping $service_name (pas de package.json)"
  fi
done

echo "\n Installation terminée pour tous les services trouvés."
