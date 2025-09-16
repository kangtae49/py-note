import './App.css'
import {add} from '@/components/utils'
import viteSvg from 'public/vite.svg'
import { useEffect } from 'react'
function App() {
  useEffect(() => {
    window.addEventListener('pywebviewready', function() {
      window.pywebview?.api?.sayHelloTo("py").then((res) => {
        console.log(res)
      })
    })
  }, [])


  return (
    <>
    <div> hello world!@! {add(2, 1)}</div>
    <img src={viteSvg} />
    <div>{}</div>
    </>
  )
}

export default App
