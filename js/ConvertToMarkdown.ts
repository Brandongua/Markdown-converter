const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const LOWER = "abcdefghijklmnopqrstuvwxyz"
const NUMBERS = "0123456789"
//@ts-ignore
const parser = math.parser()
//@ts-ignore
math.config({
  number: 'BigNumber',      // Default type of number:
                            // 'number' (default), 'BigNumber', or 'Fraction'
  precision: 64             // Number of significant digits for BigNumbers
})

Object.defineProperty(RegExp.prototype, "toJSON", {
    value: RegExp.prototype.toString
})

function generateScript(placeHolder, script, id){
    return '<span id="' + id + '">' + placeHolder + '</span><script>' + script.replaceAll("{ID}", id) + "</script>"
}

function addCustomRegex(searcher: string, replace: string){
    userDefinedRegexes.push([new RegExp(searcher, "g"), replace])
    localStorage.setItem("customRegularExpressions", JSON.stringify(userDefinedRegexes))
}
function removeCustomRegex(searcher: string){
    let searcher2 = new RegExp(searcher, "g")
    for(let i = 0; i < userDefinedRegexes.length; i++){
        let regex = userDefinedRegexes[i]
        if(regex[0].source == searcher2.source){
            userDefinedRegexes.splice(i, 1)
        }
    }
    localStorage.setItem("customRegularExpressions", JSON.stringify(userDefinedRegexes))
}
let userDefinedRegexes: Array<[RegExp, string]> = []
function loadRegexes(){
    let temp = JSON.parse(localStorage.getItem('customRegularExpressions'))
    for(let regex of temp){
        regex[0] = regex[0].split("/")
        regex[0] = regex[0].slice(1, regex[0].length - 1).join("/")
        regex[0] = new RegExp(regex[0], "g")
        console.log(regex)
        userDefinedRegexes.push(regex)
    }
}

function generateId(amount=10){
    let chars = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ-"
    let str = ""
    for(let i = 0; i < amount; i++){
        str += chars[Math.floor(Math.random() * chars.length)]
    }
    return str;
}

