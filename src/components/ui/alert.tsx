import { View } from 'react-native';

import { AppText } from '@/components/app-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { cn } from '@/lib/utils';
import colors from 'tailwindcss/colors';

type AlertProps = {
  title?: string;
  message: string;
  variant?: 'error' | 'warning' | 'info';
};

const alertStyles = {
  error: {
    container: 'border-red-200 bg-red-50',
    text: 'text-red-600',
    iconColor: colors.red[600],
    iconName: 'exclamationmark.circle',
  },
  warning: {
    container: 'border-amber-200 bg-amber-50',
    text: 'text-amber-700',
    iconColor: colors.amber[600],
    iconName: 'exclamationmark.triangle',
  },
  info: {
    container: 'border-blue-200 bg-blue-50',
    text: 'text-blue-700',
    iconColor: colors.blue[600],
    iconName: 'info.circle',
  },
} as const;

export function Alert({ title, message, variant = 'error' }: AlertProps) {
  const styles = alertStyles[variant];

  return (
    <View
      className={cn(
        'mt-3 flex-row gap-2 rounded-xl border p-3',
        styles.container,
        !title && 'items-center'
      )}>
      <IconSymbol name={styles.iconName} size={18} color={styles.iconColor} className="mt-0.5" />

      <View className="flex-1">
        {title && <AppText className={cn('text-sm font-medium', styles.text)}>{title}</AppText>}

        <AppText className={cn('text-sm', styles.text)}>{message}</AppText>
      </View>
    </View>
  );
}
