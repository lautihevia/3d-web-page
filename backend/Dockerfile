FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY backend/gradle gradle
COPY backend/gradlew backend/settings.gradle.kts backend/build.gradle.kts ./
RUN ./gradlew dependencies --no-daemon 2>/dev/null || true
COPY backend/src src
RUN ./gradlew bootJar --no-daemon -x test

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
