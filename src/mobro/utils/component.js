import React, {useEffect, useState} from "react";
import {registerPublicEndpoint} from "mobro/utils/public";
import {getDataComponent} from "mobro/hooks/components-hooks";
import {getDeviceUuid, getSocket} from "mobro/utils/socket";
import {CHANNEL_PREFIX} from "mobro/enum/channel-data";
import {addChannel, removeChannel} from "mobro/utils/channel-data";

/**
 * @param {[]} components
 * @param {string} path
 * @param {function} render
 * @returns {null|[]}
 */
export function renderComponents(components, path, render) {
    if (!Array.isArray(components) || !components.length) {
        return null;
    }

    return components.map((component, i) => {
        const Component = getDataComponent(component.type);

        if (!Component) {
            return null;
        }

        return render(Component, component.type, `${path}.components.${i}`, component.config);
    });
}

registerPublicEndpoint("utils.component.renderComponents", renderComponents);

/**
 * @param {{}} config
 * @param {{}} additionalStyles
 * @param {{}} defaults
 * @returns {{}}
 */
export function extractSize(config, additionalStyles = {}, defaults = {}) {
    return {
        ...defaults,
        width: toPixel(extractWidth(config)),
        height: toPixel(extractHeight(config)),
        ...additionalStyles
    };
}

registerPublicEndpoint("utils.component.extractSize", extractSize);

/**
 * @param {{}} config
 * @returns {number|null}
 */
export function extractHeight(config) {
    return config ? config.height : null;
}

registerPublicEndpoint("utils.component.extractHeight", extractHeight);

/**
 * @param {{}} config
 * @returns {number|null}
 */
export function extractWidth(config) {
    return config ? config.width : null;
}

registerPublicEndpoint("utils.component.extractWidth", extractWidth);

/**
 * @param {number} value
 * @returns {string|null}
 */
export function toPixel(value) {
    return value ? `${value}px` : null;
}

registerPublicEndpoint("utils.component.toPixel", toPixel);

/**
 * @param {{}} config
 * @returns {string}
 */
export function extractChannel(config) {
    return `${getDeviceUuid()}.${extractChannelId(config)}`;
}

registerPublicEndpoint("utils.component.extractChannel", extractChannel);

/**
 * @param {{}} config
 * @returns {string}
 */
export function extractChannelId(config) {
    return config?.id;
}

registerPublicEndpoint("utils.component.extractChannelId", extractChannelId);


/**
 * @param {{}} config
 * @returns {{}}
 */
export function useChannelListener(config) {
    const channel = typeof config === "string" ? config : extractChannel(config);

    const [channelData, setChannelData] = useState(null);

    useEffect(() => {
        const id = extractChannelId(config);
        addChannel({id});

        const handler = data => setChannelData(data.payload);

        getSocket().on(`${CHANNEL_PREFIX}${channel}`, handler);

        return () => {
            getSocket().off(channel, handler);
            removeChannel({id});
        }
    }, [channel]);

    return channelData;
}

registerPublicEndpoint("utils.component.useChannelListener", useChannelListener);

/**
 * @param {string} align
 * @returns {string}
 */
export function extractFlexAlign(align) {
    switch (align) {
        case "left":
            return "justify-content-start";

        case "right":
            return "justify-content-end";

        case "center":
            return "justify-content-center";

        default:
            return "";
    }
}

registerPublicEndpoint("utils.component.extractFlexAlign", extractFlexAlign);

/**
 * @param data
 * @param defaultValue
 * @returns {*}
 */
export function getDataOrDefault(data, defaultValue = null) {
    return data != null ? data : defaultValue;
}

registerPublicEndpoint("utils.component.getDataOrDefault", getDataOrDefault);