const cosmos = require('@azure/cosmos');
const endpoint = "https://eventwebappdatabase.documents.azure.com:443/";
const key = "HGel9WGpWShhRhbF4Nk7cHsWdws24SfsxYrtykKNiRmIzTWDzoWQR2iz92q6rAFY1f6sSyURdkbgJHnohyZeEg==";
const { CosmosClient } = cosmos;

const client = new CosmosClient({ endpoint, key });
const container = client.database("EventWebApp").container("Tags");


module.exports = async function (context, req) {
    context.log("Get Tags Called")

    const resource = await (await container.items.readAll().fetchAll()).resources

    ResponseOBJ={
        Tags:resource
    }

    context.res={
        status:200,
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify(ResponseOBJ)
    }
}