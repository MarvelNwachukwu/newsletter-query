import { Text, VStack } from '@chakra-ui/react';
import Search from './components/search';
import NewLetterContainer from './components/NewLetterContainer';

export default function Home() {
  return (
    <VStack
      minH='100vh'
      justifyContent='center'
      alignItems='center'
      px={10}
      py={10}
      gap={10}
    >
      <VStack>
        <Text fontSize='4xl' fontWeight='bold' textAlign={'center'}>
          Newsletter Search
        </Text>
        <Text fontSize='xl' fontWeight='bold' textAlign={'center'}>
          Search for a newsletter by title, author, or content.
        </Text>
      </VStack>
      <Search />

      <NewLetterContainer />
    </VStack>
  );
}
