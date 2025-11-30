# README

Scrape available slots from Shore



## Requirements

- Deno



## Usage

- start server

```sh
deno task start
```

- get availability, e.g.

```sh
curl 'http://localhost:8000/availability/5d51c5bb-9ac8-4a7e-b270-da95a7cfd53f/fd9344eb-c140-410d-b2e5-5ccd9b1b37a7/Europe%2FAmsterdam/2025-08-25/2025-08-31' \
  | jq -r '.[] | select(.times | length > 0) | "\(.date): \(.times | join(", "))"'
```