if(localStorage.getItem("customRegularExpressions")){
    loadRegexes()
}
const regexes = [
[
/(?<!\\)\\RAND(?:\{([0-9]+) ([0-9]+)\})?\\/gi,
(_, one=null, two=null)=>{
    if(!one){
        one = 0;
        two = 100;
    }
    return Math.floor((Math.random() * two) + 1)
}
],
[
/(?<!\\)\\EMOJI(?:(?:\{([0-9]+)(?:(?: |, ?)(.*?))?\})|\\)/gi,
(_, amount, seperator)=>{
    let emojis = {...EMOJIS, ...hiddenEmotes, ...userDefinedEmotes, ...imgEmotes}
    let keys = Object.keys(emojis)
    let imgEmoteValues = Object.values(imgEmotes)
    let sep = seperator ?? ""
    if(amount){
        let str = ""
        let emoji;
        for(let i = 0; i < amount; i++){
            emoji = emojis[keys[Math.floor(Math.random() * keys.length)]]
            str += imgEmoteValues.indexOf(emoji) >= 0 ?
            `<img src="${emoji}" align="absmiddle" style="width:1em">` + sep : emoji + sep
        }
        return str;
    }
    return emojis[Object.keys(emojis)[Math.floor(Math.random() * Object.keys(emojis).length)]]
}
],
[
/(?<!\\)\\calc\{(.*?)\}/g,
(_, ev)=>eval(ev)
],
[
/(?<!\\)\\load ? (?:=|-)> ?([^]+?)\s;$/gm,
(_, ev: string) => {
    let id = (()=>{
        let str = ""
        let chars = "abcdefghijklmnopqrstuvwxyz12345676890-"
        for(let i = 0; i < 10; i++){
            str += chars[Math.floor(Math.random() * chars.length)]
        }
        return str
    })()
    return `<span id="${id}"></span><script>${ev.replace(/replaceThis\((.*?)\)/g, `document.getElementById("${id}").innerHTML = $1`)}</script>`
}
],
[
/(?<!\\)"(.*?)" ?c> ?([^]+?)\s;$/gm,
`<p onclick='$2'>$1</p>`
],
[
/(?<!\\):(.+?):/g,
(_, name)=>{
    if(EMOJIS[name]) return EMOJIS[name]
    else if(imgEmotes[name]) return `<img src="${imgEmotes[name]}" align="absmiddle" style="width:1em">`
    else if(hiddenEmotes[name]) return hiddenEmotes[name]
    else if(userDefinedEmotes[name]) return userDefinedEmotes[name]
    return `:${name}:`
}
],
[
/(?<!\\)\|(.*?)->(.+?)<-(.*?)\|/g,
"<center style='margin-left:$1;margin-right:$3'>$2</center>"
],
[
/(?<!\\)([0-9\.]+)\/\/([0-9\.]+)/g, //fractions
"$1???$2"
],
[
/(?<!\\)--->/g, //rarrow
"???"
],
[
/(?<!\\)==>/g,
"???"
],
[
/(?<!\\)-=>/g,
"???"
],
[
/(?<!\\)<---/g,
"???"
],
[
/(?<!\\)<==/g,
"???"
],
[
/(?<!\\)\|=>/g,
"???"
],
[
/(?<!\\)<=\|/g,
"???"
],
[
/(?<!\\)\|\\v/g,
"???"
],
[
/(?<!\\)\|\\\^/g,
"???"
],
[
/(?<!\\)<--\+/g,
"&#10566;"
],
[
/(?<!\\)\+-->/g,
"&#10565;"
],
[
/(?<!\\)<=>/g,
"&#8660;"
],
[
/(?<!\\)<-\^->/g,
"&#8644;"
],
[
/(?<!\\)<-v->/g,
"&#8646;"
],
[
/(?<!\\)<_/g,
"&le;"
],
[
/(?<!\\)_>/g,
"&ge;"
],
[
/(?<!\\)\\n/g,
"<br>"
],
[
/(?<!\\)(\\u[0-9a-f]{4}|\\u\{[0-9a-f]+\})/gi,
(_, point: string) => eval(`"${point}"`)
],
[
/(?<!\\)\|{2}(.*?)\|{2}/g,
`<span style="cursor:pointer; background-color:black;" onclick="this.style.backgroundColor = this.style.backgroundColor == 'white' ? 'black' : 'white'">$1</span>`
],
[
/(?<!\\)>([iub]*) ?(.*)\n-([iub]*) ?(.*)/g,
(_, quoteD: string, quote, authorD: string, author)=> {
    for(let d of quoteD){
        switch(d.toLowerCase()){
            case "i":
                quote = `<i>${quote}</i>`
                break;
            case "u":
                quote = `<u>${quote}</u>`
                break;
            case "b":
                quote = `<b>${quote}</b>`
                break;
        }
    }
    for(let d of authorD){
        switch(d.toLowerCase()){
            case "i":
                author = `<i>${author}</i>`
                break;
            case "u":
                author = `<u>${author}</u>`
                break;
            case "b":
                author = `<b>${author}</b>`
                break;
        }
    }
    return `<blockquote>${quote}<br><span style='display:block;margin-left:2em;'>-${author}</span></blockquote>`
}
],
[
/(?<!\\)''(.*?)''/g,
"???$1???"
],
[
/(?<!\\)\((\*| )\)(?!\()/g,
(_, checked)=> `<input type="radio" ${checked === "*" ? "checked" : ""} disabled>`
],
[
/(?<!\\)\*\[(.*?)\](.*?)\|(?:\[(.*?)\])?/g,
"<span style='$1' title='$3'>$2</span>"
],
[
/(?<!\\)\[(\.)?( |x)\](?!\()/g,
(_, interactive, checked)=> `<input type="checkbox" ${checked === "x" ? "checked" : ""} ${!interactive ? "disabled" : ""}>`
],
[
/(?<!\\)#\[([a-z0-9]+)\](.+?)\|(?:\[(.+?)\])?/gi,
(_, color, content, title) => `<span title="${title ?? ""}" style="color:${color.match(/(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})/) ? "#" + color : color}">${content}</span>`
],
[
/(?<!\\)s\[([a-z0-9]+)\](.+?)\|(?:\[(.+?)\])?/gi,
'<span style="font-size:$1" title="$3">$2</span>'
],
[
/(?<!\\)f\[([a-z0-9 ]+)\](.+?)\|(?:\[(.+?)\])?/gi,
'<span title="$3" style="font-family:$1">$2</span>'
],
[
/(?<!\\)\|(\^|v|(?:l|<)|>)?\[(.+?)\](.+?)\|(?:\[(.+)\])?/g,
(_, bType, bDecoration, text, title)=>{
    let borderType = ""
    switch(bType){
        case "^":
            borderType = "border-top"
            break;
        case "v":
            borderType = "border-bottom"
            break;
        case "l":
        case "<":
            borderType = "border-left"
            break;
        case ">":
            borderType = "border-right"
            break;
        default:
            borderType = "border";
            break;
    }
    return `<span title="${title}" style="${borderType}: ${bDecoration}">${text}</span>`
}
],
[
/(?<!\\)\((C|R)\)/g,
(_, CR)=> CR == "C" ? "??" : "??"
],
[
/(?<!\\)\<-->/g,
"???"
],
[
/(?<!\\)^(.+?)-->(.+)<--(.*?)$/gm,
"<span style='display:inline-block;margin-left:$1;margin-right:$3'>$2</span>"
],
[
/(?<!\\)^(.+?)-->(.+?)$/gm,
"<span style='display:inline-block;margin-left:$1'>$2</span>"  
],
[
/(?<!\\)(.+?)<--(.+?)$/gm,
"<span style='display:inline-block;margin-right:$2'>$1</span>"  
],
[
/(?<!\\)\\(\^|_)\[(.*?)\](?:\[(.*?)\])?/g,
(_, upDown, contents, title)=> `<${upDown === "^" ? "sup" : "sub"} title='${title ? title : ""}'>${contents}</${upDown === "^" ? "sup" : "sub"}>`
],
[
/(?<!\\)("|')(.+?)\1\[(.*?)\]/g,
'<span title="$3">$2</span>'
],
[
/(?<!\\)"(.+?)"(?:::(.+?)(?:\/(.+?))?)?\s?\.{3}(.*)/g,
"<details><summary data-marker='$2 ' data-marker-open='$3 '>$1</summary>$4</details>"
],
[
/(?<!\\)(?:\[(.*?)\])?\*-(.+?)-\*(?:\[(.+?)\])?/g,
"<mark title='$3' style='background-color:$1'>$2</mark>"
],
[
/(?<!\\)([A-z]+|#[0-fa-fA-F]{8}|#[0-fa-fA-F]{6}|#[0-fa-fA-F]{3})?(?:-{3,}|<hr>)/g,
'<hr style="background-color:$1;color:$1;border-color:$1" id="$2" />'
],
[
/(?<![\\#])(^#{1,6})(?:_\[(.*?)\])? ([^#\n]+)(?:#(.+))?/gm,
(_, heading, border, contents, id) => border 
    ? `<h${heading.length} id="${id ?? ""}" style="display:block;border-bottom:${border};">${contents}</h${heading.length}>`
    : `<h${heading.length} id=${id ?? ""}>${contents}</h${heading.length}>`
],
[
/(?<!\\)\[(\.)?([0-9]+)-([0-9]+)\](?:\{?([0-9]+)\})?/g,
(_, disabled, min, max, value)=> `${min}<input type="range" min="${min}" max="${max}" value="${value}" ${!disabled ? "disabled" : ""}>${max}`
],
[
/(?<!\\)\[(.+?)\](?: ?(.*))?:(?: |\n(?: |    )?)?(?:\[|\()(.*)(?:\)|\])/g,
(_, word, speech, def)=>`<span class="_word">${word}</span><span class="_word-speech">${speech ? " (" + speech + ")" : ""}</span>:<br><span class="_definition" style='margin-left:1.5em;display:block'>${def}</span>`
],
[
/(?<!\\)^#([^\s]*)$/gm,
"<div id='$1'></div>"
], 
[
/(?<!\\|!)\[(.*?)\]\((.+?)(?:\s(.*?))?\)/g, //here because it doesn't do titles
(_, text, link, title) => `<a class="_link" title="${title ?? link}" href="${link}">${text}</a>`
],
[
/(?<!\\)(?:\[(.+?)\])?\^\^_(.+?)_\^\^(?:\[(.+?)\])?/g,
'<span style="text-decoration:overline double $1" title="$3" class="_overline _double">$2</span>'
],
[
/(?<!\\)(?:\[(.+?)\])?\^_(.+?)_\^(?:\[(.+?)\])?/g,
'<span style="text-decoration:overline $1" title="$3" class="_overline">$2</span>'
],
[
/(?<!\\)(?:\[(.+?)\])?\^\.(.+?)\.\^(?:\[(.+?)\])?/g,
'<span style="text-decoration:overline dotted $1" title="$3" class="_overline _dotted">$2</span>'
],
[
/(?<!\\)(?:\[(.+?)\])?\^~(.+?)~\^(?:\[(.+?)\])?/g,
'<span style="text-decoration:overline wavy $1" title="$3" class="_wavy _overline">$2</span>'
],
[
/(?<!\\)(?:\[(.+?)\])?\._(.+?)_\.(?:\[(.+?)\])?/g,
'<span style="text-decoration:underline dotted $1" title="$3" id="_dotted">$2</span>'
],
[
/(?<!\\)(?:\[(.+?)\])?~_(.+?)_~(?:\[(.+?)\])?/g,
'<span style="text-decoration:underline wavy $1" title="$3" class="_wavy">$2</span>'
],
[
/(?<!\\)(?:\[(.+?)\])?__(.+?)__(?:\[(.+?)\])?/g,
'<span style="text-decoration:underline double $1" title="$3" class="_underline _double">$2</span>'
],
[
/(?<!\\|_)(?:\[(.+?)\])?_(.+?)_(?:\[(.+?)\])?/g,
"<u style='text-decoration:underline $1' title='$3' class=\"_underline\">$2</u>"
],
[
/(?<!\\)\|->(.+?)(?: ?<(.*?))?\|/g,
"<p style='text-align:right;margin-right:$2'>$1</p>"
],
[
/(?<!\\)\|(?:(.*?)> ?)?(.+?)<-\|/g,
"<p style='text-align:left;margin-left:$1'>$2</p>"
],
[
/(?<!\\)(?:\.|class)\[(.+?)\](.*?)\|/g,
'<span class="$1">$2</span>'
],
[
/(?<!\\)(?<=(?:\* ?)?)(?:\.|>)(PRO|CON):?(.*)/gi,
(_, PC, contents)=>{
    let Pro = PC === "PRO"
    return `<span style="color:${Pro ? "green" : "red"}">${Pro ? "???" : "???"} ${contents}</span>`
}
],
[
/(?<!\\)A!\[(.+?)\]/g,
"<audio controls src='$1'>"
],
[
/(?<!\\)YT!\[(.+?)\](?:\(([0-9\.]*)(?: |, ?)([0-9\.]*)\))?/g,
(_, link, width, height)=>{
    return `<iframe width="${width}" height="${height}" src="${link.replace("watch?v=", "embed/")}"></iframe>`
}
],
[
/(?<!\\)\[([0-9-]+?)\]\*(.+?)\*/g,
'<span style="transform:skewX($1deg);display:inline-flex">$2</span>'
],
[
/(?<!\\)\\(ol|ul)m(?:arker)?\{([0-9]+),\s?(.+?)\}\\/g,
(_, selector, layer, to)=>{
    layer = parseInt(layer)
    for(let i = 0; i < layer;i++){
        selector += " li "
    }
    let listStyleType = null;
    if(to.match("TYPE:")){
        listStyleType = to.split("TYPE:")[1]
        return `<style>
${selector}{
    list-style-type: ${listStyleType}
}
${selector} li{
    list-style-type:inherit;
}
</style>`
    }
    return `<style>
    ${selector.trim()}::marker{
        content: "${to}\\00a0";
    }
    ${selector} li::marker{
        content:inherit;
    }
</style>`
}
],
[
/(?<!\\)%today%/g,
() => {
    let d = new Date()
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
}
],
[
/(?<!\\)%truetoday%/g,
() => {
    let d = new Date()
    return generateScript(`${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`, 'let d = new Date(); document.getElementById("{ID}").innerHTML = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear()', generateId())
}
],
[
/(?<!\\)%now%/g,
() => (new Date()).toLocaleTimeString()
],
[
/(?<!\\)%truenow%/g,
() => {
    let id = generateId()
    return generateScript((new Date()).toLocaleTimeString(), 'document.getElementById("{ID}").innerHTML = (new Date()).toLocaleTimeString()', generateId())
}
],
[
/(?<!\\)\\include(?:\{(summarymarker|softblink|blink|placeholder|kbd|samp|cmd|rainbow|highlight|l#|linenumber|csscolor)\}|(?::|  )(summarymarker|softblink|blink|placeholder|kbd|samp|cmd|spin|rainbow|highlight|l#|linenumber|csscolor)\\)/gi,
(_, include: string, include2: string)=>{
    include = include2 ?? include
    switch(include.toUpperCase()){
        case "SOFTBLINK":
            return `<style>softblink{animation:soft-blinking linear infinite;animation-duration:1000ms}@keyframes soft-blinking{0%{color:inherit;text-shadow:inherit}50%{color:transparent;text-shadow:none}}</style>`
        case "BLINK":
            return `<style>blink{animation:blinking linear infinite;animation-duration:1000ms}@keyframes blinking{0%{color:inherit;background-color:inherit;text-shadow:inherit}49%{color:inherit;background-color:inherit;text-shadow:inherit}50%{color:transparent;background-color:transparent;text-shadow:none}100%{color:transparent;background-color:transparent;text-shadow:none}}</style>`
        case "PLACEHOLDER":
            return `<style>placeholder{color:grey;user-select:none}</style>`
        case "KBD":
            return `<style>kbd{background-color:#fafbfc;border:1px solid #d1d5da;border-bottom-color:#c6cbd1;border-radius:3px;box-shadow:inset 0 -1px 0 #c6cbd1;color:#444d56;display:inline-block;font:0.8em SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace;line-height:0.9em;padding:3px 5px;vertical-align:middle}</style>`
        case "SAMP":
        case "CMD":
            return `<style>${include}{font-family:monospace, monospace;color:green;background-color:black;padding:2px}${include}::selection{background-color:white}</style>`
        case "RAINBOW":
            return `<style>rainbow{animation:rainbow-an 2000ms linear infinite;color:blue}@keyframes rainbow-an{0%{color:#f00}16%{color:#ffff00}32%{color:#00ff00}48%{color:#00ffff}64%{color:#0000ff}80%{color:#ff00ff}100%{color:#f00}}</style>`
        case "HIGHLIGHT":
            return `<style>code[class*="language-"],pre[class*="language-"]{color:black;background:none;text-shadow:0 1px white;font-family:Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}pre[class*="language-"]::-moz-selection,pre[class*="language-"] ::-moz-selection,code[class*="language-"]::-moz-selection,code[class*="language-"] ::-moz-selection{text-shadow:none;background:#b3d4fc}pre[class*="language-"]::selection,pre[class*="language-"] ::selection,code[class*="language-"]::selection,code[class*="language-"] ::selection{text-shadow:none;background:#b3d4fc}@media print{code[class*="language-"],pre[class*="language-"]{text-shadow:none}}pre[class*="language-"]{padding:1em;margin:0.5em 0;overflow:auto}:not(pre) > code[class*="language-"],pre[class*="language-"]{background:#f5f2f0}:not(pre) > code[class*="language-"]{padding:0.1em;border-radius:0.3em;white-space:normal}.token.cdata,.token.comment,.token.doctype,.token.prolog{color:slategray}.token.punctuation{color:#999}.token.namespace{opacity:0.7}.token.boolean,.token.constant,.token.deleted,.token.number,.token.property,.token.symbol,.token.tag{color:#905}.token.attr-name,.token.builtin,.token.char,.token.inserted,.token.selector,.token.string{color:#690}.language-css .token.string,.style .token.string,.token.entity,.token.operator,.token.url{color:#9a6e3a;background:hsla(0, 0%, 100%, .5)}.token.atrule,.token.attr-value,.token.keyword{color:#07a}.token.class-name,.token.function{color:#DD4A68}.token.important,.token.regex,.token.variable{color:#e90}.token.bold,.token.important{font-weight:bold}.token.italic{font-style:italic}.token.entity{cursor:help}</style>`
        case "L#":
        case "LINENUMBER":
            return `<style>pre[class*="language-"].line-numbers{position:relative;padding-left:3.8em;counter-reset:linenumber}pre[class*="language-"].line-numbers > code{position:relative;white-space:inherit}.line-numbers .line-numbers-rows{position:absolute;pointer-events:none;top:0;font-size:100%;left:-3.8em;width:3em;letter-spacing:-1px;border-right:1px solid #999;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.line-numbers-rows > span{display:block;counter-increment:linenumber}.line-numbers-rows > span:before{content:counter(linenumber);color:#999;display:block;padding-right:0.8em;text-align:right}</style>`
        case "CSSCOLOR":
            return `<style>span.inline-color-wrapper{background:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyIDIiPjxwYXRoIGZpbGw9ImdyYXkiIGQ9Ik0wIDBoMnYySDB6Ii8+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0wIDBoMXYxSDB6TTEgMWgxdjFIMXoiLz48L3N2Zz4=");background-position:center;background-size:110%;display:inline-block;height:1.333ch;width:1.333ch;margin:0 0.333ch;box-sizing:border-box;border:1px solid white;outline:1px solid rgba(0,0,0,.5);overflow:hidden}span.inline-color{display:block;height:120%;width:120%}</style>`
        case "SUMMARYMARKER":
            return `<style>summary[data-marker]::marker{content: attr(data-marker)}details[open] summary[data-marker-open]::marker{content: attr(data-marker-open)}</style>`
    }
}
],
[
/(?<!\\)\\import(?:\((gf)\))?(?:\{(.*?)\}|(?::| )(.*?)\\)/g,
(_, g, link: string, link2)=>{
    link = link2 ?? link as string;
    if(g)
        link = link.replaceAll(",", "&family=").replaceAll("&family= ", "&family=")
    return g 
    ? `<link href="https://fonts.googleapis.com/css2?family=${link}&display=swap" rel="stylesheet">`
    : `<link href="${link}" rel="stylesheet">`
}
],
[
/(?<!\\)\\(font|size|color|custom|lineheight|spacing|wordspacing|letterspacing)(?:\{((?:.|\s)*?)\}|(?::| )(.*)\\)/gi,
(_, type: string, value, value2)=>{
    value = value2 ?? value
    switch(type.toUpperCase()){
        case "FONT":
            return `<div style='font-family:${value}'>`
        case "SIZE":
            return `<div style='font-size:${value}'>`
        case "COLOR":
            return `<div style='color:${value}'>`
        case "CUSTOM":
            return `<div style="${value}">`
        case "LINEHEIGHT":
        case "SPACING":
            return `<div style='line-height:${value}>`
        case "WORDSPACING":
            return `<div style='word-spacing:${value}'>`
        case "LETTERSPACING":
            return `<div style='letter-spacing:${value}'>`
    }
}
],
[
/(?<!\\)\\END(.|\\)(?:\{(.*?)\}| (.*?)\\)?/gi,
(_, type: string, newValue: string, newValue2: string)=>{
    newValue = newValue2 ?? newValue
    switch(type.toUpperCase()){
        case "F":
            return `</div><div style="font-family: ${newValue}">`
        case "S":
            return `</div><div style="font-size: ${newValue}">`
        case "#":
            return `</div><div style="color: ${newValue}">`
        case "C":
            return `</div><div style="${newValue}">`
        case "H":
            return `</div><div style="line-height: ${newValue}">`
        case "W":
            return `</div><div style="word-spacing: ${newValue}">`
        case "L":
            return `</div><div style="letter-spacing: ${newValue}">`
        default:
            return `</div>`        
    }
}
],
[
/(?<!\\)\$\$(none|unit|simplify)?\$(.*?)\$(nohover)?\$\$/g,
(_, re, expr, settings)=>{
    if(re == "unit"){
        try{
            expr = `createUnit("${expr.split(",")[0].trim()}", "${expr.split(",")[1].trim()}")`
            const evaled = parser.evaluate(expr)
        }
        catch(err){
        }
        return ""
    }
    else if(re == "simplify"){
        //@ts-ignore
        const evaled = math.simplify(expr)
        return settings != "nohover" ? `<span title="${expr}">${evaled}</span>` : evaled
    }
    const evaled = parser.evaluate(expr)
    if(re == "none")
        return ""
    return typeof evaled != "function" ? (settings != "nohover" ? `<span title="${expr}">${evaled}</span>` : evaled) : ""
}
],
[
/(?<!\\)(^(?:\||=) .+\n?)+/gm,
(items: string) => {
    let str = "<dl>"
    for(let x of items.split("\n")){
        str += x[0] === "=" ? `<dt>${x.slice(1).trim()}</dt>` : `<dd>${x.slice(1).trim()}</dd>`
    }
    return str + "</dl>";
}
],
[
/(?<!\\)cur(?:sor)?\[(.*?)\](.*?)\|(?:\[(.*?)\])?/g,
'<span style="cursor:$1" title="$3">$2</span>'
],
[
/(?<!\\)~=/g,
"&asymp;"
],
[
/(?<!\\)\+-/g,
"&plusmn;"
],
[
/(?<!\\)\.\/\./g,
"&divide;"
],
[
/(?<!\\)\/=/g,
"&ne;"
],
[
/(?<!\\)^(.*?)->(.+?)$/gm,
(_, indent, text) => `<span style="display:inline-block; text-indent: ${indent || "2em"}">${text}</span>`
],
[
/(?<!\\)\[([^]+?)\]\*([0-9]+)/g,
(_, chars: String, count: String)=>{
    return chars.multiply(Number(count))
}
],
[
/(?<!\\)\\count:([^\n]+)((?:\n)re)?\\/g,
(_, search, Re)=> Re 
? [...preview.innerText.matchAll(search)].length 
: preview.innerText.split(search).length - 1
],
[
/(?<!\\)(?:\\s\\|\\\$)/g,
""
],
]
function convert(value, custom=true, nonCustom=true){
    actionHistory.add()
    if(custom){
        //handles the $x=2 END thing
        for(let x of value.matchAll(/^(?:var:|\$)([^=]*)=([^]+?)\s;$/gm)){
            let regex = new RegExp(`%${x[1]}%`, "g")
            value = value.replace(x[0], "").replace(regex, x[2])
        }
        //loops through the lists of regexes
        userDefinedRegexes.forEach(item=>{
            value = value.replace(item[0], item[1])
        })
        regexes.forEach(item=>{
            value = value.replace(item[0], item[1])
        })
    }
    //@ts-ignore
    return "<main class='_html'>" + (nonCustom ? marked(value) : value) + `<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js">MathJax.Hub.Config({
        jax: [
            'input/TeX',
            'output/HTML-CSS',
        ],
        extensions: [
            'tex2jax.js',
            'AssistiveMML.js',
            'a11y/accessibility-menu.js',
        ],
        TeX: {
        extensions: [
            'AMSmath.js',
            'AMSsymbols.js',
            'noErrors.js',
            'noUndefined.js',
        ]
        },
        tex2jax: {
        inlineMath: [
            ['$', '$'],
            ['\\(', '\\)'],
        ],
        displayMath: [
            ['$$', '$$'],
            ['\\[', '\\]'],
        ],
        processEscapes: true
        },
        showMathMenu: false,
        showProcessingMessages: false,
        messageStyle: 'none',
        skipStartupTypeset: false, // disable initial rendering
        positionToHash: false
    })
// set specific container to render, can be delayed too
    //@ts-ignore
    MathJax.Hub.Queue(
        //@ts-ignore
        ['Typeset', MathJax.Hub, 'preview']
    )</script></main>`
}
