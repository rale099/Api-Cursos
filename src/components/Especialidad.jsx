import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';

export default function Especialidad() {
    let emptyEspecialidad = {
        id: null,
        nombre: '',
    };

    const [especialidades, setEspecialidades] = useState(null);
    const [dialog, setDialog] = useState(false);
    const [deleteEspecialidadDialog, setDeleteEspecialidadDialog] = useState(false);
    const [especialidad, setEspecialidad] = useState(emptyEspecialidad);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const urlAPI = 'http://localhost:8080/api/especialidades';

    useEffect(() => {
        getEspecialidades();
    }, []);

    const getEspecialidades = async () =>{
        try{
            const resp = await axios.get(urlAPI);
            setEspecialidades(resp.data)
        } catch (err) {
            console.log(err);
        }
    }

    const openNew = () => {
        setEspecialidad(emptyEspecialidad);
        setSubmitted(false);
        setDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDialog(false);
    };

    const hideDeleteEspecialidadDialog = () => {
        setDeleteEspecialidadDialog(false);
    };

    const saveOrUpdate = async () => {
        setSubmitted(true);

        if (especialidad.nombre.trim()) {
            let _especialidades = [...especialidades];
            let _especialidad = { ...especialidad };

            if (_especialidad.id == null) {
                //logica para guardar una especialidad
                try {
                    const resp = await axios.post(urlAPI, _especialidad);
                    console.log(resp);
                    const {message, especialidad} = resp.data;
                    if (resp.status === 201) {
                        toast.current.show({ severity: 'success', summary: 'Registrado', detail: message, life: 3000 });
                        _especialidades.unshift(especialidad)
                        setEspecialidades(_especialidades);
                        setDialog(false);
                        setEspecialidad(emptyEspecialidad);
                    }
                } catch (err) {
                    const {message} = err.response.data;
                    if (err.response.status === 409) {
                        toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: message, life: 3000 });
                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
                    }
                }
            } else {
                //logica para actualizar una especialidad
                try {
                    const resp = await axios.put(urlAPI + `/${especialidad.id}`, _especialidad);
                    // console.log(resp);
                    if (resp.status === 202) {

                        const {message, especialidad} = resp.data;
                        const index = _especialidades.findIndex(e => e.id === especialidad.id)
                        _especialidades[index] = especialidad;

                        toast.current.show({ severity: 'success', summary: 'Actualizado', detail: message, life: 3000 });

                        setEspecialidades(_especialidades);
                        setDialog(false);
                        setEspecialidad(emptyEspecialidad);
                    }
                    
                } catch (err) {
                    const {message} = err.response.data;
                    if (err.response.status === 409) {
                        toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: message, life: 3000 });
                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
                    }
                }
            }
        }
    };

    const editEspecialidad = (especialidad) => {
        setEspecialidad({ ...especialidad });
        setDialog(true);
    };

    const confirmDeleteEspecialidad = (especialidad) => {
        setEspecialidad(especialidad);
        setDeleteEspecialidadDialog(true);
    };

    const deleteEspecialidad = async () => {
        let _especialidades = especialidades.filter((val) => val.id !== especialidad.id);
        try {
            const resp = await axios.delete(urlAPI + `/${especialidad.id}`);
            if (resp.status === 200) {
                const {message} = resp.data;
                setEspecialidades(_especialidades);
                setDeleteEspecialidadDialog(false);
                setEspecialidad(emptyEspecialidad);
                toast.current.show({ severity: 'success', summary: 'Eliminado', detail: message, life: 3000 });
            }
        } catch (err) {
            const {message, error} = err.response.data;
            if (err.response.status === 500) {
                setDeleteEspecialidadDialog(false);
                setEspecialidad(emptyEspecialidad);
                toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
            } else {

            }
        }        
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onInputChange = (e, nombre) => {
        const val = (e.target && e.target.value) || '';
        let _especialidad = { ...especialidad };

        _especialidad[`${nombre}`] = val;

        setEspecialidad(_especialidad);
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

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editEspecialidad(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteEspecialidad(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Crud especialidades</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar especialidades..." />
            </IconField>
        </div>
    );
    const EspecialidadDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveOrUpdate} />
        </React.Fragment>
    );
    const deleteEspecialidadDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteEspecialidadDialog} />
            <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteEspecialidad} />
        </React.Fragment>
    );
    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={especialidades}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 15]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} especialidades" globalFilter={globalFilter} header={header}>
                    <Column field="nombre" header="Especialidad" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={dialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Registro de especialidades" modal className="p-fluid" footer={EspecialidadDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nombre
                    </label>
                    <InputText id="nombre" value={especialidad.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !especialidad.nombre })} />
                    {submitted && !especialidad.nombre && <small className="p-error">Nombre es obligatorio.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteEspecialidadDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteEspecialidadDialogFooter} onHide={hideDeleteEspecialidadDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {especialidad && (
                        <span>
                            Estas seguro de que quieres eliminar la especialidad <b>{especialidad.nombre}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}