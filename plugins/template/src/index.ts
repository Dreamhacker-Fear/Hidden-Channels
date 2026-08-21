import { logger } from "@vendetta";

export default {
    onLoad() {
        logger.log("Hidden Servers: TEST LOADED");
    },

    onUnload() {
        logger.log("Hidden Servers: TEST UNLOADED");
    },
};
