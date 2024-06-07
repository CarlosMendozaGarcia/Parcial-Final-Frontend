import { useEffect, useState } from 'react'
import './App.css'

export const App = () => {

  const [estudiantes, setEstudiantes] = useState([])

  const get_all_estudiantes = async () => {
    const peticion = await fetch('http://localhost:3000/students/')
    const data = await peticion.json()
    setEstudiantes(data)
  }

  useEffect(() => {
    get_all_estudiantes()
  },[])

  console.log(estudiantes)
  return (
    <>
      {
        estudiantes.map(({id, name, age, grades}) => (
          <div key={id}>
            <h1>{name}</h1>
            <h3>Edad: {age}</h3>
            <h3>Notas:</h3>
            <div class="infoNotas">
            {
              grades.map(({semester, grade, id }) => (
                <div key= {id} class="notas">
                  <h4> Semestre : {semester}</h4>
                  <h4> Nota: {grade} </h4>
                </div>
              )) 
            }
            </div>
            <button id={id}>Editar</button>
          </div>
        ))
      }
    </>
  )  
}