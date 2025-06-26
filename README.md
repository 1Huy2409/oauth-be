# OAuth 2.0 Backend Server

## Dev Instruct
- Pull code from Github: 
    git clone https://github.com/1Huy2409/oauth-be.git

- Create env file from .env.example then edit: 
    cp .env.example .env 

- First build project:
    docker-compose up --build

- In case project has new libs, install libs:
    docker-compose exec backend npm install

- Dev mode with hot reload base on volumes:
    docker-compose up

- Stop container:
    docker-compose down