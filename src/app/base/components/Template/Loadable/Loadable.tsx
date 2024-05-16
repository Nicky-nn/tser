import { FunctionComponent, Suspense } from 'react'

import Loading from '../MatxLoading/MatxLoading'

const Loadable = (Component: FunctionComponent<any>) => (props: any) => (
  <Suspense fallback={<Loading />}>
    <Component {...props} />
  </Suspense>
)

export default Loadable
