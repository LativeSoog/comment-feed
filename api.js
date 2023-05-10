//API GET
const apiFetchGet = () => {
    return fetch("https://webdev-hw-api.vercel.app/api/v2/vitaliy-gusev/comments", {
        method: "GET"
    })
}

//API POST
const apiFetchPost = (token, textComment, getDate) => {
    return fetch("https://webdev-hw-api.vercel.app/api/v2/vitaliy-gusev/comments", {
        method: "POST",
        headers: {
            Authorization: token,
        },
        body: JSON.stringify({
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

//API LOGIN
const apiFetchLogin = ({ login, password }) => {
    return fetch("https://webdev-hw-api.vercel.app/api/user/login", {
        method: "POST",
        body: JSON.stringify({
            login,
            password,
        }),
    })
        .then((response) => {
            if (response.status === 400) {
                throw new Error("Неверный логин или пароль")
            } else {
                return response.json()
            }
        })
}

export { apiFetchGet, apiFetchPost, apiFetchLogin }