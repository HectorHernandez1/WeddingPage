FROM postgres:15-alpine

# Copy initialization scripts
COPY ./schema.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432 