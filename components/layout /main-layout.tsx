import { Stack, StackProps } from '@chakra-ui/react'

const MainLayout = (props: StackProps) => (
  <Stack
    width="100%"
    maxWidth="48rem"
    {...props}
  />
)

export default MainLayout
