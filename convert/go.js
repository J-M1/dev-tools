export default function (input) {
    let initialValues = input.split('\n')
    var headers = {}
    var form = {}

    var bodyExists = false

    var method = "GET"
    var url = ""

    var isH2 = false;

    //h2 / h1 check
    if (initialValues[0].includes('HTTP/1.1') || initialValues[0].includes('HTTP/1.0')) {
        let splitDetails = initialValues[0].split(" ")
        method = splitDetails[0]
        url = splitDetails[1]
    } else {
        isH2 = true
        method = initialValues.filter(value => value.startsWith(":method"))[0].split(": ")[1];
        url = "https://" + initialValues.filter(value => value.startsWith(":authority"))[0].split(": ")[1] + initialValues.filter(value => value.startsWith(":path"))[0].split(": ")[1];
    }

    for(let i=0; i<initialValues.length; i++) {
        if(i == initialValues.length-1) break
        
        switch (true) {
            case initialValues[i].toLowerCase().startsWith("host: ") && !isH2:
                url = `http://${initialValues[i].split(": ")[1]}${url}`
                break;
            case initialValues[i].includes(": "):
                if(!initialValues[i].startsWith(":")) {
                    if(initialValues[i].startsWith("cookie")) {
                        if(!headers["cookie"]) headers["cookie"] = []
                        headers["cookie"].push(initialValues[i].split(": ")[1])
                    } else {
                        try {
                            let header = initialValues[i].split(": ")
                            headers[header[0]] = [header[1]]
                        } catch(e){}
                    }
                }
                break
            default:
                break;
        }
    }

    var isForm = false
    var isJSON = false

    if(method == "POST" || method == "PATCH" || method == "PUT" ) {
        if (initialValues[initialValues.length-1].length != "") bodyExists = true
        isForm = headers["content-type"] ? headers["content-type"][0].toLowerCase().includes("form") : headers["Content-Type"] ? headers["Content-Type"][0].toLowerCase().includes("form") : false;
        isJSON = headers["content-type"] ? headers["content-type"][0].toLowerCase().includes("json") : headers["Content-Type"] ? headers["Content-Type"][0].toLowerCase().includes("json") : false;

        if(isForm) {
            let individFormItems = initialValues[initialValues.length-1].split("&")
            individFormItems.forEach(item => {
                item = item.split("=")
                form[item[0]] = [item[1]]
            });
        } else if (isJSON) {
            jsonbody = JSON.parse(initialValues[initialValues.length-1])
        } else {
            body = initialValues[initialValues.length-1]
        }
    }


    var finalValue = `reqURL, err := url.Parse("${url}")\nif err != nil {\n    log.Fatal(err)\n}\n\n` 


    //If is bodied req except form
    if(!isForm && bodyExists) method == "POST" || method == "PATCH" || method == "PUT" ? finalValue += `body := \`${initialValues[initialValues.length-1]}\`\n\n`: null

    finalValue += `req := &http.Request{\n     Method: "${method}",\n     URL: reqURL,\n` +
    `     Header: map[string][]string${JSON.stringify(headers, undefined, 7).replaceAll(/\[\s+/g, "{").replaceAll(/\s+]/g, '}')},\n`

    if(bodyExists) {
        //If JSON or form
        if(!isForm) method == "POST" || method == "PATCH" || method == "PUT" ? finalValue += `      Body: io.NopCloser(bytes.NewReader([]byte(body))),\n` : null
        //If is form
        isForm ? finalValue += `     Form: url.Values${JSON.stringify(form, undefined, 7).replaceAll(/\[\s+/g, "{").replaceAll(/\s+]/g, '}')},\n` : null
    }
    return finalValue + `}`
}