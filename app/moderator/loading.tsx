import CenterSpin from "@/app/ui/CenterSpin"
import {Skeleton} from 'antd'
export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <>
              <Skeleton active />
              <h1>LOADING</h1>
        </>
    ) 
  }