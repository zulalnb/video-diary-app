import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
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

cssInterop(LinearGradient, {
  className: {
    target: 'style',
  },
});

cssInterop(SymbolView, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      color: 'tintColor',
    },
  },
});

cssInterop(MaterialIcons, {
  className: {
    target: 'style',
  },
});
