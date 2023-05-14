import { apiFetchGet, apiFetchPost, apiFetchDelete } from "./api.js";
import { getRenderListComment } from "./listComment.js";
import { renderCommentList } from "./renderComment.js";
import { renderFormAdd, renderLoginComponent } from "./components/login-component.js";
import { format } from "date-fns";
import { deleteComment } from "./components/delete_comment-component.js";
import { likeComment } from "./components/like_comment-component.js";

const listComment = document.getElementById('comments__list');
const addForm = document.getElementById('form')
const loadingComment = document.getElementById('sendComment');
loadingComment.style.display = "none"

let token = null;

//GET-рендер ленты комментариев
const getListComment = () => {
  apiFetchGet()
    .then((response) => {
      if (response.status === 200) {
        return response.json()
      } else if (response.status === 500) {
        throw new Error("Ошибка 500")
      } else {
        throw new Error("Ошибка соединения")
      }
    })
    .then((responseData) => {
      const transformComment = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: format(new Date(comment.date), 'yyyy-MM-dd hh.mm.ss'),
          text: comment.text,
          likes: comment.likes,
          activeLike: comment.isLiked,
          id: comment.id,
        };
      });
      commentList = transformComment;
      renderCommentList(listComment, commentList, getRenderListComment)
      likeComment({ token, getListComment })
      editComment();
      deleteComment({ token, getListComment })
      saveComment();
      loadingCommentList();

    }).catch((error) => {
      if (error.message === "Ошибка 500") {
        alert("Сервер сломался, попробуй позже")
      } else {
        console.log(error.message);
      }
    })

}

getListComment();

//Рендер формы добавления комментария, формы авторизации
const getListFormAndLogin = () => {
  if (token) {
    renderFormAdd()
    const inputName = document.getElementById('input__name');
    const textComment = document.getElementById('comment__text');
    const buttonAddComment = document.getElementById('button__add-comment');

    //Callback комментария
    const commentSend = () => {
      inputName.classList.remove('add-form-error')
      textComment.classList.remove(`add-form-error`)
      if (inputName.value.trim() === '') {
        return inputName.classList.add('add-form-error');
      }
      if (textComment.value.trim() === '') {
        return textComment.classList.add('add-form-error')
      }

      addForm.style.display = "none"
      loadingComment.style.display = "flex"

      apiFetchPost(token, textComment.value, format)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            textComment.value = "";
            return response.json()
          } else if (response.status === 400) {
            throw new Error("Ошибка 400")
          } else if (response.status === 500) {
            throw new Error("Ошибка 500")
          } else {
            throw new Error("Ошибка соединения")
          }
        })
        .then((response) => {
          return getListComment()
        })
        .then((addForms) => {
          addForm.style.display = "flex"
          loadingComment.style.display = "none"
        })
        .catch((error) => {
          console.log(error.message);
          if (error.message === "Ошибка 400") {
            alert("Комментарий не может быть короче 3-х символов")
            addForm.style.display = "flex"
            loadingComment.style.display = "none"
          } else if (error.message === "Ошибка 500") {
            alert("Сервер сломался, пытаемся отправить повторно...")
            addForm.style.display = "none"
            loadingComment.style.display = "flex"
            commentSend()
          } else {
            alert("Кажется, у вас сломался интернет, попробуйте позже")
            addForm.style.display = "flex"
            loadingComment.style.display = "none"
          }
        })
    }

    //Добавление комментария
    buttonAddComment.addEventListener('click', () => {
      commentSend()
      likeComment({ token, getListComment })
      replyComment()
      editComment()
      saveComment()
      renderCommentList(listComment, commentList, getRenderListComment)
    })

    //Отправка по кнопке Enter
    textComment.addEventListener('keydown', (key) => {
      if (key.code === 'Enter') {
        commentSend()
      }
    })

    //Валидация данных
    const switchButton = () => {
      if (inputName.value.trim() !== '' && textComment.value.trim() !== '') {
        buttonAddComment.disabled = false
        buttonAddComment.classList.remove('add-form-button-disabled')
      } else {
        buttonAddComment.disabled = true;
        buttonAddComment.classList.add('add-form-button-disabled')
      }
    }

    inputName.addEventListener('input', switchButton);
    textComment.addEventListener('input', switchButton)

    //Ответ на комментарий
    const replyComment = () => {
      const contentsReplyComments = document.querySelectorAll(".comment");
      for (const replyComment of contentsReplyComments) {
        replyComment.addEventListener("click", (event) => {
          event.stopPropagation()
          let index = replyComment.dataset.commentContent;
          textComment.value =
            "QUOTE_START" +
            ` ${commentList[index].text}` +
            "QUOTE_END" + `${commentList[index].name}`
        })
      }
    }
    replyComment()

  } else if (!token) {
    renderLoginComponent({
      setToken: (newToken) => {
        token = newToken
      },
      getListFormAndLogin
    })
  }
}

getListFormAndLogin()

let commentList = []

//Загрузка комментариев
const loadingCommentList = () => {
  const loadingPage = document.getElementById('loading');
  loadingPage.style.display = "none"
}


//Добавление лайка
// const addLikeButton = () => {
//   const buttonsLikesComment = document.querySelectorAll(".like-button");
//   for (const buttonLike of buttonsLikesComment) {
//     buttonLike.addEventListener("click", (event) => {
//       const index = buttonLike.dataset.buttonLike;
//       event.stopPropagation()
//       if (commentList[index].activeLike === false) {
//         commentList[index].activeLike = true
//         commentList[index].likes += 1
//         commentList[index].activeClass = "-active-like"
//       } else {
//         commentList[index].activeLike = false
//         commentList[index].likes -= 1
//         commentList[index].activeClass = ""
//       }
//       renderCommentList(listComment, commentList, getRenderListComment)
//       addLikeButton();
//       editComment();
//       saveComment();
//       loadingCommentList();
//     })
//   }
// }


//Редактирование комментария
const editComment = () => {
  const buttonsEditComment = document.querySelectorAll(".edit-comment")
  for (const buttonEdit of buttonsEditComment) {
    buttonEdit.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = buttonEdit.dataset.buttonEdit;
      commentList[index].isEdit
        ? (commentList[index].isEdit = false)
        : (commentList[index].isEdit = true)
      renderCommentList(listComment, commentList, getRenderListComment)
      likeComment({ token, getListComment })
      editComment();
      saveComment();
      loadingCommentList();
    })
  }
}


//Сохранение комментария
const saveComment = () => {
  const buttonsSaveComment = document.querySelectorAll(".save-comment")
  for (const buttonSave of buttonsSaveComment) {
    const index = buttonSave.dataset.buttonSave;
    const editTextComment = document.getElementById(`edit${index}`)
    buttonSave.addEventListener("click", () => {
      commentList[index].text = editTextComment.value
      commentList[index].isEdit = false;
      renderCommentList(listComment, commentList, getRenderListComment)
      likeComment({ token, getListComment })
      editComment();
      loadingCommentList();
    })
  }
}



renderCommentList(listComment, commentList, getRenderListComment)

