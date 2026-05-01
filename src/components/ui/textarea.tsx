import { cn } from '@/lib/utils';
import { TextInput, TextInputProps } from 'react-native';

type TextareaProps = TextInputProps & {
  error?: boolean;
};

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <TextInput
      {...props}
      multiline
      textAlignVertical="top"
      className={cn(
        'rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900',
        'min-h-[100px]',
        error && 'border-red-500',
        className
      )}
      placeholderClassName="text-gray-400"
    />
  );
}
