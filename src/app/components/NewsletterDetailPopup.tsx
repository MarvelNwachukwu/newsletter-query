'use client';
import { useRef, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react';
import { toPng } from 'html-to-image';
import axios from 'axios';

interface NewsletterDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  newsletter: {
    title: string;
    content: string;
  } | null;
}

const NewsletterDetailPopup: React.FC<NewsletterDetailPopupProps> = ({
  isOpen,
  onClose,
  newsletter,
}) => {
  const quoteRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const [sharingQuote, setSharingQuote] = useState(false);

  if (!newsletter) return null;

  const generateShareImage = async () => {
    if (quoteRef.current === null) {
      return;
    }

    try {
      setSharingQuote(true);
      const dataUrl = await toPng(quoteRef.current);
      const blob = await (await fetch(dataUrl)).blob();
      const formData = new FormData();
      formData.append('image', blob);

      const response = await axios.post(
        'https://api.imgur.com/3/image',
        formData,
        {
          headers: {
            Authorization: `Client-ID ${process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID}`,
          },
          // http2: false, // Force HTTP/1.1
        }
      );

      const imageUrl = response.data.data.link;
      const tweetText = encodeURIComponent(
        `Check out this quote: ${newsletter.title}, find more at https://newslettersearch.vercel.app`
      );
      const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(
        imageUrl
      )}`;

      window.open(twitterUrl, '_blank');
    } catch (error) {
      console.error('Failed to generate image', error);

      toast({
        title: 'Failed to generate image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSharingQuote(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl'>
      <ModalOverlay />
      <ModalContent ref={quoteRef}>
        <ModalHeader>{newsletter.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text whiteSpace='pre-wrap'>{newsletter.content}</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme='green'
            onClick={generateShareImage}
            isLoading={sharingQuote}
          >
            Share
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewsletterDetailPopup;
