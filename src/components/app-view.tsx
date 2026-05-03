import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

export type AppViewProps = ViewProps & {
  className?: string;
};

export function AppView({ className, ...otherProps }: AppViewProps) {
  return <View className={cn('bg-white', className)} {...otherProps} />;
}
