'use client';

import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Eraser, Check } from 'lucide-react';

interface SignaturePadProps {
  onSave: (signatureData: string) => void;
  disabled?: boolean;
}

export default function SignaturePad({ onSave, disabled }: SignaturePadProps) {
  const sigRef = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleClear = () => {
    sigRef.current?.clear();
    setIsEmpty(true);
  };

  const handleSave = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      const dataUrl = sigRef.current.toDataURL('image/png');
      onSave(dataUrl);
    }
  };

  return (
    <div className="space-y-3">
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        <SignatureCanvas
          ref={sigRef}
          penColor="black"
          canvasProps={{
            className: 'w-full h-48',
            style: { width: '100%', height: '192px' },
          }}
          onBegin={() => setIsEmpty(false)}
        />
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled}
          className="btn-secondary flex items-center gap-2 !py-2"
        >
          <Eraser className="w-4 h-4" />
          נקה
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={disabled || isEmpty}
          className="btn-primary flex items-center gap-2 !py-2"
        >
          <Check className="w-4 h-4" />
          אשר חתימה
        </button>
      </div>
    </div>
  );
}
