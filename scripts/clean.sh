#!/bin/bash

# Define ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RESET='\033[0m'

# Save the current workspace
original_dir="$(pwd)"

# Define the workspaces to process
workspaces=("packages" "examples")

# Remove the root node_modules folder
if [ -d "node_modules" ]; then
  echo -e "${GREEN}Removing ${BLUE}root ${YELLOW}node_modules${GREEN} folder${RESET}"
  rm -fr node_modules || exit 1
fi

for workspace in "${workspaces[@]}"
do
  # Check if the workspaces are immediate children of the current folder
  if [ ! -d "./$workspace" ]; then
      echo -e "${RED}Error: '$workspace' is not an immediate child of the current folder${RESET}"
      exit 1
  fi

  # Change to the workspace
  cd "$workspace" || exit 1

  # Loop through each subdirectory
  for dir in */; do
    # Check if node_modules can be removed
    if [ -d "$dir/node_modules" ]; then
      echo -e "${GREEN}Removing ${BLUE}$dir/node_modules ${YELLOW}node_modules${GREEN} folder${RESET}"
      rm -fr "$dir/node_modules" || exit 1
    fi
  done

  # Change back to the original workspace
  cd "$original_dir" || exit 1
done
