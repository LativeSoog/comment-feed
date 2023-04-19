const listComment = document.getElementById('comments__list');
const inputName = document.getElementById('input__name');
const textComment = document.getElementById('comment__text');
const buttonAddComment = document.getElementById('button__add-comment');

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

//Рендер HTML

const commentList = [{
  name: "Глеб Фокин",
  date: "12.02.22 12:18",
  text: "Это будет первый комментарий на этой странице",
  likes: 3,
  activeLike: false,
  activeClass: "",
  isEdit: false
},
{
  name: "Варвана Н.",
  date: "13.02.22 19:22",
  text: "Мне нравится как оформлена эта страница! ❤",
  likes: 75,
  activeLike: false,
  activeClass: "",
  isEdit: false

}]

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
      commentList[index].isEdit == false ? commentList[index].isEdit = true : commentList[index].isEdit = false
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
        ` ${commentList[index].text}
${commentList[index].name}` +
        "QUOTE_END "
    })
  }
}

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

  commentList.push({
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
    likes: 0,
    activeLike: false
  })
}

//Добавление комментария
buttonAddComment.addEventListener('click', () => {
  commentSend()
  addLikeButton()
  editComment()
  saveComment()
  renderCommentList()

  inputName.value = ""
  textComment.value = ""
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