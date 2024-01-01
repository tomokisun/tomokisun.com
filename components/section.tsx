import { Stack, StackProps } from '@chakra-ui/react';

const Section = (props: StackProps) => (
  <Stack
    mx={{ base: '1rem', md: 'auto' }}
    {...props}
  />
)

export default Section