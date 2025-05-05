import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// TODO: Obter a URL dinamicamente, talvez via query params ou estado global
const PROPOSAL_URL = "https://villa.segfy.com/Publico/Segurados/Orcamentos/SolicitarCotacao?e=P6pb0nbwjHfnbNxXuNGlxw%3D%3D";

export default function ProposalView() {
  const [, setLocation] = useLocation();

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <div className="mb-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Visualizar Proposta</h1>
      </div>
      <div className="flex-grow border rounded-lg overflow-hidden">
        <iframe
          src={PROPOSAL_URL}
          title="Visualização da Proposta"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}