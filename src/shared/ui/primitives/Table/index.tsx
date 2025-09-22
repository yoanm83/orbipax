import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

// Table variant configurations based on modern 2025 patterns
interface TableVariants {
  variant: "default" | "striped" | "bordered" | "borderless";
  size: "sm" | "md" | "lg";
  layout: "auto" | "fixed";
  responsive: "scroll" | "stack" | "hidden";
}

// Modern Table props interface extending HTML table attributes
interface TableProps extends ComponentPropsWithoutRef<"table"> {
  variant?: TableVariants["variant"];
  size?: TableVariants["size"];
  layout?: TableVariants["layout"];
  responsive?: TableVariants["responsive"];
  stickyHeader?: boolean;
  children: ReactNode;
}

// Table Header props
interface TableHeaderProps extends ComponentPropsWithoutRef<"thead"> {
  children: ReactNode;
}

// Table Body props
interface TableBodyProps extends ComponentPropsWithoutRef<"tbody"> {
  children: ReactNode;
}

// Table Footer props
interface TableFooterProps extends ComponentPropsWithoutRef<"tfoot"> {
  children: ReactNode;
}

// Table Row props
interface TableRowProps extends ComponentPropsWithoutRef<"tr"> {
  children: ReactNode;
  selected?: boolean;
  clickable?: boolean;
}

// Table Head Cell props
interface TableHeadProps extends ComponentPropsWithoutRef<"th"> {
  children: ReactNode;
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
}

// Table Cell props
interface TableCellProps extends ComponentPropsWithoutRef<"td"> {
  children: ReactNode;
  numeric?: boolean;
  truncate?: boolean;
}

// Table Caption props
interface TableCaptionProps extends ComponentPropsWithoutRef<"caption"> {
  children: ReactNode;
}

// Semantic class configurations using design tokens
const tableVariants = {
  base: "w-full caption-bottom text-sm",

  variants: {
    default: "border-collapse",
    striped: "border-collapse [&_tbody_tr:nth-child(odd)]:bg-muted/50",
    bordered: "border border-border",
    borderless: "border-collapse"
  },

  sizes: {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  },

  layout: {
    auto: "table-auto",
    fixed: "table-fixed"
  },

  responsive: {
    scroll: "overflow-x-auto",
    stack: "block md:table",
    hidden: "hidden sm:table"
  },

  stickyHeader: "sticky top-0 z-10"
};

// Table Header styling using semantic tokens
const tableHeaderVariants = {
  base: "border-b border-border bg-muted/50 font-medium text-on-muted [&>tr]:border-b"
};

// Table Body styling
const tableBodyVariants = {
  base: "[&_tr:last-child]:border-0"
};

// Table Footer styling
const tableFooterVariants = {
  base: "border-t border-border bg-muted/50 font-medium [&>tr]:last:border-b-0"
};

// Table Row styling using semantic tokens
const tableRowVariants = {
  base: "border-b border-border transition-colors",
  interactive: "hover:bg-muted/50 cursor-pointer",
  selected: "bg-muted data-[state=selected]:bg-muted"
};

// Table Head styling using semantic tokens
const tableHeadVariants = {
  base: "h-12 px-4 text-left align-middle font-medium text-on-muted [&:has([role=checkbox])]:pr-0",
  sortable: "cursor-pointer select-none hover:bg-accent/50",
  sortIcon: "ml-2 h-4 w-4 inline-block"
};

// Table Cell styling using semantic tokens
const tableCellVariants = {
  base: "p-4 align-middle [&:has([role=checkbox])]:pr-0",
  numeric: "text-right font-mono",
  truncate: "max-w-0 truncate"
};

// Table Caption styling
const tableCaptionVariants = {
  base: "mt-4 text-sm text-on-muted"
};

