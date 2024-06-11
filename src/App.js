// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import ToolRegisterForm from './components/ToolRegisterForm';
import WorkRegisterForm from './components/WorkRegisterForm';
import StockPage from './components/StockPage';
import WithdrawalForm from './components/WithdrawalForm';
import ReturnForm from './components/ReturnForm';
import MaintenancePage from './components/MaintenancePage';
import ReportsPage from './components/ReportsPage';
import Login from './components/Login';
import UserRegisterForm from './components/UserRegisterForm';
import SteelEntry from './components/SteelEntry';
import SteelExit from './components/SteelExit';
import SteelReport from './components/SteelReport';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="App">
      {isAuthenticated && (
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <NavDropdown title="Cadastro" id="cadastro-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/cadastrar-ferramenta">Cadastrar Ferramenta</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/cadastrar-obra">Cadastrar Obra</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/cadastrar-usuario">Cadastrar Usuário</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/outros">Outros</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Estoque" id="estoque-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/estoque">Visualizar Estoque</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/retirar-ferramenta">Retirar Ferramenta</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/devolver-ferramenta">Devolver Ferramenta</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Manutenção" id="manutencao-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/manutencao">Gestão de Manutenção</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Relatórios" id="relatorios-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/relatorios">Relatórios de Ferramentas</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Aço" id="aco-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/aco-entrada">Entrada</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/aco-saida">Saída</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/aco-relatorio">Relatório</NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <Nav>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}

      <Container className="mt-4">
        <Routes>
          <Route path="/login" element={<Login onLogin={setIsAuthenticated} />} />
          {isAuthenticated ? (
            <>
              <Route path="/cadastrar-ferramenta" element={<ToolRegisterForm refreshTools={() => {}} />} />
              <Route path="/cadastrar-obra" element={<WorkRegisterForm refreshWorks={() => {}} />} />
              <Route path="/cadastrar-usuario" element={<UserRegisterForm refreshUsers={() => {}} />} />
              <Route path="/outros" element={<div>Outros</div>} />
              <Route path="/estoque" element={<StockPage />} />
              <Route path="/retirar-ferramenta" element={<WithdrawalForm refreshTools={() => {}} />} />
              <Route path="/devolver-ferramenta" element={<ReturnForm refreshTools={() => {}} />} />
              <Route path="/manutencao" element={<MaintenancePage />} />
              <Route path="/relatorios" element={<ReportsPage />} />
              <Route path="/aco-entrada" element={<SteelEntry />} />
              <Route path="/aco-saida" element={<SteelExit />} />
              <Route path="/aco-relatorio" element={<SteelReport />} />
            </>
          ) : (
            <Route path="/" element={<Login onLogin={setIsAuthenticated} />} />
          )}
        </Routes>
      </Container>
    </div>
  );
}

export default App;
