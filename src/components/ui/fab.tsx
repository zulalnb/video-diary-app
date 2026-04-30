import Icon from '@expo/vector-icons/MaterialIcons';
import { ReactNode } from 'react';
import { Pressable, PressableProps } from 'react-native';

import { cn } from '@/lib/utils';

type FabProps = PressableProps & {
  children?: ReactNode;
  onPress?: () => void;
};

export function Fab({ children, className, onPress, ...props }: FabProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'absolute bottom-6 right-6 h-20 w-20 items-center justify-center rounded-full bg-indigo-500 shadow-lg',
        className
      )}
      {...props}>
      {children ?? <Icon name="add" size={30} color="white" />}
    </Pressable>
  );
}
