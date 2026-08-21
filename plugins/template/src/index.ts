import { React } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { after } from "@vendetta/patcher";

let unpatch: (() => void) | undefined;

export default {
    onLoad() {
        const GestureHandler = window.modules.findByProps?.("PanGestureHandler");

        if (!GestureHandler) return;

        unpatch = after("PanGestureHandler", GestureHandler, (args, res) => {
            const props = args[0];
            if (!props) return;

            const oldGesture = props.onEnded;

            props.onEnded = (e: any) => {
                const x = e?.translationX ?? 0;

                // Swipe LEFT
                if (x < -80) {
                    storage.hiddenBarOpen = true;
                }

                // Swipe RIGHT
                if (x > 80) {
                    storage.hiddenBarOpen = false;
                }

                oldGesture?.(e);
            };
        });
    },

    onUnload() {
        unpatch?.();
    }
};
