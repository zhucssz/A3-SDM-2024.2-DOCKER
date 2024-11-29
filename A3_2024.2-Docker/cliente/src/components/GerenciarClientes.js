import React, { useState, useEffect } from 'react';
import api, { getClientes, addCliente } from '../api';

function ClientesManager() {
    const [clientes, setClientes] = useState([]);
    const [novoCliente, setNovoCliente] = useState({ nome: '', cpf: '', email: '', endereco: '', telefone: '' });
    const [clienteId, setClienteId] = useState('');
    const [clienteEditar, setClienteEditar] = useState({ nome: '', cpf: '', email: '', endereco: '', telefone: '' });

    useEffect(() => {
        async function fetchData() {
            const clientesResponse = await getClientes();
            setClientes(clientesResponse.data);
        }
        fetchData();
    }, []);

    function cpfValido(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    
        let sum = 0, remainder;
        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    
        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        return remainder === parseInt(cpf.substring(10, 11));
    }

    const handleAddCliente = async () => {
        try {
            if(!cpfValido(novoCliente.cpf)) {
                alert('CPF inválido, tente novamente! ');
                return;
            }
            const response = await addCliente(novoCliente);
            alert(`Cliente ${response.data.nome} criado com sucesso!`);
            setClientes([...clientes, response.data]);
            setNovoCliente({ nome: '', cpf: '', email: '', endereco: '', telefone: '' });
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
        }
    };

    const handleDeleteCliente = async () => {
        if (clienteId) {
            try {
                await api.delete(`/clientes/${clienteId}`);
                alert("Cliente removido com sucesso.");
                setClientes(clientes.filter(cliente => cliente.id !== Number(clienteId)));
                setClienteId('');
            } catch (error) {
                console.error("Erro ao remover cliente:", error);
            }
        }
    };

    const handleEditCliente = async () => {
        if(!cpfValido(clienteEditar.cpf)) {
            alert('CPF inválido, tente novamente. ');
        }
        if (clienteId && (clienteEditar.nome || clienteEditar.cpf || clienteEditar.email||clienteEditar.endereco|| clienteEditar.telefone)) {
            try {
                await api.put(`/clientes/${clienteId}`, clienteEditar);
                alert("Cliente editado com sucesso.");
                setClientes(clientes.map(cliente => 
                    cliente.id === Number(clienteId) ? { ...cliente, ...clienteEditar } : cliente
                ));
                setClienteEditar({ nome: '', cpf: '', email: '', endereco: '', telefone: '' });
                setClienteId('');
            } catch (error) {
                console.error("Erro ao editar cliente:", error);
            }
        }
    };

    return (
        <div>
            <h2 id="gerclientestitle">Adicionar Cliente</h2>
            <input
                type="text"
                placeholder="Nome"
                value={novoCliente.nome}
                className="firstinput"
                onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })}
            />
            <input
                type="text"
                placeholder="CPF"
                className="secondinput"
                value={novoCliente.cpf}
                onChange={(e) => setNovoCliente({ ...novoCliente, cpf: e.target.value })}
            />
            <input
                type="email"
                placeholder="Email"
                className="secondinput"
                value={novoCliente.email}
                onChange={(e) => setNovoCliente({ ...novoCliente, email: e.target.value })}
            />
            <input
                type="text"
                placeholder="Endereço"
                className="secondinput"
                value={novoCliente.endereco}
                onChange={(e) => setNovoCliente({ ...novoCliente, endereco: e.target.value })}
            />
            <input
                type="text"
                placeholder="Telefone"
                className="secondinput"
                value={novoCliente.telefone}
                onChange={(e) => setNovoCliente({ ...novoCliente, telefone: e.target.value })}
            />
            <button onClick={handleAddCliente} className="buttons">Adicionar Cliente</button>

            <h2>Remover Cliente</h2>
            <select onChange={(e) => setClienteId(e.target.value)}className="firstinput selectlarger" value={clienteId || ''}>
                <option value="">Selecione um cliente para remover</option>
                {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>ID {cliente.id} - {cliente.nome}</option>
                ))}
            </select>
            <button onClick={handleDeleteCliente} className="buttons">Remover Cliente</button>

            <h2>Editar Cliente</h2>
            <select onChange={(e) => setClienteId(e.target.value)} className="firstinput selectlarger" value={clienteId || ''}>
                <option value="">Selecione um cliente para editar</option>
                {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>ID {cliente.id} - {cliente.nome}</option>
                ))}
            </select>
            <br></br>
            <br></br>
            <input
                type="text"
                placeholder="Novo Nome"
                className="firstinput"
                value={clienteEditar.nome}
                onChange={(e) => setClienteEditar({ ...clienteEditar, nome: e.target.value })}
            />
            <input
                type="text"
                placeholder="Novo CPF"
                className="firstinput"
                value={clienteEditar.cpf}
                onChange={(e) => setClienteEditar({ ...clienteEditar, cpf: e.target.value })}
            />
            <input
                type="email"
                className="secondinput"
                placeholder="Novo Email"
                value={clienteEditar.email}
                onChange={(e) => setClienteEditar({ ...clienteEditar, email: e.target.value })}
            />
            <input
                type="text"
                placeholder="Novo Endereço"
                className="firstinput"
                value={clienteEditar.endereco}
                onChange={(e) => setClienteEditar({ ...clienteEditar, endereco: e.target.value })}
            />
            <input
                type="text"
                placeholder="Novo Telefone"
                className="firstinput"
                value={clienteEditar.telefone}
                onChange={(e) => setClienteEditar({ ...clienteEditar, telefone: e.target.value })}
            />
            <button onClick={handleEditCliente} className="buttons">Editar Cliente</button>
        </div>
    );
}

export default ClientesManager;
