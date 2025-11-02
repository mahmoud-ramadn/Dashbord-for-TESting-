import { Check } from "lucide-react"
import { ChevronDownIcon } from "lucide-react"

import { components } from "react-select"
import type { ContainerProps, GroupBase, MenuListProps, OptionProps } from "react-select"

import { cn } from "@/lib/utils"

/**
 * Represents a label-value pair.
 * @typedef {Object} LabelValueType
 * @property {string} label - The label of the option.
 * @property {any} value - The value of the option.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LabelValueType = { label: string; value: any }

/**
 * Props for the CustomDropDownIndicator component.
 * @typedef {Object} CustomDropDownIndicatorProps
 * @property {string} [className] - Optional CSS class for styling.
 * @property {{ menuIsOpen: boolean }} selectProps - Props from the select component.
 */
type CustomDropDownIndicatorProps = {
    className?: string
    hasValue?: boolean
    selectProps: {
        menuIsOpen: boolean
    }
}

/**
 * Custom dropdown indicator component.
 * @param {Readonly<CustomDropDownIndicatorProps>} props - The props for the component.
 * @returns {React.ReactNode} The custom dropdown indicator component.
 */
const CustomDropDownIndicator = ({ className, selectProps }: Readonly<CustomDropDownIndicatorProps>) => {
    const isMenuOpen = selectProps?.menuIsOpen

    return (
        <ChevronDownIcon
            className={cn(
                "text-border transition-transform duration-300 size-5 ms-1",
                isMenuOpen && "rotate-180",
                className
            )}
        />
    )
}

CustomDropDownIndicator.displayName = "CustomDropDownIndicator"

/**
 * Defines the props for the SelectContainer component.
 * @typedef {ContainerProps<LabelValueType, boolean, GroupBase<LabelValueType>>} SelectContainerProps
 */
type SelectContainerProps = ContainerProps<LabelValueType, boolean, GroupBase<LabelValueType>>

/**
 * Defines the props for the SelectValuesContainer component by omitting the "children" prop from SelectContainerProps.
 * @typedef {Omit<SelectContainerProps, "children">} SelectValuesContainerProps
 */
type SelectValuesContainerProps = Omit<SelectContainerProps, "children">

/**
 * Renders the selected values container component.
 * @param {Readonly<SelectValuesContainerProps>} props - The props for the SelectedValuesContainer component.
 * @returns {React.ReactNode} The selected values container component.
 */
const SelectedValuesContainer = ({
    isDisabled,
    getValue,
    selectProps,
    setValue,
    ...rest
}: Readonly<SelectValuesContainerProps>) => {
    const { getOptionValue, formatOptionLabel } = selectProps
    const values = getValue()

    /**
     * Formats the label for a given option.
     * @param {LabelValueType} option - The option to format the label for.
     * @returns {string} The formatted label.
     */
    const getValueLabel = (option: LabelValueType) =>
        formatOptionLabel?.(option, { context: "value", inputValue: "", selectValue: [] }) || option.label

    /**
     * Generates a unique key for a given option and index.
     * @param {LabelValueType} option - The option to generate a key for.
     * @param {number} index - The index of the option.
     * @returns {string} The unique key.
     */
    const getKey = (option: LabelValueType, index: number) => `${getOptionValue(option)}-${index}`

    /**
     * Converts a value to a multi-value component.
     * @param {LabelValueType} value - The value to convert.
     * @param {number} index - The index of the value.
     * @returns {React.ReactNode} The multi-value component.
     */
    const toMultiValue = (value: LabelValueType, index: number) => {
        return (
            <components.MultiValue
                {...rest}
                selectProps={selectProps}
                setValue={setValue}
                data={value}
                isDisabled={isDisabled}
                index={index}
                getValue={getValue}
                components={{
                    Container: components.MultiValueContainer,
                    Label: components.MultiValueLabel,
                    Remove: components.MultiValueRemove,
                }}
                key={getKey(value, index)}
                removeProps={{
                    onClick: () => {
                        setValue(
                            values?.filter((_, i) => i !== index),
                            "deselect-option"
                        )
                    },
                }}
            >
                {getValueLabel(value)}
            </components.MultiValue>
        )
    }

    return <div className="mt-2 flex flex-wrap gap-2">{values?.map(toMultiValue)}</div>
}

SelectedValuesContainer.displayName = "SelectedValuesContainer"

/**
 * Renders the select container component.
 * @param {Readonly<SelectContainerProps>} props - The props for the SelectContainer component.
 * @returns {React.ReactNode} The select container component.
 */
const SelectContainer = ({ children, ...rest }: Readonly<SelectContainerProps>) => {
    return (
        <>
            <components.SelectContainer {...rest}>{children}</components.SelectContainer>
            <SelectedValuesContainer {...rest} />
        </>
    )
}

SelectContainer.displayName = "SelectContainer"

type NoOptionsMessageProps = {
    noOptionsMessage?: string
}
/**
 * Renders the no options message component.
 * @param {Readonly<NoOptionsMessageProps>} props - The props for the NoOptionsMessage component.
 * @returns {React.ReactNode} The no options message component.
 */
const NoOptionsMessage = ({ noOptionsMessage }: Readonly<NoOptionsMessageProps>) => {
    return <p className="text-center text-sm font-medium text-gray-125">{noOptionsMessage ?? "لا يوجد خيارات"}</p>
}

NoOptionsMessage.displayName = "NoOptionsMessage"

const Option = (props: OptionProps<LabelValueType, boolean, GroupBase<LabelValueType>>) => {
    const isSelected = props?.isSelected

    return (
        <components.Option {...props} className="relative rounded py-1.5 pe-2 ps-8 text-sm">
            <Check className={cn("absolute start-2 top-2 size-4 opacity-0", isSelected && "opacity-100")} />
            {props.data.label}
        </components.Option>
    )
}

Option.displayName = "Option"

type LoadingMessageProps = {
    loadingMessage?: string
}

const LoadingMessage = ({ loadingMessage }: Readonly<LoadingMessageProps>) => {
    return <p className="text-center text-sm font-medium text-gray-125">{loadingMessage ?? "جاري التحميل..."}</p>
}

LoadingMessage.displayName = "LoadingMessage"

type CustomMenuListProps = MenuListProps<LabelValueType, boolean, GroupBase<LabelValueType>>
/**
 * Custom menu list component.
 * @param {Readonly<CustomMenuListProps>} props - The props for the CustomMenuList component.
 * @returns {React.ReactNode} The custom menu list component.
 */
const CustomMenuList = (props: Readonly<CustomMenuListProps>) => {
    return <components.MenuList {...props} />
}

CustomMenuList.displayName = "CustomMenuList"

export { CustomDropDownIndicator, SelectContainer, NoOptionsMessage, Option, LoadingMessage, CustomMenuList }
