module.exports = async function (context, req) {
    const cosmos = require('@azure/cosmos');
    const endpoint = process.env["CosmosEndpoint"];
    const key = process.env["CosmosKey"];
    const { CosmosClient } = cosmos;

    const client = new CosmosClient({ endpoint, key });
    const container = client.database("EventWebApp").container("Events");


    context.log("Get Events called")
    
    const resource = await (await container.items.readAll().fetchAll()).resources

    ResponseOBJ={
        Events:resource
    }

    context.res={
        status:200,
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify(ResponseOBJ)
    }
}