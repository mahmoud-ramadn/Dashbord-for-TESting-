import { type DebouncedFunc, debounce } from "lodash-es"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Custom hook for handling debounced input values
 * @param {number} [delay=300] - Debounce delay in milliseconds
 * @param {string} [initialValue=""] - Initial value for the input
 * @returns {Object} An object containing the debounced value and change handler
 * @property {string} value - The debounced value
 * @property {(val: string) => void} handleChange - Function to update the value with debouncing
 * @property {(val: string) => void} setValue - Function to set value immediately without debouncing
 */
export const useDebouncedInput = (
    delay: number = 300,
    initialValue: string = ""
): {
    value: string
    handleChange: (val: string) => void
    setValue: (val: string) => void
} => {
    const [value, setValueState] = useState<string>(initialValue)
    const debouncedCallback = useRef<DebouncedFunc<(val: string) => void>>(null)

    useEffect(() => {
        // Initialize debounce function on mount
        const debouncedFn = debounce((val: string) => {
            setValueState(val)
        }, delay)

        debouncedCallback.current = debouncedFn

        // Cleanup on unmount
        return () => {
            debouncedFn.cancel()
        }
    }, [delay])

    /**
     * Handles input changes with debouncing
     * @param {string} val - The new input value
     */
    const handleChange = useCallback((val: string) => {
        debouncedCallback.current?.(val)
    }, [])

    /**
     * Sets value immediately without debouncing
     * @param {string} val - The new value
     */
    const setValue = useCallback((val: string) => {
        setValueState(val)
        debouncedCallback.current?.cancel()
    }, [])

    return {
        value,
        handleChange,
        setValue,
    }
}
