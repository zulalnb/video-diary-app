import { TextInput, TextInputProps } from 'react-native';

import { cn } from '@/lib/utils';

type InputProps = TextInputProps & {
  error?: boolean;
};

export function Input({ className, error, ...props }: InputProps) {
  return (
    <TextInput
      {...props}
      textAlignVertical="center"
      className={cn(
        'h-12 rounded-xl border border-gray-300 px-4 py-0 text-base leading-5 text-gray-900',
        error && 'border-red-500',
        className
      )}
      placeholderClassName="text-gray-400"
    />
  );
}
