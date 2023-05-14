import { apiFetchLogin, apiFetchRegistration } from "../api.js"

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
let isLoginMode = false;
const renderAuthorizationForm = () => {
    if (isLoginMode === false) {
        return `Чтобы добавлять комментарии, необходимо <span style="cursor: pointer; text-decoration: underline" id="button__login-mode">авторизоваться</span> или <span style="cursor: pointer; text-decoration: underline" id="button__register-mode">зарегистрироваться</span>`
    } else if (isLoginMode === true) {
        return `
        <h1>Форма входа</h1>
            <input type="text" class="add-form-name" id="input__login" placeholder="Введите ваш логин" value="" /> <br>
            <input type="text" class="add-form-name" id="input__password" placeholder="Введите ваш пароль" value="" />
        <div class="add-form-row" id="">
          <button class="add-form-button" id="button__login">Войти</button>
          <button class="add-form-button" id="button__register-toogle">Зарегистрироваться</button>
        </div>`
    } else if (isLoginMode === "registrationMode") {
        return `
        <h1>Регистрация</h1>
            <input type="text" class="add-form-name" id="input__name" placeholder="Введите ваше имя" value="" /> <br>
            <input type="text" class="add-form-name" id="input__login" placeholder="Введите ваш логин" value="" /> <br>
            <input type="text" class="add-form-name" id="input__password" placeholder="Введите ваш пароль" value="" />
        <div class="add-form-row" id="">
          <button class="add-form-button" id="button__register">Регистрация</button>
        </div>`
    }
}

const renderLoginComponent = ({ setToken, getListFormAndLogin }) => {

    const renderLogin = () => {
        const renderLoginHtml = renderAuthorizationForm()
        addFormAndLogin.innerHTML = renderLoginHtml
        if (!isLoginMode) {
            document.getElementById("button__login-mode").addEventListener("click", () => {
                isLoginMode = !isLoginMode
                renderLogin()
            })
            document.getElementById("button__register-mode").addEventListener("click", () => {
                isLoginMode = "registrationMode"
                renderLogin()
            })
        } else if (isLoginMode === true) {
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
            document.getElementById("button__register-toogle").addEventListener("click", () => {
                isLoginMode = "registrationMode"
                renderLogin()
                return;
            })
        } else if (isLoginMode = "regMode") {
            document.getElementById("button__register").addEventListener("click", () => {
                const name = document.getElementById("input__name").value;
                const login = document.getElementById("input__login").value;
                const password = document.getElementById("input__password").value;

                if (!name) {
                    alert("Введите имя")
                    return;
                }
                if (!login) {
                    alert("Введите логин")
                    return;
                }
                if (!password) {
                    alert("Введите пароль")
                    return;
                }

                apiFetchRegistration({
                    name: name,
                    login: login,
                    password: password,
                })
                    .then((user) => {
                        userName = user.user.name;
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