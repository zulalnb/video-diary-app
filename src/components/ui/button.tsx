import { cn } from '@/lib/utils';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import colors from 'tailwindcss/colors';

type ButtonProps = {
  title: string;
  variant?: 'primary' | 'secondary' | 'destructive';
  loading?: boolean;
} & TouchableOpacityProps;

export function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const textStyle = variant !== 'secondary' ? 'text-white' : 'text-gray-800';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      className={cn(
        'items-center justify-center rounded-xl px-5 py-3',
        variant === 'primary' && 'bg-indigo-500',
        variant === 'secondary' && 'bg-gray-200',
        variant === 'destructive' && 'bg-red-500',
        isDisabled && 'opacity-50',
        className
      )}
      {...props}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.black} />
      ) : (
        <Text className={cn('font-semibold', textStyle)}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
