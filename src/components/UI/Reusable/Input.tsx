import React, { useRef } from "react";
import { Eye, EyeOff } from "lucide-react";

type CustomInputProps = {
    label: string;
    name: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    placeholder?: string;
    required?: boolean;
    type?: "text" | "textarea" | "password" | "dropdown" | "date" | "time";
    icon?: React.ElementType;
    disabled?: boolean;
    showPassword?: boolean;
    onTogglePasswordVisibility?: () => void;
    error?: boolean;
    helperText?: string;
    MenuOptions?: string[]; // for dropdown only
};

const Input: React.FC<CustomInputProps> = ({
    label,
    name,
    value = "",
    onChange,
    placeholder,
    required = false,
    type = "text",
    icon: Icon,
    disabled = false,
    showPassword = false,
    onTogglePasswordVisibility,
    error = false,
    helperText = "",
    MenuOptions = []
}) => {
    const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement>(null);

    const inputClasses =
        "flex-1 h-12 bg-background-default text-default outline-none text-description-regular";

    const showToggle = type === "password" && onTogglePasswordVisibility;

    const renderInput = () => {
        switch (type) {
            case "dropdown":
                return (
                    <select
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        required={required}
                        disabled={disabled}
                        className={`${inputClasses} custom-dropdown appearance-none`}
                        ref={inputRef}
                    >
                        <option value="" className="option">Select</option>
                        {MenuOptions.map((option) => (
                            <option className="option" key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );

            case "time":
            case "date":
                return (
                    <input
                        id={name}
                        name={name}
                        type={type}
                        value={value}
                        onChange={onChange}
                        required={required}
                        disabled={disabled}
                        className={`${inputClasses} hide-native-time`}
                        ref={inputRef}
                    />
                );

            default:
                return (
                    <input
                        id={name}
                        name={name}
                        type={type === "password" && !showPassword ? "password" : "text"}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        required={required}
                        disabled={disabled}
                        className={inputClasses}
                        ref={inputRef}
                    />
                );
        }
    };

    return (
        <div className="relative w-full">
            {/* Floating Label */}
            <label
                htmlFor={name}
                className="absolute left-4 transition-all duration-200 px-1 text-muted -top-3 bg-background-default z-10 text-captionMedium"
            >
                {label}
            </label>

            {/* Input Wrapper */}
            <div className="flex items-center px-4 bg-transparent border border-border-default rounded-md w-full">
                {renderInput()}

                {Icon && <Icon className="text-light ml-2 mt-1 cursor-pointer" size={18} onClick={() => inputRef.current?.showPicker()} />}

                {showToggle && (
                    <button
                        type="button"
                        onClick={onTogglePasswordVisibility}
                        className="ml-2 focus:outline-none"
                    >
                        {showPassword ? (
                            <Eye size={18} className="text-light" />
                        ) : (
                            <EyeOff size={18} className="text-light" />
                        )}
                    </button>
                )}
            </div>

            {error && helperText && (
                <p className="text-red-500 text-caption mt-1 ml-1">{helperText}</p>
            )}
        </div>
    );
};

export default Input;
