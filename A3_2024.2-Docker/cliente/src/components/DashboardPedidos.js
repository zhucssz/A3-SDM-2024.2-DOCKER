import React, { useEffect, useState } from 'react';
import api from '../api';

function Pedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [produtoFilters, setProdutoFilters] = useState({});
    const [clienteFilter, setClienteFilter] = useState(''); // Filtro para o nome do cliente

    useEffect(() => {
        async function fetchPedidos() {
            try {
                const response = await api.get('/pedidos');

                setPedidos(response.data);
            } catch (error) {
                console.error('Erro ao carregar pedidos:', error);
            }
        }
        fetchPedidos();
    }, []);

    const handleProdutoFilterChange = (pedidoId, value) => {
        setProdutoFilters(prevState => ({
            ...prevState,
            [pedidoId]: value,
        }));
    };

    // Filtro de pedidos baseado no nome do cliente
    const pedidosFiltrados = pedidos.filter(pedido =>
        pedido.cliente_nome.toLowerCase().includes(clienteFilter.toLowerCase())
    );

    return (
        <div>
            <h2 class="titlepedidos">Pedidos</h2>
            <input
                className="filterinput halflarger"
                type="text"
                placeholder="Filtrar pedido pelo cliente"
                value={clienteFilter}
                onChange={(e) => setClienteFilter(e.target.value)}
            />

            {pedidosFiltrados.length === 0 ? (
                <div id="pedidoscontainer">
                    <p>Nenhum pedido encontrado.</p>
                </div>
            ) : (
                <div id="pedidoscontainer">
                    <ul className="pedidoslist">
                    {pedidosFiltrados.map(pedido => (
                        <li key={pedido.pedido_id} className="pedidosObj liitens">
                            <details>
                                <summary className="summaryPedido">
                                    <span className="pedido-id">
                                        {[`Pedido [ID ${pedido.pedido_id}]`]}:
                                    </span>
                                    <span className="nomelist">
                                        {`${pedido.cliente_nome} [ID ${pedido.cliente_id}]` || "Cliente não encontrado"}
                                    </span>
                                    <br />
                                    <span className="pedido-data-title">
                                        {"     Data do Pedido:"}
                                    </span>
                                    <span className="nomelist   ">
                                        {new Date(pedido.pedido_data).toLocaleDateString() || "Data inválida"}
                                    </span>
                                    <br />
                                    <span className="pedido-total-title">
                                        {"     Total do Pedido:"}
                                    </span>
                                    <span className="nomelist">
                                        {pedido.total ? 
                                            `R$ ${pedido.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                                            : "R$ 0,00"}
                                    </span>
                                </summary>

                                <input
                                    className="filterinput filterprod halflarger"
                                    type="text"
                                    placeholder="Filtrar produtos pelo nome"
                                    value={produtoFilters[pedido.pedido_id] || ''}
                                    onChange={(e) => handleProdutoFilterChange(pedido.pedido_id, e.target.value)}
                                />

                                <ul>
                                    {pedido.itens && pedido.itens.length > 0 ? (
                                        pedido.itens
                                            .filter(item =>
                                                item.produto_nome.toLowerCase().includes((produtoFilters[pedido.pedido_id] || '').toLowerCase())
                                            )
                                            .map(item => (
                                                <li key={item.produto_nome} className="pedidosObj pedidosObj2">
                                                    <span className="produto-id">
                                                        ID {item.produto_id}
                                                    </span>

                                                    <span class="span-divider">|</span>

                                                    <span className="nomelist">
                                                        {item.produto_nome}
                                                    </span>

                                                    <span class="span-divider">|</span>

                                                    <span className="produto-quantidade">
                                                        {`Qtd: ${item.quantidade}`}
                                                    </span>

                                                    <span class="span-divider">|</span>

                                                    <span className="produto-preco">
                                                        {item.preco ? 
                                                            `R$ ${parseFloat(item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                                                            : "R$ 0,00"}
                                                    </span>

                                                    <span className="produto-total">
                                                        {item.total ? 
                                                            `➤  R$ ${item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                                                            : "Total: R$ 0,00"}
                                                    </span>
                                                </li>
                                            ))
                                    ) : (
                                        <li className="pedidosObj pedidosObj2">Nenhum produto no pedido</li>
                                    )}
                                </ul>
                            </details>
                        </li>
                    ))}
                </ul>
            </div>
            )}
        </div>
    );
}

export default Pedidos;
