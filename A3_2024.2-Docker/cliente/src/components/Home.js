import React, { useState } from 'react';
import DashboardProdutos from './DashboardProdutos';
import ProdutosManager from './GerenciarProdutos';
import DashboardClientes from './DashboardClientes';
import ClientesManager from './GerenciarClientes';
import DashboardPedidos from './DashboardPedidos';
import PedidosManager from './GerenciarPedidos';
import DashboardVendedores from './DashboardVendedores';
import VendedoresManager from './GerenciarVendedores';
import '../css/Home.css';

function Home() {
    const [activeTab, setActiveTab] = useState('dashboardprodutos');

    return (
        <div>
            <div className="top-menu">
                <button
                    className={`menu-button ${activeTab === 'dashboardprodutos' ? 'active' : ''}`}
                    type="button"
                    onClick={() => setActiveTab('dashboardprodutos')}
                >
                    Produtos
                </button>
                <button
                    className={`menu-button ${activeTab === 'produtosmanager' ? 'active' : ''}`}
                    type="button"
                    onClick={() => setActiveTab('produtosmanager')}
                >
                    Gerenciar Produtos
                </button>

                <button
                    className={`menu-button ${activeTab === 'dashboardclientes' ? 'active' : ''}`}
                    type="button"
                    onClick={() => setActiveTab('dashboardclientes')}
                >
                    Clientes
                </button>
                <button
                    className={`menu-button ${activeTab === 'clientesmanager' ? 'active' : ''}`}
                    type="button"
                    onClick={() => setActiveTab('clientesmanager')}
                >
                    Gerenciar Clientes
                </button>

                <button
                    className={`menu-button ${activeTab === 'dashboardpedidos' ? 'active' : ''}`}
                    type="button"
                    onClick={() => setActiveTab('dashboardpedidos')}
                >
                    Pedidos
                </button>
                <button
                    className={`menu-button ${activeTab === 'pedidosmanager' ? 'active' : ''}`}
                    type="button"
                    onClick={() => setActiveTab('pedidosmanager')}
                >
                    Gerenciar Pedidos
                </button>

                <button
                    className={`menu-button ${activeTab === 'dashboardvendedores' ? 'active' : ''}`}
                    type="button"
                    onClick={() => setActiveTab('dashboardvendedores')}
                >
                    Vendedores
                </button>
                <button
                    className={`menu-button ${activeTab === 'vendedoresmanager' ? 'active' : ''}`}
                    type="button"
                    onClick={() => setActiveTab('vendedoresmanager')}
                >
                    Gerenciar Vendedores
                </button>
            </div>

            {activeTab === 'dashboardprodutos' && <DashboardProdutos />}
            {activeTab === 'produtosmanager' && <ProdutosManager />}
            {activeTab === 'dashboardclientes' && <DashboardClientes />}
            {activeTab === 'clientesmanager' && <ClientesManager />}
            {activeTab === 'dashboardpedidos' && <DashboardPedidos />}
            {activeTab === 'pedidosmanager' && <PedidosManager />}
            {activeTab === 'dashboardvendedores' && <DashboardVendedores />}
            {activeTab === 'vendedoresmanager' && <VendedoresManager />}

            <p id="bottom-text">© 2024 - 2024 www.a3ferramentas.com.br - All Rights Reserved.</p>
        </div>
    );
}

export default Home;
