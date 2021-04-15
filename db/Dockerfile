FROM postgres
COPY ./init/ /docker-entrypoint-initdb.d/
ENV PGDATA=/var/lib/postgresql/data/pgdata
EXPOSE 5432