import { app, httpServer } from "./app";
import { config } from "./config/config";
import { messages } from "./config/logger";

httpServer.listen(config.PORT, () => console.log(messages.SERVER_RUNNING));
