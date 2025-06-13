export function Loading() {
    return (
        <div className="flex absolute top-0 right-0 bottom-0 left-0 z-50 justify-center items-center py-8 min-w-full min-h-full bg-slate-50/90 dark:bg-black/80">
            <ul>
                <li>
                    <div className="loader">
                        <div className="child"></div>
                    </div>
                </li>

                <li>
                    <div className="text"></div>
                </li>
            </ul>
        </div>
    )
}
