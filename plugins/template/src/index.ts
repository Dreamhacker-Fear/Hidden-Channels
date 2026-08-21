import { metro } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";
import { logger } from "@vendetta";

let unpatch: (() => void) | null = null;

export default {
    onLoad() {
        const GuildsBar = metro.findByName("GuildsBar");

        if (!GuildsBar) {
            logger.log("Hidden Servers: GuildsBar NOT FOUND");
            return;
        }

        logger.log("Hidden Servers: GuildsBar FOUND");

        unpatch = after("default", GuildsBar, (args, result) => {
            logger.log(
                "Hidden Servers: GuildsBar rendered"
            );

            logger.log(
                `Hidden Servers: props = ${JSON.stringify(args?.[0] ?? {})}`
            );

            return result;
        });
    },

    onUnload() {
        unpatch?.();
        unpatch = null;
    },
};
