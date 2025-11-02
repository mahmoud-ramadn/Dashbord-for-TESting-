import { useCallback, useEffect, useState } from "react"

/**
 * Timer state and control functions
 */
interface CountdownTimer {
    /** Current seconds remaining in the countdown */
    seconds: number
    /** Whether the timer is currently running */
    isActive: boolean
    /** Current countdown value */
    value: number
    /** Starts the countdown timer */
    start: () => void
    /** Stops the countdown timer */
    stop: () => void
    /** Resets the timer to initial or specified time */
    reset: (newTime?: number) => void
}

/**
 * Configuration for the countdown timer
 */
interface TimerConfig {
    /** Interval in milliseconds between countdown ticks */
    readonly TICK_INTERVAL: number
    /** Minimum allowed seconds for the timer */
    readonly MIN_SECONDS: number
}

/**
 * Timer configuration constants
 */
const TIMER_CONFIG: TimerConfig = {
    TICK_INTERVAL: 1000,
    MIN_SECONDS: 0,
} as const

/**
 * Custom hook for creating a countdown timer
 *
 * @param {number} initialSeconds - Initial number of seconds for the countdown
 * @returns {CountdownTimer} Object containing timer state and control functions
 *
 * @example
 * ```tsx
 * function TimerComponent() {
 *   const { seconds, isActive, start, stop, reset } = useCountdownTimer(60);
 *
 *   return (
 *     <div>
 *       <p>Time remaining: {seconds} seconds</p>
 *       <button onClick={start}>Start</button>
 *       <button onClick={stop}>Stop</button>
 *       <button onClick={() => reset()}>Reset</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @throws {Error} If initialSeconds is less than 0
 */
export function useCountdownTimer(initialSeconds: number): CountdownTimer {
    // Validate initial seconds
    if (initialSeconds < TIMER_CONFIG.MIN_SECONDS) {
        throw new Error("Initial seconds must be greater than or equal to 0")
    }

    const [seconds, setSeconds] = useState(initialSeconds)
    const [isActive, setIsActive] = useState(true) // Start active by default
    const [value, setValue] = useState(initialSeconds)

    /**
     * Updates countdown values and checks for completion
     */
    const updateCountdown = useCallback(() => {
        setSeconds((prev) => {
            const newValue = prev - 1
            setValue(newValue)
            return newValue
        })
    }, [])

    /**
     * Initialize timer on mount if there are initial seconds
     */
    useEffect(() => {
        if (initialSeconds > TIMER_CONFIG.MIN_SECONDS) {
            setIsActive(true)
        }
    }, [initialSeconds])

    /**
     * Handles the countdown logic
     */
    useEffect(() => {
        if (!isActive) {
            return
        }

        if (seconds <= TIMER_CONFIG.MIN_SECONDS) {
            setIsActive(false)
            return
        }

        const timer = setInterval(updateCountdown, TIMER_CONFIG.TICK_INTERVAL)

        return () => {
            clearInterval(timer)
        }
    }, [isActive, seconds, updateCountdown])

    /**
     * Starts the countdown timer if there are seconds remaining
     */
    const start = useCallback(() => {
        if (seconds <= TIMER_CONFIG.MIN_SECONDS) {
            return
        }

        setIsActive(true)
    }, [seconds])

    /**
     * Stops the countdown timer and clears interval
     */
    const stop = useCallback(() => {
        setIsActive(false)
    }, [])

    /**
     * Resets the timer to the initial time or a new specified time
     * @param {number} [newTime] - Optional new time to reset to
     */
    const reset = useCallback(
        (newTime = initialSeconds) => {
            if (newTime < TIMER_CONFIG.MIN_SECONDS) {
                throw new Error("Reset time must be greater than or equal to 0")
            }

            setIsActive(true) // Start immediately after reset
            setSeconds(newTime)
            setValue(newTime)
        },
        [initialSeconds]
    )

    return {
        seconds,
        isActive,
        value,
        start,
        stop,
        reset,
    }
}
