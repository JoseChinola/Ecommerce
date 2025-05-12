import app from "./app.js";
import { getConnection } from "./Db.js";

getConnection().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    })
});

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Emula __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ahora apunta directo a tu carpeta controllers
const controllersDir = path.join(__dirname, "controllers");
console.log("⮕ controllers folder contains:", fs.readdirSync(controllersDir));