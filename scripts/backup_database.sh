#!/bin/bash

# Usage: backup_database.sh <database>
# E.g: backup_database.sh mally

PGUSER=postgres
PGDATABASE=$1

CONTAINER_NAME=mally-postgres

BACKUP_DIR=.

# Get current date and time
datestamp=$(date +'%Y-%m-%d')
timestamp=$(date +'%H%M')

docker exec "$CONTAINER_NAME" pg_dump -U "$PGUSER" -d "$PGDATABASE" > "$BACKUP_DIR/$PGDATABASE"_"$datestamp"_"$timestamp".sql
