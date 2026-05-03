import { ActivityIndicator, Pressable, PressableProps, Text } from 'react-native';
import colors from 'tailwindcss/colors';

import { cn } from '@/lib/utils';

type ButtonProps = {
  title?: string;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  textClassName?: string;
} & PressableProps;

export function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  icon,
  iconPosition = 'start',
  className,
  textClassName,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const textStyle =
    variant === 'secondary'
      ? 'text-gray-800'
      : variant === 'ghost'
        ? 'text-indigo-500'
        : 'text-white';

  return (
    <Pressable
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center gap-2 rounded-xl px-5 py-3',
        variant === 'primary' && 'bg-indigo-500',
        variant === 'secondary' && 'bg-gray-200',
        variant === 'destructive' && 'bg-red-500',
        variant === 'ghost' && 'bg-transparent',
        isDisabled && 'opacity-50',
        className
      )}
      {...props}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'destructive' ? colors.white : colors.black}
        />
      ) : (
        <>
          {icon && iconPosition === 'start' && <>{icon}</>}
          {title && <Text className={cn('font-semibold', textStyle, textClassName)}>{title}</Text>}
          {icon && iconPosition === 'end' && <>{icon}</>}
        </>
      )}
    </Pressable>
  );
}
