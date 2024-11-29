import React, { useEffect, useState } from 'react';
import { getProdutos, getVendedores } from '../api';

function DashboardProdutos() {
    const [, setProdutos] = useState([]);
    const [produtoFilter, setProdutoFilter] = useState('');
    const [produtosComVendedor, setProdutosComVendedor] = useState([]);

    useEffect(() => {
        (async () => {
            const produtosRes = await getProdutos();
            const vendedoresRes = await getVendedores();

            const produtosComVendedorTemp = produtosRes.data.map(produto => {

                const vendedor = vendedoresRes.data.find(v => 
                    v.produtos.some(p => p.id === produto.id)
                );
                return {
                    ...produto,
                    vendedor: vendedor ? { nome: vendedor.nome } : null
                };
            });

            setProdutos(produtosRes.data);
            setProdutosComVendedor(produtosComVendedorTemp);
        })();
    }, []);

    const filtroProdutos = produtosComVendedor.filter(produto =>
        produto.nome.toLowerCase().includes(produtoFilter.toLowerCase())
    );

    return (
        <div>
            <h2 class="titleprodutos">Produtos</h2>
            <input
                className="filterinput halflarger"
                type="text"
                placeholder="Filtrar produto pelo nome"
                value={produtoFilter}
                onChange={(e) => setProdutoFilter(e.target.value)}
            />
            <div id="prodcontainer">
                <ul className="goright">
                    {filtroProdutos.map(produto => (
                        <li key={produto.id} className="clientesObj liitens">
                        <span className="produto-id">[ID {produto.id}]</span>
                        <span className="produto-nome">{produto.nome}</span>
                        <span className="produto-preco"> R$ {parseFloat(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            {produto.vendedor ? (
                                <span className="produto-vendedor comvendedor">
                                    {` Vendedor: ${produto.vendedor.nome}`}
                                </span>
                            ) : (
                                <span className="produto-vendedor semvendedor">
                                    Vendedor não disponível
                                </span>
                            )}
                            <span className="produto-id">[Estoque]:</span>
                            <span className="produto-nome">{produto.estoque}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default DashboardProdutos;
