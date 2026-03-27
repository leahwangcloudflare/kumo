import { type ReactNode } from "react";
import {
  Dialog,
  DialogRoot,
  DialogTitle,
  DialogClose,
} from "../../components/dialog";
import { Button } from "../../components/button";
import { Banner } from "../../components/banner";
import { Text } from "../../components/text";
import { cn } from "../../utils/cn";
import { WarningCircleIcon, XIcon } from "@phosphor-icons/react";

export const KUMO_FORM_DIALOG_VARIANTS = {
  size: {
    sm: {
      classes: "sm:w-[24rem]",
      description: "Small dialog for a single short input or text-only content",
    },
    base: {
      classes: "sm:w-[32rem]",
      description:
        "Default form dialog size for two side-by-side inputs or one long input",
    },
  },
} as const;

export const KUMO_FORM_DIALOG_DEFAULT_VARIANTS = {
  size: "base",
} as const;

export type KumoFormDialogSize = keyof typeof KUMO_FORM_DIALOG_VARIANTS.size;

export interface KumoFormDialogVariantsProps {
  size?: KumoFormDialogSize;
}

export interface FormDialogCancelButtonProps {
  /** Button label. @default "Cancel" */
  children?: ReactNode;
  /** Whether the button is disabled. */
  disabled?: boolean;
  /** Shows a loading spinner and disables interaction. */
  loading?: boolean;
  /** Additional CSS classes. */
  className?: string;
}

export function FormDialogCancelButton({
  children = "Cancel",
  ...props
}: FormDialogCancelButtonProps) {
  return (
    <DialogClose
      render={(dialogProps) => (
        <Button {...dialogProps} {...props} variant="secondary">
          {children}
        </Button>
      )}
    />
  );
}

FormDialogCancelButton.displayName = "FormDialogCancelButton";

export interface FormDialogSubmitButtonProps {
  /** Button label. @default "Save" */
  children?: ReactNode;
  /** Whether the button is disabled. */
  disabled?: boolean;
  /** Shows a loading spinner and disables interaction. */
  loading?: boolean;
  /** Additional CSS classes. */
  className?: string;
}

export function FormDialogSubmitButton({
  children = "Save",
  ...props
}: FormDialogSubmitButtonProps) {
  return (
    <Button type="submit" variant="primary" {...props}>
      {children}
    </Button>
  );
}

FormDialogSubmitButton.displayName = "FormDialogSubmitButton";

export interface FormDialogProps extends KumoFormDialogVariantsProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Dialog title */
  title: string;
  /** Optional description rendered directly below the title */
  description?: string;
  /** Optional banner rendered above form fields (caller decides variant — info, warning, etc.) */
  banner?: ReactNode;
  /** Error message to display as an error banner above form fields */
  errorMessage?: string;
  /** Form field content */
  children: ReactNode;
  /** Called when the form is submitted */
  onSubmit: (e: React.FormEvent) => void;
  /** Cancel button. Defaults to <FormDialogCancelButton /> */
  cancelButton?: ReactNode;
  /** Submit button. Defaults to <FormDialogSubmitButton /> */
  submitButton?: ReactNode;
  /** Additional className for the dialog */
  className?: string;
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  banner,
  errorMessage,
  children,
  onSubmit,
  cancelButton = <FormDialogCancelButton />,
  submitButton = <FormDialogSubmitButton />,
  size = KUMO_FORM_DIALOG_DEFAULT_VARIANTS.size,
  className,
}: FormDialogProps) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <Dialog
        size={size}
        className={cn(
          "p-0",
          KUMO_FORM_DIALOG_VARIANTS.size[size].classes,
          className,
        )}
      >
        <div className="flex flex-col px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
            <DialogClose
              render={(props) => (
                <Button
                  {...props}
                  variant="ghost"
                  shape="square"
                  size="sm"
                  aria-label="Close"
                >
                  <XIcon size={20} />
                </Button>
              )}
            />
          </div>
          {description && (
            <div className="max-w-prose mt-2">
              <Text variant="secondary">{description}</Text>
            </div>
          )}
          {errorMessage ? (
            <Banner
              icon={<WarningCircleIcon weight="fill" />}
              variant="error"
              description={errorMessage}
              className="mt-3"
            />
          ) : (
            banner && <div className="mt-3">{banner}</div>
          )}
        </div>

        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-4 px-6 py-2">{children}</div>
          <div className="flex justify-end gap-3 px-6 py-6">
            {cancelButton}
            {submitButton}
          </div>
        </form>
      </Dialog>
    </DialogRoot>
  );
}

FormDialog.displayName = "FormDialog";
