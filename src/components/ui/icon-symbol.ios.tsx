import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';

type IconSymbolName =
  | 'house.fill'
  | 'paperplane.fill'
  | 'chevron.left.forwardslash.chevron.right'
  | 'chevron.right'
  | 'xmark'
  | 'exclamationmark.circle'
  | 'video.slash'
  | 'gearshape'
  | 'checkmark.circle'
  | 'arrow.up.doc'
  | 'play.fill'
  | 'ellipsis'
  | 'pencil'
  | 'square.and.arrow.down'
  | 'square.and.arrow.up'
  | 'trash'
  | 'checkmark'
  | 'plus';

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
  className,
}: {
  name: SymbolViewProps['name'];
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
  className?: string;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      className={className}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
