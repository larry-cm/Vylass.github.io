
const IconFacebook = (props) => (
    <svg
        {...props}
        fill="currentColor"
        aria-hidden="true"
        viewBox="0 0 24 24"
    >
        <title>Facebook</title>
        <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
        />
    </svg>
)

const IconDiscord = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
        <title>Discord</title>
        <path fill="none" d="M0 0h24v24H0z" /><path d="m14.983 3 .123.006c2.014.214 3.527.672 4.966 1.673a1 1 0 0 1 .371.488c1.876 5.315 2.373 9.987 1.451 12.28C20.891 19.452 19.288 21 17.5 21c-.732 0-1.693-.968-2.328-2.045a22 22 0 0 0 2.103-.493 1 1 0 1 0-.55-1.924c-3.32.95-6.13.95-9.45 0a1 1 0 0 0-.55 1.924q1.074.307 2.103.494C8.193 20.031 7.232 21 6.5 21c-1.788 0-3.391-1.548-4.428-3.629-.888-2.217-.39-6.89 1.485-12.204a1 1 0 0 1 .371-.488C5.367 3.678 6.88 3.22 8.894 3.006a1 1 0 0 1 .935.435l.063.107.651 1.285.137-.016a13 13 0 0 1 2.643 0l.134.016.65-1.284a1 1 0 0 1 .754-.54zM9 10a2 2 0 0 0-1.977 1.697l-.018.154L7 12l.005.15A2 2 0 1 0 9 10m6 0a2 2 0 0 0-1.977 1.697l-.018.154L13 12l.005.15A2 2 0 1 0 15 10" /></svg>
)

const IconTwitter = (props) => (
    <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        {...props}
    >
        <title>Twitter</title>
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
);

const IconGitHub = (props) => (
    <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        {...props}
    >
        <title>GitHub</title>
        <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
        />
    </svg>
);

const IconNavigate = (props) => (
    <svg
        fill="currentColor"
        aria-label="Explorar"
        {...props}
    >
        <title>Navigate</title>
        <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m13.941 13.953-6.36 2.471 2.479-6.368 6.36-2.471-2.479 6.368z"
        />
        <path
            fillRule="evenodd"
            d="m10.06 10.056 3.889 3.889-6.368 2.479 2.479-6.368z"
        />
        <circle
            cx={12.001}
            cy={12.005}
            r={10.5}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
        />
    </svg>
)

const IconPage = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        viewBox="0 0 100.642 100.642"
        {...props}
    >
        <title>Page</title>
        <path
            d="M25.95 41.827 9.606 30.902a.664.664 0 0 0-1.03.551v19.859c0 .221.11.428.294.55l16.345 10.926a.67.67 0 0 0 .68.033.662.662 0 0 0 .35-.583v-19.86a.665.665 0 0 0-.295-.551zm0 25.162L9.606 56.064a.66.66 0 0 0-1.03.55v19.858c0 .222.11.429.294.552L25.215 87.95a.662.662 0 0 0 1.03-.55V67.54a.666.666 0 0 0-.295-.551zM45.571 53.4l-16.344-9.932a.662.662 0 0 0-1.006.566v19.859c0 .221.11.427.294.551l16.344 10.925a.662.662 0 0 0 1.03-.551V53.966a.666.666 0 0 0-.318-.566zm.023 26.17L29.25 68.646a.66.66 0 0 0-1.03.55v19.859c0 .222.11.428.294.551l16.344 10.926a.664.664 0 0 0 .68.033.663.663 0 0 0 .35-.584V80.12c0-.22-.11-.427-.294-.55zM84.82 30.872a.66.66 0 0 0-.673.021L67.405 41.487a.66.66 0 0 0-.308.572l.396 20.19a.662.662 0 0 0 1.03.538l16.345-10.926a.659.659 0 0 0 .294-.55V31.452a.662.662 0 0 0-.342-.58zm-.008 25.158a.66.66 0 0 0-.68.034L67.788 66.989a.66.66 0 0 0-.295.55v19.86a.663.663 0 0 0 1.031.55l16.345-10.926a.663.663 0 0 0 .294-.552V56.614a.665.665 0 0 0-.351-.584zM65.181 43.456a.666.666 0 0 0-.67.011l-16.343 9.932a.66.66 0 0 0-.319.565v20.854a.661.661 0 0 0 1.031.551l16.344-10.925a.663.663 0 0 0 .295-.551v-19.86a.661.661 0 0 0-.338-.577zm-20.752-13.66a.663.663 0 0 0-.324-.585l-15.337-9.11a.662.662 0 0 0-.633-.023l-17.108 8.498a.661.661 0 0 0-.061 1.151l15.285 9.724a.668.668 0 0 0 .666.026l17.161-9.111a.663.663 0 0 0 .351-.57zm-13.378-9.829 14.987 8.73a.668.668 0 0 0 .649.01l16.167-8.779a.662.662 0 0 0-.02-1.175l-15.007-7.455a.662.662 0 0 0-.573-.008l-16.148 7.504a.66.66 0 0 0-.055 1.173zM63.2 41.065a.662.662 0 0 0-.351-.574l-16.152-8.614a.661.661 0 0 0-.626.002l-15.995 8.664a.66.66 0 0 0-.347.578.667.667 0 0 0 .339.583l16.244 9.061a.653.653 0 0 0 .653-.004l15.903-9.11a.664.664 0 0 0 .332-.586zM91.945.28a.661.661 0 0 0-.611-.277L73.132 1.971a.661.661 0 0 0-.517.354l-8.349 16.162a.661.661 0 0 0 .649.963l18.526-1.649a.664.664 0 0 0 .537-.37L92 .95a.664.664 0 0 0-.055-.67zM65.169 68.611a.661.661 0 0 0-.681.034L48.144 79.57a.66.66 0 0 0-.295.55v19.86a.662.662 0 0 0 1.031.551l16.344-10.926a.661.661 0 0 0 .295-.551V69.195a.664.664 0 0 0-.35-.584z"
        />
    </svg>
)

