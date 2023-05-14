import { apiFetchDelete } from "../api.js";

//Функция удаления комментариев
const deleteComment = ({ token, getListComment }) => {
    let deleteCommentToken = token
    const buttonsDeleteComment = document.querySelectorAll(".delete-comment")
    for (const buttonDelete of buttonsDeleteComment) {
        buttonDelete.addEventListener("click", () => {
            let id = buttonDelete.dataset.buttonDelete
            apiFetchDelete({
                id: id,
                token: deleteCommentToken,
            })
                .then((response) => {
                    getListComment();
                })
                .catch((error) => {
                    alert(error.message)
                })
        })
    }
}

export { deleteComment }