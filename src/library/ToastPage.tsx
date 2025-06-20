import toast, { ToastBar, Toaster } from "react-hot-toast";

export default function ToastPage() {
  return (
    <Toaster
      position="bottom-right"
      // reverseOrder={true}
      gutter={8}
      containerClassName="absolute"
      toastOptions={{
        // opciones por defecto
        className: 'relative',
        duration: 2000,
        removeDelay: 2500,
        style: {
          border: '1px solid #f1f2f3',
          background: '#363636',
          color: '#fff',
          borderRadius: '6px',
        },

        // opciones por tipos de respuestas
        success: {
          style: {
            background: '#1a1a1a',
            color: '#D1D7DE',
          }
        },
        error: {
          duration: 4000,
          style: {
            background: '#1a1a1a',
            color: '#D1D7DE'
          },

        }
      }}
    >
      {
        (t) => (
          <ToastBar position='bottom-right' toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {
                  t.type !== "loading" && (
                    <button
                      aria-label={`cerrar la notificación ${message}`}
                      className='flex items-center px-2 my-auto mb-auto text-3xl transition-colors duration-300 rounded cursor-pointer text-slate-300/80 hover:text-slate-300 size-fit hover:bg-neutral-800'
                      onClick={() => toast.dismiss(t.id)}>
                      <span className='-translate-y-0.5 relative block size-fit'>&times;</span>
                    </button>
                  )
                }
              </>
            )}
          </ToastBar>
        )
      }
    </Toaster>
  )
}