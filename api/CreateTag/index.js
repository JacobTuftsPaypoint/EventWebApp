const cosmos = require('@azure/cosmos');
const endpoint = "https://eventwebappdatabase.documents.azure.com:443/";
const key = "HGel9WGpWShhRhbF4Nk7cHsWdws24SfsxYrtykKNiRmIzTWDzoWQR2iz92q6rAFY1f6sSyURdkbgJHnohyZeEg==";
const { CosmosClient } = cosmos;

const client = new CosmosClient({ endpoint, key });
const container = client.database("EventWebApp").container("Tags");


module.exports = async function (context, req) {
    context.log("Create Tag Called")

    const tag={
        name:req.body.name
    }

    const {resource} = await container.items.create(tag)


    ResponseOBJ={
        NameInDB:resource.name,
        Status:resource.status
    }

    context.res={
        status:200,
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify(ResponseOBJ)
    }
}