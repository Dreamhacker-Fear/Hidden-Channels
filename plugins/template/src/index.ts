import { React } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { findByProps } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";

let patch: (() => void) | null = null;

const PANEL_WIDTH = 90;
const SWIPE_DISTANCE = 70;

function HiddenServerPanel() {
    const [open, setOpen] = React.useState(
        storage.hiddenBarOpen ?? false
    );

    React.useEffect(() => {
        storage.hiddenBarOpen = open;
    }, [open]);

    return React.createElement(
        "View",
        {
            style: {
                position: "absolute",
                left: open ? 0 : -PANEL_WIDTH,
                top: 0,
                bottom: 0,
                width: PANEL_WIDTH,
                zIndex: 9999,
                backgroundColor: "#111214",
            },
            onTouchStart: (event: any) => {
                storage.swipeStartX =
                    event?.nativeEvent?.pageX ?? 0;
            },
            onTouchEnd: (event: any) => {
                const start = storage.swipeStartX ?? 0;
                const end =
                    event?.nativeEvent?.pageX ?? start;

                const distance = end - start;

                if (distance > SWIPE_DISTANCE) {
                    setOpen(false);
                }

                if (distance < -SWIPE_DISTANCE) {
                    setOpen(true);
                }
            },
        }
    );
}

export default {
    onLoad() {
        storage.hiddenBarOpen =
            storage.hiddenBarOpen ?? false;

        console.log(
            "Hidden Servers: swipe system loaded"
        );
    },

    onUnload() {
        storage.hiddenBarOpen = false;
    },

    settings: () => (
        <Forms.FormText>
            Hidden Servers
        </Forms.FormText>
    ),
};
