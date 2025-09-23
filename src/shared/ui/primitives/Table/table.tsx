"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// ==================== Base Table Components ====================

const tableVariants = cva(
  "w-full caption-bottom",
  {
    variants: {
      density: {
        compact: "text-sm",
        comfortable: "text-base"
      },
      stickyHeader: {
        true: "",
        false: ""
      },
      interactiveRows: {
        true: "",
        false: ""
      }
    },
    defaultVariants: {
      density: "compact",
      stickyHeader: false,
      interactiveRows: false
    },
  }
)

const tableWrapperVariants = cva(
  "relative w-full overflow-auto @container",
  {
    variants: {
      stickyHeader: {
        true: "overflow-y-auto max-h-[calc(100vh-200px)]",
        false: ""
      }
    },
    defaultVariants: {
      stickyHeader: false
    },
  }
)

export interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  density?: "compact" | "comfortable"
  stickyHeader?: boolean
  interactiveRows?: boolean
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, density = "compact", stickyHeader = false, interactiveRows = false, ...props }, ref) => {
    return (
      <div className={cn(tableWrapperVariants({ stickyHeader }))} data-density={density}>
        <table 
          ref={ref} 
          className={cn(
            tableVariants({ density, stickyHeader, interactiveRows }), 
            className
          )} 
          role="table"
          {...props} 
        />
      </div>
    )
  }
)
Table.displayName = "Table"

// ==================== Table Header ====================

const tableHeaderVariants = cva(
  "[&_tr]:border-b border-border",
  {
    variants: {
      stickyHeader: {
        true: "sticky top-0 z-10 bg-background shadow-sm",
        false: ""
      }
    },
    defaultVariants: {
      stickyHeader: false
    },
  }
)

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement>,
    VariantProps<typeof tableHeaderVariants> {
  stickyHeader?: boolean
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, stickyHeader = false, ...props }, ref) => (
    <thead 
      ref={ref} 
      className={cn(tableHeaderVariants({ stickyHeader }), className)} 
      {...props} 
    />
  )
)
TableHeader.displayName = "TableHeader"

// ==================== Table Body ====================

const tableBodyVariants = cva(
  "[&_tr:last-child]:border-0 [&_tr]:transition-all [&_tr]:duration-200",
  {
    variants: {},
    defaultVariants: {},
  }
)

export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn(tableBodyVariants(), className)} {...props} />
  )
)
TableBody.displayName = "TableBody"

// ==================== Table Footer ====================

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot 
      ref={ref} 
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", 
        className
      )} 
      {...props} 
    />
  )
)
TableFooter.displayName = "TableFooter"

// ==================== Table Row ====================

const tableRowVariants = cva(
  "border-b border-border transition-all duration-200",
  {
    variants: {
      density: {
        compact: "h-10 sm:h-11",
        comfortable: "h-12 sm:h-14"
      },
      interactive: {
        true: "hover:bg-accent hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset cursor-pointer",
        false: ""
      },
      selected: {
        true: "bg-primary/10",
        false: ""
      }
    },
    defaultVariants: {
      density: "compact",
      interactive: false,
      selected: false
    },
  }
)

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement>,
    VariantProps<typeof tableRowVariants> {
  density?: "compact" | "comfortable"
  interactive?: boolean
  selected?: boolean
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, density = "compact", interactive = false, selected = false, ...props }, ref) => {
    const tableDensity = React.useMemo(() => {
      if (typeof document !== 'undefined' && ref && typeof ref !== 'function' && ref.current) {
        return ref.current.closest('[data-density]')?.getAttribute('data-density') as "compact" | "comfortable" | null
      }
      return null
    }, [ref])
    
    const finalDensity = density || tableDensity || "compact"
    
    return (
      <tr 
        ref={ref} 
        className={cn(tableRowVariants({ density: finalDensity, interactive, selected }), className)} 
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? "button" : undefined}
        aria-selected={selected || undefined}
        {...props} 
      />
    )
  }
)
TableRow.displayName = "TableRow"

// ==================== Table Head ====================

