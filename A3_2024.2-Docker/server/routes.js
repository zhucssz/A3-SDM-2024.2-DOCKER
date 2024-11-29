const express = require('express');
const db = require('./db');
const router = express.Router();

// Rota de login, usuário e senha aqui
router.post('/login', (req, res) => {
    const { usuario, senha } = req.body;
    if (usuario === 'admin' && senha === 'admin') {
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Credenciais inválidas.' });
    }
});

// Envia um cliente para a tabela clientes
router.post('/clientes', (req, res) => {
    const { nome, email, cpf, endereco, telefone } = req.body;
    db.run('INSERT INTO clientes (nome, email, cpf, endereco, telefone) VALUES (?, ?, ?, ?, ?)', 
    [nome, email, cpf, endereco, telefone], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, nome, email, cpf, endereco, telefone });
    });
});

// Fetch em todos os clientes da tabela clientes
router.get('/clientes', (req, res) => {
    db.all('SELECT * FROM clientes', [], (err, linhas) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(linhas);
    });
});

// Edita um cliente da tabela clientes usando um id
router.put('/clientes/:id', (req, res) => {
    const { nome, email, cpf, endereco, telefone } = req.body;
    const { id } = req.params;
    db.run('UPDATE clientes SET nome = ?, email = ?, cpf = ?, endereco = ?, telefone = ? WHERE id = ?', 
    [nome, email, cpf, endereco, telefone, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Cliente atualizado com sucesso' });
    });
});

// Deletar um cliente da tabela clientes usando o id
router.delete('/clientes/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM clientes WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Cliente removido com sucesso' });
    });
});

// Enviar um vendedor para tabela vendedores
router.post('/vendedores', (req, res) => {
    const { nome, email, cnpj, endereco, telefone } = req.body;
    db.run('INSERT INTO vendedores (nome, email, cnpj, endereco, telefone) VALUES (?, ?, ?, ?, ?)', 
    [nome, email, cnpj, endereco, telefone], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, nome, email, cnpj, endereco, telefone });
    });
});

