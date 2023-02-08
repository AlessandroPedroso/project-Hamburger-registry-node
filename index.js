const { request, response } = require('express');
const express = require('express');
const uuid = require('uuid');

const port = 3000;

const app=express();
app.use(express.json());

const pedidos = [];

const checkUserID = (request,response,next)=>{

    const {id} = request.params

    const index = pedidos.findIndex(pedido => pedido.id === id);

    if(index < 0){
        return response.status(404).json({message:"not found id"});
    }

    request.userID = id;
    request.userIndex = index;
    next();

}

const checkMethod = (request,response,next) => {

    const methodrequest = request.method;
    const url = request.url;

    console.log(`[${methodrequest}] ${url}`);
    next();

}

app.post('/order', checkMethod,(request,response)=>{

    const {order,clientName,price,status} = request.body;

    const pedido = {

        id:uuid.v4(),
        order:order,
        clientName:clientName,
        price:price,
        status:status
    }

    pedidos.push(pedido)


    return response.status(201).json(pedido);

});

app.get('/order', checkMethod, (request,response)=>{

    return response.json(pedidos);

});

app.put('/order/:id', checkUserID, checkMethod,(request,response)=>{

    const {order,clientName,price,status} = request.body;

    const id = request.userID;
    const index = request.userIndex;

    const updatePedido = {
        id,
        order,
        clientName,
        price,
        status
    }

    pedidos[index] = updatePedido


    return response.json(updatePedido);

});

app.delete('/order/:id', checkUserID, checkMethod, (request,response)=>{

    const index = request.userIndex;

    pedidos.splice(index,1);

    return response.status(204).json();
});

app.get('/order/:id',checkUserID, checkMethod, (request,response)=>{

    const index = request.userIndex;

    const pedido = pedidos[index];

    return response.json(pedido);

})

app.patch('/order/:id', checkUserID, checkMethod,(request,response)=>{
    
    const {status} = request.body

    const id = request.userID;
    const index = request.userIndex;

    const updatePedido = {id:id,status:status};

    pedidos[index].status = updatePedido.status;

    return response.json(updatePedido);

})



app.listen(port, ()=>{
    console.log("❤️server started on port 3000❤️")
})