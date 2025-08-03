import { useRef, useState } from 'react';
import { uploadCV } from '../utils/api';
import { Button } from './ui/Button';

interface UploadButtonProps {
  onUploaded: (id: string) => void;
}

export function UploadButton({ onUploaded }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const res = await uploadCV(file);
      onUploaded(res.id);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
      <Button type="button" disabled={loading} onClick={() => inputRef.current?.click()}>
        {loading ? 'Uploading…' : 'Upload CV'}
      </Button>
    </div>
  );
}
