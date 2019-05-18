import * as log from "npmlog";
import app from "./app";

const port = process.env.PORT || 3001

app.listen(port, () => {
    log.info("express", "Server listening on port", port);
});