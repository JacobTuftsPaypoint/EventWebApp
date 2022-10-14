const cosmos = require('@azure/cosmos');
const endpoint = process.env.CosmosEndpoint;
const key = process.env.CosmosKey;
const { CosmosClient } = cosmos;

const client = new CosmosClient({ endpoint, key });
const container = client.database("EventWebApp").container("Events");


module.exports = async function (context, req) {
    context.log("Get Event Called")

    console.log(req.query.id)

    const resource = await (await container.item(req.query.id,req.query.id).read()).resource

    console.log(resource)

    let ResponseOBJ={
        Tags:resource
    }

    context.res={
        status:200,
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify(ResponseOBJ)
    }
}