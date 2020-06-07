#!/bin/sh

GITHUB_PREFIX="https://raw.githubusercontent.com/CenterForTheBuiltEnvironment/comfort_tool/master/static/js/"
CBE_FILES=("comfortmodels.js" "psychrometrics.js" "util.js")
CBE_LICENSE="cbe_license.txt"

if [ ! -f "${CBE_LICENSE}" ]; then
    echo "${CBE_LICENSE} missing in current folder."
    exit 1
fi

for t in ${CBE_FILES[@]}; do
  echo "Updating ${t}... "
  curl -sL "${GITHUB_PREFIX}${t}" | cat "${CBE_LICENSE}" - > "${t}"
  echo "ok"
done
