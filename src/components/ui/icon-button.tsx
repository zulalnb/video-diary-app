import { cn } from '@/lib/utils';
import { Pressable, PressableProps } from 'react-native';

type IconButtonProps = {
  icon: React.ReactNode;
} & PressableProps;

export function IconButton({ icon, className, ...props }: IconButtonProps) {
  return (
    <Pressable
      hitSlop={8}
      className={cn('h-11 w-11 items-center justify-center rounded-full', className)}
      {...props}>
      {icon}
    </Pressable>
  );
}