// Main Table component
const TableRoot = forwardRef<HTMLTableElement, TableProps>(
  (
    {
      variant = "default",
      size = "md",
      layout = "auto",
      responsive = "scroll",
      stickyHeader = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    // Build table classes
    const baseClasses = tableVariants.base;
    const variantClasses = tableVariants.variants[variant];
    const sizeClasses = tableVariants.sizes[size];
    const layoutClasses = tableVariants.layout[layout];
    const stickyClasses = stickyHeader ? tableVariants.stickyHeader : "";

    const tableClasses = [
      baseClasses,
      variantClasses,
      sizeClasses,
      layoutClasses,
      stickyClasses,
      className
    ].filter(Boolean).join(" ");

    // Responsive wrapper classes
    const wrapperClasses = responsive === "scroll" ? "relative w-full overflow-auto" : "";

    const TableComponent = (
      <table
        ref={ref}
        className={tableClasses}
        {...props}
      >
        {children}
      </table>
    );

    // Wrap table for responsive scroll if needed
    return responsive === "scroll" ? (
      <div className={wrapperClasses}>
        {TableComponent}
      </div>
    ) : TableComponent;
  }
);

TableRoot.displayName = "Table";

// Table Header component
export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  (
    {
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const headerClasses = [
      tableHeaderVariants.base,
      className
    ].filter(Boolean).join(" ");

    return (
      <thead
        ref={ref}
        className={headerClasses}
        {...props}
      >
        {children}
      </thead>
    );
  }
);

TableHeader.displayName = "TableHeader";

// Table Body component
export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  (
    {
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const bodyClasses = [
      tableBodyVariants.base,
      className
    ].filter(Boolean).join(" ");

    return (
      <tbody
        ref={ref}
        className={bodyClasses}
        {...props}
      >
        {children}
      </tbody>
    );
  }
);

TableBody.displayName = "TableBody";

// Table Footer component
export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  (
    {
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const footerClasses = [
      tableFooterVariants.base,
      className
    ].filter(Boolean).join(" ");

    return (
      <tfoot
        ref={ref}
        className={footerClasses}
        {...props}
      >
        {children}
      </tfoot>
    );
  }
);

TableFooter.displayName = "TableFooter";

// Table Row component
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    {
      selected = false,
      clickable = false,
      className = "",
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const rowClasses = [
      tableRowVariants.base,
      (clickable || onClick) ? tableRowVariants.interactive : "",
      selected ? tableRowVariants.selected : "",
      className
    ].filter(Boolean).join(" ");

    return (
      <tr
        ref={ref}
        className={rowClasses}
        onClick={onClick}
        data-state={selected ? "selected" : undefined}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

TableRow.displayName = "TableRow";

// Table Head component
export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      sortable = false,
      sortDirection = null,
      onSort,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const headClasses = [
      tableHeadVariants.base,
      sortable ? tableHeadVariants.sortable : "",
      className
    ].filter(Boolean).join(" ");

    // Sort icon component
    const SortIcon = () => {
      if (!sortable) {
        return null;
      }

      return (
        <span className={tableHeadVariants.sortIcon}>
          {sortDirection === "asc" && (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          )}
          {sortDirection === "desc" && (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
          {!sortDirection && (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="opacity-50">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          )}
        </span>
      );
    };

    return (
      <th
        ref={ref}
        className={headClasses}
        onClick={sortable ? onSort : undefined}
        scope="col"
        aria-sort={
          sortDirection === "asc" ? "ascending" :
          sortDirection === "desc" ? "descending" :
          sortable ? "none" : undefined
        }
        {...props}
      >
        <div className="flex items-center">
          {children}
          <SortIcon />
        </div>
      </th>
    );
  }
);

TableHead.displayName = "TableHead";

// Table Cell component
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  (
    {
      numeric = false,
      truncate = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const cellClasses = [
      tableCellVariants.base,
      numeric ? tableCellVariants.numeric : "",
      truncate ? tableCellVariants.truncate : "",
      className
    ].filter(Boolean).join(" ");

    return (
      <td
        ref={ref}
        className={cellClasses}
        {...props}
      >
        {children}
      </td>
    );
  }
);

TableCell.displayName = "TableCell";

// Table Caption component
export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  (
    {
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const captionClasses = [
      tableCaptionVariants.base,
      className
    ].filter(Boolean).join(" ");

    return (
      <caption
        ref={ref}
        className={captionClasses}
        {...props}
      >
        {children}
      </caption>
    );
  }
);

TableCaption.displayName = "TableCaption";

// Compound component interface
interface TableComponent extends React.ForwardRefExoticComponent<TableProps & React.RefAttributes<HTMLTableElement>> {
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Footer: typeof TableFooter;
  Row: typeof TableRow;
  Head: typeof TableHead;
  Cell: typeof TableCell;
  Caption: typeof TableCaption;
}

// Compound component pattern - attach sub-components to main Table
const TableWithSubComponents = TableRoot as TableComponent;
TableWithSubComponents.Header = TableHeader;
TableWithSubComponents.Body = TableBody;
TableWithSubComponents.Footer = TableFooter;
TableWithSubComponents.Row = TableRow;
TableWithSubComponents.Head = TableHead;
TableWithSubComponents.Cell = TableCell;
TableWithSubComponents.Caption = TableCaption;

export { TableWithSubComponents as Table };

// Export types for external use
export type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  TableCaptionProps,
  TableVariants
};