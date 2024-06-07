import { useEffect, useState } from 'react';
import './App.css';

export const App = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', age: '', grades: [] });

  const get_all_estudiantes = async () => {
    const peticion = await fetch('http://localhost:3000/students/');
    const data = await peticion.json();
    setEstudiantes(data);
    console.log(data)
  };

  useEffect(() => {
    get_all_estudiantes();
  }, []);

  const handleEditClick = (student) => {
    setEditing(student._id);
    setFormData({ ...student });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGradeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedGrades = [...formData.grades];
    updatedGrades[index] = {
      ...updatedGrades[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      grades: updatedGrades,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/students/:id${editing}", {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      get_all_estudiantes();
      setEditing(null);
    } else {
      console.error('Failed to update student');
    }
  };

  return (
    <>
      {estudiantes.map(({ _id, name, age, grades }) => (
        <div key={_id} className={`student ${editing === _id ? 'editing' : ''}`}>
          {editing === _id ? (
            <form onSubmit={handleSubmit}>
              <label >Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <label >Edad</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
              <div className="infoNotas">
                {formData.grades.map((grade, index) => (
                  <div key={grade._id} className="notas">
                    <label >Semestre</label>
                    <input
                      type="text"
                      name="semester"
                      value={grade.semester}
                      onChange={(e) => handleGradeChange(index, e)}
                    />
                    <label >Nota</label>
                    <input
                      type="number"
                      name="grade"
                      value={grade.grade}
                      onChange={(e) => handleGradeChange(index, e)}
                    />
                  </div>
                ))}
              </div>
              <button type="submit">Guardar</button>
            </form>
          ) : (
            <>
              <h2>{name}</h2>
              <h3>Edad: {age}</h3>
              <h3>Notas:</h3>
              <div className="infoNotas">
                {grades.map(({ semester, grade, _id }) => (
                  <div key={_id} className="notas">
                    <h4>Semestre: {semester}</h4>
                    <h4>Nota: {grade}</h4>
                  </div>
                ))}
              </div>
              <button onClick={() => handleEditClick({ _id, name, age, grades })}>
                Editar
              </button>
            </>
          )}
        </div>
      ))}
    </>
  );
};