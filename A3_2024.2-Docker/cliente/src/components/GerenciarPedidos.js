import React, { useState, useEffect } from 'react';
import api, { getClientes, getProdutos, getPedidos } from '../api';

function GerenciarPedidos() {
    const [clientes, setClientes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [itensPedido, setItensPedido] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [quantidade, setQuantidade] = useState(1);
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const clientesResponse = await getClientes();
            const produtosResponse = await getProdutos();
            const pedidosResponse = await getPedidos();
            setClientes(clientesResponse.data);
            setProdutos(produtosResponse.data);
            setPedidos(pedidosResponse.data);
        }
        fetchData();
    }, []);

    const adicionarProduto = () => {
        const produto = produtos.find(p => p.id === Number(produtoSelecionado));
        if (produto && quantidade > 0) {
            setItensPedido([
                ...itensPedido,
                {
                    produtoId: produto.id,
                    produtoNome: produto.nome,
                    quantidade,
                    preco: produto.preco,
                    total: produto.preco * quantidade
                }
            ]);
            setQuantidade(1);
            setProdutoSelecionado(null);
        } else {
            alert("Selecione um produto e insira uma quantidade válida.");
        }
    };

    const fecharPedido = async () => {
        if (!clienteSelecionado || itensPedido.length === 0) {
            alert("Por favor, selecione um cliente e adicione produtos ao pedido.");
            return;
        }
    
        const pedido = {
            cliente_id: Number(clienteSelecionado),
            itens: itensPedido.map(item => ({
                produto_id: item.produtoId,
                quantidade: item.quantidade
            }))
        };
    
        try {
            await api.post('/pedidos', pedido, { headers: { 'Content-Type': 'application/json' } });
            alert("Pedido criado com sucesso.");
            setItensPedido([]);
            setClienteSelecionado(null);
            const pedidosResponse = await getPedidos();
            setPedidos(pedidosResponse.data);
        } catch (error) {
            console.error("Erro ao fechar pedido:", error);
            alert("Erro ao fechar o pedido. Tente novamente.");
        }
    };

    const handleDeletePedido = async () => {
        if (pedidoSelecionado) {
            try {
                const idPedido = Number(pedidoSelecionado);
                if (isNaN(idPedido)) {
                    alert("ID do pedido inválido.");
                    return;
                }
    
                await api.delete(`/pedidos/${idPedido}`);
                alert("Pedido removido com sucesso.");
                setPedidos(pedidos.filter(p => p.id !== idPedido)); 
                setPedidoSelecionado(null); 
            } catch (error) {
                console.error("Erro ao remover pedido:", error);
                alert("Erro ao remover o pedido.");
            }
        }
    };

    return (
        <div>
            <h2 id="gerpedidostitle">Adicionar Pedido</h2>

            <select onChange={(e) => setClienteSelecionado(e.target.value)} className="firstinput selectlarger" value={clienteSelecionado || ''}>
                <option value="">Selecione um cliente</option>
                {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>ID {cliente.id} - {cliente.nome}</option>
                ))}
            </select>

            <h3>Adicionar Produtos ao Pedido</h3>
            <select 
                className="firstinput selectlarger"
                value={produtoSelecionado || ''}
                onChange={(e) => setProdutoSelecionado(e.target.value)}
            >
                <option value="">Selecione um produto</option>
                {produtos.map(produto => (
                    <option key={produto.id} value={produto.id}>ID {produto.id} - {produto.nome}</option>
                ))}
            </select>
            <input
                type="number"
                value={quantidade}
                className="firstinput"
                onChange={(e) => setQuantidade(parseInt(e.target.value, 10))}
                min="1"
            />
            <button onClick={adicionarProduto} className="buttons">Adicionar Produto</button>

            <h3>Itens no Pedido:</h3>
            <ul id="listpedidosscroll">
                {itensPedido.map((item, index) => (
                    <li key={index}>
                        {item.produtoNome} - Quantidade: {item.quantidade} - Total: R$ {item.total.toFixed(2)}
                    </li>
                ))}
            </ul>

            <button onClick={fecharPedido} className="buttons">Fechar Pedido</button>

            <h2>Excluir Pedido</h2>
            <select onChange={(e) => setPedidoSelecionado(e.target.value)} className="firstinput selectlarger" value={pedidoSelecionado || ''}>
                <option value="">Selecione um pedido para excluir⠀</option>
                {pedidos.map(pedido => (
                    <option key={pedido.pedido_id} value={pedido.pedido_id}>{`Pedido ${pedido.pedido_id} - Cliente ${pedido.cliente_nome} - R$ ${pedido.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</option>
                ))}
            </select>
            <button onClick={handleDeletePedido} className="buttons">Remover Pedido</button>
        </div>
    );
}

export default GerenciarPedidos;
