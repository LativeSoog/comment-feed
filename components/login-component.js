import { apiFetchLogin } from "../api.js"

const addFormAndLogin = document.getElementById("form");
let userName;
const renderFormAdd = () => {
    const addFormHtml = `
    <input type="text" class="add-form-name" id="input__name" placeholder="Введите ваше имя" value="${userName}" disabled />
    <textarea type="textarea" class="add-form-text" id="comment__text" placeholder="Введите ваш коментарий" rows="4"></textarea>
    <div class="add-form-row" id="">
      <button class="add-form-button" id="button__add-comment">Написать</button>
    </div>`
    addFormAndLogin.innerHTML = addFormHtml
}


const renderLoginComponent = ({ setToken, getListFormAndLogin }) => {
    let isLoginMode = false;
    const renderLogin = () => {
        const renderLoginHtml = isLoginMode ?
            `<h1>Форма входа</h1>
        <input type="text" class="add-form-name" id="input__login" placeholder="Введите ваш логин" value="" /> <br>
        <input type="text" class="add-form-name" id="input__password" placeholder="Введите ваш пароль" value="" />
    <div class="add-form-row" id="">
      <button class="add-form-button" id="button__login">Войти</button>
    </div>`
            :
            `Чтобы добавлять комментарии, необходимо <span id="button__login-mode">авторизоваться</span>`
        addFormAndLogin.innerHTML = renderLoginHtml
        if (!isLoginMode) {
            document.getElementById("button__login-mode").addEventListener("click", () => {
                isLoginMode = !isLoginMode
                renderLogin()
            })
        } else {
            document.getElementById("button__login").addEventListener("click", () => {

                const login = document.getElementById("input__login").value;
                const password = document.getElementById("input__password").value;

                if (!login) {
                    alert("Введите логин")
                    return
                } else if (!password) {
                    alert("Введите пароль")
                    return
                }

                apiFetchLogin({
                    login: login,
                    password: password,
                })
                    .then((user) => {
                        userName = user.user.name
                        setToken(`Bearer ${user.user.token}`)
                        getListFormAndLogin()
                    })
                    .catch((error) => {
                        alert(error.message)
                    })
            })
        }
    }
    renderLogin()

}


export { renderFormAdd, renderLoginComponent }