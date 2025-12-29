import React from "react";

export default function PrivateLayout(props: any) {
  return (
    <div className="private-layout-wrapper">
      {props.children}
      {props.modal}
    </div>
  );
}