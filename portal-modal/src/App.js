import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default () => {
  const { open, openModal, closeModal } = useModal();

  return (
    <div className="App">
      <h1>Portal modals</h1>
      <button onClick={openModal}>Open</button>
      {open && (
        <Modal close={closeModal}>
          <h1>This is a Modal using portals!</h1>
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ children, close, render }) => (
  <Portal>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%"
      }}
    >
      <div
        style={{
          position: "relative",
          background: "white",
          borderRadius: "2px",
          padding: "15px",
          minWidth: "320px",
          maxWidth: "600px",
          maxHeight: "600px",
          zIndex: 10,
          boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.3)",
          marginBottom: "100px"
        }}
      >
        {/* {render(children) || children} */}
        {children}
        <hr />
        <button onClick={close}>Close</button>
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        background: "black",
        opacity: 0.5
      }}
    />
  </Portal>
);

const useModal = () => {
  const [open, onOpenModal] = useState(false);
  const [close, onCloseModal] = useState(false);

  const openModal = () => {
    onOpenModal(true);
  };

  const closeModal = () => {
    onCloseModal(true);
    onOpenModal(false);
  };

  return { open, close, openModal, closeModal };
};

const Portal = ({ children }) => {
  let modalRoot = document.getElementById("modal");

  if (!modalRoot) {
    modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", "modal");
    document.body.appendChild(modalRoot);
  }

  const modalElement = document.createElement("div");

  useEffect(() => {
    modalRoot.appendChild(modalElement);
    return () => modalRoot.removeChild(modalElement);
  });

  return createPortal(children, modalElement);
};
