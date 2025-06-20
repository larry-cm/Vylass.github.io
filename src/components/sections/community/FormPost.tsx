import { IconUpload, IconAlert, IconError, IconChecked } from '@/assets/Icons'
import toast, { Toaster, ToastBar } from 'react-hot-toast'
import React, { useEffect, useRef, useState, type ReactNode } from 'react'
import { Loading } from '@components/Loading'
import ToastPage from '@/library/ToastPage'
const imgDefault = import.meta.env.PUBLIC_IMG_DEFAULT

export default function FormPost({ userId, imageUrl, firstName, children }: {
    userId: string,
    imageUrl: string,
    firstName: string,
    children: ReactNode
}) {
    const titleRef = useRef<HTMLInputElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')

    const maxLength = 50;
    const keyName = userId.slice(-5)

    const setLocal = (key: string, value: string) => localStorage.setItem(`${keyName}-${key}`, value)

    const handleFocusText = (el: React.RefObject<HTMLInputElement | HTMLDivElement | null>) => {
        if (!el.current) return
        el.current.focus()
    }

    type handleInputs = React.FormEvent<HTMLInputElement | HTMLDivElement>;
    const handleInputs = (e: handleInputs, max?: number): string => {
        const newValue = e.currentTarget.textContent ?
            e.currentTarget.textContent || '' :
            (e.currentTarget as HTMLInputElement).value
        const trimmed = newValue?.slice(0, max || maxLength)
        return newValue && max ? trimmed : newValue
    }

    const handleInputTitle = (e: React.FormEvent<HTMLInputElement>) => {
        if (handleInputs(e)) {
            setTitle(handleInputs(e))
            setLocal('title', handleInputs(e))
        } else {
            setTitle('')
            setLocal('title', '')
        }
    }

    const handleInputContent = (e: React.FormEvent<HTMLInputElement | HTMLDivElement>) => {
        if (handleInputs(e, maxLength) && handleInputs(e, maxLength).length <= maxLength) {
            setContent(handleInputs(e, maxLength))
            setLocal('content', handleInputs(e, maxLength))
        }
        else {
            setContent('')
            setLocal('content', '')
        }
    };

    const handleBeforeInput = (e: React.FormEvent<HTMLInputElement | HTMLDivElement>, maxLength: number) => {
        let text
        text = e.currentTarget?.textContent ?
            e.currentTarget.textContent || '' :
            (e.currentTarget as HTMLInputElement).value
        const selection = window.getSelection();
        const selectedTextLength = selection?.toString().length || 0;

        if (text.length - selectedTextLength >= maxLength) {
            e.preventDefault();
        }
    };

    const handleKeysStop = (e: React.FormEvent<HTMLInputElement | HTMLDivElement>) => {
        const keysStop = ['Escape',]
        if (keysStop.includes((e as any).key)) {
            e.preventDefault()
            console.log('stop');
        }
    }

    // se mantiene el texto
    useEffect(() => {
        const localTitle = localStorage.getItem(`${keyName}-title`) || ''
        const localContent = localStorage.getItem(`${keyName}-content`) || ''
        if (localTitle && titleRef.current) {
            setTitle(localTitle)
            titleRef.current.value = localTitle
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
    // apenas meta la imagen
    const handlePreviewImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setPreviewUrl('')
        if (!file) return
        const reader = new FileReader();
        // defino un máximo aceptable por archivo
        if (file.size > 1024 * 1024 * 2.5 && file.type.match('image/')) {
            customToast('error', 'El archivo es demasiado grande. El límite es de 2.5MB.', 'error')
            setPreviewUrl(imgDefault)
            return
        }

        reader.onloadend = (e) => setPreviewUrl(e?.target?.result as string);

        reader.onerror = () => customToast('error', 'No se pudo cargar la imagen. Por favor, pero no te preocupes. Rellenamos la imagen para cuando quieras cambiarla.', 'error')

        reader.readAsDataURL(file)
    }
    // cuando la imagen se cargue
    const handleErrorPreview = () => {
        console.log(imgDefault);

        setPreviewUrl(imgDefault)
        customToast('error', 'No se pudo cargar la imagen. Rellenamos el campo.', 'alert')
        return
    }
    // cuando se quiere publicar
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
            if (titleRef.current?.value) {
                titleRef.current.value = ''
                localStorage.removeItem(`${keyName}-title`)
                setTitle('')
            }
            if (contentRef.current?.textContent) {
                contentRef.current.textContent = ''
                localStorage.removeItem(`${keyName}-content`)
                setContent('')
            }
            // if (fileRef.current?.src) {
            //     // fileRef.current.src = ''
            //     // setPreviewUrl('')
            // }

        }

        // Case 1: falta contenido
        if (!titleSize && !contentSize && !previewUrl) {
            customToast('error', 'Debes agregar contenido para publicar', 'error')
            return;
        }

        // Case 2:  mínimo aceptado
        if (!titleSize || !contentSize || !titleAccepted || !contentAccepted) {
            customToast('error', `El título debe tener al menos ${MIN_TITLE_LENGTH} caracteres y el contenido ${MIN_CONTENT_LENGTH} caracteres`, 'error')
            return;
        }

        // Case 3: aceptado pero sin imagen
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

                    setUploadImage(false)
                    customToast('success', '¡Publicación con imagen por defecto!', 'check')
                    cleanStates()
                    if (res.redirected) window.location.href = res.url
                    await res.json()
                })()
            return;
        }

        // Case 4: aceptado
        if (titleAccepted && contentAccepted) {
            customToast('success', '¡Su publicación se esta realizando!', 'check')
            setUploadImage(true)
                // archivo para vercel
                ; (async () => {
                    const postData = new FormData()
                    postData.append('fileUp', fileRef.current?.files?.[0] || '')
                    postData.append('userInfo', JSON.stringify({
                        title,
                        content
                    }))

                    // envió la imagen a vercel
                    const res = await fetch(`/api/upload/blobVercel?filename=vercel-blob-${keyName}-${firstName}`, {
                        method: 'POST',
                        body: postData,
                    })

                    setUploadImage(false)
                    customToast('success', '¡La publicación se realizó exitosamente!', 'check')
                    cleanStates();

                    if (res.redirected) window.location.href = res.url
                    await res.json()
                })()
            return;
        }

    }
    // cuando pegan un texto 
    function handlePaste(event: React.ClipboardEvent<HTMLDivElement>): void {
        event.preventDefault();
        const updateCount = () => {
            setContent(getCurrentText())
            setLocal('content', getCurrentText())
        };
        const getCurrentText = () => contentRef.current?.textContent || "";
        const text = event.clipboardData.getData("text/plain");
        const currentText = getCurrentText();
        const allowed = maxLength - currentText.length;

        if (allowed < 0) return;

        const textToInsert = text.slice(0, allowed);

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const textNode = document.createTextNode(textToInsert);

        range.deleteContents(); // Elimina cualquier texto seleccionado
        range.insertNode(textNode);

        // Mover el cursor justo después del texto pegado
        range.setStartAfter(textNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);

        updateCount();
    }

    return (
        <section
            className="relative flex flex-col items-center h-full gap-4"
            role="form"
            aria-label="Formulario para crear una publicación"
        >
            <div
                data-anima
                className="flex flex-col order-2 w-full gap-5 p-4 rounded-md shadow-md justify-self-center bg-fondo sm:max-w-63">
                <ToastPage />
                {
                    uploadImage && <Loading />
                }
                <div className="flex justify-between gap-4">
                    <picture
                        className="flex items-center gap-2 px-3 py-2 border rounded border-fondo-claro bg-fondo-claro">
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
                        className="p-2 transition-colors rounded cursor-pointer min-w-27 bg-secondary text-slate-50 hover:bg-secondary/90 hover:text-300"
                    >
                        Publicar
                    </button>
                </div>

                <div className="flex flex-col gap-5 text-base">

                    <label htmlFor='titlePost' className='relative'>
                        <span className='sr-only'>Un titulo que describa tu publicación</span>
                        <input
                            id='titlePost'
                            ref={titleRef}
                            onKeyDown={handleKeysStop}
                            maxLength={maxLength / 2}
                            onBeforeInput={(e) => handleBeforeInput(e, maxLength / 2)}
                            onInput={handleInputTitle}
                            className="border border-neutral-400/80 px-2 py-1 rounded w-full h-auto max-h-[2.5lh] overflow-clip whitespace-pre-wrap break-words outline-none animation-height"
                        >
                        </input>
                        <span
                            onClick={() => handleFocusText(titleRef)}
                            className={` z-10 absolute right-1 bottom-1 transition-all ${title.length >= 5 ? 'hidden' : 'block'} text-slate-300 ${!title ? 'text-sm' : 'text-xs'}`}>Describe tu publicación</span>
                    </label>

                    <div className='relative'>
                        <div
                            contentEditable='true'
                            spellCheck='true'
                            role="textbox"
                            aria-multiline='true'
                            ref={contentRef}
                            onPaste={handlePaste}
                            onBeforeInput={(e) => handleBeforeInput(e, maxLength)}
                            onInput={handleInputContent}
                            onKeyDown={handleKeysStop}
                            className="border border-neutral-400/80 px-2 pb-4 py-1 rounded w-full h-[3lh] overflow-clip whitespace-pre-wrap break-words outline-none text-break *:text-break *:whitespace-normal max-w-full"
                        >
                        </div>

                        <p
                            onClick={() => handleFocusText(contentRef)}
                            className={`absolute transition-all text-slate-300 right-1 bottom-1 ${!content ? 'text-sm' : 'text-xs'}`}>{content.length}/{maxLength} Caracteres</p>

                    </div>
                </div>

                <label
                    htmlFor="photo_post"
                    className="p-4 transition-colors border-2 border-dotted rounded cursor-pointer border-neutral-400/80 bg-fondo-claro/50 hover:bg-fondo-claro group"

                >
                    <span className='sr-only'>Elige una imagen para publicar</span>
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
                                    src={previewUrl}
                                    loading='eager'
                                    onLoad={() => {
                                        if (previewUrl !== imgDefault) customToast('success', 'La imagen se cargo con éxito!', 'check')
                                    }}
                                    onError={handleErrorPreview}
                                    className='object-contain size-full'
                                    alt='imagen de pre carga'
                                />
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

            {children && children}
        </section>

    )
} 