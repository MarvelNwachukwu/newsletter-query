'use client';

import { useState } from 'react';
import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  ListItem,
  Text,
  UnorderedList,
  useDisclosure,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import NewsletterDetailPopup from './NewsletterDetailPopup';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const lowercaseQuery = searchQuery.toLowerCase();

    // Retrieve a larger set of documents
    const contentQuery = query(
      collection(db, 'newsletters'),
      orderBy('contentLowercase'),
      limit(100) // Adjust the limit as needed
    );

    const titleQuery = query(
      collection(db, 'newsletters'),
      orderBy('titleLowercase'),
      limit(100) // Adjust the limit as needed
    );

    const [contentSnapshot, titleSnapshot] = await Promise.all([
      getDocs(contentQuery),
      getDocs(titleQuery),
    ]);

    const contentResults = contentSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const titleResults = titleSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const combinedResults = [...contentResults, ...titleResults];
    const uniqueResults = Array.from(
      new Set(combinedResults.map((item) => JSON.stringify(item)))
    ).map((item) => JSON.parse(item));

    // Client-side filtering for more accurate results
    const filteredResults = uniqueResults.filter(
      (item) =>
        item.content.toLowerCase().includes(lowercaseQuery) ||
        item.title.toLowerCase().includes(lowercaseQuery)
    );

    setResults(filteredResults);
    setIsLoading(false);
  };

  const handleNewsletterClick = (newsletter: any) => {
    setSelectedNewsletter(newsletter);
    onOpen();
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <InputGroup>
          <Input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search newsletters...'
          />
          <InputRightElement>
            <IconButton
              aria-label='Search'
              icon={<SearchIcon />}
              isLoading={isLoading}
              type='submit'
            />
          </InputRightElement>
        </InputGroup>
        {isLoading && <Text>Loading...</Text>}
      </form>
      <UnorderedList mt={4} spacing={4}>
        {results.map((result) => (
          <ListItem
            key={result.id}
            cursor='pointer'
            onClick={() => handleNewsletterClick(result)}
          >
            <h3>{result.title}</h3>
            <p>{result.content.substring(0, 100)}...</p>
          </ListItem>
        ))}
      </UnorderedList>

      <NewsletterDetailPopup
        isOpen={isOpen}
        onClose={onClose}
        newsletter={selectedNewsletter}
      />
    </div>
  );
};

export default Search;
