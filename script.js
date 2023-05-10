import { apiFetchGet, apiFetchPost } from "./api.js";
import { getRenderListComment } from "./listComment.js";
import { renderCommentList } from "./renderComment.js";
import { renderFormAdd, renderLoginComponent } from "./components/login-component.js";

const listComment = document.getElementById('comments__list');
const addForm = document.getElementById('form')
const loadingComment = document.getElementById('sendComment');
loadingComment.style.display = "none"

let token = "218383128"
token = null;

//Получение и форматирование даты
const getDate = () => {
  const date = new Date();

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

//GET
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
          date: new Date(comment.date).toLocaleString(),
          text: comment.text,
          likes: comment.likes,
          activeLike: comment.isLiked,
        };
      });
      commentList = transformComment;
      renderCommentList(listComment, commentList, getRenderListComment)
      addLikeButton();
      editComment();
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

      apiFetchPost(token, textComment.value, getDate)
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
      addLikeButton()
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

    //Удаление последнего комментария
    const buttonDelComment = document.getElementById('button__del-comment').addEventListener('click', () => {
      const lastComment = listComment.innerHTML.lastIndexOf('<li class="comment">');
      listComment.innerHTML = listComment.innerHTML.slice(0, lastComment)
    })
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
const addLikeButton = () => {
  const buttonsLikesComment = document.querySelectorAll(".like-button");
  for (const buttonLike of buttonsLikesComment) {
    buttonLike.addEventListener("click", (event) => {
      const index = buttonLike.dataset.buttonLike;
      event.stopPropagation()
      if (commentList[index].activeLike === false) {
        commentList[index].activeLike = true
        commentList[index].likes += 1
        commentList[index].activeClass = "-active-like"
      } else {
        commentList[index].activeLike = false
        commentList[index].likes -= 1
        commentList[index].activeClass = ""
      }
      renderCommentList(listComment, commentList, getRenderListComment)
      addLikeButton();
      editComment();
      saveComment();
      loadingCommentList();
    })
  }
}

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
      addLikeButton();
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
      addLikeButton();
      editComment();
      loadingCommentList();
    })
  }
}



renderCommentList(listComment, commentList, getRenderListComment)