// Fetch em todos os vendedores da tabela vendedores 
router.get('/vendedores', (req, res) => {
    const sql = `
        SELECT v.id, v.nome, v.email, v.cnpj, v.endereco, v.telefone, p.id AS produto_id, p.nome AS produto_nome, p.preco
        FROM vendedores v
        LEFT JOIN vendedores_produtos vp ON v.id = vp.vendedor_id
        LEFT JOIN produtos p ON vp.produto_id = p.id;
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const vendedoresMap = {};
        rows.forEach(row => {
            if (!vendedoresMap[row.id]) {
                vendedoresMap[row.id] = {
                    id: row.id,
                    nome: row.nome,
                    email: row.email,
                    cnpj: row.cnpj,
                    endereco: row.endereco,
                    telefone: row.telefone,
                    produtos: []
                };
            }
            if (row.produto_id) {
                vendedoresMap[row.id].produtos.push({
                    id: row.produto_id,
                    nome: row.produto_nome,
                    preco: row.preco
                });
            }
        });

        res.json(Object.values(vendedoresMap));
    });
});

// Remover um vendedor
router.delete('/vendedores/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM vendedores WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Vendedor removido com sucesso' });
        console.log(`Vendedor com ID ${id} removido`);
    });
});

// Editar um vendedor
router.put('/vendedores/:id', (req, res) => {
    const { nome, email, cnpj, endereco, telefone } = req.body;
    const { id } = req.params;
    const query = `
        UPDATE vendedores 
        SET nome = COALESCE(?, nome), 
            email = COALESCE(?, email),
            cnpj = COALESCE(?, cnpj), 
            endereco = COALESCE(?, endereco), 
            telefone = COALESCE(?, telefone) 
        WHERE id = ?
    `;
    db.run(query, [nome, email, cnpj, endereco, telefone, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Vendedor atualizado com sucesso' });
    });
});

// Linkar um produto a um vendedor
router.post('/vendedores_produtos', (req, res) => {
    const { vendedor_id, produto_id } = req.body; // Get from body
    db.run('INSERT INTO vendedores_produtos (vendedor_id, produto_id) VALUES (?, ?)', [vendedor_id, produto_id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, vendedor_id, produto_id });
        console.log(`Produto ${produto_id} associado ao vendedor ${vendedor_id}`);
    });
});

// Buscar os produtos pelo id do vendedor
router.get('/vendedores/:id/produtos', (req, res) => {
    const { id } = req.params;
    db.all(
        `SELECT p.id, p.nome, p.preco, p.categoria, p.estoque FROM produtos p
        JOIN vendedores_produtos vp ON p.id = vp.produto_id
        WHERE vp.vendedor_id = ?`,
        [id],
        (err, linhas) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(linhas);
        }
    );
});

// Enviar um produto para a tabela produtos, passando nome e preco
router.post('/produtos', (req, res) => {
    const { nome, preco, categoria, estoque } = req.body;
    db.run('INSERT INTO produtos (nome, preco, categoria, estoque) VALUES (?, ?, ?, ?)', 
    [nome, preco, categoria, estoque], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, nome, preco, categoria, estoque });
    });
}); 

// Fetch em todos os produtos da tabela produtos
router.get('/produtos', (req, res) => {
    db.all('SELECT * FROM produtos', [], (err, linhas) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(linhas);
    });
});

// Editar o produto na tabela produtos usando o id
router.put('/produtos/:id', (req, res) => {
    const { nome, preco, categoria, estoque } = req.body;
    const { id } = req.params;
    db.run('UPDATE produtos SET nome = ?, preco = ?, categoria = ?, estoque = ? WHERE id = ?', 
    [nome, preco, categoria, estoque, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Produto atualizado com sucesso' });
    });
});

// Deletar um produto na tabela produtos usando o id
router.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM produtos WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Produto removido com sucesso' });
    });
});

// Post na tabela pedidos usando a api
router.post('/pedidos', (req, res) => {
    const { cliente_id, itens } = req.body;

    if (!cliente_id || !itens || itens.length === 0) {
        return res.status(400).json({ error: 'Cliente e itens são obrigatórios' });
    }

    db.run('INSERT INTO pedidos (cliente_id) VALUES (?)', [cliente_id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        const pedidoId = this.lastID;
        const itemPromises = itens.map(item => {
            return new Promise((resolve, reject) => {
                db.run(
                    'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade) VALUES (?, ?, ?)',
                    [pedidoId, item.produto_id, item.quantidade],
                    function (err) {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        });

        Promise.all(itemPromises)
            .then(() => res.status(201).json({ message: 'Pedido criado com sucesso', pedidoId }))
            .catch(error => res.status(500).json({ error: error.message }));
    });
});

// Obter todos os pedidos com detalhes do cliente e produtos
router.get('/pedidos', (req, res) => {
    const sql = `
        SELECT 
            p.id AS pedido_id, 
            c.id AS cliente_id,
            c.nome AS cliente_nome, 
            p.data AS pedido_data,
            ip.quantidade,
            pr.id AS produto_id,
            pr.nome AS produto_nome, 
            pr.preco
        FROM pedidos p
        JOIN clientes c ON p.cliente_id = c.id
        JOIN itens_pedido ip ON p.id = ip.pedido_id
        JOIN produtos pr ON ip.produto_id = pr.id
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const pedidosMap = {};
        rows.forEach(row => {
            if (!pedidosMap[row.pedido_id]) {
                pedidosMap[row.pedido_id] = {
                    pedido_id: row.pedido_id,
                    cliente_id: row.cliente_id,
                    cliente_nome: row.cliente_nome,
                    pedido_data: row.pedido_data,
                    itens: [],
                    total: 0  // Adiciona um campo para o total
                };
            }

            const itemTotal = row.quantidade * row.preco;  // Calcula o total por item
            pedidosMap[row.pedido_id].total += itemTotal;  // Soma o total do item ao total do pedido

            pedidosMap[row.pedido_id].itens.push({
                produto_id: row.produto_id,
                produto_nome: row.produto_nome,
                preco: row.preco,
                quantidade: row.quantidade,
                total: itemTotal  // Adiciona o total do item
            });
        });

        const pedidos = Object.values(pedidosMap);
        res.json(pedidos);
    });
});

// Deletar um pedido da tabela pedidos usando o id
router.delete('/pedidos/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM itens_pedido WHERE pedido_id = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        db.run('DELETE FROM pedidos WHERE id = ?', [id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Pedido removido com sucesso' });
        });
    });
});

module.exports = router;