import React, { useState, useEffect } from 'react';
import { getProdutos, getVendedores, addVendedor, associarProdutoVendedor, deleteVendedor, updateVendedor } from '../api';

function VendedoresManager() {
    const [vendedores, setVendedores] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [novoVendedor, setNovoVendedor] = useState({ nome: '', cnpj: '', email: '', endereco: '', telefone: '' });
    const [vendedorId, setVendedorId] = useState('');
    const [produtoId, setProdutoId] = useState('');
    const [vendedorEditar, setVendedorEditar] = useState({ nome: '', cnpj: '', email: '', endereco: '', telefone: '' });

    // Carrega a lista de produtos e vendedores
    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseProdutos = await getProdutos();
                const responseVendedores = await getVendedores();
                setProdutos(responseProdutos.data);
                setVendedores(responseVendedores.data);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        };
        fetchData();
    }, []);

    function cnpjValido(cnpj) {
        cnpj = cnpj.replace(/\D/g, '');
        if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
    
        const calc = (base, pos) => {
            let sum = 0, factor = base.length + 1;
            for (let i = 0; i < base.length; i++) {
                sum += parseInt(base[i]) * factor--;
                if (factor < 2) factor = pos;
            }
            return (sum % 11 < 2 ? 0 : 11 - (sum % 11));
        };
    
        const base = cnpj.slice(0, 12);
        const digit1 = calc(base, 9);
        const digit2 = calc(base + digit1, 9);
    
        return cnpj.endsWith(`${digit1}${digit2}`);
    }
    
    // Adiciona um novo vendedor
    const handleAddVendedor = async () => {
        try {
            if(!cnpjValido(novoVendedor.cnpj)) {
                alert("CNPJ inválido, tente novamente! ");
                return;
            }
            const response = await addVendedor(novoVendedor);
            setVendedores([...vendedores, response.data]);
            setNovoVendedor({ nome: '', cnpj: '', email: '', endereco: '', telefone: '' }); 
            alert(`Vendedor ${response.data.nome} criado com sucesso!`);
        } catch (error) {
            console.error('Erro ao criar vendedor:', error);
        }
    };

    // Remove um vendedor
    const handleDeleteVendedor = async () => {
        if (!vendedorId) {
            alert('Selecione um vendedor para remover.');
            return;
        }
        try {
            await deleteVendedor(vendedorId);
            setVendedores(vendedores.filter((vendedor) => vendedor.id !== vendedorId));
            alert('Vendedor removido com sucesso!');
        } catch (error) {
            console.error('Erro ao remover vendedor:', error);
        }
    };

    // Edita um vendedor
    const handleUpdateVendedor = async () => {
        if (!vendedorId) {
            alert('Selecione um vendedor para editar.');
            return;
        }
        if(!cnpjValido(vendedorEditar.cnpj)) {
            alert("CNPJ inválido, tente novamente! ");
            return;
        }
        try {
            await updateVendedor(vendedorId, vendedorEditar);
            setVendedores(vendedores.map((v) => (v.id === vendedorId ? { ...v, ...vendedorEditar } : v)));
            setVendedorEditar({ nome: '', cnpj: '', email: '', endereco: '', telefone: '' });
            alert('Vendedor atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao editar vendedor:', error);
        }
    };

    const handleAssociarProdutoVendedor = async (vendedorId, produtoId) => {
        try {
            const response = await associarProdutoVendedor(vendedorId, produtoId);
            if (response.data) {
                alert(`Produto ${produtoId} associado ao vendedor ${vendedorId} com sucesso!`);
            } else {

            }
        } catch (error) {
            console.error('Erro ao associar produto ao vendedor:', error);
        }
    };

    return (
        <div>
            <h2 id="gervendedorestitle">Adicionar Vendedor</h2>
            <input
                type="text"
                placeholder="Nome"
                value={novoVendedor.nome}
                onChange={(e) => setNovoVendedor({ ...novoVendedor, nome: e.target.value })}
                class="firstinput"
            />
            <input
                type="text"
                placeholder="CNPJ"
                value={novoVendedor.cnpj}
                onChange={(e) => setNovoVendedor({ ...novoVendedor, cnpj: e.target.value })}
                class="firstinput"
            />
            <input
                type="email"
                placeholder="Email"
                value={novoVendedor.email}
                onChange={(e) => setNovoVendedor({ ...novoVendedor, email: e.target.value })}
                class="secondinput"
            />
            <input
                type="text"
                placeholder="Endereço"
                value={novoVendedor.endereco}
                onChange={(e) => setNovoVendedor({ ...novoVendedor, endereco: e.target.value })}
                class="firstinput"
            />
            <input
                type="text"
                placeholder="Telefone"
                value={novoVendedor.telefone}
                onChange={(e) => setNovoVendedor({ ...novoVendedor, telefone: e.target.value })}
                class="firstinput"
            />
            <button onClick={handleAddVendedor} class="buttons">Adicionar Vendedor</button>

            <h2>Remover Vendedor</h2>
            <select onChange={(e) => setVendedorId(e.target.value)} value={vendedorId} class="selectvendedor selectlarger">
                <option value="">Selecione um vendedor para remover</option>
                {vendedores.map((vendedor) => (
                    <option key={vendedor.id} value={vendedor.id}>
                        ID {vendedor.id} - {vendedor.nome}
                    </option>
                ))}
            </select>
            <button onClick={handleDeleteVendedor} class="buttons">Remover Vendedor</button>

            <h2>Editar Vendedor</h2>
            <select onChange={(e) => setVendedorId(e.target.value)} value={vendedorId} class="selectvendedor selectlarger">
                <option value="">Selecione um vendedor para editar</option>
                {vendedores.map((vendedor) => (
                    <option key={vendedor.id} value={vendedor.id}>
                        ID {vendedor.id} - {vendedor.nome}
                    </option>
                ))}
            </select>
            <br></br>
            <br></br>
            <input
                type="text"
                placeholder="Novo Nome"
                value={vendedorEditar.nome}
                onChange={(e) => setVendedorEditar({ ...vendedorEditar, nome: e.target.value })}
                class="firstinput"
            />
            <input
                type="text"
                placeholder="Novo CNPJ"
                value={vendedorEditar.cnpj}
                onChange={(e) => setVendedorEditar({ ...vendedorEditar, cnpj: e.target.value })}
                class="firstinput"
            />
            <input
                type="email"
                placeholder="Novo Email"
                value={vendedorEditar.email}
                onChange={(e) => setVendedorEditar({ ...vendedorEditar, email: e.target.value })}
                class="secondinput"
            />
            <input
                type="text"
                placeholder="Novo Endereço"
                value={vendedorEditar.endereco}
                onChange={(e) => setVendedorEditar({ ...vendedorEditar, endereco: e.target.value })}
                class="firstinput"
            />
            <input
                type="text"
                placeholder="Novo Telefone"
                value={vendedorEditar.telefone}
                onChange={(e) => setVendedorEditar({ ...vendedorEditar, telefone: e.target.value })}
                class="firstinput"
            />
            <button onClick={handleUpdateVendedor} class="buttons">Editar Vendedor</button>

            <h2>Associar Produto a Vendedor</h2>
            <select onChange={(e) => setVendedorId(e.target.value)} value={vendedorId} class="selectvendedor selecthalf">
                <option value="">Selecione um vendedor</option>
                {vendedores.map((vendedor) => (
                    <option key={vendedor.id} value={vendedor.id}>
                        ID {vendedor.id} - {vendedor.nome}
                    </option>
                ))}
            </select>

            <select onChange={(e) => setProdutoId(e.target.value)} value={produtoId} class="selectproduto selectlarger">
                <option value="">Selecione um produto</option>
                {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                        ID {produto.id} - {produto.nome}
                    </option>
                ))}
            </select>

            <button onClick={() => handleAssociarProdutoVendedor(vendedorId, produtoId)} class="buttons">Associar Produto a Vendedor</button>
        </div>
    );
}

export default VendedoresManager;