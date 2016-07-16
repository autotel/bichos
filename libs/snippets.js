//original source: http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
function randomString(len)
{
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";

    for( var i=0; i < Math.floor(len); i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}