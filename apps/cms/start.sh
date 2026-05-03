#!/bin/sh
set -e

echo "Running Payload migrations..."
npm run payload -- migrate --force-accept-warnings 2>/dev/null || echo "Migration skipped or already up to date"

echo "Starting Payload CMS..."
exec npm run start
