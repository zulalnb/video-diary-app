import { AppText } from '@/components/app-text';
import { Button } from '@/components/ui/button';
import { Link } from 'expo-router';
import { View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <AppText type="title" className="mb-2 text-center">
        No videos yet
      </AppText>
      <AppText className="mb-4 text-center">
        Add your first video to start creating memories.
      </AppText>

      <Link href="/modal" asChild>
        <Button title="Add Video" />
      </Link>
    </View>
  );
}
