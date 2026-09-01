import React from 'react';
import { Info } from 'lucide-react';

interface AmazonDisclosureProps {
  text?: string;
}

export const AmazonDisclosure: React.FC<AmazonDisclosureProps> = ({ text }) => {
  const displayText =
    text ||
    'Some links on this website may be Amazon affiliate links. We may earn a commission if you make a purchase through these links, at no additional cost to you.';

  return (
    <div
      className="max-w-4xl mx-auto my-8 px-4"
      id="amazon-disclosure-container"
    >
      <div className="flex items-start gap-3 p-4 rounded-xl bg-stone-100/90 border border-stone-200/80 text-stone-600 text-xs sm:text-sm leading-relaxed">
        <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-stone-800 mr-1">Affiliate Disclosure:</strong>
          <span>{displayText}</span>
        </div>
      </div>
    </div>
  );
};
