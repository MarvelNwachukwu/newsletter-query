'use client';
import { AddIcon } from '@chakra-ui/icons';
import { IconButton, useDisclosure } from '@chakra-ui/react';
import AddNewsletterPopup from './AddNewsletterPopup';

const NewLetterContainer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  return (
    <>
      <IconButton
        aria-label='Add newsletter'
        icon={<AddIcon />}
        onClick={onOpen}
        position='fixed'
        bottom={4}
        right={4}
        colorScheme='blue'
        size='lg'
        isRound
      />
      
      <AddNewsletterPopup isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default NewLetterContainer;
