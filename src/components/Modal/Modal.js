import React from 'react';
import ReactDOM from 'react-dom';
import { Transition } from '@headlessui/react';
// import './modal.css'; // Import the custom CSS for animations
const Modal = ({ showModal, setShowModal, children }) => {
    // Handle click outside modal content
    const handleOverlayClick = (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        setShowModal(false);
      }
    };
  
    return ReactDOM.createPortal(
      <Transition
        show={showModal}
        enter="modal-enter"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="modal-exit"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className="modal-overlay"
          onClick={handleOverlayClick}
        >
          <div className="modal-content dark:border-strokedark dark:bg-boxdark">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {children}
          </div>
        </div>
      </Transition>,
      document.body
    );
  };
  
  export default Modal;