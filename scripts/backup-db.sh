#!/bin/bash

# MEDORA Automated Database Backup Script
# This script performs a backup of the MEDORA database running in a Docker container.

set -e

# --- Configuration ---
APP_NAME="medora"
BACKUP_DIR="/opt/medora/backups"
TIMESTAMP=$(date +%Y%m%d%H%M%S)
BACKUP_FILE="$BACKUP_DIR/medora_db_backup_$TIMESTAMP.sql.gz"
RETENTION_DAYS=7

# --- Colors for Output ---
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=== MEDORA Database Backup Started ===${NC}"

# 1. Create backup directory if it doesn't exist
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    chmod 700 "$BACKUP_DIR"
fi

# 2. Extract DATABASE_URL from container environment to get credentials
# Note: This assumes the container is running and has DATABASE_URL set.
DB_URL=$(docker exec "$APP_NAME" env | grep DATABASE_URL | cut -d '=' -f2-)

if [ -z "$DB_URL" ]; then
    echo -e "${RED}Error: Could not retrieve DATABASE_URL from container $APP_NAME.${NC}"
    exit 1
fi

# Parse DB_URL (mysql://user:pass@host:port/db)
# This is a simplified parser for the standard format
DB_USER=$(echo "$DB_URL" | sed -e 's/mysql:\/\/\([^:]*\):.*/\1/')
DB_PASS=$(echo "$DB_URL" | sed -e 's/mysql:\/\/.*:\([^@]*\)@.*/\1/')
DB_HOST=$(echo "$DB_URL" | sed -e 's/mysql:\/\/.*@\([^:]*\):.*/\1/')
DB_PORT=$(echo "$DB_URL" | sed -e 's/mysql:\/\/.*@.*:\([^\/]*\)\/.*/\1/')
DB_NAME=$(echo "$DB_URL" | sed -e 's/mysql:\/\/.*@.*\///')

# 3. Perform Backup
echo -e "${BLUE}Backing up database $DB_NAME to $BACKUP_FILE...${NC}"
docker exec "$APP_NAME" /usr/bin/mysqldump \
    -u"$DB_USER" -p"$DB_PASS" -h"$DB_HOST" -P"$DB_PORT" \
    --databases "$DB_NAME" | gzip > "$BACKUP_FILE"

# 4. Verify Backup
if [ -s "$BACKUP_FILE" ]; then
    echo -e "${GREEN}SUCCESS: Backup completed successfully.${NC}"
    ls -lh "$BACKUP_FILE"
else
    echo -e "${RED}Error: Backup file is empty or was not created.${NC}"
    exit 1
fi

# 5. Retention Policy (Delete backups older than RETENTION_DAYS)
echo -e "${BLUE}Applying retention policy (deleting backups older than $RETENTION_DAYS days)...${NC}"
find "$BACKUP_DIR" -name "medora_db_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo -e "${BLUE}=== Backup Process Finished ===${NC}"
