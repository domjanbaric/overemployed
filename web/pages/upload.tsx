import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UploadButton } from '../components/UploadButton';
import { CVParsePreview } from '../components/CVParsePreview';
import { getCV, parseCV, CVData } from '../utils/api';

export default function UploadPage() {
  const router = useRouter();
  const [cv, setCv] = useState<CVData | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    const { id } = router.query;
    if (typeof id === 'string') {
      getCV(id).then((cvData) => {
        if (!cvData.parsed_json) {
          parseCV(id).then(setCv);
        } else {
          setCv(cvData);
        }
      });
    }
  }, [router.isReady, router.query.id]);

  async function handleUploaded(id: string) {
    const data = await parseCV(id);
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
