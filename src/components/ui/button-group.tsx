"use client";
import { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Children, cloneElement, ReactElement } from "react";

interface ButtonGroupProps {
  children: ReactElement<ButtonProps>[];
  className?: string;
}

export function ButtonGroup({ children, className }: ButtonGroupProps) {
  const totalButtons = Children.count(children);
  return (
    <div className={cn("flex", className)}>
      {Children.map(children, (child, index) => {
        const isFirst = index === 0;
        const isLast = index === totalButtons - 1;

        return cloneElement(child as ReactElement<any>, {
          className: cn(child.props.className, {
            "rounded-l-none": !isFirst,
            "rounded-r-none": !isLast,
            "border-l-0": !isFirst,
          }),
        });
      })}
    </div>
  );
}
