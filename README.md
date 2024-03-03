<!--suppress HtmlDeprecatedAttribute -->
<p align="center">
  <a href="">
    <img src="./apps/ui/src/assets/logo.svg" height="220">
  </a>
</p>

<h1 align="center">
Mally
</h1>
<h4 align="center">
A collection of open source web services 
</h4>

## Features

-   URL Shortener and Pastebin services
-   CI/CD
-   Tests

## Stack

-   **Frontend:** Angular and PrimeNG.
-   **Backend:** Springboot, RabbitMQ, PostgreSQL and Redis.

## Architecture

```mermaid
---
title: Mally Architecture
---
flowchart LR
%% Styles
    classDef app fill:#f7e081,stroke:#333,stroke-width:1px

%% Entities
    UI[UI - Angular]
    POSTGRES[(PostgreSQL)]
    API[API - Springboot]
    RMQ[RabbitMQ]
    REDIS[(Redis)]

%% Flow
    UI -->|HTTP|BACKEND
    RMQ <-->|AMQP|BACKEND

    subgraph BACKEND [API]
        direction LR
        API --> POSTGRES
        API --> REDIS
    end

```

## License

Mally is licensed under the [MIT License](LICENSE).
