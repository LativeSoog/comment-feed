import { apiFetchLike } from "../api.js";

const likeComment = ({ token, getListComment }) => {
    let likeCommentToken = token
    const likeButtonsComment = document.querySelectorAll(".like-button");
    for (const likeButton of likeButtonsComment) {
        likeButton.addEventListener("click", (event) => {
            event.stopPropagation()
            let id = likeButton.dataset.buttonLike

            apiFetchLike({
                id: id,
                token: likeCommentToken,
            })
                .then((response) => {
                    getListComment()
                })
                .catch((error) => {
                    alert(error.message)
                })
        })
    }
}

export { likeComment }