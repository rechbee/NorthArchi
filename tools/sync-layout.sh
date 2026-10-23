#!/usr/bin/env bash
# Copia o cabeçalho e o rodapé de index.html para todas as outras páginas.
# Edite o menu/rodapé só em index.html e rode:  bash tools/sync-layout.sh
set -euo pipefail
cd "$(dirname "$0")/.."

for page in *.html; do
  [ "$page" = "index.html" ] && continue
  perl -0pi -e '
    BEGIN { local $/; open my $f, "<", "index.html" or die; $src = <$f>; }
    for my $part (qw(header footer)) {
      my ($block) = $src =~ m{(<!-- layout:$part -->.*?<!-- /layout:$part -->)}s or die "marcador $part ausente";
      s{<!-- layout:$part -->.*?<!-- /layout:$part -->}{$block}s;
    }
  ' "$page"
  echo "ok  $page"
done
