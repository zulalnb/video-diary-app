import { Image } from 'expo-image';
import { VideoView } from 'expo-video';
import { cssInterop } from 'nativewind';
import { TextInput } from 'react-native';

cssInterop(Image, { className: 'style' });
cssInterop(VideoView, { className: 'style' });

cssInterop(TextInput, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      textAlign: true,
    },
  },
  placeholderClassName: {
    target: false,
    nativeStyleToProp: {
      color: 'placeholderTextColor',
    },
  },
  selectionClassName: {
    target: false,
    nativeStyleToProp: {
      color: 'selectionColor',
    },
  },
});
