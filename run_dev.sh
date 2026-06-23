#!/bin/bash

# Load env variables from .env if it exists
if [ -f .env ]; then
  while IFS= read -r line || [ -n "$line" ]; do
    # Skip comments and empty lines
    if [[ ! "$line" =~ ^# ]] && [[ ! -z "$line" ]]; then
      export "$line"
    fi
  done < .env
fi

# Set PATH to include JAVA_HOME/bin
if [ ! -z "$JAVA_HOME" ]; then
  export PATH="$JAVA_HOME/bin:$PATH"
fi

# Determine maven command
MVEN="mvn"
if [ ! -z "$MAVEN_BIN" ]; then
  MVEN="$MAVEN_BIN"
fi

# Export Maven command
export MAVEN_COMMAND="$MVEN"

# Run concurrently
npx concurrently -n "Frontend,Backend" -c "cyan,green" \
  "npm run dev:front" \
  "cd backend && \"$MAVEN_COMMAND\" spring-boot:run"
