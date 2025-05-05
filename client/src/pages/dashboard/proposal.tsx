import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PROPOSAL_URL = "https://villa.segfy.com/Publico/Segurados/Orcamentos/SolicitarCotacao?e=P6pb0nbwjHfnbNxXuNGlxw%3D%3D";

export default function DashboardProposal() {
  const [, setLocation] = useLocation();

  return (
    <div className="container p-4 pb-24">
      <div className="mb-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => setLocation('/dashboard')} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Cotação de Seguro</h1>
      </div>
      <div className="h-[calc(100vh-200px)] border rounded-lg overflow-hidden">
        <iframe
          src={PROPOSAL_URL}
          title="Cotação de Seguro"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}