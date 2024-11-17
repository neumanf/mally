# Use an official Gradle image to build the application
FROM maven:3.9.8-eclipse-temurin-21-alpine AS builder

ENV APP_HOME=/app

WORKDIR $APP_HOME

COPY ./apps/api/pom.xml .
COPY ./apps/api/src ./src
RUN mvn package -T4 -DskipTests -Dmaven.test.skip

# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:21-jre-alpine

ENV ARTIFACT_NAME=api-0.0.1-SNAPSHOT.jar
ENV APP_HOME=/app
ENV CONFIGURATION_FILE=application.test.yml

RUN apk add curl

WORKDIR $APP_HOME

COPY --from=builder $APP_HOME/target/$ARTIFACT_NAME .
COPY --from=builder /app/src/main/resources/$CONFIGURATION_FILE ./$CONFIGURATION_FILE

ENTRYPOINT exec java -jar ${ARTIFACT_NAME} --spring.config.location=file:/app/$CONFIGURATION_FILE
