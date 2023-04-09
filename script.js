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
  activeClass: ""
},
{
  name: "Варвана Н.",
  date: "13.02.22 19:22",
  text: "Мне нравится как оформлена эта страница! ❤",
  likes: 75,
  activeLike: false,
  activeClass: ""
}]

//Добавление лайка
const addLikeButton = () => {
  const buttonsLikesComment = document.querySelectorAll(".like-button");
  for (const buttonLike of buttonsLikesComment) {
    buttonLike.addEventListener("click", () => {
      index = buttonLike.dataset.buttonLike;

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

const renderCommentList = () => {
  commentListHtml = commentList.map((comment, index) => {
    return `<li class="comment">
    <div class="comment-header">
      <div>${comment.name}</div>
      <div>${comment.date}</div>
    </div>
    <div class="comment-body">
      <div class="comment-text">
        ${comment.text}
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

  addLikeButton()
}

renderCommentList()



//Лайк добавляется только одному ком-ту, продумать снятие лайка, сделать наложение стиля закрашенного сердца


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
    name: inputName.value,
    date: getDate(),
    text: textComment.value,
    likes: 0,
    activeLike: false
  })
}

//Добавление комментария
buttonAddComment.addEventListener('click', () => {
  commentSend()
  addLikeButton()
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