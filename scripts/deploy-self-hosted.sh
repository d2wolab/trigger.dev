#!/bin/bash
# Self-hosted Trigger.dev deployment script

# Exit on error
set -e

# Default values
PROJECT_PATH="."
ENVIRONMENT="prod"
CONFIG_FILE=""
PROJECT_REF=""
DRY_RUN=false
SKIP_SYNC_ENV_VARS=false
ENV_FILE=".env"
SKIP_PROMOTION=false
PROFILE="default"
API_URL=""
LOG_LEVEL="log"
SKIP_TELEMETRY=false
NETWORK_MODE=""

# Help function
function show_help {
  echo "Usage: ./deploy-self-hosted.sh [options]"
  echo
  echo "Self-hosted Trigger.dev deployment script"
  echo
  echo "Options:"
  echo "  -p, --path PATH                 The path to the project (default: \"$PROJECT_PATH\")"
  echo "  -e, --env ENV                   Deploy to a specific environment (default: \"$ENVIRONMENT\")"
  echo "  -c, --config FILE               The name of the config file, found at [path]"
  echo "  -r, --project-ref REF           The project ref. This will override the project specified in the config file."
  echo "  -d, --dry-run                   Do a dry run of the deployment"
  echo "  -s, --skip-sync-env-vars        Skip syncing environment variables"
  echo "  -f, --env-file FILE             Path to the .env file (default: \"$ENV_FILE\")"
  echo "  -k, --skip-promotion            Skip promoting the deployment"
  echo "  -o, --profile PROFILE           The login profile to use (default: \"$PROFILE\")"
  echo "  -a, --api-url URL               Override the API URL"
  echo "  -l, --log-level LEVEL           The CLI log level (debug, info, log, warn, error, none)"
  echo "  -t, --skip-telemetry            Opt-out of sending telemetry"
  echo "  -n, --network MODE              The networking mode for RUN instructions"
  echo "  -h, --help                      Show this help message"
  echo
}

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -p|--path)
      PROJECT_PATH="$2"
      shift 2
      ;;
    -e|--env)
      ENVIRONMENT="$2"
      shift 2
      ;;
    -c|--config)
      CONFIG_FILE="$2"
      shift 2
      ;;
    -r|--project-ref)
      PROJECT_REF="$2"
      shift 2
      ;;
    -d|--dry-run)
      DRY_RUN=true
      shift
      ;;
    -s|--skip-sync-env-vars)
      SKIP_SYNC_ENV_VARS=true
      shift
      ;;
    -f|--env-file)
      ENV_FILE="$2"
      shift 2
      ;;
    -k|--skip-promotion)
      SKIP_PROMOTION=true
      shift
      ;;
    -o|--profile)
      PROFILE="$2"
      shift 2
      ;;
    -a|--api-url)
      API_URL="$2"
      shift 2
      ;;
    -l|--log-level)
      LOG_LEVEL="$2"
      shift 2
      ;;
    -t|--skip-telemetry)
      SKIP_TELEMETRY=true
      shift
      ;;
    -n|--network)
      NETWORK_MODE="$2"
      shift 2
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      exit 1
      ;;
  esac
done

# Build command
CMD="npx trigger.dev@latest deploy --self-hosted"

# Add path
CMD="$CMD $PROJECT_PATH"

# Add options
[[ -n "$ENVIRONMENT" ]] && CMD="$CMD --env $ENVIRONMENT"
[[ -n "$CONFIG_FILE" ]] && CMD="$CMD --config $CONFIG_FILE"
[[ -n "$PROJECT_REF" ]] && CMD="$CMD --project-ref $PROJECT_REF"
$DRY_RUN && CMD="$CMD --dry-run"
$SKIP_SYNC_ENV_VARS && CMD="$CMD --skip-sync-env-vars"
[[ -n "$ENV_FILE" ]] && CMD="$CMD --env-file $ENV_FILE"
$SKIP_PROMOTION && CMD="$CMD --skip-promotion"
[[ -n "$PROFILE" ]] && CMD="$CMD --profile $PROFILE"
[[ -n "$API_URL" ]] && CMD="$CMD --api-url $API_URL"
[[ -n "$LOG_LEVEL" ]] && CMD="$CMD --log-level $LOG_LEVEL"
$SKIP_TELEMETRY && CMD="$CMD --skip-telemetry"
[[ -n "$NETWORK_MODE" ]] && CMD="$CMD --network $NETWORK_MODE"

# Print command
echo "Executing: $CMD"

# Execute command
eval "$CMD"