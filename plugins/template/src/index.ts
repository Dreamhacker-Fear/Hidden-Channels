import { metro } from "@vendetta/metro/common";
import { logger } from "@vendetta";

export default {
    onLoad() {
        const GuildsBar = metro.findByName("GuildsBar");

        logger.log(
            GuildsBar
                ? "Hidden Servers: GuildsBar FOUND"
                : "Hidden Servers: GuildsBar NOT FOUND"
        );
    },

    onUnload() {},
};
