import { React } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { metro, patcher, logger } from "@vendetta";
import Settings from "./Settings";

let unpatch: (() => void) | null = null;

const PANEL_WIDTH = 90;

function HiddenServersPanel() {
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
                zIndex: 99999,
                backgroundColor: "#111214",
            },

            onTouchStart: (e: any) => {
                storage.swipeStartX =
                    e?.nativeEvent?.pageX ?? 0;
            },

            onTouchEnd: (e: any) => {
                const start =
                    storage.swipeStartX ?? 0;

                const end =
                    e?.nativeEvent?.pageX ?? start;

                const distance = end - start;

                if (distance < -60) {
                    setOpen(true);
                }

                if (distance > 60) {
                    setOpen(false);
                }
            },
        },
        React.createElement(
            "Text",
            {
                style: {
                    color: "#ffffff",
                    fontSize: 14,
                    marginTop: 40,
                    textAlign: "center",
                },
            },
            "HIDDEN"
        )
    );
}

export default {
    onLoad() {
        logger.log("Hidden Servers: loading");

        storage.hiddenBarOpen =
            storage.hiddenBarOpen ?? false;

        try {
            const Navigation =
                metro.findByProps(
                    "getLastSelectedGuildId"
                );

            if (!Navigation) {
                logger.error(
                    "Hidden Servers: navigation module not found"
                );
                return;
            }

            /*
             * Find a React component exposed by the navigation
             * module and add our panel to its rendered output.
             */
            const component =
                Navigation.default ??
                Navigation;

            if (typeof component !== "function") {
                logger.error(
                    "Hidden Servers: navigation component unavailable"
                );
                return;
            }

            unpatch = patcher.after(
                component,
                "render",
                (_args: any[], result: any) => {
                    if (!result) return result;

                    try {
                        const panel =
                            React.createElement(
                                HiddenServersPanel
                            );

                        if (Array.isArray(result.props?.children)) {
                            result.props.children.push(panel);
                        } else if (result.props) {
                            result.props.children =
                                React.createElement(
                                    React.Fragment,
                                    null,
                                    result.props.children,
                                    panel
                                );
                        }
                    } catch (e) {
                        logger.error(
                            `Hidden Servers: ${String(e)}`
                        );
                    }

                    return result;
                }
            );

            logger.log(
                "Hidden Servers: navigation patch installed"
            );
        } catch (e) {
            logger.error(
                `Hidden Servers: ${String(e)}`
            );
        }
    },

    onUnload() {
        if (unpatch) {
            unpatch();
            unpatch = null;
        }

        storage.hiddenBarOpen = false;

        logger.log("Hidden Servers unloaded");
    },

    settings: Settings,
};
