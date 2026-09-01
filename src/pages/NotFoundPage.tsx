import React from 'react';
import { ArrowLeft, Compass } from 'lucide-react';

interface NotFoundPageProps {
  onBackToHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onBackToHome }) => {
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-6 text-center" id="page-not-found">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-6 shadow-xs">
        <Compass className="w-8 h-8 stroke-[1.5]" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-1">
        Error 404
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-3">
        Page not found
      </h1>

      <p className="text-sm text-stone-600 max-w-sm mx-auto mb-8 leading-relaxed">
        The page you are looking for does not exist or has been moved.
      </p>

      <button
        onClick={onBackToHome}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm transition-colors shadow-sm"
        id="btn-404-back-home"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>
    </div>
  );
};
