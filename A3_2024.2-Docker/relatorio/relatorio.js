/*
    Esse script puxa os dados do banco de dados e cria um arquivo em pdf, separando por queries e em diferentes endpoints.
    Ao abrir o endpoint da query desejada, o browser iniciará o download do pdf automaticamente, no título do relatório terá o tipo de query utilizada e a data do momento de download.
*/

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const moment = require('moment');
const PDFDocument = require('pdfkit');

// Caminho do banco de dados e porta utilizada:
const DATABASE_PATH = 'banco_de_dados.db';
const app = express();
const PORT = 4000;

// Função que retorna a data no momento utilizando o formato "Dia_Mês_Ano-Hora-Minuto"
const dataAgora = () => {
    const now = moment();
    return now.format('DD_MM_YYYY-HH_mm');
};

const db = new sqlite3.Database(DATABASE_PATH, (err) => {
    if (err) {
        console.error('Erro: ', err.message);
    }
});

app.get('/', (req, res) => {
    res.send('acesse um dos endpoints');
});

/*
    Os endpoints disponíveis são listados aqui:
    Ao iniciar o servidor, os links serão exibidos no console, para seguir basta apertar ctrl + click com o mouse em cima do link
*/
app.listen(PORT, () => {
    console.log(`Produtos mais vendidos:\nhttp://localhost:${PORT}/produtos-mais-vendidos\n`);
    console.log(`Produtos por pedido:\nhttp://localhost:${PORT}/produtos-por-pedido\n`);
    console.log(`Gasto médio por cliente:\nhttp://localhost:${PORT}/gasto-medio-por-cliente\n`);
    console.log(`Produtos com baixo estoque:\nhttp://localhost:${PORT}/baixo-estoque`);
});

// Endpoint de produtos mais vendidos
app.get('/produtos-mais-vendidos', (req, res) => {
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="relatorio-mais-vendidos-${dataAgora()}.pdf"`);

    doc.pipe(res);

    // Query SQL para pegar o nome dos produtos mais vendidos
    const queries = {
        prodMaisVendido: `
            SELECT 
                p.nome AS produto_nome, 
                SUM(ip.quantidade) AS total_vendido
            FROM 
                itens_pedido ip
            JOIN 
                produtos p ON ip.produto_id = p.id
            GROUP BY 
                p.id
            ORDER BY 
                total_vendido DESC;
        `
    };

    const results = {};

    const fetchData = (queryKey) => {
        return new Promise((resolve, reject) => {
            db.all(queries[queryKey], [], (err, rows) => {
                if (err) reject(err);
                results[queryKey] = rows;
                resolve();
            });
        });
    };

    Promise.all(
        Object.keys(queries).map(queryKey => fetchData(queryKey))
    ).then(() => {
        doc.fontSize(18).text('RELATÓRIO A3FERRAMENTAS', { align: 'center' }).moveDown();

        // Produto Mais Vendido
        doc.fontSize(15).text('> Produtos Mais Vendidos: ').moveDown(0.75);
        //* Slice para pegar apenas 3 produtos, pode ser retirado depois para pegar mais, fizemos para ficar um top 3 apenas
        results.prodMaisVendido.slice(0, 3).forEach(row => {
            doc.fillColor('black').fontSize(13)
                .text(`[${row.produto_nome}] >> `, { continued: true })
                .fillColor('green').text(`[${row.total_vendido} ${row.total_vendido > 1 ? 'VENDIDOS' : 'VENDIDO'}]`)
                .moveDown(0.5);
        });
        doc.moveDown();

        doc.end();
    }).catch(err => {
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        }
    });
});

app.get('/produtos-por-pedido', (req, res) => {
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="relatorio-produtos-por-pedido-${dataAgora()}.pdf"`);

    doc.pipe(res);

    // Query SQL para pegar o nome dos produtos por pedido
    const queries = {
        prodPorPedido: `
            SELECT 
                pe.id AS pedido_id, 
                c.nome AS cliente_nome, 
                p.nome AS produto_nome, 
                ip.quantidade
            FROM 
                pedidos pe
            JOIN 
                clientes c ON pe.cliente_id = c.id
            JOIN 
                itens_pedido ip ON pe.id = ip.pedido_id
            JOIN 
                produtos p ON ip.produto_id = p.id
            ORDER BY 
                pe.id, c.nome;
        `
    };

    const results = {};

    const fetchData = (queryKey) => {
        return new Promise((resolve, reject) => {
            db.all(queries[queryKey], [], (err, rows) => {
                if (err) reject(err);
                results[queryKey] = rows;
                resolve();
            });
        });
    };

    Promise.all(
        Object.keys(queries).map(queryKey => fetchData(queryKey))
    ).then(() => {
        doc.fontSize(18).text('RELATÓRIO A3FERRAMENTAS', { align: 'center' }).moveDown();

        // Produto por Pedido
        doc.fillColor('black').fontSize(15).text('> Produto por Pedido:').moveDown(0.75);
        results.prodPorPedido.forEach(row => {
            doc.fillColor('black').fontSize(13).text(`[${row.produto_nome}] >> `, { continued: true }).fillColor('green').text(`[${row.quantidade} ${row.quantidade > 1 ? 'PRODUTOS' : 'PRODUTO'}]`).moveDown(0.5);
        });

        doc.end();
    }).catch(err => {
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        }
    });
});

