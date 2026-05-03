import { Text, type TextProps } from 'react-native';

import { cn } from '@/lib/utils';

export type AppTextProps = TextProps & {
  className?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  center?: boolean;
};

export function AppText({ className, type = 'default', center = false, ...rest }: AppTextProps) {
  return (
    <Text
      className={cn(
        'text-neutral-900',
        type === 'default' && 'text-base leading-6',
        type === 'defaultSemiBold' && 'text-base font-semibold leading-6',
        type === 'title' && 'text-3xl font-bold leading-8',
        type === 'subtitle' && 'text-xl font-bold',
        type === 'link' && 'text-base leading-7 text-sky-300',
        center && 'text-center',
        className
      )}
      {...rest}
    />
  );
}
