"use client"

import * as React from "react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

import {
  CheckIcon,
  ChevronRightIcon,
} from "lucide-react"

function DropdownMenu({
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Root
      data-slot="dropdown-menu"
      {...props}
    />
  );
}

function DropdownMenuPortal({
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Portal
      data-slot="dropdown-menu-portal"
      {...props}
    />
  );
}

function DropdownMenuTrigger({
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  align = "start",
  sideOffset = 8,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Portal>

      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        align={align}
        className={cn(

          // BASE
          "z-50",

          // SIZE
          "min-w-[280px]",
          "max-h-(--radix-dropdown-menu-content-available-height)",

          // DESIGN
          "overflow-hidden rounded-3xl",
          "border border-slate-200/80",
          "bg-white/95 backdrop-blur-xl",

          // SHADOW
          "shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)]",

          // SPACING
          "p-2",

          // TEXT
          "text-slate-700",

          // ANIMATION
          "origin-(--radix-dropdown-menu-content-transform-origin)",
          "duration-200",
          "data-open:animate-in",
          "data-open:fade-in-0",
          "data-open:zoom-in-95",
          "data-closed:animate-out",
          "data-closed:fade-out-0",
          "data-closed:zoom-out-95",

          // SLIDE
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",

          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Group
      data-slot="dropdown-menu-group"
      {...props}
    />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(

        // BASE
        "group/dropdown-menu-item relative flex cursor-default items-center",

        // SIZE
        "min-h-[52px]",

        // SPACING
        "gap-3 rounded-2xl px-4 py-3",

        // TEXT
        "text-[15px] font-medium text-slate-700",

        // EFFECTS
        "outline-hidden select-none transition-all duration-200",

        // HOVER
        "hover:bg-blue-50 hover:text-blue-700",

        // FOCUS
        "focus:bg-blue-50 focus:text-blue-700",

        // ACTIVE
        "active:scale-[0.98]",

        // INSET
        "data-inset:pl-10",

        // DESTRUCTIVE
        "data-[variant=destructive]:text-red-600",
        "data-[variant=destructive]:hover:bg-red-50",
        "data-[variant=destructive]:focus:bg-red-50",

        // DISABLED
        "data-disabled:pointer-events-none",
        "data-disabled:opacity-50",

        // ICONS
        "[&_svg]:pointer-events-none",
        "[&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-5",

        className
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      checked={checked}
      className={cn(

        "relative flex min-h-[52px] cursor-default items-center gap-3 rounded-2xl",
        "py-3 pr-10 pl-4",
        "text-[15px] font-medium text-slate-700",
        "outline-hidden select-none transition-all duration-200",

        "hover:bg-blue-50 hover:text-blue-700",
        "focus:bg-blue-50 focus:text-blue-700",

        "data-inset:pl-10",
        "data-disabled:pointer-events-none",
        "data-disabled:opacity-50",

        "[&_svg]:pointer-events-none",
        "[&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-5",

        className
      )}
      {...props}
    >

      <span
        className="pointer-events-none absolute right-4 flex items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="h-4 w-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>

      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(

        "relative flex min-h-[52px] cursor-default items-center gap-3 rounded-2xl",
        "py-3 pr-10 pl-4",
        "text-[15px] font-medium text-slate-700",
        "outline-hidden select-none transition-all duration-200",

        "hover:bg-blue-50 hover:text-blue-700",
        "focus:bg-blue-50 focus:text-blue-700",

        "data-inset:pl-10",
        "data-disabled:pointer-events-none",
        "data-disabled:opacity-50",

        "[&_svg]:pointer-events-none",
        "[&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-5",

        className
      )}
      {...props}
    >

      <span
        className="pointer-events-none absolute right-4 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="h-4 w-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>

      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(

        // SPACING
        "px-4 pt-3 pb-2",

        // TEXT
        "text-xs font-black uppercase tracking-[0.18em]",
        "text-slate-400",

        // INSET
        "data-inset:pl-10",

        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(
        "my-2 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-xs font-semibold tracking-wider text-slate-400",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Sub
      data-slot="dropdown-menu-sub"
      {...props}
    />
  );
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(

        "flex min-h-[52px] cursor-default items-center gap-3 rounded-2xl",
        "px-4 py-3",
        "text-[15px] font-medium text-slate-700",
        "outline-hidden select-none transition-all duration-200",

        "hover:bg-blue-50 hover:text-blue-700",
        "focus:bg-blue-50 focus:text-blue-700",

        "data-inset:pl-10",
        "data-open:bg-blue-50 data-open:text-blue-700",

        "[&_svg]:pointer-events-none",
        "[&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-5",

        className
      )}
      {...props}
    >

      {children}

      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(

        "z-50 min-w-[240px]",
        "overflow-hidden rounded-3xl",
        "border border-slate-200/80",
        "bg-white/95 backdrop-blur-xl",

        "p-2 text-slate-700",

        "shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)]",

        "origin-(--radix-dropdown-menu-content-transform-origin)",
        "duration-200",

        "data-open:animate-in",
        "data-open:fade-in-0",
        "data-open:zoom-in-95",

        "data-closed:animate-out",
        "data-closed:fade-out-0",
        "data-closed:zoom-out-95",

        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}