import React from 'react'
import { verifyAdminSession } from '@/lib/dal'

const Home = async () => {
  await verifyAdminSession();

  return (
    <></>
  )
}

export default Home