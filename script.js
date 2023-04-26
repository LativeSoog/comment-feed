const listComment = document.getElementById('comments__list');
const addForm = document.getElementById('form')
const inputName = document.getElementById('input__name');
const textComment = document.getElementById('comment__text');
const buttonAddComment = document.getElementById('button__add-comment');
const loadingComment = document.getElementById('sendComment');
loadingComment.style.display = "none"


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
  return fetch("https://webdev-hw-api.vercel.app/api/v1/vitaliy-gusev/comments", {
    method: "GET"
  })
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
      renderCommentList()
      loadingCommentList();

    }).catch((error) => {
      if (error.message === "Ошибка 500") {
        alert("Сервер сломался, попробуй позже")
      } else {
        alert("Кажется, у вас сломался интернет, попробуйте позже")
      }
    })


}

getListComment();

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
      index = buttonLike.dataset.buttonLike;
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
      renderCommentList()
    })
  }
}

//Редактирование комментария
const editComment = () => {
  const buttonsEditComment = document.querySelectorAll(".edit-comment")
  for (const buttonEdit of buttonsEditComment) {
    buttonEdit.addEventListener("click", (event) => {
      event.stopPropagation();
      index = buttonEdit.dataset.buttonEdit;
      commentList[index].isEdit
        ? (commentList[index].isEdit = false)
        : (commentList[index].isEdit = true)
      renderCommentList()
    })
  }
}

//Сохранение комментария
const saveComment = () => {
  const buttonsSaveComment = document.querySelectorAll(".save-comment")
  for (const buttonSave of buttonsSaveComment) {
    const editTextComment = document.getElementById(`edit${index}`)
    buttonSave.addEventListener("click", () => {
      index = buttonSave.dataset.buttonSave;
      commentList[index].text = editTextComment.value
      commentList[index].isEdit = false;
      renderCommentList()
    })
  }
}

//Ответ на комментарий
const replyComment = () => {
  const contentsReplyComments = document.querySelectorAll(".comment");
  for (const replyComment of contentsReplyComments) {
    replyComment.addEventListener("click", () => {
      index = replyComment.dataset.commentContent;
      textComment.value =
        "QUOTE_START" +
        ` ${commentList[index].text}` +
        "QUOTE_END" + `${commentList[index].name}`
    })
  }
}

//Рендер HTML
const renderCommentList = () => {
  commentListHtml = commentList.map((comment, index) => {
    return commentList[index].isEdit == true ?
      `<li class="comment">
      <div class="comment-header">
        <div>${comment.name}</div>
        <div>${comment.date}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">
          <textarea id="edit${index}" class="editText" type="textarea">${comment.text}</textarea>
        </div>
        <div class="comment-text">
        <button class="save-comment" data-button-save=${index}>Cохранить</button>
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button class="like-button ${comment.activeClass}" data-button-like="${index}"></button>
        </div>
      </div>
    </li>` :
      `<li class="comment" data-comment-content="${index}">
      <div class="comment-header">
        <div>${comment.name}</div>
        <div>${comment.date}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">
          ${comment.text}
        </div>
        <div class="comment-text">
        <button class="edit-comment" data-button-edit=${index}>Редактировать</button>
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button class="like-button ${comment.activeClass}" data-button-like="${index}"></button>
        </div>
      </div>
    </li>`
  }).join('')
  listComment.innerHTML = commentListHtml

  addLikeButton();
  editComment();
  saveComment();
  replyComment()
}

renderCommentList()

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

  fetch("https://webdev-hw-api.vercel.app/api/v1/vitaliy-gusev/comments", {
    method: "POST",
    body: JSON.stringify({
      name: inputName.value
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("/", "&frasl;"),
      date: getDate(),
      text: textComment.value
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("/", "&frasl;")
        .replaceAll("QUOTE_START", '<div class="quote">')
        .replaceAll("QUOTE_END", '</div>'),
      forceError: true,
    })
  })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        inputName.value = "";
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
        alert("Имя пользователя или комментарий не могут быть короче 3-х символов")
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
  editComment()
  saveComment()
  renderCommentList()
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

//Удаление последнего комментария
const buttonDelComment = document.getElementById('button__del-comment').addEventListener('click', () => {
  const lastComment = listComment.innerHTML.lastIndexOf('<li class="comment">');
  listComment.innerHTML = listComment.innerHTML.slice(0, lastComment)
})