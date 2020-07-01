if (!document.querySelector('.hide-article-box')) {
	return;
}
document.querySelectorAll('.article_content').forEach(it => it.style.height = "auto");
document.querySelector('.hide-article-box').remove();