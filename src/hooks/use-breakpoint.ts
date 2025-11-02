import { throttle } from "lodash-es"

import * as React from "react"

/**
 * Configuration for throttling resize events
 */
const THROTTLE_CONFIG = {
    /** Delay in milliseconds between resize event handling */
    DELAY: 100,
    /** Leading edge execution */
    LEADING: true,
    /** Trailing edge execution */
    TRAILING: true,
} as const

/**
 * Screen breakpoint widths in pixels
 */
export const BREAKPOINTS = {
    mobile: 768,
    tablet: 1024,
    desktop: 1440,
} as const

type BreakpointKey = keyof typeof BREAKPOINTS

/**
 * Represents the state of each breakpoint
 */
interface BreakpointState {
    /** True if screen width is less than mobile breakpoint */
    isMobile: boolean
    /** True if screen width is between mobile and tablet breakpoints */
    isTablet: boolean
    /** True if screen width is greater than tablet breakpoint */
    isDesktop: boolean
}

/**
 * Creates media query strings for each breakpoint
 */
const createMediaQueries = () => ({
    mobile: `(max-width: ${BREAKPOINTS.mobile - 1}px)`,
    tablet: `(min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.tablet - 1}px)`,
    desktop: `(min-width: ${BREAKPOINTS.tablet}px)`,
})

/**
 * Evaluates the current breakpoint state based on media queries
 */
const evaluateBreakpoints = (mediaQueries: ReturnType<typeof createMediaQueries>): BreakpointState => ({
    isMobile: window.matchMedia(mediaQueries.mobile).matches,
    isTablet: window.matchMedia(mediaQueries.tablet).matches,
    isDesktop: window.matchMedia(mediaQueries.desktop).matches,
})

/**
 * Custom hook for responsive design breakpoint detection
 *
 * @returns {BreakpointState} Object containing boolean flags for each breakpoint
 *
 * @example
 * ```tsx
 * const Component = () => {
 *   const { isMobile, isTablet, isDesktop } = useBreakpoint();
 *
 *   return (
 *     <div>
 *       {isMobile && <MobileView />}
 *       {isTablet && <TabletView />}
 *       {isDesktop && <DesktopView />}
 *     </div>
 *   );
 * };
 * ```
 */
export function useBreakpoint(): BreakpointState {
    const [breakpoint, setBreakpoint] = React.useState<BreakpointState>({
        isMobile: false,
        isTablet: false,
        isDesktop: false,
    })

    React.useEffect(() => {
        const mediaQueries = createMediaQueries()

        const handleResize = () => {
            setBreakpoint(evaluateBreakpoints(mediaQueries))
        }

        const throttledHandler = throttle(handleResize, THROTTLE_CONFIG.DELAY, {
            leading: THROTTLE_CONFIG.LEADING,
            trailing: THROTTLE_CONFIG.TRAILING,
        })

        // Initialize MediaQueryList observers
        const mediaQueryLists = Object.values(mediaQueries).map((query) => window.matchMedia(query))

        // Add listeners
        mediaQueryLists.forEach((mql) => {
            mql.addEventListener("change", throttledHandler)
        })

        // Set initial state
        handleResize()

        // Cleanup
        return () => {
            mediaQueryLists.forEach((mql) => {
                mql.removeEventListener("change", throttledHandler)
            })
            throttledHandler.cancel()
        }
    }, [])

    return breakpoint
}

/**
 * Type guard to check if a value is a valid breakpoint key
 */
export const isBreakpointKey = (key: string): key is BreakpointKey => key in BREAKPOINTS
