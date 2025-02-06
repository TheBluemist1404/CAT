This is CAT, on your first pull, run `docker-compose up --build` (of course remember to run docker first)

- **You only need to rebuild (`--build`) if you change `execute.js` or `Dockerfile`.**
- **For normal work, just use `docker-compose up`.**
- **Use `docker-compose down` to stop everything cleanly.**
- run both backend and frontend with `npm start` at root (I have set up `concurrently` for convenience)
