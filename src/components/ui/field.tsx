import { Text, TextProps, View, ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

type FieldProps = ViewProps & {
  className?: string;
};

export function Field({ children, className, ...props }: FieldProps) {
  return (
    <View className={cn('w-full gap-1', className)} {...props}>
      {children}
    </View>
  );
}

type FieldLabelProps = TextProps & {
  className?: string;
};

export function FieldLabel({ children, className, ...props }: FieldLabelProps) {
  return (
    <Text className={cn('text-sm font-medium text-gray-700', className)} {...props}>
      {children}
    </Text>
  );
}

type FieldErrorProps = TextProps & {
  message?: string;
  className?: string;
};

export function FieldError({ message, className, ...props }: FieldErrorProps) {
  if (!message) return null;

  return (
    <Text className={cn('text-xs text-red-500', className)} {...props}>
      {message}
    </Text>
  );
}
