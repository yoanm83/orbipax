// OrbiPax UI Primitives - Modern React Components with Tailwind CSS v4
// Built with 2025 best practices: TypeScript, forwardRef, compound components

// Button component with variants (solid, outline, ghost, link)
export { Button } from "./Button";
export type { ButtonProps, ButtonVariants } from "./Button";

// Input component with variants (outlined, filled, underlined)
export { Input } from "./Input";
export type { InputProps, InputVariants } from "./Input";

// Card component with compound pattern (Card.Header, Card.Body, Card.Footer)
export { Card, CardHeader, CardBody, CardFooter } from "./Card";
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps, CardVariants } from "./Card";

// Form component with compound pattern (Form.Field, Form.Group, Form.Actions)
// Includes React Hook Form + Zod integration and examples
export {
  Form, FormField, FormGroup, FormActions, useFormContext,
  FormProvider, FormField as RHFFormField, FormActions as RHFFormActions, FormGroup as RHFFormGroup,
  ContactFormExample, RegistrationFormExample, SearchFormExample
} from "./Form";

export type {
  FormProps, FormFieldProps, FormGroupProps, FormActionsProps, FormVariants, FormContextValue,
  FormProviderProps, FormFieldProps as RHFFormFieldProps, FormActionsProps as RHFFormActionsProps, FormGroupProps as RHFFormGroupProps
} from "./Form";

// Table component with compound pattern (Table.Header, Table.Body, Table.Footer, Table.Row, Table.Head, Table.Cell)
export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption } from "./Table";
export type { TableProps, TableHeaderProps, TableBodyProps, TableFooterProps, TableRowProps, TableHeadProps, TableCellProps, TableCaptionProps, TableVariants } from "./Table";

// Collapsible component with compound pattern (Collapsible.Trigger, Collapsible.Content)
export { Collapsible, CollapsibleTrigger, CollapsibleContent, useCollapsibleContext } from "./Collapsible";
export type { CollapsibleProps, CollapsibleTriggerProps, CollapsibleContentProps, CollapsibleVariants } from "./Collapsible";

// Toast component with provider and hook (ToastProvider, useToast)
export { Toast, ToastProvider, useToast } from "./Toast";
export type { ToastData, ToastProps, ToastProviderProps, ToastVariants } from "./Toast";

// Select component with compound pattern (Select.Content, Select.Item)
export { Select } from "./Select";
export type { SelectProps, SelectContentProps, SelectItemProps, SelectOption, SelectVariants } from "./Select";

// DropdownMenu component with compound pattern (DropdownMenu.Trigger, DropdownMenu.Content, DropdownMenu.Item, DropdownMenu.Separator)
export { DropdownMenu } from "./DropdownMenu";
export type { DropdownMenuProps, DropdownMenuTriggerProps, DropdownMenuContentProps, DropdownMenuItemProps, DropdownMenuSeparatorProps, DropdownMenuVariants } from "./DropdownMenu";

// Avatar component with group support (Avatar.Group)
export { Avatar } from "./Avatar";
export type { AvatarProps, AvatarGroupProps, AvatarVariants, AvatarLoadingStatus } from "./Avatar";

// Shadow component with elevation and utility components (Shadow.Card, Shadow.Modal, Shadow.Dropdown, Shadow.Tooltip, Shadow.FloatingPanel)
export { Shadow } from "./Shadow";
export type { ShadowProps, ShadowVariants } from "./Shadow";

// Checkbox component with group support (Checkbox.Group, Checkbox.GroupItem)
export { Checkbox } from "./Checkbox";
export type { CheckboxProps, CheckboxGroupProps, CheckboxGroupItemProps, CheckboxVariants } from "./Checkbox";

// Switch component for toggle controls
export { Switch } from "./Switch";
export type { SwitchProps, SwitchVariants } from "./Switch";

// Toggle component with group support (Toggle.Group, Toggle.GroupItem)
export { Toggle } from "./Toggle";
export type { ToggleProps, ToggleGroupProps, ToggleGroupItemProps, ToggleVariants } from "./Toggle";

// Calendar component with year-friendly picker (Calendar.Header, Calendar.Grid, Calendar.MonthPicker, Calendar.YearPicker, Calendar.Range)
export { Calendar } from "./Calendar";
export type { CalendarProps, CalendarRangeProps, CalendarHeaderProps, CalendarVariants, DateValue, DateRange } from "./Calendar";

// Textarea component with auto-resize and character count (Textarea.CharacterCounter)
export { Textarea } from "./Textarea";
export type { TextareaProps, TextareaVariants, CharacterCounterProps } from "./Textarea";

// Dialog component with accessibility and focus trap (Dialog.Trigger, Dialog.Content, Dialog.Header, Dialog.Title, Dialog.Description, Dialog.Body, Dialog.Footer, Dialog.Close, Dialog.Overlay)
export { Dialog } from "./Dialog";
export type { DialogProps, DialogTriggerProps, DialogContentProps, DialogOverlayProps, DialogHeaderProps, DialogTitleProps, DialogDescriptionProps, DialogFooterProps, DialogCloseProps, DialogVariants } from "./Dialog";

// Modal component with imperative API and advanced features (Modal.Content, Modal.Header, Modal.Body, Modal.Footer, Modal.Close, useModal)
export { Modal, useModal } from "./Modal";
export type { ModalProps, ModalContentProps, ModalHeaderProps, ModalBodyProps, ModalFooterProps, ModalVariants, ModalHandle } from "./Modal";

// Sheet component with slide-out panels and accessibility (Sheet.Trigger, Sheet.Content, Sheet.Header, Sheet.Title, Sheet.Description, Sheet.Body, Sheet.Footer, Sheet.Close)
export { Sheet } from "./Sheet";
export type { SheetProps, SheetTriggerProps, SheetContentProps, SheetHeaderProps, SheetTitleProps, SheetDescriptionProps, SheetBodyProps, SheetFooterProps, SheetCloseProps, SheetVariants } from "./Sheet";

// EmptyState component for engaging empty UI states (EmptyState.Icon, EmptyState.Illustration, EmptyState.Title, EmptyState.Description, EmptyState.Actions)
export { EmptyState } from "./EmptyState";
export type { EmptyStateProps, EmptyStateIconProps, EmptyStateIllustrationProps, EmptyStateTitleProps, EmptyStateDescriptionProps, EmptyStateActionsProps, EmptyStateVariants } from "./EmptyState";

// Badge component for status indicators and labels (Badge.Container, Badge.Content, Badge.Icon)
export { Badge } from "./Badge";
export type { BadgeProps, BadgeContainerProps, BadgeContentProps, BadgeIconProps, BadgeVariants } from "./Badge";

// Typography component for semantic text hierarchy (Typography.Display, Typography.Headline, Typography.Title, Typography.Body, Typography.Label, Typography.Caption)
export { Typography } from "./Typography";
export type { TypographyProps, DisplayProps, HeadlineProps, TitleProps, BodyProps, LabelProps, CaptionProps, TypographyVariants } from "./Typography";