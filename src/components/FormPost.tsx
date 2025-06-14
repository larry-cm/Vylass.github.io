import { IconUpload, IconAlert, IconError, IconChecked } from '@/assets/Icons'
import toast, { Toaster, ToastBar } from 'react-hot-toast'
import React, { useEffect, useRef, useState } from 'react'
import { Loading } from '@components/Loading'


export default function FormPost({ userId, imageUrl, firstName, }: {
    userId: string,
    imageUrl: string,
    firstName: string,
}) {
    const titleRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const maxLength = 50;
    const keyName = userId.slice(-5)
    const setLocal = (key: string, value: string) => localStorage.setItem(`${keyName}-${key}`, value)

    const handleFocusText = (el: React.RefObject<HTMLDivElement | null>) => {
        if (!el.current) return
        el.current.focus()
    }

    type handleInputs = React.ChangeEvent<HTMLInputElement> | React.SyntheticEvent<HTMLDivElement>;
    const handleInputs = (e: handleInputs, max?: number): string => {
        if (!e.currentTarget.textContent) return ''
        const newValue = e.currentTarget.textContent
        const trimmed = newValue?.slice(0, max || maxLength)
        return newValue && max ? trimmed : newValue
    }

    const handleInputTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (handleInputs(e)) {
            setTitle(handleInputs(e))
            setLocal('title', handleInputs(e))
        } else {
            setTitle(handleInputs(e))
            setLocal('title', handleInputs(e))
        }
    }

    const handleInputContent = (e: React.FormEvent<HTMLDivElement>) => {
        if (handleInputs(e, maxLength)) {
            setContent(handleInputs(e, maxLength))
            setLocal('content', handleInputs(e, maxLength))
        }
        else {
            setContent(handleInputs(e, maxLength))
            setLocal('content', handleInputs(e, maxLength))
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
        const localTitle = localStorage.getItem(`${keyName}-title`) || ''
        const localContent = localStorage.getItem(`${keyName}-content`) || ''
        if (localTitle && titleRef.current) {
            setTitle(localTitle)
            titleRef.current.textContent = localTitle
        }
        if (localContent && contentRef.current) {
            setContent(localContent)
            contentRef.current.textContent = localContent
        }
    }, [])

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadImage, setUploadImage] = useState(false)

    const imgRef = useRef<HTMLImageElement>(null)
    const fileRef = useRef<HTMLInputElement>(null)
    // avisos personalizados 
    const customToast = (type: 'error' | 'success', message: string, icon: 'alert' | 'check' | 'error') => {
        const icons = {
            alert: <IconAlert className='text-orange-500 min-w-10 max-w-10' />,
            check: <IconChecked className='text-green-500 min-w-10 max-w-10' />,
            error: <IconError className='min-w-10 max-w-10 text-error' />
        }
        if (type === 'error') toast.error(message, {
            icon: icons[icon]
        });
        else toast.success(message, {
            icon: icons[icon]
        });
    }

    const handlePreviewImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return
        const reader = new FileReader();

        if (file.size > 1024 * 1024 * 2.5) {
            toast.error('El archivo es demasiado grande. El límite es de 2.5MB.', {
                icon: <IconError className='text-orange-500 min-w-6 max-w-8' />
            })
            return
        }
        reader.onloadend = (e) => {
            setPreviewUrl(e?.target?.result as string);
        };
        reader.onerror = () => {
            customToast('error', 'No se pudo cargar la imagen. Por favor, pero no te preocupes. Rellenamos la imagen para cuando quieras cambiarla.', 'error')
        }
        reader.readAsDataURL(file)
    }

    const handlePreviewOnload = () => {
        if (!imgRef.current) return
        if (imgRef.current && !imgRef.current.src.match('/svg/404.svg')) {
            customToast('success', '¡Imagen cargada exitosamente! Lista para ser publicada.', 'check')
            return
        }
        customToast('error', 'No se pudo cargar la imagen. Rellenamos el campo.', 'alert')
        return
    }

    const handleSubmitData = () => {
        // definiendo mínimo en los textos
        const MIN_TITLE_LENGTH = Math.floor(maxLength / 10);
        const MIN_CONTENT_LENGTH = Math.floor(maxLength / 5);

        // limpiando los inputs y dándoles su limitación
        const titleSize = title.trim().length;
        const contentSize = content.trim().length;
        const titleAccepted = titleSize >= MIN_TITLE_LENGTH;
        const contentAccepted = contentSize >= MIN_CONTENT_LENGTH;

        // limpieza de estados
        const cleanStates = () => {
            if (titleRef.current?.textContent) {
                titleRef.current.textContent = ''
                localStorage.removeItem(`${keyName}-title`)
                setTitle('')
            }
            if (contentRef.current?.textContent) {
                contentRef.current.textContent = ''
                localStorage.removeItem(`${keyName}-content`)
                setContent('')
            }
            if (previewUrl && fileRef.current) {
                setPreviewUrl('')
                fileRef.current.value = ''
            }
        }

        // Case 1: Empty submission
        if (!titleSize && !contentSize && !previewUrl) {
            customToast('error', 'Debes agregar contenido para publicar', 'error')
            return;
        }

        // Case 2: Incomplete or invalid content lengths
        if (!titleSize || !contentSize || !titleAccepted || !contentAccepted) {
            customToast('error', `El título debe tener al menos ${MIN_TITLE_LENGTH} caracteres y el contenido ${MIN_CONTENT_LENGTH} caracteres`, 'error')
            return;
        }

        // Case 3: Valid content but default image
        if (titleAccepted && contentAccepted && !previewUrl) {
            customToast('error', 'La publicación se realizará con una imagen por defecto', 'alert')
            setUploadImage(true)
                ; (async () => {

                    const postData = new FormData()
                    postData.append('userInfo', JSON.stringify({
                        title,
                        content
                    }))
                    const res = await fetch(`/api/upload/blobVercel`, {
                        method: 'POST',
                        body: postData
                    })
                    if (!res.ok) {
                        customToast('error', 'Error al realizar el envió de la imagen', 'error')
                        return;
                    }
                    if (res.redirected) window.location.href = res.url
                    await res.json()
                    setUploadImage(false)
                    customToast('success', '¡Publicación con imagen por defecto!', 'check')
                })()
            cleanStates()
            return;
        }

        // Case 4: All valid
        if (titleAccepted && contentAccepted) {
            customToast('success', '¡Su publicación se esta realizando!', 'check')
            setUploadImage(true)
                // archivo para vercel
                ; (async () => {
                    const postData = new FormData()
                    postData.append('fileUp', fileRef.current?.files?.[0] || 'aqio')
                    postData.append('userInfo', JSON.stringify({
                        title,
                        content
                    }))
                    try {
                        // envió la imagen a vercel
                        const res = await fetch(`/api/upload/blobVercel?filename=vercel-blob-${keyName}-${firstName}`, {
                            method: 'POST',
                            body: postData,
                        })
                        if (!res.ok) customToast('error', 'Error al realizar el envió de la imagen', 'error')
                        if (res.redirected) window.location.href = res.url
                        await res.json()
                        setUploadImage(false)
                        customToast('success', '¡La publicación se realizó exitosamente!', 'check')
                    } catch (error) {
                        customToast('error', 'Hubo un error al procesar la publicación. Por favor, intenta de nuevo.', 'error')
                    }

                })()
            cleanStates();

            return;
        }

    }

    return (
        <div
            data-anima
            className="flex flex-col order-2 w-full gap-5 p-4 rounded-md shadow-2xl justify-self-center  sm:w-2xs bg-neutral-900/80">
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
            {
                uploadImage && <Loading />
            }
            <div className="flex justify-between gap-4">
                <picture
                    className="flex gap-2 items-center border border-neutral-800 bg-neutral-800/80 px-3 py-2 rounded">
                    <img
                        className="rounded-full size-6 min-w-6"
                        src={imageUrl ? imageUrl : "/logo.svg"}
                        alt="Aquí va tu foto de perfil guapeé."
                    />
                    <span className="text-sm text-slate-100">
                        @{firstName} </span>
                </picture>


                <button
                    onClick={handleSubmitData}
                    title="Publicar"
                    aria-label="Generar la publicación"
                    role="button"
                    type="button"
                    className="p-2 rounded transition-colors cursor-pointer min-w-27 bg-orange-600/80 text-slate-50 hover:bg-orange-600 hover:text-300"
                >
                    Publicar
                </button>
            </div>

            <div className="flex flex-col gap-5 text-base">
                <div className='relative'>
                    <div
                        contentEditable="true"
                        suppressContentEditableWarning
                        ref={titleRef}
                        onKeyDown={handleKeysStop}
                        onBeforeInput={(e) => handleBeforeInput(e, maxLength / 2)}
                        onInput={handleInputTitle}
                        className="border border-neutral-400/80 px-2 py-1 rounded w-full h-[1.6lh] overflow-clip whitespace-pre-wrap break-words outline-none "
                    >
                    </div>
                    <span
                        onClick={() => handleFocusText(titleRef)}
                        className={` z-10 absolute right-1 bottom-1 transition-all ${title.length >= 5 ? 'hidden' : 'block'} text-slate-300 ${!title ? 'text-sm' : 'text-xs'}`}>Describe tu publicación</span>
                </div>

                <div className='relative'>
                    <div
                        contentEditable="true"
                        suppressContentEditableWarning
                        ref={contentRef}
                        onBeforeInput={(e) => handleBeforeInput(e, maxLength)}
                        onInput={handleInputContent}
                        onKeyDown={handleKeysStop}
                        className="border border-neutral-400/80 px-2 pb-4 py-1 rounded w-full h-[3lh] overflow-clip whitespace-pre-wrap break-words outline-none "
                    >
                    </div>
                    {
                        <p
                            onClick={() => handleFocusText(contentRef)}
                            className={`absolute transition-all text-slate-300 right-1 bottom-1 ${!content ? 'text-sm' : 'text-xs'}`}>Máximo {maxLength}/{content.length} caracteres</p>
                    }
                </div>
            </div>

            <label
                htmlFor="photo_post"
                className="p-4 transition-colors border-2 border-dotted rounded cursor-pointer border-neutral-400/80 bg-neutral-800/80 hover:bg-neutral-800 group"

            >
                <span className='sr-only'>Aquí podrás elegir que imagen vas a publicar</span>
                <picture
                    className="flex flex-col items-center justify-center h-20 text-sm font-medium text-slate-300 "
                >
                    <input
                        ref={fileRef}
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
                                <span className='text-orange-500 transition-colors group group-hover:drop-shadow-amber-600 drop-shadow-md'>
                                    <IconUpload className='transition duration-300 size-12 group-hover:-translate-y-1' />
                                </span>
                            )
                    }
                </picture>
            </label>
        </div >
    )
}