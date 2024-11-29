const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('banco_de_dados.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT UNIQUE NOT NULL,
            email TEXT NOT NULL,
            endereco TEXT,
            telefone TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            preco REAL NOT NULL,
            categoria TEXT,
            estoque INTEGER DEFAULT 0
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS vendedores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cnpj TEXT UNIQUE NOT NULL,
            email TEXT NOT NULL,
            endereco TEXT,
            telefone TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS vendedores_produtos (
            vendedor_id INTEGER,
            produto_id INTEGER,
            FOREIGN KEY (vendedor_id) REFERENCES vendedores (id),
            FOREIGN KEY (produto_id) REFERENCES produtos (id),
            PRIMARY KEY (vendedor_id, produto_id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS pedidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_id INTEGER,
            data TEXT DEFAULT (datetime('now', 'localtime')),
            FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        )
    `);

    // Tabela de Itens de Pedido
    db.run(`
        CREATE TABLE IF NOT EXISTS itens_pedido (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pedido_id INTEGER,
            produto_id INTEGER,
            quantidade INTEGER,
            FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
            FOREIGN KEY (produto_id) REFERENCES produtos(id)
        )
    `);

    
    // // Clientes padrões do trabalho
    // db.run(`INSERT INTO clientes (nome, cpf, email, endereco, telefone ) VALUES ('Pedro Alcântara das Neves', 26029313061, 'pedroaln@gmail.com', '69316014', '33964126945')`);
    // db.run(`INSERT INTO clientes (nome, cpf, email, endereco, telefone ) VALUES ('Davi dos Reis da Fonseca Ramos', 77629773099,  'framos@gmail.com', '59012420', '79961617442')`);
    // db.run(`INSERT INTO clientes (nome, cpf, email, endereco, telefone ) VALUES ('Leonardo Almeida de Souza', 81006984062, 'leoalms@gmail.com', '53423466', '88963291140')`);
    // db.run(`INSERT INTO clientes (nome, cpf, email, endereco, telefone ) VALUES ('Roberto Afonso Santos', 87186786022, 'robertoafs@gmail.com', '38706970', '34985719848')`);
    // db.run(`INSERT INTO clientes (nome, cpf, email, endereco, telefone ) VALUES ('Daniela Letícia Neves', 90424670020, 'danilebn@gmail.com', '09336050', '99981502250')`);
    // db.run(`INSERT INTO clientes (nome, cpf, email, endereco, telefone ) VALUES ('Júlio César Souza', 74935991062, 'jucsrsz@gmail.com', '65061540', '48986127709')`);
    // db.run(`INSERT INTO clientes (nome, cpf, email, endereco, telefone ) VALUES ('Vinícius Scaffoldi', 57964514059, 'visc@gmail.com', '78061320', '63966734497')`);
    // db.run(`INSERT INTO clientes (nome, cpf, email, endereco, telefone ) VALUES ('Vitória Menezes', 91805024078, 'vimenz@gmail.com', '78700411', '27984360872')`);
    // db.run(`INSERT INTO clientes (nome, cpf, email, endereco, telefone ) VALUES ('Henrique Gliori', 60393833054, 'hengli@gmail.com', '78142610', '41970183529')`);
    // db.run(`INSERT INTO clientes (nome, cpf, email, endereco, telefone ) VALUES ('Fernanda Almeida Santos', 43188931034, 'fealms@gmail.com', '72883682', '31994059137')`);

    // // Vendedores padrões do trabalho
    // db.run(`INSERT INTO vendedores (nome, cnpj, email, endereco, telefone) VALUES ('Oficina do mecânico', '37941631000115', 'offmec@gmail.com', '65636350', '2250742921')`);
    // db.run(`INSERT INTO vendedores (nome, cnpj, email, endereco, telefone) VALUES ('Amazon', '83609618000180', 'amazon@gmail.com', '87053390', '3129580451')`);
    // db.run(`INSERT INTO vendedores (nome, cnpj, email, endereco, telefone) VALUES ('Aliexpress', '88099757000125', 'aliexp@gmail.com', '24859028', '7138948390')`);
    // db.run(`INSERT INTO vendedores (nome, cnpj, email, endereco, telefone) VALUES ('Alibaba', '23691297000184', 'alibaba@gmail.com', '68906084', '9449446070')`);
    // db.run(`INSERT INTO vendedores (nome, cnpj, email, endereco, telefone) VALUES ('Mercado Livre', '34101962000159', 'meclive@gmail.com', '79017360', '8946334204')`);

    // // Produtos padrões do trabalho
    // // Ferramentas de Aperto
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Chave Inglesa Ajustável 10 Pol 250mm Cromada Sparta', 28.90, 'Ferramentas de Aperto', 100)`);
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Alicate de Bico Meia Cana 6,5 Pol', 31.90, 'Alicates', 100)`);
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Alicate de Pressão 10 Pol.', 51.90, 'Alicates', 100)`);
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Alicate para Anéis Externos com Pontas Retas 19x60mm', 49.99, 'Alicates', 100)`);

    // // Parafusadeiras e Furadeiras
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Parafusadeira Furadeira Impacto Brushless High Torque 1/2 pol 120Nm', 1099.90, 'Parafusadeiras', 50)`);
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Parafusadeira/Furadeira PFV120 a Bateria 12V de Li-Ion 3/8 Pol', 189.90, 'Parafusadeiras', 50)`);
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Furadeira de Impacto 3/8 Pol 550W', 109.90, 'Furadeiras', 75)`);
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Furadeira de Impacto 1/2 Pol 620W', 159.90, 'Furadeiras', 75)`);

    // // Equipamentos
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Moto Esmeril 6 Pol 360W Bivolt', 219.90, 'Equipamentos', 30)`);
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Impermeabilizante Asfáltico 18L.', 149.00, 'Materiais de Construção', 20)`);

    // // Medição
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Trena Laser 40m com Precisão de 0.5mm', 129.90, 'Ferramentas de Medição', 60)`);
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Régua de Alumínio 60cm com Escala Milimetrada', 22.90, 'Ferramentas de Medição', 60)`);

    // // Manutenção e Suporte
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Cavalete de 2 Toneladas', 64.90, 'Manutenção e Suporte', 40)`);
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Cinta de Alavanca para Ajuste de Tensão', 15.90, 'Manutenção e Suporte', 80)`);

    // // Serragem e Corte
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Serra Tico-Tico 500W com Base Plana', 179.90, 'Serragem e Corte', 45)`);
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Lixa de Cinta 75x457mm 360W', 99.90, 'Serragem e Corte', 70)`);

    // // Fixação e Acessórios
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Parafuso de Aço Inox 8x1/2 Pol (Caixa com 100 unidades)', 39.90, 'Fixação e Acessórios', 200)`);
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Cabo de Aço 3mm 10 Metros', 29.90, 'Fixação e Acessórios', 100)`);

    // // Proteção e Segurança
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Luva de Proteção em Látex para Trabalho Pesado', 7.90, 'Proteção e Segurança', 150)`);

    // // Brocas e Pontas
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Broca de Aço Rápido 8mm para Madeira', 5.90, 'Brocas e Pontas', 300)`);

    // // Ferramentas Diversas
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Chave Allen Conjunto 9 Peças', 24.90, 'Ferramentas Diversas', 90)`);
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Chave de Fenda 6 Pol. com Cabo de Borracha', 12.90, 'Ferramentas Diversas', 100)`);
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Martelo de Unha 400g com Cabo de Madeira', 19.90, 'Ferramentas Diversas', 80)`);

    // // Acessórios
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Escada Dobrável 2,5m Alumínio', 169.90, 'Acessórios', 25)`);
    // db.run(`INSERT INTO produtos (nome, preco, categoria, estoque) VALUES ('Jogo de Chave Combinada 6 a 22mm com 12 Peças', 79.90, 'Acessórios', 60)`);


    // // Pedidos padões do trabalho
    // db.run(`INSERT INTO pedidos (cliente_id) VALUES (2)`, function () {
    //     db.run(`INSERT INTO itens_pedido (pedido_id, produto_id, quantidade) VALUES (${this.lastID}, 4, 2)`);
    //     db.run(`INSERT INTO itens_pedido (pedido_id, produto_id, quantidade) VALUES (${this.lastID}, 2, 5)`);
    // });

    // db.run(`INSERT INTO pedidos (cliente_id) VALUES (5)`, function () {
    //     db.run(`INSERT INTO itens_pedido (pedido_id, produto_id, quantidade) VALUES (${this.lastID}, 9, 1)`);
    //     db.run(`INSERT INTO itens_pedido (pedido_id, produto_id, quantidade) VALUES (${this.lastID}, 11, 2)`);
    //     db.run(`INSERT INTO itens_pedido (pedido_id, produto_id, quantidade) VALUES (${this.lastID}, 23, 3)`);
    // });
});

module.exports = db;    