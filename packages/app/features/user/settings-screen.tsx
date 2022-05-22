import { View, Text } from 'dripsy'
import { createParam } from 'solito'
import { TextLink } from 'solito/link'

export function SettingsScreen() {
  return (
    <View sx={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextLink href="/">👈 Go Home</TextLink>
    </View>
  )
}
