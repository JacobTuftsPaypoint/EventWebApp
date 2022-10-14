const cosmos = require('@azure/cosmos');
const endpoint = process.env.CosmosEndpoint;
const key = process.env.CosmosKey;
const { CosmosClient } = cosmos;

const client = new CosmosClient({ endpoint, key });
const container = client.database("EventWebApp").container("Events");


module.exports = async function (context, req) {
    context.log("Create Event Called")

    const event=req.body

    const {resource} = await container.items.create(event)
    
    ResponseOBJ={
        EventInDB:resource,
        Status:resource.status
    }

    context.res={
        status:200,
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify(ResponseOBJ)
    }
}