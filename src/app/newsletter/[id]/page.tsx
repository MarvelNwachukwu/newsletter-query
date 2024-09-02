'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function NewsletterDetail({ params }: { params: { id: string } }) {
  const [newsletter, setNewsletter] = useState<any>(null);

  useEffect(() => {
    const fetchNewsletter = async () => {
      const docRef = doc(db, 'newsletters', params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNewsletter({ id: docSnap.id, ...docSnap.data() });
      }
    };
    fetchNewsletter();
  }, [params.id]);

  if (!newsletter) return <div>Loading...</div>;

  return (
    <div>
      <h1>{newsletter.title}</h1>
      <p>{newsletter.content}</p>
    </div>
  );
}