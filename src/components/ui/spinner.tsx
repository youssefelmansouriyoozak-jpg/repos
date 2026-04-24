import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, size, ...props }: React.ComponentProps<"svg"> & { size?: string | number }) {
  const sizeMap = {
    sm: "size-3",
    md: "size-4",
    lg: "size-8",
    xl: "size-12",
  };
  
  const sizeClass = typeof size === 'string' && size in sizeMap ? sizeMap[size as keyof typeof sizeMap] : undefined;
  const sizeValue = typeof size === 'number' ? size : undefined;

  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      size={sizeValue}
      className={cn("animate-spin", sizeClass || (!sizeValue && "size-4"), className)}
      {...props}
    />
  )
}

export { Spinner }
