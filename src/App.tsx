import './App.css'
import {add} from '@/components/utils'
import logo from 'src/assets/favicon.ico'
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
    <img src={logo} />
    <div>{}</div>
    </>
  )
}

export default App
