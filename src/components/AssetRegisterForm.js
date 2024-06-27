// src/components/AssetRegisterForm.js
import React, { useState, useContext } from 'react';
import AssetTypeContext from '../context/AssetTypeContext';
import AssetContext from '../context/AssetContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import '../App.css';

const AssetRegisterForm = () => {
  const [assetDetails, setAssetDetails] = useState({
    nome: '',
    tipo: '',
    marca: '',
    modelo: '',
    ano: '',
    departamento: '',
    condicao: '',
    trocaOleoKm: '' // Adicione este campo
  });

  const [showModal, setShowModal] = useState(false);
  const [newField, setNewField] = useState('');
  const [modalField, setModalField] = useState('');

  const { assetTypes, brands, models, departments, addAssetType, addBrand, addModel, addDepartment } = useContext(AssetTypeContext);
  const { addAsset } = useContext(AssetContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssetDetails({ ...assetDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addAsset(assetDetails);
    setAssetDetails({
      nome: '',
      tipo: '',
      marca: '',
      modelo: '',
      ano: '',
      departamento: '',
      condicao: '',
      trocaOleoKm: '' // Limpe este campo após o envio
    });
  };

  const handleAddField = () => {
    switch(modalField) {
      case 'tipo':
        addAssetType(newField);
        break;
      case 'marca':
        addBrand(newField);
        break;
      case 'modelo':
        addModel(newField);
        break;
      case 'departamento':
        addDepartment(newField);
        break;
      default:
        break;
    }
    setNewField('');
    setShowModal(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="container asset-register-form">
        <h2>Cadastro de Ativo</h2>
        <div className="form-group">
          <label>Nome:</label>
          <input type="text" name="nome" value={assetDetails.nome} onChange={handleChange} required />
        </div>
        <div className="form-group d-flex align-items-center">
          <label>Tipo:</label>
          <select name="tipo" value={assetDetails.tipo} onChange={handleChange} required className="flex-grow-1 mr-2">
            <option value="">Selecione o tipo</option>
            {assetTypes.map((type) => (
              <option key={type._id} value={type.typeName}>{type.typeName}</option>
            ))}
          </select>
          <Button variant="primary" onClick={() => { setShowModal(true); setModalField('tipo'); }}>+</Button>
        </div>
        <div className="form-group d-flex align-items-center">
          <label>Marca:</label>
          <select name="marca" value={assetDetails.marca} onChange={handleChange} required className="flex-grow-1 mr-2">
            <option value="">Selecione a marca</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand.name}>{brand.name}</option>
            ))}
          </select>
          <Button variant="primary" onClick={() => { setShowModal(true); setModalField('marca'); }}>+</Button>
        </div>
        <div className="form-group d-flex align-items-center">
          <label>Modelo:</label>
          <select name="modelo" value={assetDetails.modelo} onChange={handleChange} required className="flex-grow-1 mr-2">
            <option value="">Selecione o modelo</option>
            {models.map((model) => (
              <option key={model._id} value={model.name}>{model.name}</option>
            ))}
          </select>
          <Button variant="primary" onClick={() => { setShowModal(true); setModalField('modelo'); }}>+</Button>
        </div>
        <div className="form-group d-flex align-items-center">
          <label>Departamento:</label>
          <select name="departamento" value={assetDetails.departamento} onChange={handleChange} required className="flex-grow-1 mr-2">
            <option value="">Selecione o departamento</option>
            {departments.map((department) => (
              <option key={department._id} value={department.name}>{department.name}</option>
            ))}
          </select>
          <Button variant="primary" onClick={() => { setShowModal(true); setModalField('departamento'); }}>+</Button>
        </div>
        <div className="form-group">
          <label>Condição:</label>
          <select name="condicao" value={assetDetails.condicao} onChange={handleChange} required>
            <option value="">Selecione a condição</option>
            <option value="Novo">Novo</option>
            <option value="Usado">Usado</option>
          </select>
        </div>
        <div className="form-group">
          <label>Troca de Óleo a Cada (km):</label>
          <input type="number" name="trocaOleoKm" value={assetDetails.trocaOleoKm} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Registrar Ativo</button>
      </form>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Novo {modalField}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>{`Novo ${modalField.charAt(0).toUpperCase() + modalField.slice(1)}:`}</label>
            <input type="text" value={newField} onChange={(e) => setNewField(e.target.value)} className="form-control" required />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleAddField}>Adicionar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AssetRegisterForm;
