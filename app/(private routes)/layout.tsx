import React from "react";

interface PrivateLayoutProps {
  children: React.ReactNode;
  modal?: React.ReactNode;
}

export default function PrivateLayout({ children, modal }: PrivateLayoutProps) {
  return (
    <div className="private-layout-wrapper">
      {children}
      {modal}
    </div>
  );
}