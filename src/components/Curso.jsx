import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag'
import axios from 'axios';
import { FileUpload } from 'primereact/fileupload';
import { Image } from 'primereact/image';
import { RadioButton } from 'primereact/radiobutton';

export default function Curso({cursosActivos, cursosInactivos}) {
    let emptyCurso = {
        id: null,
        nombre: '',
        descripcion: '',
        precio: 0,
        imagen: null,
        estado: '',
        instructor: null,
    };

    const estados = [
        { name: 'Activo', value: 'A' },
        { name: 'Inactivo', value: 'I' },
    ];


    const [selectedFilter, setSelectedFilter] = useState('activos');
    const [cursos, setCursos] = useState(null);
    const [dialog, setDialog] = useState(false);
    const [instructores, setInstructores] = useState(null);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [changeCursoDialog, setChangeCursoDialog] = useState(false);
    const [curso, setCurso] = useState(emptyCurso);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const urlAPI = 'http://localhost:8080/api/cursos';
    const urlAPII = 'http://localhost:8080/api/instructores';
    const rutaImg = 'http://localhost:8080/images/cursos/'

    useEffect(() => {
        if (selectedFilter === 'activos') {
            getCursos();
        } else {
            getCursosInactivos();
        }
        getInstructores();
    }, [selectedFilter, cursosActivos, cursosInactivos]);

    const getCursos = async () =>{
        try{
            const resp = await axios.get(urlAPI);
            setCursos(resp.data)
        } catch (err) {
            console.log(err);
        }
    }

    const getCursosInactivos = async () =>{
        try{
            const resp = await axios.get(`${urlAPI}/inactivos`);
            
            setCursos(resp.data)
        } catch (err) {
            console.log(err);
        }
    }

    const getInstructores = async () =>{
        try{
            const resp = await axios.get(urlAPII);
            setInstructores(resp.data)
        } catch (err) {
            console.log(err);
        }
    }

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD'});
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.precio);
    }

    const getSeverity = (curso) => {
        switch (curso.estado) {
            case 'A':
                return 'success';

            case 'I':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.estado == 'A' ? 'Activo' : 'Inactivo'} severity={getSeverity(rowData)}></Tag>;
    };

    const openNew = () => {
        setCurso(emptyCurso);
        setSelectedInstructor(null);
        setSubmitted(false);
        setDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPreviewImage(null)
        setDialog(false);
    };

    const hideChangeCursoDialog = () => {
        setChangeCursoDialog(false);
    };

    const createFormData = () => {
        let formData = new FormData();
        curso.instructor = selectedInstructor;
        if (selectedImage == null) {
            if (curso.id == null) {
                curso.imagen = null;
                curso.estado = 'A';
                formData.append("imagen", null);
            }
        } else {
            formData.append("imagen", selectedImage)
        }
        formData.append("curso",
            new Blob([JSON.stringify(curso)], {type: "application/json"})
        );
        return formData;
    }

    const saveOrUpdate = async () => {
        setSubmitted(true);

        if (curso.nombre.trim()) {
            let _cursos = [...cursos];
            let _curso = createFormData();

            if(curso.id == null) {//Agregando un curso
                try {
                    const resp = await axios.post(urlAPI, _curso, {
                        headers:{
                            'Content-Type' : 'multipart/form-data'
                        }
                    });
                    if (resp.status === 201) {
                        const {message, curso} = resp.data;
                        toast.current.show({ severity: 'success', summary: 'Registrado', detail: message, life: 3000 });
                        _cursos.unshift(curso)
                        setCursos(_cursos);
                        setDialog(false);
                        setCurso(emptyCurso);
                    }
                } catch (err) {
                    const {message} = err.response.data;
                    if (err.response.status === 409) {
                        toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: message, life: 3000 });
                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
                    }
                }
            } else {//Actualizando -> Tarea pa nosotros
                try {
                    const resp = await axios.put(urlAPI`/${curso.id}`, _curso, {
                        headers:{
                            'Content-Type' : 'multipart/form-data'
                        }
                    });
                    if (resp.status === 202) {
                        const {message, curso} = resp.data;
                        const index = _cursos.findIndex(e=> e.id === curso.id)
                        _cursos.splice(index,1, curso)
                        toast.current.show({ severity: 'success', summary: 'Actualizado', detail: message, life: 2000 });
                        setCursos(_cursos);
                        setDialog(false);
                        setCurso(emptyCurso);
                    }
                } catch (err) {
                    const {message} = err.response.data;
                    if (err.response.status === 409) {
                        toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: message, life: 2000 });
                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 2000 });
                    }
                }
            } 
        }
    };

    const editCurso = (curso) => {
        setCurso({ ...curso });
        setSelectedInstructor({...curso.instructor});
        setDialog(true);
    };

    const confirmChangeCurso = (curso) => {
        setCurso(curso);
        setChangeCursoDialog(true);
    };

    const changeStateCurso = async () => {
        let _cursos = cursos.filter((val) => val.id !== curso.id);
        const _estado = curso.estado == 'A' ? 'I' : 'A';
        try {
            const resp = await axios.put(`$+{urlAPI}/change-state?estado=${_estado}`, curso);
            if (resp.status === 202) {
                const {message} = resp.data;
                setCursos(_cursos);
                setChangeCursoDialog(false);
                setCurso(emptyCurso);
                
                toast.current.show({ severity: 'success', summary: 'Estado cambiado', detail: message, life: 3000 });
            }
        } catch (err) {
            const {message, error} = err.response.data;
            if (err.response.status === 500){
                setChangeCursoDialog(false);
                setCurso(emptyCurso);
                toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
                console.log(error)
            } else {
                console.log(err);
            }
        }
    };

    const onChangeImage = (e) => {
        const file = e.files[0];
        setSelectedImage(file);
        setPreviewImage(URL.createObjectURL(file));
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onInstructorChange = (e) => {
        let _curso = { ...curso };

        _curso['instructor'] = e.value;
        setCurso(_curso);
    };

    const onInputChange = (e, nombre) => {
        const val = (e.target && e.target.value) || '';
        let _curso = { ...curso };

        _curso[`${nombre}`] = val;

        setCurso(_curso);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _curso = { ...curso };

        _curso[`${name}`] = val;

        setCurso(_curso);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const centerToolbarTemplate = () => {
        return <div className='flex flex-wrap gap-3'>
            <div className='flex align-items-center'>
                <RadioButton 
                    inputId="activos" 
                    name="curso" 
                    value="activos" 
                    onChange={(e) => setSelectedFilter(e.value)} 
                    checked={selectedFilter === 'activos'}                
                />
                <label htmlFor="activos" className='ml-2'>Activos</label>
            </div>
            <div className='flex align-items-center'>
                <RadioButton 
                    inputId="inactivos" 
                    name="curso" 
                    value="inactivos" 
                    onChange={(e) => setSelectedFilter(e.value)} 
                    checked={selectedFilter === 'inactivos'}                
                />
                <label htmlFor="inactivos" className='ml-2'>Inactivos</label>
            </div>
        </div>
     };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editCurso(rowData)} />
                <Button icon={rowData.estado == 'A' ? "pi pi-times" : "pi pi-check"} rounded outlined severity={rowData.estado == 'A' ? 'danger':'success'} onClick={() => confirmChangeCurso(rowData)} />
            </React.Fragment>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={`${rutaImg}/${rowData.imagen}`} alt={rowData.imagen} className="shadow-2 border-round" style={{ width: '64px' }} />;
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Crud cursos</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar cursos..." />
            </IconField>
        </div>
    );

    const cursoDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveOrUpdate} />
        </React.Fragment>
    );

    const changeCursoDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideChangeCursoDialog} />
            <Button label="Si" icon="pi pi-check" severity="danger" onClick={changeStateCurso} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} center={centerToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={cursos}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 15]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} cursos" globalFilter={globalFilter} header={header}>
                    <Column field="nombre" header="Nombre" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="descripcion" header="Descipcion" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="imagen" header="Imagen" body={imageBodyTemplate}></Column>
                    <Column field="precio" header="Precio" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="estado" header="Estado" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="instructor.nombre" header="Instructor" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={dialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={curso.id == null ? 'Registro de cursos' : 'Actualizacion de cursos'} modal className="p-fluid" footer={cursoDialogFooter} onHide={hideDialog}>
            {curso.imagen && <img src={`${rutaImg}``${curso.imagen}`} alt={curso.imagen} className="product-image block m-auto pb-3" />}
                <div className="field">
                    <label htmlFor="nombre" className="font-bold">
                        Nombre
                    </label>
                    <InputText id="nombre" value={curso.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !curso.nombre })} />
                    {submitted && !curso.nombre && <small className="p-error">Nombre es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="descripcion" className="font-bold">
                        Descripcion
                    </label>
                    <InputTextarea id="descripcion" value={curso.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} required rows={3} cols={20} />
                    {submitted && !curso.descripcion && <small className="p-error">Descipcion es requerida.</small>}
                </div> 
                <div className="field">
                    <label htmlFor="precio" className="font-bold">
                        Precio
                    </label>
                    <InputNumber id="precio" value={curso.precio} onValueChange={(e) => onInputNumberChange(e, 'precio')} mode="currency" currency="USD" locale="en-US" required autoFocus className={classNames({ 'p-invalid': submitted && !curso.precio  > 0})} />
                    {submitted && !curso.precio && <small className="p-error">El precio debe ser mayor a 0</small>}
                </div>
                <div className="field">
                    <label htmlFor="Instructor" className="font-bold">
                        Instructor
                    </label>
                    <Dropdown value={selectedInstructor} onChange={(e) => setSelectedInstructor(e.value)} options={instructores} optionLabel="nombre" 
                        placeholder="Seleccionar instructor" className="w-full md:w-14rem clasesNames({ 'p-invalid': submitted && selectedInstructor == })"/>
                    {submitted && selectedInstructor == null && <small className="p-error">Seleccione un instructor</small>}
                </div>
                <div className="field">
                    <FileUpload name='imagen' chooseLabel='Seleccionar imagen' accept='image/*' mode='basic' customUpload uploadHandler={onChangeImage} auto/>
                </div>
                {
                    previewImage && (
                        <div className='field'>
                            <Image src={previewImage} alt='Imagen' width='200'preview/>
                        </div>
                    )
                }
            </Dialog>

            <Dialog visible={changeCursoDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={changeCursoDialogFooter} onHide={hideChangeCursoDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {curso && (
                        <span>
                            Desea cambiar el estado del curso <b>{curso.nombre}</b> a <b>{curso.estado == 'A' ? 'Inactivo' : 'Activo'} ?</b>
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}