import React from 'react';

export const Dialog: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }> = ({
  open,
  onOpenChange,
  children,
}) =>
  open ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6">{children}</div>
    </div>
  ) : null;

export const DialogContent: React.FC<{ children: React.ReactNode }> = ({ children }) => <div>{children}</div>;
export const DialogHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="mb-4">{children}</div>;
export const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h2 className="text-xl font-bold">{children}</h2>;
export const DialogFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-4 flex justify-end gap-2">{children}</div>
);