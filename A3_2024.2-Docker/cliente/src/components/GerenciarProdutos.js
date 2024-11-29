import React, { useState, useEffect } from 'react';
import api, { addProduto, getProdutos } from '../api';

function ProdutosManager() {
    const [produtos, setProdutos] = useState([]);
    const [novoProduto, setNovoProduto] = useState({ nome: '', preco: '', categoria: '', estoque: 0 });
    const [produtoId, setProdutoId] = useState('');
    const [produtoEditar, setProdutoEditar] = useState({ nome: '', preco: 0, categoria: '', estoque: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const produtosData = await getProdutos();
                setProdutos(produtosData.data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error.response ? error.response.data : error.message);
            }
        };
        fetchData();
    }, []);

    // Função para criar um novo produto
    const handleAddProduto = async () => {
        try {
            const response = await addProduto(novoProduto);
            alert(`Produto ${response.data.nome} criado com sucesso!`);
            setProdutos([...produtos, response.data]);
            setNovoProduto({ nome: '', preco: '', categoria: '', estoque: 0 });
        } catch (error) {
            console.error('Erro ao criar produto:', error);
        }
    };

    const handleDeleteProduto = async () => {
        if(produtoId) {
            try {
                await api.delete(`/produtos/${produtoId}`);
                alert("Produto removido com sucesso.");
                setProdutos(produtos.filter(produto => produto.id !== Number(produtoId)));
                setProdutoId('');
            } catch (error) {
                console.error('Erro ao remover produto:', error);
            }
        }
    };

    const handleUpdateProduto = async () => {
        try {
            const response = await api.put(`/produtos/${produtoId}`, produtoEditar);
            setProdutos(produtos.map(produto => produto.id === produtoId ? response.data : produto));
            alert("Produto editado com sucesso.");
            const produtosData = await getProdutos();
            setProdutos(produtosData.data);
            setProdutoId('');
            setProdutoEditar({ nome: '', preco: 0, categoria: '', estoque: 0 });
        } catch (error) {
            console.error('Erro ao editar produto:', error);
        }
    };

    return (
        <div>
            <h2 id="gerprodutostitle">Adicionar Produto</h2>
            <input
                class="firstinput"
                type="text"
                placeholder="Nome"
                value={novoProduto.nome}
                onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
            />
            <input
                class="secondinput"
                type="number"
                placeholder="Preço"
                value={novoProduto.preco}
                onChange={(e) => setNovoProduto({ ...novoProduto, preco: e.target.value})}
            />
            <input
                class="firstinput"
                type="text"
                placeholder="Categoria"
                value={novoProduto.categoria}
                onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })}
            />
            <input
                class="secondinput"
                type="number"
                placeholder="Estoque"
                value={novoProduto.estoque}
                onChange={(e) => setNovoProduto({ ...novoProduto, estoque: e.target.value})}
            />
            <button onClick={handleAddProduto} class="buttons">Adicionar Produto</button>

            <h2>Excluir Produto</h2>
            <select onChange={(e) => setProdutoId(e.target.value)} value={produtoId} className="selectproduto selectlarger">
                <option value="">Selecione um produto para excluir</option>
                {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                        ID {produto.id} - {produto.nome}
                    </option>
                ))}
            </select>
            <button onClick={handleDeleteProduto} className="buttons">Remover Produto</button>

            <h2>Editar Produto</h2>
            <select onChange={(e) => setProdutoId(e.target.value)} value={produtoId} className="selectproduto selectlarger">
                <option value="">Selecione um produto para editar</option>
                {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                        ID {produto.id} - {produto.nome}
                    </option>
                ))}
            </select>
            <br></br>
            <br></br>
            <input
                type="text"
                placeholder="Novo Nome"
                value={produtoEditar.nome || ''}
                onChange={(e) => setProdutoEditar({ ...produtoEditar, nome: e.target.value })}
                className="firstinput"
            />
            <input
                type="number"
                placeholder="Novo Preço"
                value={produtoEditar.preco || 0}
                onChange={(e) => setProdutoEditar({ ...produtoEditar, preco: parseFloat(e.target.value) })}
                className="secondinput"
            />
            <input
                type="text"
                placeholder="Nova Categoria"
                value={produtoEditar.categoria || ''}
                onChange={(e) => setProdutoEditar({ ...produtoEditar, categoria: e.target.value })}
                className="firstinput"
            />
            <input
                type="number"
                placeholder="Novo Estoque"
                value={produtoEditar.estoque || 0}
                onChange={(e) => setProdutoEditar({ ...produtoEditar, estoque: parseFloat(e.target.value) })}
                className="secondinput"
            />
            <button onClick={handleUpdateProduto} className="buttons">Editar Produto</button>
        </div>
    );
}

export default ProdutosManager;
