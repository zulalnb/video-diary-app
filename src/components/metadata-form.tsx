import { Controller, useFormContext } from 'react-hook-form';
import { Text, View } from 'react-native';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { VideoMetadataFormValues } from '@/validations/metadata';

export function MetadataForm() {
  const { control } = useFormContext<VideoMetadataFormValues>();

  return (
    <View className="gap-3">
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="Give this clip a name"
              error={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError message={fieldState.error?.message} />}
          </Field>
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>
              Description <Text className="text-sm italic text-gray-500">(Optional)</Text>
            </FieldLabel>
            <Textarea
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="Add a short note"
              error={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError message={fieldState.error?.message} />}
          </Field>
        )}
      />
    </View>
  );
}
