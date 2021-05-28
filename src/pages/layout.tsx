import { NextPage } from 'next'
import { DashboardLayout } from '@/modules/layout/DashboardLayout'

import { withLayout } from '@moxy/next-layout'

const Test: NextPage = () => {
  return <div>test</div>
}

export default withLayout(<DashboardLayout />)(Test)
