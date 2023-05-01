const renderCommentList = (element, commentList, getRenderListComment) => {
    let commentListHtml = commentList
        .map((comment, index) => getRenderListComment(comment, index))
        .join("")
    element.innerHTML = commentListHtml
}

export { renderCommentList }