const tableHeadVariants = cva(
  "text-left align-middle font-medium text-muted-foreground uppercase tracking-wider [&:has([role=checkbox])]:pr-0",
  {
    variants: {
      density: {
        compact: "h-8 sm:h-9 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs",
        comfortable: "h-10 sm:h-11 px-3 sm:px-3.5 py-2 sm:py-3 text-xs sm:text-[13px]"
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right"
      },
      responsive: {
        "hide-sm": "hidden sm:table-cell",
        "hide-md": "hidden md:table-cell",
        "hide-lg": "hidden lg:table-cell",
        "show": ""
      },
      sortable: {
        true: "cursor-pointer select-none hover:bg-muted/50",
        false: ""
      }
    },
    defaultVariants: {
      density: "compact",
      align: "left",
      responsive: "show",
      sortable: false
    },
  }
)

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement>,
    VariantProps<typeof tableHeadVariants> {
  density?: "compact" | "comfortable"
  align?: "left" | "center" | "right"
  responsive?: "hide-sm" | "hide-md" | "hide-lg" | "show"
  sortable?: boolean
  sorted?: "asc" | "desc" | false
  onSort?: () => void
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ 
    className, 
    density = "compact", 
    align = "left", 
    responsive = "show", 
    sortable = false,
    sorted = false,
    onSort,
    children,
    ...props 
  }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (sortable && onSort && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        onSort()
      }
    }
    
    return (
      <th
        ref={ref}
        className={cn(
          tableHeadVariants({ density, align, responsive, sortable }),
          className
        )}
        onClick={sortable ? onSort : undefined}
        onKeyDown={handleKeyDown}
        tabIndex={sortable ? 0 : undefined}
        role={sortable ? "button" : undefined}
        aria-sort={sorted ? (sorted === "asc" ? "ascending" : "descending") : undefined}
        {...props}
      >
        <div className="flex items-center gap-1">
          {children}
          {sortable && (
            <span className="ml-1 text-xs">
              {sorted === "asc" ? "↑" : sorted === "desc" ? "↓" : "↕"}
            </span>
          )}
        </div>
      </th>
    )
  }
)
TableHead.displayName = "TableHead"

// ==================== Table Cell ====================

const tableCellVariants = cva(
  "align-middle [&:has([role=checkbox])]:pr-0",
  {
    variants: {
      density: {
        compact: "px-2.5 sm:px-3 py-1.5 sm:py-2",
        comfortable: "px-3 sm:px-3.5 py-2 sm:py-3"
      },
      variant: {
        primary: "text-[15px] font-semibold text-foreground",
        secondary: "text-sm text-foreground",
        meta: "text-[13px] text-muted-foreground tabular-nums",
        default: "text-sm text-foreground"
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right"
      },
      truncate: {
        true: "truncate max-w-[200px]",
        false: ""
      },
      responsive: {
        "hide-sm": "hidden sm:table-cell",
        "hide-md": "hidden md:table-cell",
        "hide-lg": "hidden lg:table-cell",
        "show": ""
      }
    },
    defaultVariants: {
      density: "compact",
      variant: "default",
      align: "left",
      truncate: false,
      responsive: "show"
    },
  }
)

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement>,
    VariantProps<typeof tableCellVariants> {
  density?: "compact" | "comfortable"
  variant?: "primary" | "secondary" | "meta" | "default"
  align?: "left" | "center" | "right"
  truncate?: boolean
  responsive?: "hide-sm" | "hide-md" | "hide-lg" | "show"
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ 
    className, 
    density = "compact", 
    variant = "default", 
    align = "left", 
    truncate = false, 
    responsive = "show", 
    children, 
    ...props 
  }, ref) => {
    // Add title for truncated content
    const cellProps = truncate && typeof children === 'string' 
      ? { ...props, title: children }
      : props
    
    return (
      <td 
        ref={ref} 
        className={cn(
          tableCellVariants({ density, variant, align, truncate, responsive }),
          className
        )}
        {...cellProps}
      >
        {children}
      </td>
    )
  }
)
TableCell.displayName = "TableCell"

// ==================== Table Caption ====================

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption 
      ref={ref} 
      className={cn("mt-4 text-sm text-muted-foreground", className)} 
      {...props} 
    />
  )
)
TableCaption.displayName = "TableCaption"

// ==================== Table Pagination ====================

export interface TablePaginationProps {
  currentItems: number
  totalItems: number
  itemsPerPage: number
  currentPage: number
  totalPages: number
  onItemsPerPageChange?: (value: number) => void
  onPageChange?: (page: number) => void
  className?: string
  pageSizeOptions?: number[]
}

