export default function Loading() {
    return (
        <div className="flex justify-center items-center absolute top-13 left-0 w-full">
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