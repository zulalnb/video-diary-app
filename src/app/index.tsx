import { Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="mb-2 text-xl font-semibold">No videos yet</Text>

      <Text className="mb-6 text-center text-gray-500">
        Add your first video to start creating memories.
      </Text>

      <TouchableOpacity className="rounded-xl bg-indigo-500 px-6 py-3">
        <Text className="font-medium text-white">Add Video</Text>
      </TouchableOpacity>
    </View>
  );
}
