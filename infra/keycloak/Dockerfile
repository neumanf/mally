FROM registry.access.redhat.com/ubi9 AS ubi-micro-build

RUN mkdir -p /mnt/rootfs
RUN dnf install --installroot /mnt/rootfs curl --releasever 9 --setopt install_weak_deps=false --nodocs -y && \
    dnf --installroot /mnt/rootfs clean all && \
    rpm --root /mnt/rootfs -e --nodeps setup

FROM quay.io/keycloak/keycloak:25.0.4 AS builder

# Configure a database vendor
ENV KC_DB=postgres

WORKDIR /opt/keycloak

RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:25.0.4

COPY --from=ubi-micro-build /mnt/rootfs /
COPY --from=builder /opt/keycloak/ /opt/keycloak/

COPY ./infra/keycloak/themes/mally/keycloak-theme-for-kc-22-and-above.jar /opt/keycloak/providers/keycloak-theme.jar
COPY ./infra/keycloak/themes/mally /opt/keycloak/themes/mally
COPY ./infra/keycloak/realms/mally.json /opt/keycloak/data/import/mally.json

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]