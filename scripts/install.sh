#!/bin/bash

# Define colors
GREEN="\033[32m"
RED="\033[31m"
YELLOW="\033[33m"
BLUE='\033[0;34m'
RESET="\033[0m"

# Save the current workspace
original_dir="$(pwd)"

# Define the directories to process
directories=("packages" "examples")

# Loop through each workspace and run "npm <arguments>"
for workspace in "${directories[@]}"; do
  # Check if the workspace exists
  if [ ! -d "$workspace" ]; then
    echo -e "${RED}Error: Workspace \"$workspace\" does not exist.${RESET}"
    exit 1
  fi

  # Change to the workspace
  cd "$workspace" || exist 1

  # Loop through each subdirectory
  for dir in */; do
    # Check if package.json contains the specified script
    if [ -f "$dir/package.json" ]; then
      echo -e "${GREEN}Installing: ${BLUE}$workspace/$dir${RESET}"
      cd "$dir" && npm install && cd .. || exit 1
    else
      echo -e "${YELLOW}Skipping workspace: ${BLUE}$workspace/$dir${RESET}"
      echo -e "${YELLOW}The package.json file does not exist.${RESET}"
    fi
  done

  # Change back to the original workspace
  cd "$original_dir" || exit 1
done
