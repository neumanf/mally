FROM registry.access.redhat.com/ubi9 AS ubi-micro-build

RUN mkdir -p /mnt/rootfs
RUN dnf install --installroot /mnt/rootfs curl --releasever 9 --setopt install_weak_deps=false --nodocs -y && \
    dnf --installroot /mnt/rootfs clean all && \
    rpm --root /mnt/rootfs -e --nodeps setup

FROM node:18 AS theme-builder

RUN apt-get update && \
    apt-get install -y openjdk-17-jdk && \
    apt-get install -y maven;

COPY ./infra/keycloak/themes/theme-generator/package.json ./infra/keycloak/themes/theme-generator/yarn.lock /opt/app/
WORKDIR /opt/app
RUN yarn install --frozen-lockfile
COPY ../infra/keycloak/themes/theme-generator/ /opt/app/
RUN yarn build-keycloak-theme

FROM quay.io/keycloak/keycloak:25.0.4 AS builder

# Configure a database vendor
ENV KC_DB=postgres

WORKDIR /opt/keycloak

COPY --from=theme-builder /opt/app/dist_keycloak/keycloak-theme-for-kc-22-and-above.jar /opt/keycloak/providers/

RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:25.0.4

COPY --from=ubi-micro-build /mnt/rootfs /
COPY --from=builder /opt/keycloak/ /opt/keycloak/

COPY ./infra/keycloak/realms/mally.json /opt/keycloak/data/import/mally.json

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]