#!/bin/bash

# Force start from root folder
cd "$(dirname "$0")/.."

set -e

Color_Off='\033[0m' # Text Reset
Green='\033[0;32m'  # Green
Yellow='\033[0;33m' # Yellow
BGreen='\033[1;32m' # Bold Green

invalid_packages=()
version=$1

if [[ -z "$version" ]]; then
    echo "Please enter the version you want to check"
    read -r version
fi

packages=$(./node_modules/.bin/lerna list --json)
nb_packages=$(echo $packages | jq length)

# For each packages, check if there is not already a
# published version matching the one given in parameter
i=1
while read -r name; do
    echo -ne "\r\033[2K($i/$nb_packages) ${Green}Checking versions for $BGreen$name$Green...$Color_Off"

    exists=$(npm view --json $name time | jq "has(\"$version\")")

    if [[ $exists = "true" ]]; then
        invalid_packages+=($name)
    fi

    ((i++))
done < <(echo $packages | jq -r '.[]|[.name] | @tsv')

echo -e "\r\033[2K${BGreen}Checked $nb_packages packages for ${version} ✓$Color_Off"

if [[ ${#invalid_packages[@]} -gt 0 ]]; then
    echo -e "\n${Yellow}The given version ($version) already exists on the npm registry for:"
    for ((i = 0; i < ${#invalid_packages[@]}; i++)); do echo -e "- ${invalid_packages[$i]}"; done
fi
