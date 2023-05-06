import { readability } from "@chakra-ui/theme-tools"
import {
    toHex,
    transparentize as setTransparency,
} from "color2k"

import get from "dlv"

type Dict = { [key: string]: any }

interface WCAG2Params {
    level?: "AA" | "AAA"
    size?: "large" | "small"
}

/**
 * Get the color raw value from theme
 * @param theme - the theme object
 * @param color - the color path ("green.200")
 * @param fallback - the fallback color
 *
 * Prevent deprecated notion. Chakra UI want delete it but don't sugest better solution
 * https://github.com/chakra-ui/chakra-ui/discussions/6139
 */
export const getColor = (theme: Dict, color: string, fallback?: string) => {
    const hex = get(theme, `colors.${color}`, color)
    try {
        toHex(hex)
        return hex
    } catch {
        // returning black to stay consistent with TinyColor behaviour so as to prevent breaking change
        return fallback ?? "#000000"
    }
}

/**
 * Make a color transparent
 * @param color - the color in hex, rgb, or hsl
 * @param opacity - the amount of opacity the color should have (0-1)
 *
 * Prevent deprecated notion. Chakra UI want delete it but don't sugest better solution
 * https://github.com/chakra-ui/chakra-ui/discussions/6139
 */
export const transparentize =
    (color: string, opacity: number) => (theme: Dict) => {
        const raw = getColor(theme, color)
        return setTransparency(raw, 1 - opacity)
    }

export function isReadable(
    color1: string,
    color2: string,
    wcag2: WCAG2Params = { level: "AA", size: "small" },
): boolean {
    const readabilityLevel = readability(color1, color2)
    switch ((wcag2.level ?? "AA") + (wcag2.size ?? "small")) {
        case "AAsmall":
        case "AAAlarge":
            return readabilityLevel >= 4.5
        case "AAlarge":
            return readabilityLevel >= 3
        case "AAAsmall":
            return readabilityLevel >= 7
        default:
            return false
    }
}

/**
 * Checks if a color meets the Web Content Accessibility
 * Guidelines (Version 2.0) for contrast ratio.
 *
 * @param textColor - the foreground or text color
 * @param bgColor - the background color
 * @param options
 *
 */
export const isAccessible =
    (textColor: string, bgColor: string, options?: WCAG2Params) =>
        (theme: Dict) =>
            isReadable(getColor(theme, bgColor), getColor(theme, textColor), options)