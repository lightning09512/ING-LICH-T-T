import React from 'react';

interface FormattedContentProps {
  content: string;
}

export const FormattedContent: React.FC<FormattedContentProps> = ({ content }) => {
  const lines = content.split('\n');

  return (
    <div className="space-y-2 font-sans text-xs sm:text-sm text-gray-800 leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        // Check if it's a bullet point item starting with '- ' or '* '
        const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
        const rawText = isBullet ? trimmed.slice(2).trim() : trimmed;

        // Parse **bold** parts
        const parts = rawText.split(/(\*\*.*?\*\*)/g);

        if (isBullet) {
          return (
            <div 
              key={idx} 
              className="flex items-start gap-2.5 bg-amber-50/50 hover:bg-amber-100/60 p-3 rounded-xl border border-amber-200/80 transition-colors shadow-[1px_1px_0px_rgba(0,0,0,0.05)]"
            >
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
              <div className="flex-1 leading-relaxed">
                {parts.map((part, pIdx) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    const text = part.slice(2, -2);
                    return (
                      <span 
                        key={pIdx} 
                        className="font-black text-black bg-amber-200/80 px-1.5 py-0.5 rounded border border-amber-400 mr-1.5 inline-block text-xs sm:text-[13px]"
                      >
                        {text}
                      </span>
                    );
                  }
                  return <span key={pIdx}>{part}</span>;
                })}
              </div>
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={idx} className="leading-relaxed">
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={pIdx} className="font-black text-black">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return <span key={pIdx}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
};
