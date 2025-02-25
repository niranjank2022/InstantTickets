import app from "./app";
import { config } from "./config/config";
import { messages } from "./config/logger";

app.listen(config.PORT, () => console.log(messages.serverRunning));
