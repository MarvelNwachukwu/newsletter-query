'use client';
import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

interface AddNewsletterPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddNewsletterPopup: React.FC<AddNewsletterPopupProps> = ({
  isOpen,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const duplicate = await checkForDuplicate();

    if (duplicate) {
      toast({
        title: 'Duplicate newsletter',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await addDoc(collection(db, 'newsletters'), {
        title,
        content,
        titleLowercase: title.toLowerCase(),
        contentLowercase: content.toLowerCase(),
      });
      toast({
        title: 'Newsletter added',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setTitle('');
      setContent('');
    } catch (error) {
      toast({
        title: 'Error adding newsletter',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkForDuplicate = async () => {
    const lowercaseTitle = title.toLowerCase();
    const lowercaseContent = content.toLowerCase();

    const querySnapshot = await getDocs(collection(db, 'newsletters'));
    const newsletters = querySnapshot.docs.map((doc) => doc.data());
    const duplicate = newsletters.find(
      (newsletter) =>
        newsletter.titleLowercase === lowercaseTitle &&
        newsletter.contentLowercase === lowercaseContent
    );
    return duplicate;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Newsletter</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Content</FormLabel>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              type='submit'
              isLoading={isLoading}
            >
              Add Newsletter
            </Button>
            <Button variant='ghost' onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddNewsletterPopup;
