import { Image } from 'expo-image';
import { VideoView } from 'expo-video';
import { cssInterop } from 'nativewind';

cssInterop(Image, { className: 'style' });
cssInterop(VideoView, { className: 'style' });
