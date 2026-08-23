import { createServerApp } from "./app.js";

const port = Number(process.env.PORT ?? 3000);

createServerApp({ staticRoot: process.env.STATIC_ROOT }).listen(port);