// Query SQL para pegar o nome dos clientes e o gasto médio e total deles
app.get('/gasto-medio-por-cliente', (req, res) => {
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="relatorio-gasto-medio-cliente-${dataAgora()}.pdf"`);

    doc.pipe(res);

    const queries = {
        gastoMedio: `
            SELECT 
                c.nome AS cliente_nome, 
                ROUND(SUM(p.preco * ip.quantidade), 2) AS total_gasto,
                ROUND(AVG(p.preco * ip.quantidade), 2) AS gasto_medio
            FROM 
                clientes c
            JOIN 
                pedidos pe ON c.id = pe.cliente_id
            JOIN 
                itens_pedido ip ON pe.id = ip.pedido_id
            JOIN 
                produtos p ON ip.produto_id = p.id
            GROUP BY 
                c.id
            ORDER BY 
                total_gasto DESC;
        `
    };

    const results = {};

    const fetchData = (queryKey) => {
        return new Promise((resolve, reject) => {
            db.all(queries[queryKey], [], (err, rows) => {
                if (err) reject(err);
                results[queryKey] = rows;
                resolve();
            });
        });
    };

    Promise.all(
        Object.keys(queries).map(queryKey => fetchData(queryKey))
    ).then(() => {
        doc.fontSize(18).text('RELATÓRIO A3FERRAMENTAS', { align: 'center' }).moveDown();

        // Gasto Médio
        doc.fillColor('black').fontSize(15).text('> Gasto Médio por Cliente: ').moveDown(0.75);
        results.gastoMedio.forEach(row => {
            doc.fillColor('black')
                .fontSize(13).text(`[${row.cliente_nome}] >> TOTAL = `, { continued: true })
                .fillColor('green').text(`R$${row.total_gasto}`, { continued: true })
                .fillColor('black').text(` | MÉDIA = `, { continued: true })
                .fillColor('green').text(`R$${row.gasto_medio}`).moveDown(0.5);
        });

        doc.end();
    }).catch(err => {
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        }
    });
});

// Query SQL para pegar o nome dos produtos com baixo estoque, retorna nome e estoque
app.get('/baixo-estoque', (req, res) => {
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="relatorio-estoque-${dataAgora()}.pdf"`);

    doc.pipe(res);

    // Estoque abaixo ou igual a 50 é considerado baixo
    const queries = {
        baixoEstoque: `
            SELECT 
                nome AS produto_nome, 
                estoque
            FROM 
                produtos
            WHERE 
                estoque <= 50
            ORDER BY 
                estoque ASC;
        `
    };

    const results = {};

    const fetchData = (queryKey) => {
        return new Promise((resolve, reject) => {
            db.all(queries[queryKey], [], (err, rows) => {
                if (err) reject(err);
                results[queryKey] = rows;
                resolve();
            });
        });
    };

    Promise.all(
        Object.keys(queries).map(queryKey => fetchData(queryKey))
    ).then(() => {
        doc.fontSize(18).text('RELATÓRIO A3FERRAMENTAS', { align: 'center' }).moveDown();

        // Produtos com Baixo Estoque
        doc.fillColor('black').fontSize(15).text('> Produtos com Baixo Estoque:').moveDown(0.75);
        results.baixoEstoque.forEach(row => {
            doc.fillColor('black')
                .fontSize(13).text(`[${row.produto_nome}] >> `, { continued: true })
                .fillColor('red').text(`${row.estoque} em estoque. `).moveDown(0.5);
        });

        doc.end();
    }).catch(err => {
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        }
    });
});
