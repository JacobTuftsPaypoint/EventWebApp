let ActiveAddTags = false

/*
    Server communication:
    Static Web App > Azure Functions > Cosmos DB 
*/

//Adress for local testing
const localAPI = ""
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
    return HTTPGET(`${APIAdress}/event?id=${eventid}`).then((response)=>{
        if(response.status==200){
            return(response.json())
        } else {
            return(Promise.reject("Check console for error"))
        }
    })
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
let CreateEventCall = document.querySelector("#CreateEvent")
CreateEventCall.addEventListener("click",()=>{
    CreateEventButton()
})

let DeleteEventCall = document.querySelector("#DeleteEvent")
DeleteEventCall.addEventListener("click",()=>{
    DeleteEventButton()
})

let UpdateEventCall = document.querySelector("#UpdateEvent")
UpdateEventCall.addEventListener("click",()=>{
    UpdateEventButton()
})

let CreateTagCall = document.querySelector("#CreateTag")
CreateTagCall.addEventListener("click",()=>{
    CreateTagButton()
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
        this.id = document.createElement("p")
        this.id.appendChild(document.createTextNode(obj.id))
        this.id.classList.add("IDRef")
        this.container.appendChild(this.id)
    }
}

function ClearConfig() {
    let container = document.querySelector("#ConfigHolder")
    container.innerHTML = ("")
}

function CreateEventButton() {
    ClearConfig()
    ActiveAddTags = true
    
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
        if (element == "tags") {
            newelabel.appendChild(document.createTextNode(element+": (Select from list of tags below)"))
        } else if (element == "img") {
            newelabel.appendChild(document.createTextNode(element+": (full URL)"))
        } else {
            newelabel.appendChild(document.createTextNode(element+":"))
        }
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

    document.querySelector("#input_tags").setAttribute("readonly",true)

    container.addEventListener("submit",()=>{
        console.log("done")
        const formdata = new FormData(container)
        let TagList = formdata.get("input_tags").split(",")
        TagList.pop()
        let reqobj ={
            name:formdata.get("input_name"),
            desc:formdata.get("input_desc"),
            price:formdata.get("input_price"),
            date:formdata.get("input_date"),
            location:formdata.get("input_location"),
            Organiser:formdata.get("input_Organiser"),
            img:formdata.get("input_img"),
            tags:TagList        
        }
        ActiveAddTags = false
        CreateEvent(reqobj)
    })
}

function DeleteEventButton(){
    ClearConfig()
    const container = document.querySelector("#ConfigHolder")
    container.appendChild(document.createElement("br"))
    let newelabel = document.createElement("label")
    newelabel.for = "input_id"
    newelabel.appendChild(document.createTextNode("id:"))
    let newinput = document.createElement("input")
    newinput.type = "text"
    newinput.name = "input_id"
    newinput.id = "input_id"
    container.appendChild(newelabel)
    container.appendChild(newinput)
    container.appendChild(document.createElement("br"))
    let newbutton = document.createElement("button")
    newbutton.type = "submit"
    newbutton.appendChild(document.createTextNode("Delete"))
    container.appendChild(newbutton)
    container.addEventListener("submit",(event)=>{
        const formdata = new FormData(container)
        const input = formdata.get("input_id")
        event.preventDefault()
        GetEvent(input).then((result)=>{
            ClearConfig()
            let gotobject = result.Tags
            question = document.createElement("h2")
            question.appendChild(document.createTextNode(gotobject.name))
            container.appendChild(question)
            let newbutton = document.createElement("button")
            newbutton.appendChild(document.createTextNode("Keep"))
            newbutton.addEventListener("click",()=>{
                ClearConfig()
            })
            newbutton.classList.add("GreenButton")
            container.appendChild(newbutton)
            let newbutton2 = document.createElement("button")
            newbutton2.appendChild(document.createTextNode("Delete"))
            newbutton2.addEventListener("click",()=>{
                console.log("delete attempt")
                DeleteEvent(input)
                location.reload()
            })
            newbutton2.classList.add("RedButton")
            container.appendChild(newbutton2)

        })
    })
}

