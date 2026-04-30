import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { VideoMetadataFormValues, videoMetadataSchema } from '@/schemas/metadata';

type MetadataFormProps = {
  isSubmitting?: boolean;
  onSubmit: (values: VideoMetadataFormValues) => void;
};

export function MetadataForm({ isSubmitting = false, onSubmit }: MetadataFormProps) {
  const { control, handleSubmit } = useForm<VideoMetadataFormValues>({
    resolver: zodResolver(videoMetadataSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  return (
    <View className="w-full gap-4">
      <View>
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Give this clip a name"
                error={error?.message}
              />
              <FieldError message={error?.message} />
            </Field>
          )}
        />
      </View>

      <View>
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Add a short note"
                error={error?.message}
              />
              <FieldError message={error?.message} />
            </Field>
          )}
        />
      </View>

      <Button
        title={isSubmitting ? 'Saving...' : 'Save'}
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
}
