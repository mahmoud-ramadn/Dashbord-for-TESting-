"use client"

import { type ElementRef, useMemo, useRef } from "react"
import Select, { type MenuPlacement, type MultiValue, type SingleValue } from "react-select"
import CreatableSelect from "react-select/creatable"

import { cn } from "@/lib/utils"

import { syncCustomClasses } from "@/components/ui/select-input/class-names"
import {
    CustomDropDownIndicator,
    CustomMenuList,
    type LabelValueType,
    LoadingMessage,
    NoOptionsMessage,
    Option,
    SelectContainer,
} from "@/components/ui/select-input/custom-components"

interface Props {
    placeholder?: string
    value?: LabelValueType | LabelValueType[] | null
    defaultValue?: LabelValueType | LabelValueType[] | null
    options?: LabelValueType[]
    className?: string
    hideSelectedOptions?: boolean
    dropdownIndicatorClassName?: string
    loadOptions?: (value: string) => Promise<LabelValueType[]>
    isMulti?: boolean
    isSearchable?: boolean
    isLoading?: boolean
    isClearable?: boolean
    ariaInvalid?: boolean
    loadingMessage?: string
    noOptionsMessage?: string
    onChange?: (value: SingleValue<LabelValueType> | MultiValue<LabelValueType>) => void
    onInputChange?: (value: string) => void
    menuPlacement?: MenuPlacement
    isCreatable?: boolean
    onCreateOption?: (value: string) => void
    menuStartingValue?: string
    disabled?: boolean
    isRtl?: boolean
}

export const SelectInput = ({
    className,
    placeholder = "",
    options = [],
    isMulti = false,
    isSearchable = false,
    isClearable = false,
    ariaInvalid = false,
    hideSelectedOptions = false,
    isLoading = false,
    value,
    defaultValue,
    dropdownIndicatorClassName,
    onChange,
    onInputChange,
    noOptionsMessage,
    loadingMessage,
    menuPlacement = "auto",
    isCreatable = false,
    onCreateOption,
    menuStartingValue,
    disabled,
    isRtl = true,
}: Readonly<Props>) => {
    const menuListRef = useRef<ElementRef<"div">>(null)

    /**
     * Dynamically selects the appropriate Select component based on the props.
     * If loadOptions is true, it uses AsyncSelect for asynchronous loading of options.
     * If isCreatable is true, it uses CreatableSelect for creatable options.
     * Otherwise, it defaults to the standard Select component.
     */
    const SelectComponent = useMemo(() => {
        return isCreatable ? CreatableSelect : Select
    }, [isCreatable])

    /**
     * When the menu is opened, scroll the selected option into view.
     * This is necessary because the menu is virtualized and the selected option
     * may not be visible initially.
     */
    const selectMenuOpenChangeHandler = () => {
        requestAnimationFrame(() => {
            const selectedOption = Array.from(menuListRef.current?.children ?? []).find(
                (child) => child.textContent === menuStartingValue
            )

            if (selectedOption) {
                selectedOption.scrollIntoView({ block: "center" })
            }
        })
    }

    return (
        <div className={className}>
            <SelectComponent
                components={{
                    DropdownIndicator: (props) => (
                        <CustomDropDownIndicator
                            {...props}
                            className={cn(dropdownIndicatorClassName, ariaInvalid && "text-red-500")}
                        />
                    ),
                    NoOptionsMessage: (props) => <NoOptionsMessage {...props} noOptionsMessage={noOptionsMessage} />,
                    LoadingMessage: () => <LoadingMessage loadingMessage={loadingMessage} />,
                    MenuList: (props) => <CustomMenuList {...props} innerRef={menuListRef} />,
                    Option,
                    ...(isMulti && { SelectContainer }),
                }}
                isDisabled={disabled}
                placeholder={placeholder}
                value={value}
                isLoading={isLoading}
                defaultValue={defaultValue}
                options={options}
                controlShouldRenderValue={!isMulti}
                classNames={syncCustomClasses}
                onChange={(value) => {
                    onChange?.(value)
                }}
                onInputChange={(value) => {
                    onInputChange?.(value)
                }}
                formatCreateLabel={(value) => {
                    return "إنشاء" + " " + value
                }}
                onCreateOption={onCreateOption}
                hideSelectedOptions={hideSelectedOptions}
                isMulti={isMulti}
                isClearable={isClearable}
                isSearchable={isSearchable}
                aria-invalid={ariaInvalid}
                menuPlacement={menuPlacement as MenuPlacement}
                unstyled
                onMenuOpen={menuStartingValue ? selectMenuOpenChangeHandler : undefined}
                styles={{
                    menuList(base) {
                        return {
                            ...base,
                            maxHeight: "100%",
                        }
                    },
                }}
                isRtl={isRtl}
            />
        </div>
    )
}
