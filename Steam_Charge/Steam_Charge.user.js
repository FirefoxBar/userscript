(function () {
  const container = document.getElementById("prices_user");

  // 获取转换率
  const firstItem = container.querySelector(".addfunds_area_purchase_game");
  const newItem = firstItem.cloneNode(true);
  const displayAmount = newItem
    .querySelector(".game_purchase_price")
    .innerText.trim();
  newItem.querySelector(".game_purchase_price").remove();
  const submit = newItem.querySelector("[data-currency]");
  const realAmount = submit.getAttribute("data-amount");

  // 填入输入框
  const t = Array.from(newItem.children).find((x) => x.tagName === "H1");
  const tips = Array.from(newItem.children).find((x) => x.tagName === "P");

  t.innerHTML = "<input class='j_text' type='text' style='height:30px' />";
  tips.innerHTML = realAmount + " = " + displayAmount;

  // 提交
  submit.removeAttribute("onclick");
  submit.addEventListener("click", () => {
    document.getElementById("input_amount").value = t.querySelector("input").value;
    document.getElementById("input_currency").value = submit.getAttribute("data-currency");
    document.getElementById("form_addfunds").submit();
  });

  container.insertBefore(newItem, container.children[0]);
})();
