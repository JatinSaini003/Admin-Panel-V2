// components/UI/Reusable/ConfirmationPopup.tsx
import React from "react";

interface ConfirmationPopupProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
    isOpen,
    message,
    onConfirm,
    onCancel,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-10 bg-black/50 flex justify-center items-center">
            <div className="flex flex-col items-center bg-background-active rounded-lg shadow-lg overflow-hidden">
                <span className="text-subheading-regular text-default text-center font-gilroy-medium p-7">
                    {message}
                </span>
                <div className="w-full grid grid-cols-2 border-t border-muted">
                    <button
                        className="py-3 px-10 text-muted hover:text-default hover:bg-primary transition-colors"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                    <button
                        className="py-3 px-10 text-muted border-l border-muted hover:text-default hover:bg-primary transition-colors"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPopup;
