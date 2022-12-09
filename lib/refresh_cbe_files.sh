#!/bin/sh

GITHUB_PREFIX="https://raw.githubusercontent.com/CenterForTheBuiltEnvironment/comfort_tool/master/static/js/"
CBE_FILES=("comfort-models.js" "psychrometrics.js" "util.js" "global.js")
CBE_LICENSE="cbe_license.txt"

if [ ! -f "${CBE_LICENSE}" ]; then
    echo "${CBE_LICENSE} missing in current folder."
    exit 1
fi

for t in ${CBE_FILES[@]}; do
  echo "Updating ${t}... "
  curl -sL "${GITHUB_PREFIX}${t}" | cat "${CBE_LICENSE}" - "${t}.inc" 2>/dev/null > "${t}"
  echo "ok"
done
