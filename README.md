# VPS-Manager
A VPS manager for Vultr. Leverages Cloudflare API to enable HTTPS.

## Setup
The create-react-app project is inside /client, and the server is inside of /server. There should already be a build inside /server. Several environment variables are required to make this project work.

- `VULTR_API_KEY`, the API key from Vultr.
- `CLOUDFLARE_API_KEY`, the API key from Cloudflare.
- `CLOUDFLARE_EMAIL`, the email of the Cloudflare account you're using.
- `PORT (optional)`, the port to listen on (default 3000).  

## Usage
run `npm i` inside of /server. Then, provided the environment variables are setup correctly, you can run `npm start` and launch the app from a web browser. Note that currently, you must purchase the domain and change its nameservers to Cloudflare's manually.
