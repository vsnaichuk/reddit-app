import { styled } from 'dripsy';
import { View } from 'react-native';

const StyledView = styled(View)((props: ISeparatorProps) => ({
  pt: props.size,
}));

interface ISeparatorProps {
  size: number;
}

export function Separator(props: ISeparatorProps) {
  return <StyledView {...props} />;
}
