const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);

app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;

    if (usuario === 'admin' && senha === 'admin') {
        res.status(200).json({ success: true, message: 'Falha no login' });
    } else {
        res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }
});

app.listen(5000, () => console.log('Server local em http://localhost:5000\n\nAcesse os endpoints usando /api/{cliente, produtos, vendedores, vendedores/{id}/produtos, pedidos}'));