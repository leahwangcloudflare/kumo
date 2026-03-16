import { Field as FieldBase } from "@base-ui/react/field";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn";
import { Label } from "../label";

/** Field variant definitions (currently empty, reserved for future additions). */
export const KUMO_FIELD_VARIANTS = {
  // Field currently has no variant options but structure is ready for future additions
} as const;

export const KUMO_FIELD_DEFAULT_VARIANTS = {} as const;

// Derived types from KUMO_FIELD_VARIANTS
export interface KumoFieldVariantsProps {
  /**
   * When true, places the control (checkbox/switch) before the label visually.
   * When false (default), places the label before the control.
   * Used to support different layout patterns (e.g., iOS-style toggles on the right).
   */
  controlFirst?: boolean;
  /**
   * Size of the field, affects spacing between label and input.
   * - `"xs"` — Extra small (gap-1)
   * - `"sm"` — Small (gap-1)
   * - `"base"` — Default (gap-1)
   * - `"lg"` — Large (gap-2)
   * @default "base"
   */
  size?: "xs" | "sm" | "base" | "lg";
}

export function fieldVariants({
  controlFirst = false,
  size = "base",
}: KumoFieldVariantsProps = {}) {
  const gapClass = size === "lg" ? "gap-2" : size === "base" ? "gap-1" : "gap-1";
  
  return cn(
    // Base styles - vertical layout (default)
    "grid",
    gapClass,

    // Horizontal layout for checkbox and switch
    // Default: Grid auto-reverses in RTL (desired)
    "has-[input[type=checkbox]]:grid-cols-[auto_1fr] has-[input[type=checkbox]]:items-center",
    "has-[[role=switch]]:grid-cols-[auto_1fr] has-[[role=switch]]:items-center",

    // Control first: use flexbox with row-reverse to flip visual order without affecting text direction
    // flex-row-reverse in LTR: Control→Label, in RTL: Label→Control (opposite of grid default)
    controlFirst && [
      "has-[input[type=checkbox]]:flex has-[input[type=checkbox]]:flex-row-reverse has-[input[type=checkbox]]:flex-wrap has-[input[type=checkbox]]:items-center",
      "has-[[role=switch]]:flex has-[[role=switch]]:flex-row-reverse has-[[role=switch]]:flex-wrap has-[[role=switch]]:items-center",
      "[&>label]:flex-1",
    ],
  );
}

/**
 * Match type for field validation errors.
 * Can be a boolean or a key from the browser's ValidityState interface.
 * Source: BaseErrorProps["match"] (ComponentPropsWithoutRef<typeof FieldBase.Error>)
 */
export type FieldErrorMatch =
  | boolean
  | "badInput"
  | "customError"
  | "patternMismatch"
  | "rangeOverflow"
  | "rangeUnderflow"
  | "stepMismatch"
  | "tooLong"
  | "tooShort"
  | "typeMismatch"
  | "valid"
  | "valueMissing";

/**
 * Field component props — wraps a form control with label, description, and error message.
 *
 * @example
 * ```tsx
 * <Field label="Email" required>
 *   <Input placeholder="you@example.com" />
 * </Field>
 *
 * <Field label="Phone" required={false} description="We'll only use this for account recovery.">
 *   <Input placeholder="+1 555-0000" />
 * </Field>
 * ```
 */
export interface FieldProps extends KumoFieldVariantsProps {
  /** The form control element(s) to wrap (Input, Select, Checkbox, etc.). */
  children: ReactNode;
  /** The label content — can be a string or any React node. */
  label: ReactNode;
  /**
   * When explicitly `false`, shows gray "(optional)" text after the label.
   * When `true` or `undefined`, no indicator is shown.
   */
  required?: boolean;
  /** Tooltip content displayed next to the label via an info icon. */
  labelTooltip?: ReactNode;
  /** Validation error with a message and a browser `ValidityState` match key. */
  error?: {
    message: ReactNode;
    match: FieldErrorMatch;
  };
  /** Helper text displayed below the control (hidden when `error` is present). */
  description?: ReactNode;
  /** When `true`, places the control before the label (for checkbox/switch layouts). */
  controlFirst?: boolean;
  /**
   * Size of the field, affects spacing between label and input.
   * @default "base"
   */
  size?: "xs" | "sm" | "base" | "lg";
}

/**
 * Form field wrapper that provides a label, optional description, and error display
 * around any form control. Built on Base UI Field primitives.
 *
 * @example
 * ```tsx
 * <Field label="Username">
 *   <Input placeholder="Choose a username" />
 * </Field>
 * ```
 */
export function Field({
  children,
  label,
  required,
  labelTooltip,
  error,
  description,
  controlFirst = false,
  size = "base",
}: FieldProps) {
  // Show "(optional)" when required is explicitly false
  const showOptional = required === false;

  const labelTextSize = size === "xs" ? "text-xs" : size === "sm" ? "text-sm" : "text-base";

  return (
    <FieldBase.Root className={fieldVariants({ controlFirst, size })}>
      <FieldBase.Label className={cn("m-0 flex w-full items-center justify-between text-kumo-default", labelTextSize)}>
        <span className="inline-flex items-center gap-1 font-medium">
          {label}
          {labelTooltip && (
            <Label tooltip={labelTooltip} asContent>
              {""}
            </Label>
          )}
        </span>
        {showOptional && (
          <span className="text-sm font-normal text-kumo-subtle">Optional</span>
        )}
      </FieldBase.Label>
      {children}
      {error ? (
        <FieldBase.Error
          className={cn(
            "text-sm leading-snug text-kumo-danger",
            // Span full width in horizontal layout
            "col-span-full",
          )}
          match={error.match}
        >
          {error.message}
        </FieldBase.Error>
      ) : (
        description && (
          <FieldBase.Description
            className={cn(
              "text-sm leading-snug text-kumo-subtle",
              // Span full width in horizontal layout
              "col-span-full",
            )}
          >
            {description}
          </FieldBase.Description>
        )
      )}
    </FieldBase.Root>
  );
}
