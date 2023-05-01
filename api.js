//Method: GET
const apiFetchGet = () => {
    return fetch("https://webdev-hw-api.vercel.app/api/v1/vitaliy-gusev/comments", {
        method: "GET"
    })
}

//Method: POST

const apiFetchPost = (inputName, textComment, getDate) => {
    return fetch("https://webdev-hw-api.vercel.app/api/v1/vitaliy-gusev/comments", {
        method: "POST",
        body: JSON.stringify({
            name: inputName
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("/", "&frasl;"),
            date: getDate(),
            text: textComment
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("/", "&frasl;")
                .replaceAll("QUOTE_START", '<div class="quote">')
                .replaceAll("QUOTE_END", '</div>'),
            forceError: true,
        })
    })
}

export { apiFetchGet, apiFetchPost }