const IconUpload = (props) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <title>Upload</title>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
        <path d="M7 9l5 -5l5 5" />
        <path d="M12 4l0 12" />
    </svg>
)

const IconAlert = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" >
        <title>Alert</title>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 9v4" /><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" /><path d="M12 16h.01" /></svg>
)

const IconChecked = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
    >
        <title>Checked</title>
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
        ></path>
    </svg>
)

const IconError = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <title>Error</title>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 9v4" /><path d="M12 16v.01" /></svg>
)

const IconShare = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="currentColor">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path
            d="M18.5 3a2.5 2.5 0 1 1 -.912 4.828l-4.556 4.555a5.475 5.475 0 0 1 .936 3.714l2.624 .787a2.5 2.5 0 1 1 -.575 1.916l-2.623 -.788a5.5 5.5 0 0 1 -10.39 -2.29l-.004 -.222l.004 -.221a5.5 5.5 0 0 1 2.984 -4.673l-.788 -2.624a2.498 2.498 0 0 1 -2.194 -2.304l-.006 -.178l.005 -.164a2.5 2.5 0 1 1 4.111 2.071l.787 2.625a5.475 5.475 0 0 1 3.714 .936l4.555 -4.556a2.487 2.487 0 0 1 -.167 -.748l-.005 -.164l.005 -.164a2.5 2.5 0 0 1 2.495 -2.336z" />
    </svg>
)

const IconDotsMenu = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <title>Menu</title>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>
)

const IconGo = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="currentColor" aria-hidden="true" >
        <path
            d="M2.669 11.333V8.667c0-.922 0-1.655.048-2.244.048-.597.15-1.106.387-1.571l.155-.276a4 4 0 0 1 1.593-1.472l.177-.083c.418-.179.872-.263 1.395-.305.589-.048 1.32-.048 2.243-.048h.5a.665.665 0 0 1 0 1.33h-.5c-.944 0-1.613 0-2.135.043-.386.032-.66.085-.876.162l-.2.086a2.67 2.67 0 0 0-1.064.982l-.102.184c-.126.247-.206.562-.248 1.076-.043.523-.043 1.192-.043 2.136v2.666c0 .944 0 1.613.043 2.136.042.514.122.829.248 1.076l.102.184c.257.418.624.758 1.064.982l.2.086c.217.077.49.13.876.161.522.043 1.19.044 2.135.044h2.667c.944 0 1.612-.001 2.135-.044.514-.042.829-.121 1.076-.247l.184-.104c.418-.256.759-.623.983-1.062l.086-.2c.077-.217.13-.49.16-.876.043-.523.044-1.192.044-2.136v-.5a.665.665 0 0 1 1.33 0v.5c0 .922.001 1.655-.047 2.244-.043.522-.127.977-.306 1.395l-.083.176a4 4 0 0 1-1.471 1.593l-.276.154c-.466.238-.975.34-1.572.39-.59.047-1.321.047-2.243.047H8.667c-.923 0-1.654 0-2.243-.048-.523-.043-.977-.126-1.395-.305l-.177-.084a4 4 0 0 1-1.593-1.471l-.155-.276c-.237-.465-.339-.974-.387-1.57-.049-.59-.048-1.322-.048-2.245m10.796-8.22a2.43 2.43 0 0 1 3.255.167l.167.185c.727.892.727 2.18 0 3.071l-.168.185-5.046 5.048a4 4 0 0 1-1.945 1.072l-.317.058-1.817.26a.665.665 0 0 1-.752-.753l.26-1.816.058-.319a4 4 0 0 1 1.072-1.944L13.28 3.28zm2.314 1.108a1.103 1.103 0 0 0-1.476-.076l-.084.076-5.046 5.048a2.67 2.67 0 0 0-.716 1.296l-.04.212-.134.939.94-.134.211-.039a2.67 2.67 0 0 0 1.298-.716L15.78 5.78l.076-.084c.33-.404.33-.988 0-1.392z" />
    </svg>
)
const IconAccessibility = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg"{...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" >
        <title>Comunicación</title>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M10 16.5l2 -3l2 3m-2 -3v-2l3 -1m-6 0l3 1" /><circle cx={12} cy={7.5} r={.5} fill="currentColor" /></svg>
)

