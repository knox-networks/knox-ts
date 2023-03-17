#!/bin/bash

# Define color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RESET='\033[0m' # No Color

# Check if the first argument is provided
if [ -z "$1" ]; then
  echo -e "${RED}Error: Workspace subfolder is not provided.${RESET}"
  exit 1
fi

echo -e "${GREEN}Running scripts in ${BLUE}$1${GREEN} subfolders...${RESET}"

# Save the current workspace
original_dir="$(pwd)"

# Change to the workspace subfolder
cd "$1" || {
  echo -e "${RED}Error: Workspace subfolder \"$1\" does not exist.${RESET}"
  exit 1
}

# Loop through each subdirectory
for dir in */; do
  # Check if package.json contains the specified script
  if [ -f "$dir/package.json" ] && grep -q "\"$2\":" "$dir/package.json" && grep -q "\"scripts\"" "$dir/package.json"; then
    # shellcheck disable=SC2145
    echo -e "${GREEN}Running: ${YELLOW}$dir npm ${@:2}${RESET}"
    cd "$dir" && npm run "${@:2}" && cd .. || exit 1
  else
    echo -e "${YELLOW}Skipping workspace: $dir${RESET}"
    echo -e "${YELLOW}The package.json file does not contain the script \"${RED}$2${YELLOW}\" in the \"scripts\" section.${RESET}"
  fi
done

# Change back to the original workspace
cd "$original_dir" || exit 1
