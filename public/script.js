const tagobj = {
    name:"Sussy"
}

const eventobj = {
    name:"Test event",
    desc:"An event as a test",
    price:10,
    date:"2022-11-01T17:00:00",
    location:"Weatherspoons, Biggleswade",
    Organiser:"jacob Tufts",
    img:"https://upload.wikimedia.org/wikipedia/commons/4/4b/%D0%A0%D0%B0%D0%BD%D0%BA%D0%BE%D0%B2%D1%96_%D0%BA%D0%BE%D0%BB%D1%8C%D0%BE%D1%80%D0%B8_%D1%83_%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7%D0%BD%D0%B8%D0%BA%D1%83_%D0%91%D0%BE%D0%B1%D1%80%D0%BE%D0%B2%D0%BD%D1%8F.jpg",
    tags:[
        "null",
        "null",
        "one",
        "two"
    ]
}
const eventobj2 = "44d5457b-7466-4739-aa1d-24c890fa3f42"

/*
    Server communication:
    Static Web App > Azure Functions > Cosmos DB 
*/

//Adress for local testing
const localAPI = "http://localhost:7071"
const APIAdress = `${localAPI}/api`

//Base GET request as a promise
function HTTPGET(adr) {
    return fetch(adr,{method:"get"})
}

//Base PUT request as a promise
function HTTPPUT(adr,bodyobj) {
    return fetch(adr,{method:"put",body:JSON.stringify(bodyobj)})
}

//Base DELETE request as a promise
function HTTPDelete(adr,id) {
    return fetch(`${adr}?id=${id}`,{method:"delete"})
}

//Create Tag in databse
function CreateTag(tagname) {
    let bodyobj={name:tagname}
    return HTTPPUT(`${APIAdress}/tag`,bodyobj)
}

//Get all tags
function GetTagAll() {
    return HTTPGET(`${APIAdress}/tag/all`).then((response)=>{
        if(response.status==200){
            return(response.json())
        } else {
            return(Promise.reject("Check console for error"))
        }
    })
}

//Create Event in database
function CreateEvent(eventobj) {
    return HTTPPUT(`${APIAdress}/event`,eventobj)
}

//Get event with GUID
function GetEvent(eventid) {
    return HTTPGET(`${APIAdress}/event?id=${eventid}`)
}

//Get all events
function GetEventAll() {
    return HTTPGET(`${APIAdress}/event/all`).then((response)=>{
        if(response.status==200){
            return(response.json())
        } else {
            return(Promise.reject("Check console for error"))
        }
    })
}

//Delete event with GUID
function DeleteEvent(eventid) {
    return HTTPDelete(`${APIAdress}/event`,eventid)
}

//Event Listener
CreateEventCall = document.querySelector("#CreateEvent")
CreateEventCall.addEventListener("click",()=>{
    CreateEventButton()
})

//Template for events in grid
class Event{
    constructor(obj,parentID){
        this.ParentElement = document.querySelector(parentID)
        this.container = document.createElement("article")
        this.title = document.createElement("h2")
        this.img = document.createElement("img")
        this.list1 = document.createElement("ul")
        this.org = document.createElement("li")
        this.location = document.createElement("li")
        this.date = document.createElement("li")
        this.list2 = document.createElement("ul")
        this.pricebutton = document.createElement("button")
        this.infobutton = document.createElement("button")
        this.tagdiv = document.createElement("div")
        this.list3 = document.createElement("ul")
        this.ParentElement.appendChild(this.container)
        this.container.appendChild(this.title)
        this.container.appendChild(this.img)
        this.container.appendChild(this.list1)
        this.container.appendChild(this.list2)
        this.container.appendChild(this.tagdiv)
        this.list1.appendChild(this.org)
        this.list1.appendChild(this.location)
        this.list1.appendChild(this.date)
        this.list2.appendChild(this.pricebutton)
        this.list2.appendChild(this.infobutton)
        this.list2.classList.add("infoholder")
        this.tagdiv.appendChild(this.list3)
        this.list3.classList.add("tags")
        this.title.appendChild(document.createTextNode(String(obj.name)))
        this.img.setAttribute("src",String(obj.img))
        this.org.appendChild(document.createTextNode(String(obj.Organiser)))
        this.location.appendChild(document.createTextNode(String(obj.location)))
        this.date.appendChild(document.createTextNode(String(obj.date)))
        if (obj.price>0) {
            this.pricebutton.appendChild(document.createTextNode(`£${obj.price}`))
        } else {
            this.pricebutton.appendChild(document.createTextNode("Free!"))
        }
        this.pricebutton.classList.add("pricebutton")
        this.infobutton.appendChild(document.createTextNode("Info"))
        obj.tags.forEach(element => {
            let temp = document.createElement("li")
            temp.appendChild(document.createTextNode(String(element)))
            this.list3.appendChild(temp)
        });
    }
}

function CreateEventButton() {
    const container = document.querySelector("#ConfigHolder")

    let EventObject = {
        name:"",
        desc:"",
        price:"",
        date:"",
        location:"",
        Organiser:"",
        img:"",
        tags:[]
    }

    Object.keys(EventObject).forEach(element => {
        container.appendChild(document.createElement("br"))
        let newelabel = document.createElement("label")
        newelabel.for = "input_"+element
        newelabel.appendChild(document.createTextNode(element+":"))
        let newinput = document.createElement("input")
        newinput.type = "text"
        newinput.name = "input_"+element
        newinput.id = "input_"+element
        container.appendChild(newelabel)
        container.appendChild(newinput)
    })
    container.appendChild(document.createElement("br"))
    let newbutton = document.createElement("button")
    newbutton.type = "submit"
    newbutton.appendChild(document.createTextNode("Create"))
    container.appendChild(newbutton)
    container.addEventListener("submit",()=>{
        console.log("done")
        const formdata = new FormData(container)
        let reqobj ={
            name:formdata.get("input_name"),
            desc:formdata.get("input_desc"),
            price:formdata.get("input_price"),
            date:formdata.get("input_date"),
            location:formdata.get("input_location"),
            Organiser:formdata.get("input_Organiser"),
            img:formdata.get("input_img"),
            tags:["one","two","three","four"]           
        }
        CreateEvent(reqobj)
    })
}

GetEventAll().then((result)=>{
    result.Events.forEach(element => {
        new Event(element,"#eventholder")
    });
})




GetTagAll().then((result)=>{
    console.log(result)
})