const TablePagination = React.forwardRef<HTMLDivElement, TablePaginationProps>(
  ({ 
    currentItems, 
    totalItems, 
    itemsPerPage, 
    currentPage, 
    totalPages, 
    onItemsPerPageChange, 
    onPageChange, 
    className,
    pageSizeOptions = [10, 25, 50, 100],
    ...props 
  }, ref) => {
    const [isChangingPage, setIsChangingPage] = React.useState(false)
    
    const handlePageChange = React.useCallback((page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) return
      
      setIsChangingPage(true)
      onPageChange?.(page)
      
      // Reset loading state after animation
      setTimeout(() => setIsChangingPage(false), 300)
    }, [currentPage, totalPages, onPageChange])
    
    // Generate page numbers to display
    const getPageNumbers = () => {
      const delta = 2
      const range: number[] = []
      const rangeWithDots: (number | string)[] = []
      let l: number | undefined
      
      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
          range.push(i)
        }
      }
      
      range.forEach((i) => {
        if (l !== undefined) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1)
          } else if (i - l !== 1) {
            rangeWithDots.push('...')
          }
        }
        rangeWithDots.push(i)
        l = i
      })
      
      return rangeWithDots
    }
    
    return (
      <div 
        ref={ref} 
        className={cn(
          "relative border-t p-4",
          className
        )} 
        role="navigation"
        aria-label="Pagination Navigation"
        aria-busy={isChangingPage}
        {...props}
      >
        {/* Loading overlay */}
        {isChangingPage && (
          <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center z-10 bg-background/50">
            <div className="flex items-center gap-2 text-primary">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-medium">Loading...</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left side - Results info */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-semibold">{currentItems}</span> of <span className="font-semibold">{totalItems}</span> items
            </div>
            
            {/* Screen reader announcement */}
            <span className="sr-only" aria-live="polite" aria-atomic="true">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          {/* Right side - Controls */}
          <div className="flex items-center gap-4">
            {/* Items per page selector */}
            {onItemsPerPageChange && (
              <div className="flex items-center gap-2">
                <label htmlFor="items-per-page" className="text-sm text-muted-foreground">Show</label>
                <select
                  id="items-per-page"
                  value={itemsPerPage}
                  onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                  className="h-8 w-[70px] rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {pageSizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Page selector */}
            <div className="flex items-center gap-2 hidden sm:flex">
              <label htmlFor="page-select" className="text-sm text-muted-foreground whitespace-nowrap">Page:</label>
              <select
                id="page-select"
                value={currentPage}
                onChange={(e) => handlePageChange(Number(e.target.value))}
                disabled={totalPages === 0}
                className="h-8 w-[70px] rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            
            {/* Page navigation */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center justify-center p-2 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed border border-input min-h-[36px] min-w-[36px] text-muted-foreground hover:text-primary hover:bg-accent disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                aria-label="Go to previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Page numbers */}
              <div className="hidden sm:flex items-center gap-1">
                {getPageNumbers().map((pageNum, index) => {
                  if (pageNum === '...') {
                    return (
                      <span key={`dots-${index}`} className="px-2 text-muted-foreground">
                        ...
                      </span>
                    )
                  }
                  
                  const page = pageNum as number
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        "px-3 py-1 text-sm font-medium rounded-lg transition-colors duration-200 min-h-[36px]",
                        currentPage === page 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-transparent text-muted-foreground hover:text-primary hover:bg-accent"
                      )}
                      aria-label={`Go to page ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
              
              {/* Mobile: Current page indicator */}
              <span className="sm:hidden px-3 py-1 text-sm text-muted-foreground">
                {currentPage} / {totalPages}
              </span>
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex items-center justify-center p-2 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed border border-input min-h-[36px] min-w-[36px] text-muted-foreground hover:text-primary hover:bg-accent disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                aria-label="Go to next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
)
TablePagination.displayName = "TablePagination"

// ==================== Specialized Table Cell Components ====================

interface TableCellPlateProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
  href?: string
}

const TableCellPlate = React.forwardRef<HTMLTableCellElement, TableCellPlateProps>(
  ({ className, children, href, align, ...props }, ref) => {
    const validAlign = align && (align === "left" || align === "center" || align === "right") ? align : undefined
    return (
    <TableCell ref={ref} variant="primary" className={className} {...(validAlign && { align: validAlign })} {...props}>
      {href ? (
        <a 
          href={href} 
          className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded"
        >
          {children}
        </a>
      ) : (
        children
      )}
    </TableCell>
    )
  }
)
TableCellPlate.displayName = "TableCellPlate"

interface TableCellVehicleInfoProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  make: string
  model: string
  color: string
}

const TableCellVehicleInfo = React.forwardRef<HTMLTableCellElement, TableCellVehicleInfoProps>(
  ({ className, make, model, color, align, ...props }, ref) => {
    const validAlign = align && (align === "left" || align === "center" || align === "right") ? align : undefined
    return (
    <TableCell ref={ref} variant="secondary" className={className} {...(validAlign && { align: validAlign })} {...props}>
      <span className="flex items-center gap-1">
        <span>{make}</span>
        <span className="text-muted-foreground">·</span>
        <span>{model}</span>
        <span className="text-muted-foreground">·</span>
        <span>{color}</span>
      </span>
    </TableCell>
    )
  }
)
TableCellVehicleInfo.displayName = "TableCellVehicleInfo"

interface TableCellMetaProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  label?: string
  value: string
  icon?: React.ReactNode
  responsive?: "hide-sm" | "hide-md" | "hide-lg" | "show"
}

const TableCellMeta = React.forwardRef<HTMLTableCellElement, TableCellMetaProps>(
  ({ className, label, value, icon, responsive = "show", align, ...props }, ref) => {
    const validAlign = align && (align === "left" || align === "center" || align === "right") ? align : undefined
    return (
    <TableCell ref={ref} variant="meta" truncate responsive={responsive} className={className} {...(validAlign && { align: validAlign })} {...props}>
      <span className="flex items-center gap-1">
        {icon && <span className="w-3.5 h-3.5 text-muted-foreground">{icon}</span>}
        {label && <span className="text-muted-foreground">{label}:</span>}
        <span className="tabular-nums">{value}</span>
      </span>
    </TableCell>
    )
  }
)
TableCellMeta.displayName = "TableCellMeta"

interface TableCellBadgeProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "danger" | "info"
}

const TableCellBadge = React.forwardRef<HTMLTableCellElement, TableCellBadgeProps>(
  ({ className, children, variant = "default", align, ...props }, ref) => {
    const badgeStyles = {
      default: "bg-muted text-muted-foreground",
      success: "bg-green-500/10 text-green-700 dark:text-green-400",
      warning: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
      danger: "bg-red-500/10 text-red-700 dark:text-red-400",
      info: "bg-blue-500/10 text-blue-700 dark:text-blue-400"
    }
    const validAlign = align && (align === "left" || align === "center" || align === "right") ? align : undefined
    
    return (
      <TableCell ref={ref} className={className} {...(validAlign && { align: validAlign })} {...props}>
        <span className={cn(
          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
          badgeStyles[variant]
        )}>
          {children}
        </span>
      </TableCell>
    )
  }
)
TableCellBadge.displayName = "TableCellBadge"

interface TableCellActionProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
}

const TableCellAction = React.forwardRef<HTMLTableCellElement, TableCellActionProps>(
  ({ className, children, align, ...props }, ref) => {
    const validAlign = align && (align === "left" || align === "center" || align === "right") ? align : "right"
    return (
    <TableCell ref={ref} align={validAlign} className={className} {...props}>
      {children}
    </TableCell>
    )
  }
)
TableCellAction.displayName = "TableCellAction"

interface TableCellStatusProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  status: "available" | "unavailable" | "maintenance" | "reserved" | string
  label?: string
}

const TableCellStatus = React.forwardRef<HTMLTableCellElement, TableCellStatusProps>(
  ({ className, status, label, align, ...props }, ref) => {
    const statusStyles = {
      available: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
      unavailable: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
      maintenance: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
      reserved: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
      default: "bg-muted text-muted-foreground border-border"
    }
    const validAlign = align && (align === "left" || align === "center" || align === "right") ? align : undefined
    
    return (
      <TableCell ref={ref} className={className} {...(validAlign && { align: validAlign })} {...props}>
        <span className={cn(
          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
          statusStyles[status as keyof typeof statusStyles] || statusStyles.default
        )}>
          {label || status}
        </span>
      </TableCell>
    )
  }
)
TableCellStatus.displayName = "TableCellStatus"

// ==================== Table Button Component ====================

interface TableButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"
  size?: "compact" | "comfortable"
}

const TableButton = React.forwardRef<HTMLButtonElement, TableButtonProps>(
  ({ className, variant = "primary", size = "compact", children, ...props }, ref) => {
    const buttonStyles = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-muted text-foreground hover:bg-muted/80",
      ghost: "bg-transparent text-foreground hover:bg-accent"
    }
    
    const sizeStyles = {
      compact: "h-7 px-3 text-xs",
      comfortable: "h-9 px-4 text-sm"
    }
    
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          buttonStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
TableButton.displayName = "TableButton"

// ==================== Responsive Table Cell Component ====================

interface TableCellResponsiveProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  hideOnMobile?: boolean
  children: React.ReactNode
}

const TableCellResponsive = React.forwardRef<HTMLTableCellElement, TableCellResponsiveProps>(
  ({ className, hideOnMobile = false, children, align, ...props }, ref) => {
    const validAlign = align && (align === "left" || align === "center" || align === "right") ? align : undefined
    return (
    <TableCell 
      ref={ref} 
      className={cn(
        hideOnMobile && "hidden sm:table-cell",
        className
      )} 
      {...(validAlign && { align: validAlign })}
      {...props}
    >
      {children}
    </TableCell>
    )
  }
)
TableCellResponsive.displayName = "TableCellResponsive"

// ==================== Exports ====================

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TablePagination,
  // Specialized cells
  TableCellPlate,
  TableCellVehicleInfo,
  TableCellMeta,
  TableCellBadge,
  TableCellAction,
  TableCellStatus,
  TableButton,
  TableCellResponsive,
}