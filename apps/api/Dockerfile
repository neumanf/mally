# Use an official Gradle image to build the application
FROM gradle:8.5-jdk17 AS BUILD

ENV APP_HOME=/usr/app/
WORKDIR $APP_HOME
COPY build.gradle settings.gradle $APP_HOME

COPY gradle $APP_HOME/gradle
COPY --chown=gradle:gradle . /home/gradle/src
USER root
RUN chown -R gradle /home/gradle/src

COPY . .

RUN ls -al /home/gradle/src

RUN gradle clean build --no-daemon

# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-slim

ENV ARTIFACT_NAME=api-0.0.1-SNAPSHOT.jar
ENV APP_HOME=/usr/app/

WORKDIR $APP_HOME

COPY --from=BUILD $APP_HOME/build/libs/$ARTIFACT_NAME .
COPY --from=BUILD /home/gradle/src/src/main/resources/application.prod.yml /app/application.prod.yml

ENTRYPOINT exec java -jar ${ARTIFACT_NAME} --spring.config.location=file:/app/application.prod.yml
