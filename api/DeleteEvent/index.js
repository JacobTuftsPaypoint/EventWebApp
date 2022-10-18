const cosmos = require('@azure/cosmos');
const endpoint = "https://eventwebappdatabase.documents.azure.com:443/";
const key = "HGel9WGpWShhRhbF4Nk7cHsWdws24SfsxYrtykKNiRmIzTWDzoWQR2iz92q6rAFY1f6sSyURdkbgJHnohyZeEg==";
const { CosmosClient } = cosmos;

const client = new CosmosClient({ endpoint, key });
const container = client.database("EventWebApp").container("Events");


module.exports = async function (context, req) {
    context.log("Delete Event Called")

    console.log(req.query.id)

    const resource = await container.item(req.query.id,req.query.id).delete()

    console.log(resource)

    let ResponseOBJ={
        Tags:resource.statusCode
    }

    context.res={
        status:200,
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify(ResponseOBJ)
    }
}