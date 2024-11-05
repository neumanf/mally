#!/bin/bash

# Usage: restore_database.sh <database> <file>
# E.g: restore_database.sh mally ./mally_2024-10-08_2016.sql

PGUSER=postgres
PGDATABASE=$1

CONTAINER_NAME=mally-postgres

BACKUP_FILE=$2

docker cp "$BACKUP_FILE" $CONTAINER_NAME:/

docker exec "$CONTAINER_NAME" psql -U "$PGUSER" -d "$PGDATABASE" -1 -f "/$BACKUP_FILE"
