import { cn } from '@/helpers/tailwind.helpers';
import { Spinner } from '@nextui-org/react';
import type { ClassValue } from 'clsx';

export default function Loading({ className, ...props }: { className?: ClassValue }) {
  return (
    <Spinner
      label="Loading..."
      color="success"
      size="lg"
      className={cn('w-full h-full flex justify-center items-center', className)}
      classNames={{
        label: 'dark:text-[var(--background)] text-[var(--foreground)]',
      }}
      {...props}
    />
  );
}
