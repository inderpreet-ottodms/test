declare global 
{
    interface String
    {
        shuffle(length?:number): String;
    }
    interface Date
    {
        toDateTimeString(): String;
    }
}
String.prototype.shuffle = function(length?:number): string
{
    var a = this.split(""),
    n = a.length;
    
    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    
    let returnString =  a.join('').toString();

    return (length==null || length==undefined || returnString.length<=length ) 
                ? returnString 
                : returnString.substring(0,length);  
}

Date.prototype.toDateTimeString = function(): string
{
    return ((this.toDateString().replace(/\s/g, "") + 
            (this.toTimeString().replace(/\s/g, "")))
                       .replace(/\:/g, "")
                       .replace(/\+/g, "")
                       .replace(/\(/g, "")
                       .replace(/\)/g, ""));
}
export{};
    
