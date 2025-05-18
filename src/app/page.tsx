'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const getEmails = async () => {
    setLoading(true);
    setEmails([]);
    try {
      const urls = inputValue
        .split(',')
        .map((url) => url.trim())
        .filter((url) => url.length > 0);
      const res = await fetch('/api/get-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
      });
      const data = await res.json();
      setEmails(data.emails || []);
    } catch {
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (emails.length === 0) return;
    const textToCopy = emails.join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    setTextValue(inputValue);
  }, [inputValue]);

  return (
    <div className="flex flex-col gap-5 p-5 justify-center items-center h-screen">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-end justify-center gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">
              URLs:
              <input
                className="input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="https://www.exemplo.com.br"
              />
            </label>
          </div>
          <button
            className="btn btn-primary"
            onClick={getEmails}
            disabled={loading}
          >
            {loading ? 'Buscando...' : 'Capturar Emails'}
          </button>
        </div>
        <span className="text-sm text-gray-500">
          Digite as URLs separadas por vírgula
        </span>
      </div>

      <div className="flex flex-col w-[280px] h-[500px] overflow-x-auto text-white border border-gray-500 rounded-md p-2">
        {emails.length > 0 && (
          <button
            className="btn btn-success mb-2"
            onClick={handleCopy}
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        )}
        {emails.length > 0
          ? emails.map((email) => <p key={email}>{email}</p>)
          : textValue && !loading && <p>Nenhum e-mail encontrado.</p>}
      </div>
    </div>
  );
}
