import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  titleClassName?: string;
  headerContent?: React.ReactNode; // Conteúdo customizado para o header, além do título
  footerContent?: React.ReactNode; // Conteúdo para o rodapé do card
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  title,
  titleClassName = 'text-lg font-semibold text-gray-800',
  headerContent,
  footerContent,
}) => {
  const baseCardClass = "bg-white shadow-md rounded-lg overflow-hidden";

  return (
    <div className={`${baseCardClass} ${className}`}>
      {(title || headerContent) && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          {title && !headerContent && <h3 className={titleClassName}>{title}</h3>}
          {headerContent && <>{headerContent}</>}
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
      {footerContent && (
        <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
          {footerContent}
        </div>
      )}
    </div>
  );
};