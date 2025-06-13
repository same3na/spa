import { useEffect } from "react";

interface ModalComponentProps {
  isOpen: boolean
  onClose: () => void
  contents: React.ReactNode
}

export default function ModalComponent({isOpen, onClose, contents}: ModalComponentProps) {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Disable body scroll when modal is open
    } else {
      document.body.style.overflow = ''; // Enable body scroll when modal is closed
    }

    return () => {
      document.body.style.overflow = ''; // Cleanup on unmount
    };
  }, [isOpen]);


  useEffect(() => {
    const handleEscape = (e:any) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Only add the event listener if the modal is open
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    // Cleanup the event listener when the modal is closed
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  
  
  return (
    <>
      {/* Modal overlay with fade-in transition */}
      <div
        className={`fixed inset-0 bg-[rgba(0,0,0,0.75)] z-50 transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Modal content with slide-up transition */}
        <div
          className={`absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-950 p-6 rounded-lg w-4/5 h-4/5 max-w-screen-lg overflow-auto transition-transform duration-500 ease-out ${
            isOpen ? 'translate-y-0' : 'translate-y-10'
          }`}
        >
          <h2 className="text-lg font-bold">This is a Modal</h2>
          <p className="my-4">You can add any content you like here.</p>

          {/* Scrollable content */}
          <div className="h-full overflow-auto">
            {contents}
          </div>

          {/* <div className="flex justify-end mt-4">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={onClose} // Close modal using parent's onClose function
            >
              Close Modal
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
}