const IconExternalLink = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" >
        <title>Ir</title>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" /><path d="M11 13l9 -9" /><path d="M15 4h5v5" /></svg>
)
const IconSupport = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 3a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-4.724l-4.762 2.857a1 1 0 0 1 -1.508 -.743l-.006 -.114v-2h-1a4 4 0 0 1 -3.995 -3.8l-.005 -.2v-8a4 4 0 0 1 4 -4zm-6 10a1 1 0 0 0 -1 1v.01a1 1 0 0 0 2 0v-.01a1 1 0 0 0 -1 -1m0 -6a1 1 0 0 0 -1 1v3a1 1 0 0 0 2 0v-3a1 1 0 0 0 -1 -1" /></svg>
)
const IconLinkedIn = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
        <title>LinkedIn</title>
        <path fill="none" d="M0 0h24v24H0z" /><path d="M17 2a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm-9 8a1 1 0 0 0-1 1v5a1 1 0 0 0 2 0v-5a1 1 0 0 0-1-1m6 0a3 3 0 0 0-1.168.236l-.125.057A1 1 0 0 0 11 11v5a1 1 0 0 0 2 0v-3a1 1 0 0 1 2 0v3a1 1 0 0 0 2 0v-3a3 3 0 0 0-3-3M8 7a1 1 0 0 0-.993.883L7 8.01a1 1 0 0 0 1.993.117L9 8a1 1 0 0 0-1-1" /></svg>
)
const IconDownload = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor"
        xmlns="http://www.w3.org/2000/svg">
        <title>Descargar</title>
        <path
            d="M12 2C12.5523 2 13 2.44772 13 3V12.1716L16.2929 8.87868C16.6834 8.48816 17.3166 8.48816 17.7071 8.87868C18.0976 9.26921 18.0976 9.90237 17.7071 10.2929L12.7071 15.2929C12.3166 15.6834 11.6834 15.6834 11.2929 15.2929L6.29289 10.2929C5.90237 9.90237 5.90237 9.26921 6.29289 8.87868C6.68342 8.48816 7.31658 8.48816 7.70711 8.87868L11 12.1716V3C11 2.44772 11.4477 2 12 2Z" />
        <path
            d="M5 17C5 16.4477 5.44772 16 6 16H18C18.5523 16 19 16.4477 19 17V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V17Z" />
    </svg>
)
const IconFullScreen = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M16 4l4 0l0 4" /><path d="M14 10l6 -6" /><path d="M8 20l-4 0l0 -4" /><path d="M4 20l6 -6" /><path d="M16 20l4 0l0 -4" /><path d="M14 14l6 6" /><path d="M8 4l-4 0l0 4" /><path d="M4 4l6 6" /></svg>
)
const IconX = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
)
export {
    IconX,
    IconFullScreen,
    IconExternalLink,
    IconSupport,
    IconLinkedIn,
    IconAccessibility,
    IconDownload,
    IconGo,
    IconDiscord,
    IconFacebook,
    IconTwitter,
    IconGitHub,
    IconUpload,
    IconNavigate,
    IconPage,
    IconAlert,
    IconChecked,
    IconError,
    IconShare,
    IconDotsMenu
};