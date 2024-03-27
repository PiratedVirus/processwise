'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
import { Result, Button } from 'antd'
import { useRouter } from 'next/navigation'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
  const router = useRouter();
  return (
    <div>
  <Result
    status="warning"
    title="There are some problems with your data."
    subTitle="Please make sure you are passing the correct attachment."
    extra={
      <Button className='bg-blue-600 text-white' type="primary" key="console" onClick={() => router.back()}>
        Go back
      </Button>
    }
  />
    </div>
  )
}