import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UploadButton } from '../components/UploadButton';
import { CVParsePreview } from '../components/CVParsePreview';
import { getCV, CVData } from '../utils/api';

export default function UploadPage() {
  const router = useRouter();
  const [cv, setCv] = useState<CVData | null>(null);

  useEffect(() => {
    const { id } = router.query;
    if (typeof id === 'string') {
      getCV(id).then(setCv);
    }
  }, [router.query]);

  async function handleUploaded(id: string) {
    const data = await getCV(id);
    setCv(data);
    router.replace({ pathname: '/upload', query: { id } }, undefined, { shallow: true });
  }

  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Upload CV</h1>
      <UploadButton onUploaded={handleUploaded} />
      <CVParsePreview cv={cv} />
    </main>
  );
}
