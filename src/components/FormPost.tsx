import { IconUpload, IconAlert, IconError, IconChecked } from '@/assets/Icons'
import toast, { Toaster, ToastBar } from 'react-hot-toast'
import { useEffect, useRef, useState } from 'react'


export default function FormPost({ userId, hasImage, imageUrl, firstName, lastName }: {
    userId: string,
    hasImage: boolean,
    imageUrl: string,
    firstName: string,
    lastName: string
}) {
    const titleRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const maxLength = 100;

    const setLocal = (key: string, value: string) => localStorage.setItem(`${userId}-${key}`, value)

    const handleInputTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.currentTarget.textContent
        if (newTitle) {
            setTitle(newTitle)
            setLocal('title', newTitle)
        } else {
            setTitle('')
            setLocal('title', '')
        }

    }

    const handleInputContent = (e: React.FormEvent<HTMLDivElement>) => {
        const newContent = e.currentTarget.textContent || '';
        const trimmed = newContent.slice(0, maxLength);

        if (trimmed) {
            setContent(trimmed)
            setLocal('content', trimmed)
        }
        else {
            setContent('')
            setLocal('content', '')
        }
    };

    const handleBeforeInput = (e: React.SyntheticEvent<HTMLDivElement>, maxLength: number) => {

        const text = e.currentTarget.textContent || '';
        const selection = window.getSelection();
        const selectedTextLength = selection?.toString().length || 0;

        if (text.length - selectedTextLength >= maxLength) {
            e.preventDefault();
        }
    };

    const handleKeysStop = (e: React.FormEvent<HTMLDivElement>) => {
        const keysStop = ['Escape', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab']
        if (keysStop.includes((e as any).key)) {
            e.preventDefault()
            console.log('stop');
        }

    }

    useEffect(() => {
        const localTitle = localStorage.getItem(`${userId}-title`) || ''
        const localContent = localStorage.getItem(`${userId}-content`) || ''
        if (localTitle && titleRef.current) {
            titleRef.current.textContent = localTitle
        }
        if (localContent && contentRef.current) {
            contentRef.current.textContent = localContent
        }
    }, [])

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const imgRef = useRef<HTMLImageElement>(null)

    const handlePreviewImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return
        const reader = new FileReader();
        if (file.size > 1024 * 1024 * 2.5) {
            toast.error('El archivo es demasiado grande. El límite es de 2.5MB.', {
                icon: <IconError className='min-w-6 max-w-8 text-orange-500' />
            })
            return
        }
        reader.onloadend = (e) => {
            setPreviewUrl(e?.target?.result as string);
        };
        reader.onerror = (e) => {
            toast.error('No se pudo cargar la imagen. Por favor, pero no te preocupes. Rellenamos la imagen para cuando quieras cambiarla.', {
                icon: (
                    <IconError className='min-w-6 max-w-8 text-orange-700' />
                ),
            })
        }
        reader.readAsDataURL(file)
    }

    const handlePreviewOnload = () => {
        if (!imgRef.current) return
        if (imgRef.current && !imgRef.current.src.match('/svg/404.svg')) {
            toast.success('¡Imagen cargada exitosamente! Lista para ser publicada.', {
                icon: <IconChecked className='min-w-6 max-w-8 text-green-500' />,
            })
            return
        }

        toast.error('No se pudo cargar la imagen. Rellenamos el campo.', {
            icon: (
                <IconAlert className='min-w-6 max-w-8 text-orange-500' />
            ),
        })
    }

    const handleSubmitData = () => {
        // Define minimum required lengths
        const MIN_TITLE_LENGTH = Math.floor(maxLength / 7);
        const MIN_CONTENT_LENGTH = Math.floor(maxLength / 5);

        // Clean and validate input sizes
        const titleSize = title.trim().length;
        const contentSize = content.trim().length;
        const titleAccepted = titleSize >= MIN_TITLE_LENGTH;
        const contentAccepted = contentSize >= MIN_CONTENT_LENGTH;

        // Case 1: Empty submission
        if (!titleSize && !contentSize && !previewUrl) {
            toast.error('Debes agregar contenido para publicar');
            return;
        }

        // Case 2: Incomplete or invalid content lengths
        if (!titleSize || !contentSize || !titleAccepted || !contentAccepted) {
            toast.error(`El título debe tener al menos ${MIN_TITLE_LENGTH} caracteres y el contenido ${MIN_CONTENT_LENGTH} caracteres`);
            return;
        }

        // Case 3: Valid content but default image
        if (titleAccepted && contentAccepted && !previewUrl) {
            toast.error('La publicación se realizará con una imagen por defecto', {
                icon: <IconAlert className='min-w-6 max-w-8 text-orange-500' />
            });
            return;
        }

        // Case 4: All valid
        if (titleAccepted && contentAccepted) {
            toast.success('¡Publicación realizada con éxito!', {
                icon: <IconChecked className='min-w-6 max-w-8 text-green-500' />
            });
            return;
        }
    }

    return (
        <div
            data-anima
            className=" order-2 flex flex-col gap-5 justify-self-center p-4 w-full max-w-80 sm:w-2xs shadow-2xl rounded-md  bg-neutral-900/80">
            <Toaster
                position="bottom-right"
                // reverseOrder={true}
                gutter={8}
                containerClassName=""
                toastOptions={{
                    // opciones por defecto
                    className: '',
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
                                                className='text-3xl flex items-center text-slate-300/80 hover:text-slate-300 px-2 size-fit mb-auto transition-colors duration-300 cursor-pointer rounded hover:bg-neutral-800 my-auto'
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

            <div className="flex gap-4 justify-between">
                <picture
                    className="flex gap-2 items-center border border-neutral-800/80 bg-neutral-800/80 px-3 py-1.5 rounded">
                    <img
                        className="rounded-full  size-6 min-w-6"
                        src={hasImage ? imageUrl : "/logo.svg"}
                        alt=""
                    />
                    <span className="text-sm text-slate-100">
                        @{firstName} </span>
                </picture>

                <menu className="flex gap-2 items-center">

                    <button
                        onClick={handleSubmitData}
                        title="Publicar"
                        aria-label="Generar la publicación"
                        role="button"
                        type="button"
                        className="p-1.5 px-3 rounded transition-colors cursor-pointer min-w-27 bg-orange-600/80 text-slate-50 hover:bg-orange-600 hover:text-300"
                    >
                        Publicar
                    </button>
                </menu>
            </div>

            <div className="flex flex-col gap-5">
                <div className='relative'>
                    <div
                        contentEditable="true"
                        suppressContentEditableWarning
                        ref={titleRef}
                        onKeyDown={handleKeysStop}
                        onBeforeInput={(e) => handleBeforeInput(e, 50)}
                        onInput={handleInputTitle}
                        className="z-20 border px-2 py-1 rounded w-full text-lg min-h-[1lh] whitespace-pre-wrap break-words outline-none"
                    >
                    </div>
                    <span
                        onClick={() => {
                            if (!titleRef.current) return
                            titleRef.current.focus()
                        }}
                        className={` z-10 absolute right-1 bottom-1 transition-all ${title.length > 10 ? 'hidden' : 'block'} text-slate-300 ${!title ? 'text-sm' : 'text-xs'}`}>Describe tu publicación</span>
                </div>

                <div className='relative'>
                    <div
                        contentEditable="true"
                        suppressContentEditableWarning
                        ref={contentRef}
                        onBeforeInput={(e) => handleBeforeInput(e, maxLength)}
                        onInput={handleInputContent}
                        onKeyDown={handleKeysStop}
                        className="border px-2 pb-4 py-1 rounded w-full text-lg min-h-[3lh] whitespace-pre-wrap break-words outline-none "
                    >
                    </div>
                    {
                        <p
                            onClick={() => {
                                if (!contentRef.current) return
                                contentRef.current.focus()
                            }}
                            className={`absolute transition-all text-slate-300 right-1 bottom-1 ${!content ? 'text-sm' : 'text-xs'}`}>Máximo {maxLength}/{content.length} caracteres</p>
                    }
                </div>
            </div>

            <label
                htmlFor="photo_post"
                className="p-4 rounded border-2 border-dotted transition-colors cursor-pointer bg-neutral-800/80 hover:bg-neutral-800 group"

            >
                <picture
                    className="flex flex-col justify-center items-center h-20 text-sm font-medium text-slate-300 "
                >
                    <input
                        onChange={handlePreviewImage}
                        type="file"
                        name={`photo_post`}
                        id={`photo_post`}
                        accept="image/*"
                        className="sr-only"
                    />

                    {
                        previewUrl ? (
                            <img
                                ref={imgRef}
                                onLoad={handlePreviewOnload}
                                onError={() => { if (imgRef.current) imgRef.current.src = '/svg/404.svg' }}
                                className='object-contain size-full'
                                src={previewUrl || '/svg/404.svg'}//{!errorPreviewUrl ? '/svg/404.svg' : previewUrl}
                                alt='imagen de pre carga'
                                loading='eager' />
                        )
                            : (
                                <span className='text-orange-500 group group-hover:drop-shadow-amber-600 transition-colors drop-shadow-md'>
                                    <IconUpload className='size-12 group-hover:-translate-y-1 transition duration-300' />
                                </span>
                            )
                    }
                </picture>
            </label>
        </div>
    )
}