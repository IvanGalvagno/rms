"use client";

import React, { useId } from "react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string | string[] | null;
    wrapperClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    errorClassName?: string;
    required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
    {
      label,
      name,
      type = 'text',
      error,
      wrapperClassName = 'mb-4',
      labelClassName = 'block text-sm font-medium text-gray-700 mb-1',
      inputClassName, // Permite customização total do input
      errorClassName = 'mt-1 text-xs text-red-600',
      className, // Adicionado para permitir classes no elemento input diretamente
      ...props
    },
    ref
  ) => {
    const id = useId(); // Gera um ID único para associar label e input
    const fieldId = props.id || `${name}-${id}`;

    const defaultInputClass = `block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm`;
    const errorInputClass = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500';

    const combinedInputClassName = `${defaultInputClass} ${errorInputClass} ${inputClassName || ''} ${className || ''}`;

    const displayError = Array.isArray(error) ? error.join(', ') : error;

    return (
      <div className={wrapperClassName}>
        {label && <label htmlFor={fieldId} className={labelClassName}>{label}</label>}
        <input
          ref={ref}
          id={fieldId}
          name={name}
          type={type}
          className={combinedInputClassName.trim()}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...props}
        />
        {displayError && <p id={`${fieldId}-error`} className={errorClassName}>{displayError}</p>}
      </div>
    );
  }
)