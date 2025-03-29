import app from "./app.js";
import { PORT } from "./config.js";
import { getConnection } from "./Db.js";

getConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
});

