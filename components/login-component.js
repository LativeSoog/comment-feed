import { apiFetchLogin } from "../api.js"

const addFormAndLogin = document.getElementById("form")
const renderFormAdd = () => {
    const addFormHtml = `
    <input type="text" class="add-form-name" id="input__name" placeholder="Введите ваше имя" value="" />
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
                console.log(`object`);
                isLoginMode = !isLoginMode
                renderLogin()
            })
        } else {
            document.getElementById("button__login").addEventListener("click", () => {
                const login = "admin";
                const password = "admin";

                apiFetchLogin({
                    login: login,
                    password: password,
                })
                    .then((user) => {
                        console.log(`kruto`);
                        setToken("sfdihfishdfi")
                        getListFormAndLogin()
                    })
            })
        }
    }
    renderLogin()

}


export { renderFormAdd, renderLoginComponent }