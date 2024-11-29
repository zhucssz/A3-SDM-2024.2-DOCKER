import React, { useEffect, useState } from 'react';
import { getClientes } from '../api';

function DashboardClientes() {
    const [clientes, setClientes] = useState([]);
    const [clienteFilter, setClienteFilter] = useState('');

    const filtroClientes = clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(clienteFilter.toLowerCase())
    );
    
    useEffect(() => {
        (async () => {
            const clientesRes = await getClientes();
            setClientes(clientesRes.data);
        })();
    }, []);

    return (
        <div>
            <h2 class="titleclientes">Clientes</h2>
            <input
                class="filterinput halflarger"
                type="text"
                placeholder="Filtrar cliente pelo nome"
                value={clienteFilter}
                onChange={(e) => setClienteFilter(e.target.value)}
            />  
            <div id="clientescontainer">
                <ul class="goright">
                    {filtroClientes.map(cliente => (
                        <li key={cliente.id} className="clientesObj liitens">
                            <details>
                            <summary className="summaryVendedor">
                                <span className="nomelistid">[ID {cliente.id}]:</span>
                                <span className="nomelist">{cliente.nome}</span>
                                <br></br>
                                <span className="nomelistid">     [EMAIL]:</span>
                                <span className="nomelist">{cliente.email}</span>
                            </summary>
                            <ul>    
                                <span className="nomelistid"> [CPF]:</span>
                                <span className="nomelist">{cliente.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</span>
                                <br></br>
                                <span className="nomelistid"> [CEP]:</span>
                                <span className="nomelist">{cliente.endereco.replace(/(\d{5})(\d{3})/, '$1-$2')}</span>
                                <br></br>
                                <span className="nomelistid"> [TELEFONE]:</span>
                                <span className="nomelist">{cliente.telefone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')}</span>
                            </ul>
                        </details>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}


export default DashboardClientes;
