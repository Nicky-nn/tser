import React, {FC, Suspense} from 'react'
import MatxLoading from "../MatxLoading/MatxLoading";

type MatxSuspenseProps = {
    children: JSX.Element
}

const MatxSuspense: FC<MatxSuspenseProps> = ({children}: MatxSuspenseProps) => {
    return <Suspense fallback={<MatxLoading/>}>{children}</Suspense>
}

export default MatxSuspense
