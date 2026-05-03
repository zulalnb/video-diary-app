import { Modal, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/ui/button';

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  visible,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 items-center justify-center">
        <View className="rounded-2xl bg-white p-12">
          <AppText type="title" className="mb-2">
            {title}
          </AppText>

          {description && <AppText className="mb-6 text-gray-500">{description}</AppText>}

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button
                title={cancelText}
                variant="secondary"
                onPress={onCancel}
                disabled={loading}
              />
            </View>

            <View className="flex-1">
              <Button
                title={confirmText}
                variant="destructive"
                onPress={onConfirm}
                loading={loading}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
