import { useState } from 'react';
import { exportPersona } from '../utils/api';
import { Button } from './ui/Button';

interface Props {
  personaId: string;
  template: string;
}

export function ExportButton({ personaId, template }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await exportPersona(personaId, template);
      window.open(res.url, '_blank');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" onClick={handleClick} disabled={loading}>
      {loading ? 'Exporting…' : 'Export'}
    </Button>
  );
}
