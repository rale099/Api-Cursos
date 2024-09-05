
import React, {useRef, useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "primereact/button";
//importaciones de sweetAlert 


const RegistroInscripcion = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [inscripcion, setInscripcion] = useState(location.state.inscripcion);
    
    const url = 'http://localhost:8080/api/incripciones';

    //funcion para dare formato de modeda al precio
    const formatCurrency = (value) =>{
        return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'})
    }; 
    
    const priceBodyTemplate = () =>{
        return formatCurrency(price);
    }
    //funcion para calcular el total de la incripcion
    const totalPagar = inscripcion.inscripcionCursoList.reduce((total, item) => total + item.curso.precio, 0);
    //funcion para obtener la fecha del sistema y con formato aaa-MD-dd
    const getDateNow = () =>{
        let date = new Date();
        let day = `${(date.getDate())}`.padStart(2, '0');
        let month = `${(date.getMonth()+1)}`.padStart(2, '0');
        let year = date.getFullYear();
        let fullDate = `${year}--${month}--${day}`
        return fullDate;
    }
    //funcion para guardar la inscripcion
    const saveInscripcion = async() =>{
        if(inscripcion.inscripcionCursoList.length > 0){
            try{
                //seteamos datos complementarios
                inscripcion.monto = totalPagar;
                inscripcion.fecha = getDateNow();
                const response = await axios.post(url, inscripcion);
                if(response.status===201){
                    const {message} = response.data;
                    mySwal.fire({
                        title: <p>Realizado</p>,
                        text: message,
                        icon: 'success', 
                        confirmButtomText: 'Aceptar',
                    });
                    inscripcion.inscripcionCursoList = [];
                    navigate("/incripciones", {state: {inscripcion}});
                }
            }catch(err){
                console.log(err);
            }
        }
    } 
    return (
        <div>
            <h1>CLiente: {inscripcion.usuario.nombre}</h1>
            <h2>DETALLE DE LA INSCRIPCION</h2>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Curso</th>
                            <th className="px-6 py-3">Decripcion</th>
                            <th className="px-6 py-3">Especialidad</th>
                            <th className="px-6 py-3">Instructor</th>
                            <th className="px-6 py-3">Precio</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {inscripcion.inscripcionCursoList.map((item)=>(
                            <tr key={item.curso.id} className="bg-white border-b dark:bg-gray-800
                            dark:border-gray-700">
                                <td className="px-6 py-4">{item.curso.nombre}</td>
                                <td className="px-6 py-4">{item.curso.descripcion}</td>
                                <td className="px-6 py-4">{item.curso.instructor.especialidad.nombre}</td>
                                <td className="px-6 py-4">{item.curso.instructor.nombre}</td>
                                <td className="px-6 py-4">{priceBodyTemplate (item.curso.precio)}</td>
                                <td className="px-6 py-4">
                                    <Button icon="pi pi-trash" rounded outlined severity="danger"></Button>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={3} className="px-6 py-4">
                                <Button icon="pi pi-check" severity="success" onClick={saveInscripcion}>Confirmar Inscripcion</Button>
                            </td>
                            <td className="px-6 py-4">
                                Total a pagar 
                            </td>
                            <td className="px-6 py-4">
                                {priceBodyTemplate(totalPagar)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RegistroInscripcion