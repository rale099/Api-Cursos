import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Link } from 'react-router-dom';


export default function InscripcionCliente() {
    let emptyInscripciones = {
        id: null,
        estado: '',
        fecha: '',
        monto: null,
        usuario: {id: "2", "nombre":"Maria Ramos"},
        inscripcionCursoList: []
    }

    useEffect(() => {
        // CursoService.getCursos().then((data) => setCursos(data.slice(0, 12)));
        getInscripciones();
        getCursos();
    }, []);


   const [inscripciones, setInscripciones] = useState(null);
   const [inscripcion, setInscripcion] = useState(emptyInscripciones);
   const [submitted, setSubmitted] = useState(false);
   const [selectedCursos, setSelectedCursos] = useState([]);
   const [cursos, setCursos] = useState([]);
   const [curso, setCurso] = useState(null);
   const [cursoAgregado, setCursoAgregado] = useState('');
    const[dialog, setDialog] = useState(false);
   const [layout, setLayout] = useState('grid');
    const toast = useRef(null);
   const urlAPI = 'http://localhost:8080/api/inscripciones';
   const urlAPI2 = 'http://localhost:8080/api/cursos';
   const rutaImg = "http://localhost:8080/images/cursos/";

    const getInscripciones = async () =>{
        try{
            const resp = await axios.get(urlAPI);
            setInscripciones(resp.data);
        }catch(err){
            console.error(err)
        }
    }

    const getCursos = async () =>{
        try{
            const resp = await axios.get(urlAPI2);
            setCursos(resp.data)
        } catch (err) {
            console.log(err);
        }
    }

    const addCursoToList = (item) => {
        let _selectedCursos = [...selectedCursos];
        //verificamos si ya existe un curso seleccionado 
        const existeItem = _selectedCursos.find(curso => curso.id === item.id);
        if(existeItem){
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Este curso ya esta agregado a su inscripcion, elija otro', life: 3000 });
        }else{
            _selectedCursos = [..._selectedCursos, item];
            setSelectedCursos(_selectedCursos);
            //seteamos al arreglo de inscripcionCursoList
            inscripcion.inscripcionCursoList = _selectedCursos;
            console.log(inscripcion.inscripcionCursoList);
            toast.current.show({ severity: 'success', summary: 'Agregado', detail: 'Curso agregado a la inscripcion', life: 3000 });

        }
    }

    const getSeverity = (curso) => {
        switch (curso.estado) {
            case 'A':
                return 'success';

            case 'I':
                return 'danger';

            default:
                return null;
        }
    };


        const openNew = (curso) => {
        setCurso(curso);
        setDialog(true);
    
    };

    const hideDialog = () => {
        setDialog(false);
    };



        

    const listItem = (curso, index) => {
        return (
            <div className="col-12" key={curso.id}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}> 
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`${rutaImg}/${curso.imagen}`} alt="Imagen del curso" />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{curso.nombre}</div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="font-semibold">{curso.instructor.especialidad.nombre}</span>
                                </span>
                                <Tag value={curso.estado} severity={getSeverity(curso)}></Tag>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold">${curso.precio}</span>
                            <Button icon="pi pi-plus" className="p-button-rounded" onClick={() => addCursoToList(curso)}></Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const gridItem = (curso) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={curso.id}>
                <div className="p-4 border-1 surface-border surface-card border-round" style={{ height: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-tag"></i>
                            <span className="font-semibold">{curso.instructor.especialidad.nombre}</span>
                        </div>
                        <Tag value={curso.estado} severity={getSeverity(curso)}></Tag>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5" style={{ flex: 1, overflow: 'hidden' }}>
                        <img className="w-9 shadow-2 border-round" src={`${rutaImg}/${curso.imagen}`} alt="Imagen" />
                        <div className="text-2xl font-bold text-center" >{curso.nombre}</div>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-2xl font-semibold">${curso.precio}</span>
                        <Button icon="pi pi-plus" className="p-button-rounded" onClick={() => addCursoToList(curso)}></Button>
                    </div>
                </div>
            </div>
        );
    };
    

    const itemTemplate = (curso, layout, index) => {
        if (!curso) {
            return;
        }

        if (layout === 'list') return listItem(curso, index);
        else if (layout === 'grid') return gridItem(curso);
    };

    const listTemplate = (cursos, layout) => {
        return <div className="grid grid-nogutter">{cursos.map((curso, index) => itemTemplate(curso, layout, index))}</div>;
    };

    const header = () => {
        return (
            <div className="flex justify-content-end">
                    {inscripcion.inscripcionCursoList.length > 0 && (
                        <Link to="/registro-inscripcion" state={{inscripcion}}>
                            <Button label='Registrar inscripcion' link ></Button>
                        </Link>
                    )}
                {/* <Button className="p-button-rounded mr-6" disabled >Cursos inscritos</Button> */}
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        );
    };


    return (
        
        <div className="card">
            <Toast ref={toast} />


            <DataView value={cursos} listTemplate={listTemplate} layout={layout} header={header()} />


        </div>
    )

    
}