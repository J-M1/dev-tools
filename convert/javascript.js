export default function (input) {
    let initialValues = input.split('\n')
    var requestStruct = {
        method: "GET",
        url: "",
        headers: {}
    }

    var isH2 = false;

    //h2 / h1 check
    if (initialValues[0].includes('HTTP/1.1') || initialValues[0].includes('HTTP/1.0')) {
        let splitDetails = initialValues[0].split(" ")
        requestStruct["method"] = splitDetails[0]
        requestStruct["url"] = splitDetails[1]
        console.log(requestStruct)
    } else {
        isH2 = true
        requestStruct["method"] = initialValues.filter(value => value.startsWith(":method"))[0].split(": ")[1];
        requestStruct["url"] = "https://" + initialValues.filter(value => value.startsWith(":authority"))[0].split(": ")[1] + initialValues.filter(value => value.startsWith(":path"))[0].split(": ")[1];
    }

    for(let i=0; i<initialValues.length; i++) {
        if(i == initialValues.length-1) break
        
        switch (true) {
            case initialValues[i].toLowerCase().startsWith("host: ") && !isH2:
                requestStruct["url"] =  `http://${initialValues[i].split(": ")[1]}${requestStruct["url"]}`
                break;
            case initialValues[i].includes(": "):
                if(!initialValues[i].startsWith(":")) {
                    if(initialValues[i].startsWith("cookie")) {
                        if(!requestStruct.headers["cookie"]) requestStruct.headers["cookie"] = []
                        requestStruct.headers["cookie"].push(initialValues[i].split(": ")[1])
                    } else {
                        try {
                            let header = initialValues[i].split(": ")
                            requestStruct.headers[header[0]] = header[1]
                        } catch(e){}
                    }
                }
                break
            default:
                break;
        }
    }

    if(requestStruct.method == "POST") {
        let isForm = requestStruct.headers["content-type"] ? requestStruct.headers["content-type"].toLowerCase().includes("form") : requestStruct.headers["Content-Type"] ? requestStruct.headers["Content-Type"].toLowerCase().includes("form") : false;
        let isJSON = requestStruct.headers["content-type"] ? requestStruct.headers["content-type"].toLowerCase().includes("json") : requestStruct.headers["Content-Type"] ? requestStruct.headers["Content-Type"].toLowerCase().includes("json") : false;

        if(isForm) {
            requestStruct["form"] = {}
            let individFormItems = initialValues[initialValues.length-1].split("&")
            individFormItems.forEach(item => {
                item = item.split("=")
                requestStruct["form"][item[0]] = item[1]
            });
        } else if (isJSON) {
            requestStruct["JSON"] = JSON.parse(initialValues[initialValues.length-1])
        } else {
            requestStruct["body"] = initialValues[initialValues.length-1]
        }
    }

    return(`let options = ` + JSON.stringify(requestStruct, undefined, 4))
}