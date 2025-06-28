# OAuth 2.0 Backend Server

## Dev Instruct
- Pull code from Github: 
    git clone https://github.com/1Huy2409/oauth-be.git

- Create env file from .env.example then edit: 
    cp .env.example .env 

- First build project:
    docker-compose up -d

- Rebuild:
    docker-compose down
    docker-compose up --build -d

- Dev mode with hot reload base on volumes:
    docker-compose up

- Stop container:
    docker-compose down