function UpdateEventButton(){
    ClearConfig()
    ActiveAddTags = true
    const container = document.querySelector("#ConfigHolder")
    container.appendChild(document.createElement("br"))
    let newelabel = document.createElement("label")
    newelabel.for = "input_id"
    newelabel.appendChild(document.createTextNode("id:"))
    let newinput = document.createElement("input")
    newinput.type = "text"
    newinput.name = "input_id"
    newinput.id = "input_id"
    container.appendChild(newelabel)
    container.appendChild(newinput)
    container.appendChild(document.createElement("br"))
    let newbutton = document.createElement("button")
    newbutton.appendChild(document.createTextNode("Update"))
    container.appendChild(newbutton)
    newbutton.addEventListener("click",(event)=>{
        const formdata = new FormData(container)
        const input = formdata.get("input_id")
        event.preventDefault()
        GetEvent(input).then((result)=>{
            ClearConfig()
            Object.keys(result.Tags).forEach(element => {
                if (element[0]!="_" && element!="id") { 
                    container.appendChild(document.createElement("br"))
                    let newelabel = document.createElement("label")
                    newelabel.for = "input_"+element
                    if (element == "tags") {
                        newelabel.appendChild(document.createTextNode(element+": (Select from list of tags below)"))
                    } else if (element == "img") {
                        newelabel.appendChild(document.createTextNode(element+": (full URL)"))
                    } else {
                        newelabel.appendChild(document.createTextNode(element+":"))
                    }
                    let newinput = document.createElement("input")
                    newinput.type = "text"
                    newinput.name = "input_"+element
                    newinput.id = "input_"+element
                    newinput.value = result.Tags[element]
                    if(element=="tags"){
                        newinput.value+=","
                    }
                    container.appendChild(newelabel)
                    container.appendChild(newinput)
                }
            })
            container.appendChild(document.createElement("br"))
            let newbutton3 = document.createElement("button")
            newbutton3.type = "submit"
            newbutton3.appendChild(document.createTextNode("Update"))
            container.appendChild(newbutton3)

            console.log(result.Tags.id)
        
            document.querySelector("#input_tags").setAttribute("readonly",true)
        
            container.addEventListener("submit",()=>{
                event.preventDefault()
                DeleteEvent(result.Tags.id)
                console.log("ooooo")
                const formdata = new FormData(container)
                let TagList = formdata.get("input_tags").split(",")
                TagList.pop()
                let reqobj ={
                    id:result.Tags.id,
                    name:formdata.get("input_name"),
                    desc:formdata.get("input_desc"),
                    price:formdata.get("input_price"),
                    date:formdata.get("input_date"),
                    location:formdata.get("input_location"),
                    Organiser:formdata.get("input_Organiser"),
                    img:formdata.get("input_img"),
                    tags:TagList        
                }
                ActiveAddTags = false
                CreateEvent(reqobj)
            })
        })
    })
}

function CreateTagButton() {
    ClearConfig()
    const container = document.querySelector("#ConfigHolder")
    container.appendChild(document.createElement("br"))
    let newelabel = document.createElement("label")
    newelabel.for = "input_name"
    newelabel.appendChild(document.createTextNode("name:  (Max Length 20 && Must not exist)"))
    let newinput = document.createElement("input")
    newinput.type = "text"
    newinput.name = "input_name"
    newinput.id = "input_name"
    container.appendChild(newelabel)
    container.appendChild(newinput)
    container.appendChild(document.createElement("br"))
    let newbutton = document.createElement("button")
    newbutton.type = "submit"
    newbutton.appendChild(document.createTextNode("Create"))
    container.appendChild(newbutton)
    container.addEventListener("submit",(event)=>{
        const formdata = new FormData(container)
        const input = formdata.get("input_name")
        CreateTag(input)
    })
}

GetTagAll().then((result)=>{
    const TagList = result.Tags
    const container = document.querySelector("#TagList")
    TagList.forEach(element => {
        let item = document.createElement("p")
        item.classList.add("TagItem")
        item.appendChild(document.createTextNode(element.name))
        item.addEventListener("click",()=>{
            if(ActiveAddTags == true){
                let target = document.querySelector("#input_tags")
                target.value += `${element.name},`
            }
        })
        container.appendChild(item)
    });
})

GetEventAll().then((result)=>{
    result.Events.forEach(element => {
        new Event(element,"#eventholder")
    });
})

/*
    Theme Selector
*/
const BodyElement = document.querySelector("body");
const SystemButton = document.getElementById("SystemButton")
const LightButton = document.getElementById("LightButton")
const DarkButton = document.getElementById("DarkButton")
SystemButton.addEventListener("click",function(){NoTheme(BodyElement);},false);
LightButton.addEventListener("click",function(){GoLight(BodyElement);},false);
DarkButton.addEventListener("click",function(){GoDark(BodyElement);},false);

//On Page load select theme
let CurrentTheme = localStorage.getItem("theme");
if(CurrentTheme==="Dark"){
    GoDark(BodyElement);
} else if(CurrentTheme==="Light"){
    GoLight(BodyElement);
}

function GoDark(BodyElement){
    BodyElement.dataset.theme = "Dark";
    localStorage.setItem("theme","Dark");
}
function GoLight(BodyElement){
    BodyElement.dataset.theme = "Light";
    localStorage.setItem("theme","Light");
}
function NoTheme(BodyElement){
    BodyElement.dataset.theme = "Null";
    localStorage.removeItem("theme")
}