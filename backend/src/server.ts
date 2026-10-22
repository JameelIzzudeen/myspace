import app from "./app.js";

const SERVER_PORT = process.env.SERVER_PORT;

app.listen(SERVER_PORT, () => {
    console.log(`Server Running on port ${SERVER_PORT}`)
})