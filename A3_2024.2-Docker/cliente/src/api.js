import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

export const getClientes = () => api.get('/clientes');
export const getProdutos = () => api.get('/produtos');
export const getVendedores = () => api.get('/vendedores');
export const getPedidos = () => api.get('/pedidos');

export const addCliente = (cliente) => api.post('/clientes', cliente);
export const updateCliente = (id, cliente) => api.put(`/clientes/${id}`, cliente);
export const deleteCliente = (id) => api.delete(`/clientes/${id}`);

export const addProduto = (produto) => api.post('/produtos', produto);
export const updateProduto = (id, produto) => api.put(`/produtos/${id}`, produto);
export const deleteProduto = (id) => api.delete(`/produtos/${id}`);

export const addVendedor = (vendedor) => api.post('/vendedores', vendedor); 
export const deleteVendedor = (id) => api.delete(`/vendedores/${id}`);
export const updateVendedor = (id, vendedor) => api.put(`/vendedores/${id}`, vendedor);

export const addPedido = (clienteId, itens) => api.post('/pedidos', { cliente_id: clienteId, itens });

export const deletePedido = (id) => api.delete(`/pedidos/${id}`);

export const associarProdutoVendedor = (vendedorId, produtoId) =>
    api.post('/vendedores_produtos', { vendedor_id: vendedorId, produto_id: produtoId });

// Adiciona um produto ao pedido, incluindo a quantidade
export const addProdutoAoPedido = (pedidoId, produtoId, quantidade) => 
    api.post('/pedidos/produtos', { pedido_id: pedidoId, produto_id: produtoId, quantidade });

// Login do ademiro
export const login = async (usuario, senha) => {
    try {
        const response = await api.post('/login', { usuario, senha });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default api;