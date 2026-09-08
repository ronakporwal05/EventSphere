# Stage 1: Build stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app
# .mvn/jvm.config contains --add-opens so Lombok can access javac internals (JDK 17+ module restriction)
COPY pom.xml .
COPY .mvn .mvn
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -Dmaven.test.skip=true -B

# Stage 2: Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S eventsphere && adduser -S eventsphere -G eventsphere
COPY --from=builder /app/target/eventsphere-backend-1.0.0-SNAPSHOT.jar app.jar
USER eventsphere:eventsphere
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
